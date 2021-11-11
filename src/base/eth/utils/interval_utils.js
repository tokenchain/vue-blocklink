export const intervalUtils = {
    setAsyncExcludingInterval(fn, intervalMs, onError) {
        let isLocked = false;
        const intervalId = setInterval(async () => {
            if (isLocked) {
                return;
            }
            else {
                isLocked = true;
                try {
                    await fn();
                }
                catch (err) {
                    onError(err);
                }
                isLocked = false;
            }
        }, intervalMs);
        return intervalId;
    },
    clearAsyncExcludingInterval(intervalId) {
        clearInterval(intervalId);
    },
    setInterval(fn, intervalMs, onError) {
        const intervalId = setInterval(() => {
            try {
                fn();
            }
            catch (err) {
                onError(err);
            }
        }, intervalMs);
        return intervalId;
    },
    clearInterval(intervalId) {
        clearInterval(intervalId);
    },
};
//# sourceMappingURL=interval_utils.js.map