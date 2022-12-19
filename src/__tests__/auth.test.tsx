import { mount, ReactWrapper } from 'enzyme';
import { RecoilRoot } from 'recoil';
import { act } from 'react-dom/test-utils';
import React from 'react';
import Login from 'src/pages/authentication/login';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';

import { QueryClient, QueryClientProvider } from 'react-query';
import { serverProxy } from '@utils/core/server-proxy';
import httpAdapter from 'axios/lib/adapters/http';
import nock from 'nock';
import { HTTP_STATUS, SECOND } from '@constants/common';
import waitFor from './utils';
import ActivationCode from 'src/pages/authentication/activation-code';
import CreateWallet from 'src/pages/authentication/create-wallet';
import { ExportWalletDrawer } from '@components/authentication/export-wallet-drawer';
import { core } from '@utils/core/core';

const pushMock = jest.fn();
const modalMock = jest.fn();
const refetchMock = jest.fn();

const userSelfInfoMock = jest.fn().mockImplementation(() => ({
    user: null,
    isLoading: false,
    refetch: refetchMock,
}));

const resgisterWalletMock = jest.spyOn(core.user, 'registWalletAddress');

serverProxy.defaults.adapter = httpAdapter;

jest.mock('@components/common/modals/confirm', () => (args) => {
    modalMock({ ...args });
});

jest.mock('src/react-query/user', () => {
    const originalModule = jest.requireActual('src/react-query/user');
    return {
        __esModule: true,
        ...originalModule,
        useUserSelfInfoQuery: () => userSelfInfoMock(),
    };
});

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: pushMock,
    }),
}));

jest.mock('next-i18next', () => ({
    useTranslation: () => ({ t: jest.fn((text: string) => text) }),
}));

jest.mock('@services/wallet/plugins', () => ({
    getPluginByType: () => ({
        createWalletByMnemonic: jest.fn(() => 'mock wallet address'),
    }),
}));

describe('login 페이지 시나리오', () => {
    let container: ReactWrapper;

    beforeAll(() => {
        const queryClient = new QueryClient();

        container = mount(
            <QueryClientProvider client={queryClient}>
                <RecoilRoot>
                    <ThemeProvider theme={theme as any}>
                        <Login />
                    </ThemeProvider>
                </RecoilRoot>
            </QueryClientProvider>
        );

        nock(process.env.NEXT_PUBLIC_API_ENDPOINT)
            .post('/api/auth/send-otp')
            .reply(HTTP_STATUS.SUCCESS, {
                data: {
                    success: true,
                },
            });
    });

    describe('프로세스 테스트', () => {
        afterEach(() => {
            modalMock.mockClear();
            refetchMock.mockClear();
        });

        it('이메일 유효성 실패 테스트', async () => {
            await act(async () => {
                await container
                    .find('[data-test-id="email"]')
                    .find('input')
                    .simulate('blur', { target: { name: 'email', value: 'ijj1792' } });
            });

            await waitFor(async () => {
                await container.update();
                expect(container.find('[data-test-id="input-error-text"]').hostNodes().length).toEqual(1);
            });
        });

        it('이메일 유효성 성공 테스트', async () => {
            await act(async () => {
                await container
                    .find('[data-test-id="email"]')
                    .find('input')
                    .simulate('blur', { target: { name: 'email', value: 'ijj1792@naver.com' } });
            });

            await waitFor(async () => {
                await container.update();
                expect(container.find('[data-test-id="input-error-text"]').hostNodes().length).toEqual(0);
            });
        });

        it('로그인 실패 테스트', async () => {
            nock(process.env.NEXT_PUBLIC_API_ENDPOINT)
                .persist()
                .post('/api/auth/login-by-password')
                .reply(HTTP_STATUS.BAD_REQUEST, {
                    data: {
                        success: false,
                    },
                    message: 'error',
                });

            await act(async () => {
                await container
                    .find('[data-test-id="email"]')
                    .find('input')
                    .simulate('blur', { target: { name: 'email', value: 'ijj1792@naver.com' } });
                await container
                    .find('[data-test-id="password"]')
                    .find('input')
                    .simulate('blur', { target: { name: 'password', value: 'fail' } });
                await container.find('[data-test-id="login-btn"]').hostNodes().simulate('click');
            });

            await waitFor(async () => {
                await container.update();
                expect(container.find('[data-test-id="input-error-text"]').hostNodes().length).toEqual(1);
            });
            nock.cleanAll();
        });

        it('로그인 성공 테스트', async () => {
            nock(process.env.NEXT_PUBLIC_API_ENDPOINT)
                .persist()
                .post('/api/auth/login-by-password')
                .reply(HTTP_STATUS.SUCCESS, {
                    content: {
                        userData: {},
                        accessToken: '',
                        refreshToken: '',
                    },
                    message: 'success',
                });

            await act(async () => {
                await container
                    .find('[data-test-id="email"]')
                    .find('input')
                    .simulate('blur', { target: { name: 'email', value: 'ijj179212@naver.com' } });
                await container
                    .find('[data-test-id="password"]')
                    .find('input')
                    .simulate('change', { target: { name: 'password', value: '123456' } })
                    .simulate('blur', { target: { name: 'password', value: '123456' } });
                await container.update();
            });

            await waitFor(() => {
                container.find('[data-test-id="login-btn"]').hostNodes().simulate('click');
                expect(pushMock).toHaveBeenCalled();
            }, SECOND * 2);
        });
    });

    afterAll(() => {
        container.unmount();
    });
});

describe('activation-code 페이지 시나리오', () => {
    let container: ReactWrapper;

    beforeAll(() => {
        const queryClient = new QueryClient();

        userSelfInfoMock.mockReset();
        userSelfInfoMock.mockImplementation(() => ({
            user: {
                email: 'ijj1792@naver.com',
            },
            refetch: refetchMock,
        }));
        container = mount(
            <QueryClientProvider client={queryClient}>
                <RecoilRoot>
                    <ThemeProvider theme={theme as any}>
                        <ActivationCode />
                    </ThemeProvider>
                </RecoilRoot>
            </QueryClientProvider>
        );
    });

    describe('프로세스 테스트', () => {
        it('액티베이션 코드 실패 테스트', async () => {
            nock(process.env.NEXT_PUBLIC_API_ENDPOINT)
                .put('/api/activation-codes/update-activation-code')
                .reply(HTTP_STATUS.BAD_REQUEST, {
                    data: {
                        success: true,
                    },
                });

            await act(async () => {
                await container
                    .find('[data-test-id="activation-code"]')
                    .find('input')
                    .simulate('blur', { target: { value: '123456', name: 'activationCode' } });
            });

            await waitFor(() => {
                container.find('[data-test-id="submit-activation-code"]').hostNodes().simulate('click');
                expect(
                    container
                        .find('[data-test-id="activation-code"]')
                        .find('[data-test-id="input-error-text"]')
                        .hostNodes().length
                ).toEqual(1);
            });
        });

        it('액티베이션 코드 성공 테스트', async () => {
            nock(process.env.NEXT_PUBLIC_API_ENDPOINT)
                .put('/api/activation-codes/update-activation-code')
                .reply(HTTP_STATUS.SUCCESS, {
                    data: {
                        success: true,
                    },
                });

            await act(async () => {
                await container
                    .find('[data-test-id="activation-code"]')
                    .find('input')
                    .simulate('blur', { target: { value: '456789', name: 'activationCode' } });
            });

            await waitFor(() => {
                container.find('[data-test-id="submit-activation-code"]').hostNodes().simulate('click');
                expect(refetchMock).toHaveBeenCalled();
            });
        });
    });
});

describe('create-wallet 페이지 시나리오', () => {
    let container: ReactWrapper;

    beforeAll(() => {
        const queryClient = new QueryClient();

        userSelfInfoMock.mockReset();
        userSelfInfoMock.mockImplementation(() => ({
            user: {
                email: 'ijj1792@naver.com',
            },
            refetch: refetchMock,
        }));
        container = mount(
            <QueryClientProvider client={queryClient}>
                <RecoilRoot>
                    <ThemeProvider theme={theme as any}>
                        <CreateWallet />
                    </ThemeProvider>
                </RecoilRoot>
            </QueryClientProvider>
        );
    });

    afterEach(() => {
        modalMock.mockClear();
        refetchMock.mockClear();
    });
    describe('프로세스 테스트', () => {
        it('drawer open 확인', async () => {
            act(() => {
                container.find('[data-test-id="open-drawer-exportwallet"]').hostNodes().simulate('click');
            });

            await waitFor(() => {
                container.update();
                expect(container.find(ExportWalletDrawer).exists('[data-test-id="mnemonics-confirm"]')).toEqual(true);
            });
        });

        it('mnemonics 선택 확인', async () => {
            expect(
                container.find(ExportWalletDrawer).find('[data-test-id="inactive-label"]').hostNodes().length
            ).toEqual(12);

            act(() => {
                container
                    .find(ExportWalletDrawer)
                    .find('[data-test-id="inactive-label"]')
                    .hostNodes()
                    .slice(6)
                    .forEach((node) => node.simulate('click'));
            });
            container.update();
            expect(
                container.find(ExportWalletDrawer).find('[data-test-id="inactive-label"]').hostNodes().length
            ).toEqual(6);
        });

        it('mnemonics 선택 실패 케이스', async () => {
            act(() => {
                container
                    .find(ExportWalletDrawer)
                    .find('[data-test-id="inactive-label"]')
                    .hostNodes()
                    .forEach((node) => node.simulate('click'));
            });

            await act(async () => {
                await container
                    .find(ExportWalletDrawer)
                    .find('[data-test-id="mnemonics-confirm"]')
                    .hostNodes()
                    .simulate('click');
            });
            await waitFor(() => {
                expect(modalMock).toHaveBeenCalled();
            });
        });

        it('mnemonics 선택 성공 케이스', async () => {
            nock(process.env.NEXT_PUBLIC_API_ENDPOINT)
                .put('/api/users/wallet-address')
                .reply(HTTP_STATUS.SUCCESS, {
                    data: {
                        success: false,
                    },
                });

            act(() => {
                container
                    .find(ExportWalletDrawer)
                    .find('[data-test-id="active-label"]')
                    .hostNodes()
                    .forEach((node) => node.simulate('click'));
            });

            const list = container.find(ExportWalletDrawer).props().mnemonics;
            container.update();
            act(() => {
                const inActiveLabels = container
                    .find(ExportWalletDrawer)
                    .find('[data-test-id="inactive-label"]')
                    .hostNodes();

                list.forEach((keyword: string) => {
                    const label = inActiveLabels.findWhere((n) => n.text() === keyword);
                    label.hostNodes().simulate('click');
                });
            });

            await act(async () => {
                await container
                    .find(ExportWalletDrawer)
                    .find('[data-test-id="mnemonics-confirm"]')
                    .hostNodes()
                    .simulate('click');
            });

            expect(resgisterWalletMock).toHaveBeenCalled();
        });
    });
});

export {};
