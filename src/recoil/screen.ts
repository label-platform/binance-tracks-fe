import { atom, selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';

const screenState = atom({
    key: 'screenState',
    default: null,
});

const screenDataState = atom({
    key: 'screenDataState',
    default: null,
});

const screenStateQuery = selectorFamily({
    key: 'screenVisibleQuery',
    get:
        (screenID: string) =>
        ({ get }) => ({ visible: get(screenState) === screenID, data: get(screenDataState) }),
});

export const useScreenState = <T>(screenID: string): { visible: boolean; data: T } =>
    useRecoilValue(screenStateQuery(screenID));

export const useScreenDispatch = () => {
    const setSceen = useSetRecoilState(screenState);
    const setData = useSetRecoilState(screenDataState);

    const open = (screenID: string, data: any = null) => {
        setSceen(screenID);
        setData(data);
    };

    const close = () => {
        setSceen('');
        setData(null);
    };

    return {
        open,
        close,
    };
};
