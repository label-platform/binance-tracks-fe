export class HistoryManagerSingleTon {
    private static instance: any;
    private _count = 0;

    init(count: number) {
        this._count = count;
    }

    public static getInstance(): HistoryManagerSingleTon {
        return this.instance || (this.instance = new this());
    }

    increment() {
        this._count += 1;
    }

    decrement() {
        if (this._count > 0) {
            this._count -= 1;
        }
    }

    clear() {
        this._count = 0;
    }

    get count() {
        return this._count;
    }
}
