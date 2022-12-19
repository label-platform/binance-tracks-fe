import { atom, selector, selectorFamily, useRecoilState, useRecoilValue } from 'recoil';

const drawerState = atom({
    key: 'drawerState',
    default: [],
});

const singleDrawerQuery = selectorFamily({
    key: 'singleDrawerQuery',
    get:
        (drawerID: string) =>
        ({ get }) => {
            const state = get(drawerState);
            return state.includes(drawerID);
        },
});

export const useDrawerState = (drawerID: string) => {
    return useRecoilValue(singleDrawerQuery(drawerID));
};

export const useDrawerCountIsOpend = () => {
    const drawer = useRecoilValue(drawerState);
    return drawer.length;
};

export const useDrawerDispatch = () => {
    const [state, setDrawer] = useRecoilState(drawerState);

    const closeDrawer = (drawerID: string) => {
        if (!state.includes(drawerID)) return;
        const index = state.indexOf(drawerID);
        const newState = [...state];
        newState.splice(index, 1);
        setDrawer(newState);
    };

    const closeSequenciallyDrawer = () => {
        if (state.length === 0) return;
        setDrawer(state.slice(0, state.length - 1));
    };

    const openDrawer = (drawerID: string) => {
        if (state.includes(drawerID)) return;
        setDrawer([...state, drawerID]);
    };

    const closeAll = () => {
        setDrawer([]);
    };

    return {
        close: closeDrawer,
        open: openDrawer,
        closeSequencially: closeSequenciallyDrawer,
        closeAll,
    };
};
