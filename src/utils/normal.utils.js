export const throttle = (fn, s) => {
    let timer;
    return (...args) => {
        // if (timer === undefined) fn(...args);
        if (!timer) fn(...args);
        timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
        }, s);
    }
}