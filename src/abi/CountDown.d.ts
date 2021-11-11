export interface DateCountDown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    remain_seconds: number;
}
export declare class CountDown {
    timeRemaining: number;
    onComplete?: Function;
    onRender?: Function;
    constructor(expiredDate: any, onRender: any, onComplete: any);
    private setExpiredDate;
    private complete;
    getTime(): DateCountDown;
    private update;
    private start;
}
//# sourceMappingURL=CountDown.d.ts.map