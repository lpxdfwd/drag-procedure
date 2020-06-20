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

export const fromatSearch = search => {
    if (!search) return {};
    const arr = decodeURIComponent(search).split('?')[1].split('&');
    return arr.reduce((total, item) => {
        const items = item.split('=');
        total[items[0]] = items[1];
        return total;
    }, {})
}
