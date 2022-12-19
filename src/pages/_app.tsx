import type { AppProps } from 'next/app';
import { Fragment } from 'react';
import type { Page } from 'types/page';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { appWithTranslation } from 'next-i18next';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import '@styles/swiper.styles.css';
import '@styles/base.styles.css';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { withRecoil } from 'src/recoil';
import { MessageList } from '@components/common/message-list';
import { theme } from '@constants/theme';
import { HTTP_STATUS, SECOND } from '@constants/common';
import { ServerError } from '@utils/core/exceptions';
import { TokenManagerSingleTon } from '@services/token';
import { useEffectOnce } from 'react-use';
import TRGlobalErrorBoundary from '@components/common/TRErrorBoundary';

type Props = AppProps & {
    Component: Page;
};

const MAXIMUM_TRY = 1;
const authRetryOption = {
    retryDelay: SECOND,
    retry: (failureCount, error: ServerError) => {
        try {
            if ([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN].includes(error.code)) {
                if (!TokenManagerSingleTon.getInstance().isCanBeRefresh && failureCount > 2) return false;
                if (failureCount > MAXIMUM_TRY) return false;
                if (TokenManagerSingleTon.getInstance().isCanDoRefresh && HTTP_STATUS.FORBIDDEN === error.code) {
                    TokenManagerSingleTon.getInstance().refresh();
                }
                return true;
            }
            return false;
        } catch {
            return false;
        }
    },
};
const App = ({ Component, pageProps }: Props) => {
    const getLayout = Component.getLayout ?? ((page) => page);
    const Layout = Component.layout ?? Fragment;

    const queryClient = new QueryClient({
        queryCache: new QueryCache(),
        defaultOptions: {
            queries: {
                ...authRetryOption,
                refetchOnWindowFocus: false,
            },
            mutations: {
                ...authRetryOption,
            },
        },
    });

    useEffectOnce(() => {
        let loadRetry = 1;
        let intervalID = null;
        intervalID = setInterval(() => {
            if (loadRetry > 5 || TokenManagerSingleTon.getInstance().isCanBeRefresh) {
                clearInterval(intervalID);
                return;
            }
            loadRetry += 1;
            TokenManagerSingleTon.getInstance().load();
        }, SECOND / 2);
    });

    return (
        <MuiThemeProvider theme={theme}>
            <EmotionThemeProvider theme={theme as any}>
                <QueryClientProvider client={queryClient}>
                    <TRGlobalErrorBoundary>
                        <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
                        <div id="screen-top" />
                        <MessageList />
                    </TRGlobalErrorBoundary>
                </QueryClientProvider>
            </EmotionThemeProvider>
        </MuiThemeProvider>
    );
};
export default withRecoil(appWithTranslation(App));
