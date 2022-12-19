import { NATIVE_EVENT } from '@constants/native-event';
import { useTracksRouter } from '@hooks/use-tracks-router';
import { TokenManagerSingleTon } from '@services/token';
import { doEither, sendToNative } from '@utils/native';
import { useCallback, useEffect } from 'react';
import { useUserSelfInfoQuery } from 'src/react-query/user';

interface AuthGuardProps {
    children: React.ReactNode;
}

export const AuthGuard = (props: AuthGuardProps) => {
    const { children } = props;
    const router = useTracksRouter();
    const { user, isLoading } = useUserSelfInfoQuery();

    const clearUserInfo = useCallback(() => {
        TokenManagerSingleTon.getInstance().clear();
        doEither(
            () => {
                router.replace('/authentication/login');
            },
            () => {
                sendToNative({ name: NATIVE_EVENT.EXPIRED_TOKEN });
            }
        );
    }, []);

    useEffect(() => {
        if (!router.isReady) return;
        if (isLoading) return;

        if (!user?.id && !isLoading) {
            clearUserInfo();
        } else if (!user.hasActivationCodeId) {
            if (router.pathname === '/authentication/activation-code') return;
            clearUserInfo();
        }
    }, [router.isReady, user?.id, isLoading]);

    if (!user.id) return null;
    if (!user.hasActivationCodeId && router.pathname !== '/authentication/activation-code') return null;

    return <>{children}</>;
};
