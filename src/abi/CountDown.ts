export interface DateCountDown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    remain_seconds: number;
}

export class CountDown {
    timeRemaining: number;
    onComplete?: Function;
    onRender?: Function;

    constructor(expiredDate, onRender, onComplete) {
      this.onRender = onRender
      this.onComplete = onComplete
      this.setExpiredDate(expiredDate)
    }

    private setExpiredDate(expiredDate: any): void {
      // get the current time
      const currentTime = new Date().getTime()
      if (expiredDate instanceof Date) {
        // calculate the remaining time
        this.timeRemaining = expiredDate.getTime() - currentTime
      } else {
        // it is specific to seconds
        this.timeRemaining = parseInt(expiredDate) * 1000 - currentTime
      }
      this.timeRemaining <= 0
        ? this.complete()
        : this.start()
    }

    private complete(): void {
      if (typeof this.onComplete === "function") {
        this.onComplete()
      }
    }

    public getTime(): DateCountDown {
      return {
        days: Math.floor(this.timeRemaining / 1000 / 60 / 60 / 24),
        hours: Math.floor(this.timeRemaining / 1000 / 60 / 60) % 24,
        minutes: Math.floor(this.timeRemaining / 1000 / 60) % 60,
        seconds: Math.floor(this.timeRemaining / 1000) % 60,
        remain_seconds: Math.floor(this.timeRemaining / 1000)
      }
    }

    private update(): void {
      if (typeof this.onRender === "function") {
        this.onRender(this.getTime())
      }
    }

    private start(): void {
      // update the countdown
      this.update()
      //  setup a timer
      const intervalId = setInterval(() => {
        // update the timer
        this.timeRemaining -= 1000
        if (this.timeRemaining < 0) {
          // call the callback
          this.complete()
          // clear the interval if expired
          clearInterval(intervalId)
        } else {
          this.update()
        }
      }, 1000)
    }
}
