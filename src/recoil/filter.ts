import { atom, selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';

const filterOptionState = atom<any>({
    key: 'FilterOption',
    default: {},
});

const singleModalQuery = selectorFamily({
    key: 'singleModalQuery',
    get:
        (filterId: string) =>
        ({ get }) => {
            const filter = get(filterOptionState);
            return filter[filterId] || null;
        },
});

export const useFilterState = (filterId: string) => {
    return useRecoilValue(singleModalQuery(filterId));
};

export const useMarketPlacefilterDispatch = () => {
    const setfilterOption = useSetRecoilState(filterOptionState);

    const set = (key: string, option: any) => {
        setfilterOption((filter: any) => ({
            ...filter,
            [key]: { ...filter[key], ...option },
        }));
    };
    const setMulti = (key: string, optionKey: any, option?: any) => {
        setfilterOption((filter: any) => {
            const copied = { ...filter[key] };
            let newArr = [];
            if (copied[optionKey]) {
                const filterCopied = copied[optionKey].filter((el) => el !== option).concat(option);
                newArr = newArr.concat(filterCopied);
            } else if (option) {
                newArr.push(option);
            }

            return {
                ...filter,
                [key]: { ...filter[key], [optionKey]: newArr },
            };
        });
    };
    const unsetMulti = (key: string, optionKey: string, option: any) => {
        setfilterOption((filter: any) => {
            const copied = { ...filter[key] };
            const filterOption = copied[optionKey].filter((el) => el !== option);

            return {
                ...filter,
                [key]: { ...filter[key], [optionKey]: filterOption },
            };
        });
    };
    const unset = (key: string, deletKey: string) => {
        setfilterOption((filter: any) => {
            const copied = { ...filter[key] };
            delete copied[deletKey];
            return {
                ...filter,
                [key]: { ...copied },
            };
        });
    };
    const clear = (key: string) => {
        setfilterOption((filter: any) => ({
            ...filter,
            [key]: {},
        }));
    };

    return {
        unset,
        set,
        clear,
        setMulti,
        unsetMulti,
    };
};
