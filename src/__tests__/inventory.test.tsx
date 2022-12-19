/* eslint-disable react/display-name */
import './mocks/mock-global';
import { theme } from '@constants/theme';
import { ThemeProvider } from '@emotion/react';
import { mount, ReactWrapper } from 'enzyme';
import { RecoilRoot } from 'recoil';
import { ATTRIBUTE, ITEM_STATUS, ITEM_TYPE, QUALITY } from '@models/common.interface';
import { Item } from '@models/item/item';
import { createHeadphone, Headphone } from '@models/headphone/headphone';
import { createHeadphoneBox, HeadphoneBox } from '@models/headphone-box/headphone-box';

import { QueryClient, QueryClientProvider } from 'react-query';
import waitFor from './utils';
import { act } from 'react-dom/test-utils';
import { HeadphoneTab } from '@components/inventory/headphone-tab';
import { HeadphoneBoxes } from '@components/inventory/headphone-boxes-tab';
import { serverProxy } from '@utils/core/server-proxy';
import httpAdapter from 'axios/lib/adapters/http';
import nock from 'nock';
import { HTTP_STATUS, MODAL_ID, SECOND } from '@constants/common';
import { StickerTab } from '@components/inventory/sticker-tab';
import { createSticker, Sticker } from '@models/sticker/sticker';
import { ModalHeadphoneBox } from '@components/inventory/modal-headphone-box';
import { CustomDialog } from '@components/common/modals/dialog';
import { ModalSticker } from '@components/inventory/modal-sticker';
import { ModalSellItem } from '@components/common/modal-sell-item';

const HEADPHONE_ITMES = {
    [ITEM_STATUS.IDLE]: Item.createMockItem(ITEM_TYPE.HEADPHONE, ITEM_STATUS.IDLE),
    [ITEM_STATUS.SELLING]: Item.createMockItem(ITEM_TYPE.HEADPHONE, ITEM_STATUS.SELLING),
};

const HEADPHONEBOX_ITMES = {
    [ITEM_STATUS.IDLE]: Item.createMockItem(ITEM_TYPE.HEADPHONEBOX, ITEM_STATUS.IDLE),
    [ITEM_STATUS.SELLING]: Item.createMockItem(ITEM_TYPE.HEADPHONEBOX, ITEM_STATUS.SELLING),
};

const STICKER_ITMES = {
    [ITEM_STATUS.IDLE]: Item.createMockItem(ITEM_TYPE.STICKER, ITEM_STATUS.IDLE),
    [ITEM_STATUS.SELLING]: Item.createMockItem(ITEM_TYPE.STICKER, ITEM_STATUS.SELLING),
};

serverProxy.defaults.adapter = httpAdapter;

const pushMock = jest.fn();
const openMock = jest.fn();
const modalStateMock = jest.fn().mockImplementation(() => ({
    data: null,
}));

jest.mock('@hooks/use-tracks-router', () => ({
    useTracksRouter: () => ({
        push: pushMock,
    }),
}));

jest.mock('swiper/react', () => ({
    Swiper: ({ children }) => {
        return children;
    },
    SwiperSlide: ({ children }) => {
        return children;
    },
}));

jest.mock('next/image', () => () => <></>);

jest.mock('@icons/index', () => {
    const originalModule = jest.requireActual('@icons/index');
    const overrideIcon = Object.keys(originalModule).reduce((prev, key) => ({ ...prev, [key]: () => <></> }), {});
    return {
        ...overrideIcon,
    };
});

jest.mock('src/recoil/modal', () => ({
    useModalDispatch: () => ({
        open: openMock,
        close: jest.fn(),
        setData: jest.fn(),
    }),
    useModalState: () => modalStateMock(),
}));

describe('인벤토리 동작 시나리오', () => {
    nock(process.env.NEXT_PUBLIC_API_ENDPOINT)
        .get('/api/inventories/headphone-boxes/list')
        .query(true)
        .reply(HTTP_STATUS.SUCCESS, {
            success: true,
            content: {
                data: [
                    HeadphoneBox.createMock(HEADPHONEBOX_ITMES[ITEM_STATUS.IDLE], QUALITY.COMMON),
                    HeadphoneBox.createMock(HEADPHONEBOX_ITMES[ITEM_STATUS.SELLING], QUALITY.COMMON),
                ],
                meta: {
                    page: 1,
                    take: 8,
                    itemCount: 2,
                    pageCount: 2,
                    hasPreviousPage: false,
                    hasNextPage: false,
                },
            },
        });

    nock(process.env.NEXT_PUBLIC_API_ENDPOINT)
        .get('/api/inventories/headphones/list')
        .query(true)
        .reply(HTTP_STATUS.SUCCESS, {
            success: true,
            content: {
                data: [
                    Headphone.createMock(HEADPHONE_ITMES[ITEM_STATUS.IDLE], {
                        quality: QUALITY.COMMON,
                    }),
                    Headphone.createMock(HEADPHONE_ITMES[ITEM_STATUS.SELLING], {
                        quality: QUALITY.COMMON,
                    }),
                ],
                meta: {
                    page: 1,
                    take: 8,
                    itemCount: 2,
                    pageCount: 2,
                    hasPreviousPage: false,
                    hasNextPage: false,
                },
            },
        });

    nock(process.env.NEXT_PUBLIC_API_ENDPOINT)
        .persist()
        .get('/api/inventories/headphones/detail')
        .query(true)
        .reply(HTTP_STATUS.SUCCESS, {
            success: true,
            content: Headphone.createMock(HEADPHONE_ITMES[ITEM_STATUS.IDLE], {
                quality: QUALITY.COMMON,
            }),
        });

    nock(process.env.NEXT_PUBLIC_API_ENDPOINT)
        .get('/api/inventories/stickers/list')
        .query(true)
        .reply(HTTP_STATUS.SUCCESS, {
            success: true,
            content: {
                data: [
                    Sticker.createMock(STICKER_ITMES[ITEM_STATUS.IDLE], ATTRIBUTE.COMFORT),
                    Sticker.createMock(STICKER_ITMES[ITEM_STATUS.SELLING], ATTRIBUTE.COMFORT),
                ],
                meta: {
                    page: 1,
                    take: 8,
                    itemCount: 2,
                    pageCount: 2,
                    hasPreviousPage: false,
                    hasNextPage: false,
                },
            },
        });

    describe('탭 요소 확인', () => {
        let container: ReactWrapper;
        const queryClient = new QueryClient();

        beforeAll(() => {
            container = mount(
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider theme={theme as any}>
                        <RecoilRoot>
                            <HeadphoneTab />
                        </RecoilRoot>
                    </ThemeProvider>
                </QueryClientProvider>
            );
        });

        describe('헤드폰 탭', () => {
            it('헤드폰 탭: 헤드폰 카드 렌더링 되는 지 체크', async () => {
                await waitFor(async () => {
                    await container.update();
                    await expect(container.find('[data-test-id="headphone-card"]').hostNodes().length).toEqual(2);
                });
            });

            it('헤드폰 탭: 헤드폰 카드 클릭 시 router 푸시 동작 하는 지 체크', async () => {
                await act(async () => {
                    await container.find('[data-test-id="headphone-card"]').hostNodes().at(0).simulate('click');
                });

                await waitFor(() => {
                    expect(pushMock).toHaveBeenCalled();
                });
            });

            afterAll(() => {
                container.unmount();
                pushMock.mockClear();
            });
        });

        describe('헤드폰 박스 탭', () => {
            beforeAll(() => {
                container = mount(
                    <QueryClientProvider client={queryClient}>
                        <ThemeProvider theme={theme as any}>
                            <RecoilRoot>
                                <HeadphoneBoxes />
                            </RecoilRoot>
                        </ThemeProvider>
                    </QueryClientProvider>
                );
            });
            it('헤드폰 박스 탭: 헤드폰 카드 렌더링 되는 지 체크', async () => {
                await waitFor(async () => {
                    await container.update();
                    expect(container.find('[data-test-id="headphone-box-card"]').hostNodes().length).toEqual(2);
                });
            });

            it('헤드폰 박스 탭: IDLE 상태 클릭 체크', async () => {
                await act(async () => {
                    container.find('[data-test-id="headphone-box-card"]').hostNodes().at(0).simulate('click');
                });

                await waitFor(() => {
                    expect(openMock.mock.calls[0][0]).toBe(MODAL_ID.HEADPHONE_BOX_MODAL);
                });
            });

            it('헤드폰 박스 탭: SELLING 상태 클릭 체크', async () => {
                await act(async () => {
                    container.find('[data-test-id="headphone-box-card"]').hostNodes().at(1).simulate('click');
                });

                await waitFor(() => {
                    expect(openMock).not.toHaveBeenCalled();
                });
            });

            afterEach(() => {
                openMock.mockClear();
            });

            afterAll(() => {
                container.unmount();
            });
        });

        describe('스티커 탭', () => {
            beforeAll(() => {
                container = mount(
                    <QueryClientProvider client={queryClient}>
                        <ThemeProvider theme={theme as any}>
                            <RecoilRoot>
                                <StickerTab />
                            </RecoilRoot>
                        </ThemeProvider>
                    </QueryClientProvider>
                );
            });

            it('스티커 탭: 스티커 카드 렌더링 되는 지 체크', async () => {
                await waitFor(async () => {
                    await container.update();
                    expect(container.find('[data-test-id="sticker-card"]').hostNodes().length).toEqual(2);
                });
            });

            it('스티커 탭: IDLE 상태 클릭 체크', async () => {
                await act(async () => {
                    container.find('[data-test-id="sticker-card"]').hostNodes().at(0).simulate('click');
                });

                await waitFor(() => {
                    expect(openMock.mock.calls[0][0]).toBe(MODAL_ID.STICKER_MODAL);
                });
            });

            it('스티커 탭: SELLING 상태 클릭 체크', async () => {
                await act(async () => {
                    container.find('[data-test-id="sticker-card"]').hostNodes().at(1).simulate('click');
                });

                await waitFor(() => {
                    expect(openMock).not.toHaveBeenCalled();
                });
            });

            it('스티커 탭: SELLING 상태 클릭 체크', async () => {
                await act(async () => {
                    container.find('[data-test-id="sticker-card"]').hostNodes().at(1).simulate('click');
                });

                await waitFor(() => {
                    expect(openMock).not.toHaveBeenCalled();
                });
            });

            afterEach(() => {
                openMock.mockClear();
            });

            afterAll(() => {
                container.unmount();
            });
        });

        describe('헤드폰 박스 모달', () => {
            beforeAll(() => {
                modalStateMock.mockImplementation(() => ({
                    visible: true,
                    data: createHeadphoneBox(
                        HeadphoneBox.createMock(HEADPHONEBOX_ITMES[ITEM_STATUS.IDLE], QUALITY.COMMON)
                    ),
                }));

                container = mount(
                    <QueryClientProvider client={queryClient}>
                        <ThemeProvider theme={theme as any}>
                            <RecoilRoot>
                                <ModalHeadphoneBox />
                            </RecoilRoot>
                        </ThemeProvider>
                    </QueryClientProvider>
                );
            });

            it('헤드폰 박스 모달 렌더링 체크', async () => {
                await waitFor(() => {
                    container.update();
                    expect(container.find(CustomDialog).length).toBe(1);
                });
            });

            it('헤드폰 박스 모달 판매 버튼 클릭 체크', async () => {
                await act(async () => {
                    await container.find('[data-test-id="sell-btn"]').hostNodes().simulate('click');
                });

                await waitFor(() => {
                    expect(openMock.mock.calls[0][0]).toBe(MODAL_ID.SELL_ITEM_MODAL);
                });
            });

            afterAll(() => {
                container.unmount();
            });
        });

        describe('스티커 모달', () => {
            beforeAll(() => {
                modalStateMock.mockImplementation(() => ({
                    visible: true,
                    data: createSticker(Sticker.createMock(STICKER_ITMES[ITEM_STATUS.IDLE], ATTRIBUTE.COMFORT)),
                }));

                container = mount(
                    <QueryClientProvider client={queryClient}>
                        <ThemeProvider theme={theme as any}>
                            <RecoilRoot>
                                <ModalSticker />
                            </RecoilRoot>
                        </ThemeProvider>
                    </QueryClientProvider>
                );
            });

            it('스티커 모달 렌더링 체크', async () => {
                await waitFor(() => {
                    container.update();
                    expect(container.find(CustomDialog).length).toBe(1);
                });
            });

            it('스키터 모달 판매 버튼 클릭 체크', async () => {
                await act(async () => {
                    await container.find('[data-test-id="sell-btn"]').hostNodes().simulate('click');
                });

                await waitFor(() => {
                    expect(openMock.mock.calls[0][0]).toBe(MODAL_ID.SELL_ITEM_MODAL);
                });
            });

            afterEach(() => {
                openMock.mockClear();
            });

            afterAll(() => {
                container.unmount();
                modalStateMock.mockReset();
            });
        });

        describe('아이템 판매 모달', () => {
            beforeAll(() => {
                modalStateMock
                    .mockImplementationOnce(() => ({
                        visible: true,
                        data: createHeadphone(
                            Headphone.createMock(HEADPHONE_ITMES[ITEM_STATUS.IDLE], {
                                quality: QUALITY.COMMON,
                            })
                        ),
                    }))
                    .mockImplementationOnce(() => ({
                        visible: true,
                        data: null,
                    }))
                    .mockImplementationOnce(() => ({
                        visible: true,
                        data: createHeadphoneBox(
                            HeadphoneBox.createMock(HEADPHONEBOX_ITMES[ITEM_STATUS.IDLE], QUALITY.COMMON)
                        ),
                    }))
                    .mockImplementation(() => ({
                        visible: true,
                        data: createSticker(Sticker.createMock(STICKER_ITMES[ITEM_STATUS.IDLE], ATTRIBUTE.COMFORT)),
                    }));
            });

            it('헤드폰 판매 모달 렌더링 체크', async () => {
                expect(container.find('[data-test-id="headphone-content"]').length).toBe(1);
            });

            it('헤드폰 박스 판매 모달 렌더링 체크', async () => {
                expect(container.find('[data-test-id="headphone-box-content"]').hostNodes().length).toBe(1);
            });

            it('스티커 판매 모달 렌더링 체크', async () => {
                expect(container.find('[data-test-id="sticker-content"]').hostNodes().length).toBe(1);
            });

            beforeEach(() => {
                container = mount(
                    <QueryClientProvider client={queryClient}>
                        <ThemeProvider theme={theme as any}>
                            <RecoilRoot>
                                <ModalSellItem />
                            </RecoilRoot>
                        </ThemeProvider>
                    </QueryClientProvider>
                );
            });

            afterEach(() => {
                openMock.mockClear();
                container.unmount();
            });
        });
    });
});

export {};
