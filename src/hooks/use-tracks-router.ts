import { HistoryManagerSingleTon } from '@services/history';
import { useRouter } from 'next/router';
import { UrlObject } from 'url';

export function useTracksRouter() {
    const router = useRouter();
    const historyInstance = HistoryManagerSingleTon.getInstance();
    try {
        if (!window.ReactNativeWebView) {
            return router;
        }
    } catch {
        return router;
    }

    return {
        ...router,
        push: (url: UrlObject | string) => {
            historyInstance.increment();
            router.push(url);
        },
        back: () => {
            historyInstance.decrement();
            router.back();
        },
    };
}
