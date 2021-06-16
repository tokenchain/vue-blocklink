import 'isomorphic-fetch';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
export const fetchAsync = async (endpoint, options = {}, timeoutMs = 20000) => {
    if (options.signal || options.timeout) {
        throw new Error('Cannot call fetchAsync with options.signal or options.timeout. To set a timeout, please use the supplied "timeoutMs" parameter.');
    }
    let optionsWithAbortParam;
    if (!isNode) {
        const controller = new AbortController();
        const signal = controller.signal;
        setTimeout(() => {
            controller.abort();
        }, timeoutMs);
        optionsWithAbortParam = {
            signal,
            ...options,
        };
    }
    else {
        optionsWithAbortParam = {
            timeout: timeoutMs,
            ...options,
        };
    }
    const response = await fetch(endpoint, optionsWithAbortParam);
    return response;
};
