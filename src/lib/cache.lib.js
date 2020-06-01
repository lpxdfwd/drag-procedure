import {parse, serialize} from 'cookie';

const SESSION_ID = '#session_id';

function getCookie(name) {
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  const values = document.cookie.match(reg);
  return values ? unescape(values[2]) : null;
}

class CacheLib {
  #cookieMap;

  static COOKIE_MAX_AGE = 24 * 60 * 60;

  get sessionId() {
    return this.#cookieMap[SESSION_ID];
  }

  set sessionId(val) {
    this.setCookie({
      name: SESSION_ID,
      value: val
    });
  }

  constructor(cookie) {
    this.#cookieMap = parse(cookie || '');
  }

  setCookieMap(name, value) {
    this.#cookieMap[name] = value;
  }

  getCookie(name) {
    return this.#cookieMap[name] || getCookie(name);
  }

  setCookie({
    name, value, maxAge = CacheLib.COOKIE_MAX_AGE, option = {}
  }) {
    const val = value || '';
    this.setCookieMap(name, val);
    const cokkieOptions = new CookieSetOption(value, maxAge, option);
    document.cookie = serialize(name, val, cokkieOptions);
  }

  clear() {
    const keys = Object.keys(this.#cookieMap);
    keys.forEach(item => this.setCookie({name: item, value: null}));
  }
}

class CookieSetOption {
  constructor(value, maxAge, options) {
    if (!value) {
      this.maxAge = 0;
    } else {
      this.maxAge = maxAge;
    }

    this.httpOnly = false; // http-only 不设置

    this.path = '/'; // 生效地址都是根路径

    if (options) {
      Object.assign(this, options);
    }
  }
}

const cacheLib = new CacheLib(document.cookie);

export default cacheLib;
