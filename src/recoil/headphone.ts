import { Headphone } from '@models/headphone/headphone';
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useMessageDispatch } from './message';

const MAX_ENHANCED_HEADPHONE = 5;

const headphoneState = atom<Headphone>({
    key: 'currentHeadPhone',
    default: null,
});

const mintHeadphoneState = atom<Headphone>({
    key: 'mintHeadPhoneState',
    default: null,
});

const enhancedHeadphoneState = atom<Array<Headphone>>({
    key: 'enhancedHeadphoneState',
    default: [],
});

export const useHeadphoneState = () => {
    const currentHeadPhone = useRecoilValue(headphoneState);
    const mintHeadPhone = useRecoilValue(mintHeadphoneState);
    const enhancedHeadphone = useRecoilValue(enhancedHeadphoneState);
    return {
        current: currentHeadPhone,
        selectmintheadphone: mintHeadPhone,
        enhanced: enhancedHeadphone,
    };
};

export const useHeadphoneDispatch = () => {
    const setHeadPhone = useSetRecoilState(headphoneState);

    const set = (headphone: Headphone) => {
        setHeadPhone(headphone);
    };

    const clear = () => {
        setHeadPhone(null);
    };

    return {
        set,
        clear,
    };
};

export const useMintHeadphoneDispatch = () => {
    const setMintHeadphone = useSetRecoilState(mintHeadphoneState);
    const set = (headphone: Headphone) => {
        setMintHeadphone(headphone);
    };
    const clear = () => {
        setMintHeadphone(null);
    };
    return {
        set,
        clear,
    };
};

export const useEnhanceHeadphoneDispatch = () => {
    const [enhancedHeadphones, setEnhancedHeadphone] = useRecoilState(enhancedHeadphoneState);
    const { message } = useMessageDispatch();
    const set = (headphone: Headphone) => {
        if (MAX_ENHANCED_HEADPHONE <= enhancedHeadphones.length) {
            message.none(
                'Can`t select other headphone. If you want to select other headphones, Please remove has selected headphone before.'
            );
            return;
        }
        setEnhancedHeadphone((headphones) => [...headphones, headphone]);
    };

    const clearAll = () => {
        setEnhancedHeadphone([]);
    };

    const remove = (headphoneID: string) => {
        setEnhancedHeadphone((headphones) => headphones.filter((headphone) => headphone.id !== headphoneID));
    };

    const has = (headphoneID: string) => {
        return enhancedHeadphones.some((headphone) => headphone.id === headphoneID);
    };

    return {
        set,
        has,
        remove,
        clearAll,
    };
};
