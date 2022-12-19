class SizeCalculator {
    private size: number;

    calculate(size: number, ratio: number): SizeCalculator {
        this.size = Math.round(size * (ratio / 100));
        return this;
    }

    toNumber(): number {
        return this.size;
    }

    toPx(): string {
        return `${this.size}px`;
    }
}

export const calc = (size: number, _ratio = 0): SizeCalculator => {
    // const ratio = _ratio / 100;
    // return Math.round(_height * ratio);
    const sizeCalculator = new SizeCalculator();
    return sizeCalculator.calculate(size, _ratio);
};
