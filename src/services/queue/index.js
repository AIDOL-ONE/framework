// src/services/queue/index.js
const EventEmitter = require('events');
const logger = require('../../config/logger');

/**
 * Queue management for async operations
 */
class QueueService extends EventEmitter {
  constructor(config = {}) {
    super();
    this.queues = new Map();
    this.processors = new Map();
    this.config = {
      maxConcurrent: config.maxConcurrent || 3,
      defaultTimeout: config.defaultTimeout || 30000,
      retryAttempts: config.retryAttempts || 3
    };
  }

  /**
   * Add item to queue
   */
  async addToQueue(queueName, data, options = {}) {
    if (!this.queues.has(queueName)) {
      this.queues.set(queueName, []);
    }

    const queue = this.queues.get(queueName);
    const queueItem = {
      id: `${queueName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      data,
      options: {
        ...this.config,
        ...options
      },
      attempts: 0,
      status: 'pending',
      addedAt: Date.now()
    };

    queue.push(queueItem);
    this.emit('itemAdded', { queueName, item: queueItem });
    this.processQueue(queueName);

    return queueItem.id;
  }

  /**
   * Register processor for queue
   */
  registerProcessor(queueName, processorFn) {
    this.processors.set(queueName, processorFn);
    this.emit('processorRegistered', { queueName });
  }

  /**
   * Process items in queue
   */
  async processQueue(queueName) {
    if (!this.processors.has(queueName)) {
      throw new Error(`No processor registered for queue: ${queueName}`);
    }

    const queue = this.queues.get(queueName);
    const processor = this.processors.get(queueName);
    const processing = queue.filter(item => item.status === 'processing');

    if (processing.length >= this.config.maxConcurrent) {
      return;
    }

    const nextItem = queue.find(item => item.status === 'pending');
    if (!nextItem) return;

    nextItem.status = 'processing';
    nextItem.attempts += 1;

    try {
      const result = await Promise.race([
        processor(nextItem.data),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Processing timeout')), 
          nextItem.options.timeout || this.config.defaultTimeout)
        )
      ]);

      nextItem.status = 'completed';
      nextItem.result = result;
      this.emit('itemCompleted', { queueName, item: nextItem });
    } catch (error) {
      logger.error(`Error processing queue item:`, error);
      
      if (nextItem.attempts < nextItem.options.retryAttempts) {
        nextItem.status = 'pending';
        nextItem.error = error.message;
        this.emit('itemRetry', { queueName, item: nextItem });
      } else {
        nextItem.status = 'failed';
        nextItem.error = error.message;
        this.emit('itemFailed', { queueName, item: nextItem });
      }
    }

    this.cleanQueue(queueName);
    this.processQueue(queueName);
  }

  /**
   * Clean completed/failed items from queue
   */
  cleanQueue(queueName) {
    const queue = this.queues.get(queueName);
    if (!queue) return;

    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    const now = Date.now();

    this.queues.set(queueName, queue.filter(item => {
      const isOld = now - item.addedAt > maxAge;
      return !(isOld || item.status === 'completed');
    }));
  }
}

module.exports = QueueService;