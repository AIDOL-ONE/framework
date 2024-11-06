// src/core/EventEmitter.js
const EventEmitter = require('events');

/**
 * Custom event emitter for agent communication
 * Extends Node's EventEmitter with specific agent-related functionality
 */
class AgentEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(20); // Increase max listeners for complex agent interactions
  }

  /**
   * Emit an event with automatic error handling and logging
   * @param {string} eventName - Name of the event
   * @param {any} data - Event data
   */
  safeEmit(eventName, data) {
    try {
      this.emit(eventName, data);
    } catch (error) {
      console.error(`Error emitting ${eventName}:`, error);
    }
  }
}

module.exports = new AgentEventEmitter();
