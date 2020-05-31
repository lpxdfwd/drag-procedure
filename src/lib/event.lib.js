import EventEmitter from 'eventemitter3';

const eventEmitter = new EventEmitter();

//订阅事件
export const eventOn = eventEmitter.on.bind(eventEmitter);

//触发事件
export const eventEmit = eventEmitter.emit.bind(eventEmitter);

//删除事件
export const removeEvent = eventEmitter.off.bind(eventEmitter);
