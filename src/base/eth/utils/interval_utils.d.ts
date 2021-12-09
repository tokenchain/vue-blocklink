export declare const intervalUtils: {
    setAsyncExcludingInterval(fn: () => Promise<void>, intervalMs: number, onError: (err: Error) => void): any;
    clearAsyncExcludingInterval(intervalId: any): void;
    setInterval(fn: () => void, intervalMs: number, onError: (err: Error) => void): any;
    clearInterval(intervalId: any): void;
};
//# sourceMappingURL=interval_utils.d.ts.map