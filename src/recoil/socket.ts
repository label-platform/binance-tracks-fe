import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

const socketState = atom({
    key: 'socketState',
    default: null,
    dangerouslyAllowMutability: true,
});

const hasSocketQuery = selector({
    key: 'hasSocketState',
    get({ get }) {
        return !!get(socketState);
    },
});

export const useSocketState = () => {
    const socket = useRecoilValue(socketState);
    const hasSocket = useRecoilValue(hasSocketQuery);

    return {
        socket,
        hasSocket,
    };
};

export const useSocketDispatch = () => {
    const setSocket = useSetRecoilState(socketState);
    return {
        setSocket,
    };
};
