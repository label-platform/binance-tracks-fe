/* eslint-disable no-unused-vars */
import { LISTEN_EVENT, NATIVE_EVENT } from '@constants/native-event';
import { doEither, sendToNative, useListenNativeEvent } from '@utils/native';
import { useRef } from 'react';

type FinishFunction = (text: string) => void;

export const useClipboard = () => {
    const readPromise = useRef(null);
    const read = ({ onFinish }: { onFinish: FinishFunction }) => {
        doEither(
            async () => {
                onFinish(await navigator.clipboard?.readText());
            },
            () => {
                readPromise.current = (text: string) => {
                    onFinish(text);
                };
                sendToNative({ name: NATIVE_EVENT.READ_CLIPBOARD });
            }
        );
    };

    const write = (text: string) => {
        doEither(
            () => {
                navigator.clipboard.writeText(text);
            },
            () => {
                sendToNative({ name: NATIVE_EVENT.WRITE_CLIPBOARD, params: { text } });
            }
        );
    };

    useListenNativeEvent(({ data }) => {
        switch (data.type) {
            case LISTEN_EVENT.READ_CLIPBOARD: {
                if (typeof readPromise.current !== 'function') return;
                readPromise.current(data.params.text || '');
            }
        }
    });

    return {
        write,
        read,
    };
};
