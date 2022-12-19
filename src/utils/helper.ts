import { isBetween } from './utilities';

/* 헤드폰 배터리를 게이지로 변환하기 위한 로직 */
export const convertBatteryToGage = (battery: number) => {
    if (battery === 0) return 0;
    if (isBetween(1, 19, battery)) return 1;
    if (isBetween(20, 29, battery)) return 2;
    if (isBetween(30, 39, battery)) return 3;
    if (isBetween(40, 49, battery)) return 4;
    if (isBetween(50, 59, battery)) return 5;
    if (isBetween(60, 69, battery)) return 6;
    if (isBetween(70, 79, battery)) return 7;
    if (isBetween(80, 89, battery)) return 8;
    if (isBetween(90, 95, battery)) return 9;
    if (isBetween(96, 100, battery)) return 10;
};
