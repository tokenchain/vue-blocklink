export class CountDown {
    constructor(expiredDate, onRender, onComplete) {
        this.onRender = onRender;
        this.onComplete = onComplete;
        this.setExpiredDate(expiredDate);
    }
    setExpiredDate(expiredDate) {
        const currentTime = new Date().getTime();
        if (expiredDate instanceof Date) {
            this.timeRemaining = expiredDate.getTime() - currentTime;
        }
        else {
            this.timeRemaining = parseInt(expiredDate) * 1000 - currentTime;
        }
        this.timeRemaining <= 0
            ? this.complete()
            : this.start();
    }
    complete() {
        if (typeof this.onComplete === "function") {
            this.onComplete();
        }
    }
    getTime() {
        return {
            days: Math.floor(this.timeRemaining / 1000 / 60 / 60 / 24),
            hours: Math.floor(this.timeRemaining / 1000 / 60 / 60) % 24,
            minutes: Math.floor(this.timeRemaining / 1000 / 60) % 60,
            seconds: Math.floor(this.timeRemaining / 1000) % 60,
            remain_seconds: Math.floor(this.timeRemaining / 1000)
        };
    }
    update() {
        if (typeof this.onRender === "function") {
            this.onRender(this.getTime());
        }
    }
    start() {
        this.update();
        const intervalId = setInterval(() => {
            this.timeRemaining -= 1000;
            if (this.timeRemaining < 0) {
                this.complete();
                clearInterval(intervalId);
            }
            else {
                this.update();
            }
        }, 1000);
    }
}
//# sourceMappingURL=CountDown.js.map