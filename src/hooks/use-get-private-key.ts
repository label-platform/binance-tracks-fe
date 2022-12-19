import { LISTEN_EVENT, NATIVE_EVENT } from '@constants/native-event';
import { WalletSingleTon } from '@services/wallet/wallet';
import { doEither, sendToNative, useListenNativeEvent } from '@utils/native';
import { useState } from 'react';
import { useEffectOnce } from 'react-use';

export function useGetPrivateKey() {
    const [pk, setPk] = useState(null);

    useListenNativeEvent(({ data }) => {
        if (data.type === LISTEN_EVENT.SEND_PRIVATE_KEY) {
            setPk(data.params.privateKey);
        }
    });

    useEffectOnce(() => {
        if (WalletSingleTon.getInstance().privateKey) {
            setPk(WalletSingleTon.getInstance().privateKey);
            return;
        }
        doEither(
            () => {
                setPk(localStorage.getItem('pk'));
            },
            () => {
                sendToNative({ name: NATIVE_EVENT.GET_PRIVATE_KEY });
            }
        );
    });

    return pk;
}
