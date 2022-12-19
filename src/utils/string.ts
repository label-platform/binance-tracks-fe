import { SECOND } from '@constants/common';

export function truncateString({
    text,
    start = 4,
    end = 4,
    separator = '...',
}: {
    text: string;
    start?: number;
    end?: number;
    separator?: string;
}): string {
    if (!text) {
        return text;
    }
    const textLength = text.length;
    if (textLength <= start + end) {
        return text;
    }
    const startText = text.substr(0, start);
    const endText = text.substr(textLength - end);
    return `${startText}${separator}${endText}`;
}

export function convertTimeFormat(millisecond: number, format = 'hh:mm:ss'): string {
    let result = null;
    let formatStandard = null;
    let newFormat = format.toLocaleLowerCase();
    const seconds = Math.floor(millisecond / SECOND) % 60;
    const minutes = Math.floor(millisecond / SECOND / 60) % 60;
    const hours = Math.floor(millisecond / SECOND / 60 / 60);

    while ((result = /(?<!\[)[hsm]{1,2}(?!\])(?![a-z]+\])/gi.exec(newFormat)) !== null) {
        if (formatStandard === null) formatStandard = result[0][0];
        let targetValue = 0;
        switch (result[0][0]) {
            case 'h' /* 시 */:
                if (formatStandard !== 'h') break;
                targetValue = hours;
                break;
            case 'm' /* 분 */:
                if (formatStandard === 'm') {
                    targetValue = hours * 60 + minutes;
                } else {
                    targetValue = minutes;
                }

                break;
            case 's' /* 초 */:
                if (formatStandard === 's') {
                    targetValue = minutes * 60 + seconds;
                } else {
                    targetValue = seconds;
                }
                break;
            default:
                break;
        }

        newFormat = newFormat.replace(
            result[0],
            result[0].length === 1 ? `${targetValue}` : toInteger2Digits(targetValue)
        );
    }

    // eslint-disable-next-line no-useless-escape
    return newFormat.replaceAll(/[\[\]]/g, '');
}

export function toInteger2Digits(value: number): string {
    if (isNaN(value)) return '0';
    return value < 10 ? `0${value}` : `${value}`;
}
