// Callbacks.js
import EventEmitter from "eventemitter3";
export const eventEmitter = new EventEmitter();

export function executeHandlerForPaste(action, result) {
    console.log("1234", action);
    console.log("5678", result);
    // Emit an event to notify that handlePaste has been executed
    return new Promise((resolve) => {
      // Emit an event and resolve the Promise
      eventEmitter.emit('handlePaste', action, result);
      resolve('Event:executeHandlerForPaste successfully fired');
    });
  }
