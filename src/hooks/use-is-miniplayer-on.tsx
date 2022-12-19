import { LISTEN_EVENT, NATIVE_EVENT } from '@constants/native-event';
import { sendToNative, useIsOnNative, useListenNativeEvent } from '@utils/native';
import { useLayoutEffect, useState } from 'react';

export const useIsMiniPlayerOn = () => {
    const [open, setIsOpen] = useState(false);
    const isNative = useIsOnNative();
    useLayoutEffect(() => {
        sendToNative({ name: NATIVE_EVENT.CHECK_MINI_PLAYER });
    });

    useListenNativeEvent(({ data }) => {
        switch (data.type) {
            case LISTEN_EVENT.CHECK_MINI_PLAYER: {
                setIsOpen(data.params.isShow);
                break;
            }
        }
    });
    return open && isNative;
};
