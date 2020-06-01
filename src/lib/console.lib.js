window.__open_debugger__ = false;

const log = console.log.bind(console);

const isDev = process.env.NODE_ENV === 'development';

const debuggerConsole = (...args) => {
  if ((isDev || window.__open_debugger__)) {
    log.apply(console, args);
  }
};

export default debuggerConsole;
