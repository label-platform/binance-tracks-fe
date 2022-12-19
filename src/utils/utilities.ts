import QrCode from 'qrcode-reader';
import { URL } from 'url';
const qr = new QrCode();

// percent should be between 0 and 1
export const range = (start, end, percent) => (end - start) * percent + start;

export const clamp = (min, max, val) => Math.max(Math.min(val, max), min);

export const isBetween = (start: number, end: number, target: number) => start <= target && end >= target;

// take a number ("val") in between the two numbers in arr1, and map it to a number in between the two numbers in arr2
export const rangeMap = (arr1, arr2, val) => {
    const percent = (val - arr1[0]) / (arr1[1] - arr1[0]);
    return range(arr2[0], arr2[1], percent);
};

// rangeMap with a guarantee that the returned number will be inside the bounds of arr2
export const clampedRangeMap = (arr1, arr2, val) => {
    const min = arr2[0] < arr2[1] ? arr2[0] : arr2[1];
    const max = min === arr2[0] ? arr2[1] : arr2[0];
    return clamp(min, max, rangeMap(arr1, arr2, val));
};

// https://twitter.com/chpwn/status/285540192096497664
// iOS constant = 0.55
export const rubberBand = (distance, dimension, constant = 0.15) => {
    return (distance * dimension * constant) / (dimension + constant * distance);
};

// https://medium.com/@nathangitter/building-fluid-interfaces-ios-swift-9732bb934bf5
export const rubberband2 = (offset, constant = 0.7) => Math.pow(offset, constant);

export const rubberBandIfOutOfBounds = (min, max, delta, constant) => {
    if (delta < min) {
        return -rubberBand(min - delta, max - min, constant) + min;
    }
    if (delta > max) {
        return rubberBand(delta - max, max - min, constant) + max;
    }
    return delta;
};

export const decelerationRates = {
    fast: 0.99,
    normal: 0.998,
};

// https://medium.com/@nathangitter/building-fluid-interfaces-ios-swift-9732bb934bf5
// note: velocity in UIkit is points per second, but react use gesture gives px per millisecond,
// so we can simplify somewhat
export const projection = (initialVelocity, rateName = 'normal') => {
    const decelerationRate = decelerationRates[rateName] || rateName;
    return (initialVelocity * decelerationRate) / (1 - decelerationRate);
};

export const findNearestNumberInArray = (n, arr) => {
    const sortedArr = [...arr].sort((a, b) => a - b);
    if (n <= sortedArr[0]) return sortedArr[0];
    if (n >= sortedArr[arr.length - 1]) return sortedArr[arr.length - 1];

    for (let i = 1; i < sortedArr.length; i++) {
        const prev = sortedArr[i - 1];
        const current = sortedArr[i];
        if (current === n) return current;
        if (current > n && prev < n) {
            return current - n < n - prev ? current : prev;
        }
    }
    return false;
};

export const shuffle = (array) => array.sort(() => Math.random() - 0.5);

export const decimalCeil = (decimal: number, point: number): number => {
    const dotPoint = decimal.toString().indexOf('.');
    if (dotPoint < 1) return decimal;

    return +decimal.toString().slice(0, dotPoint + 1 + point);
};

export const getSecretFromQR = async (bitmapImage: { data: any; width: number; height: number }) => {
    try {
        const url: string = await new Promise((resolve, reject) => {
            qr.callback = (error, value) => (error ? reject(error) : resolve(value.result));
            qr.decode(bitmapImage);
        });
        const queries = url.slice(url.indexOf('?') + 1, url.length).split('&');
        return queries[0].split('=')[1];
    } catch (error) {
        throw new Error(error);
    }
};

export const isNumber = (num: any) => {
    if (typeof num === 'number') return !isNaN(num);
    if (typeof num !== 'string') return false;
    return num === '' ? false : !isNaN(+num);
};

export const convertToCapitalization = (text: string) => {
    return `${text[0].toUpperCase()}${text.slice(1).toLowerCase()}`;
};
