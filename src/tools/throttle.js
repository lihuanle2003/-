const throttle = (fn, delay) => {
    let timer = null;
    console.log(fn);
    return function () {
        if (!timer) {
            timer = setTimeout(() => {
                fn.call()
                timer = null;
            }, delay)
        }
    }
}

export default throttle