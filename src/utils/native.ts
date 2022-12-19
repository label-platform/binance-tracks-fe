import { ListenCallbackType, NATIVE_EVENT_GUARD } from '@constants/native-event';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useUnmount } from 'react-use';

interface SendToNativeProps {
    name: NATIVE_EVENT_GUARD;
    params?: any;
}

export function doEither(weblogic?: () => void, applogic?: () => void) {
    if (typeof window === 'undefined') return;
    if (window.ReactNativeWebView) {
        if (typeof applogic === 'function') applogic();
    } else {
        if (typeof weblogic === 'function') weblogic();
    }
}

export function sendToNative(props: SendToNativeProps) {
    if (typeof window === 'undefined') return;
    if (!window.ReactNativeWebView) return;

    window.ReactNativeWebView.postMessage(JSON.stringify(props));
}

export function useListenNativeEvent(callback: ListenCallbackType, deps: Array<string | boolean | number> = []) {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!window.ReactNativeWebView) return;

        document.addEventListener('message', callback as any);
        window.addEventListener('message', callback as any);
        return () => {
            document.removeEventListener('message', callback as any);
            window.removeEventListener('message', callback as any);
        };
    }, [...deps]);
}

export function useListenNativeEventByFlag(callback: ListenCallbackType, flag: boolean) {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!window.ReactNativeWebView) return;
        if (flag) {
            document.addEventListener('message', callback as any);
            window.addEventListener('message', callback as any);
        } else {
            document.removeEventListener('message', callback as any);
            window.removeEventListener('message', callback as any);
        }
    }, [flag]);

    useUnmount(() => {
        document.removeEventListener('message', callback as any);
        window.removeEventListener('message', callback as any);
    });
}

export function useIsOnNative() {
    const [isNative, setIsNative] = useState<boolean>(true);
    useLayoutEffect(() => {
        if (typeof window === 'undefined') setIsNative(false);
        if (!window.ReactNativeWebView) setIsNative(false);
    }, []);

    return isNative;
}
