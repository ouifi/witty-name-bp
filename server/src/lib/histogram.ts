import { Logger, LOG_LEVELS } from './log';

class Histogram {
    private histogram: Record<string, number>;

    constructor(newHist?: Record<string, number>) {
        this.histogram = newHist || {};
    }

    tick(key: string): number {
        if (this.histogram[key]) {
            this.histogram[key]++;
        } else {
            this.histogram[key] = 1;
        }
        return this.histogram[key];
    }

    out(level?: LOG_LEVELS): void {
        Logger.print(level, this.histogram);
    }
}

export {
    Histogram
};
