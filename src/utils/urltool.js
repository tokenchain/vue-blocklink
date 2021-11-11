function getStoredItemInt(key, _default) {
    if (localStorage) {
        if (localStorage.getItem(key) === null) {
            return _default
        } else {
            return parseInt(localStorage.getItem(key))
        }
    } else {
        return _default
    }
}

function getStoredItemStr(key, _default_str) {
    if (localStorage) {
        if (localStorage.getItem(key) === null) {
            return _default_str
        } else {
            return parseInt(localStorage.getItem(key))
        }
    } else {
        return _default_str
    }
}

export {
    getStoredItemInt,
    getStoredItemStr
}
