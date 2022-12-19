import { Keypad, PasscodeInput } from '@components/common/passcode';
import { ResetChangePasscode } from '@components/setting/reset-change-passcode';
import { mount, ReactWrapper } from 'enzyme';
import { RecoilRoot } from 'recoil';
import { act } from 'react-dom/test-utils';
import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';
import HeadphoneDetail from 'src/pages/headphone/[id]';

const closeMock = jest.fn();
const closeAllMock = jest.fn();

jest.mock('src/recoil/drawer', () => ({
    useDrawerState: () => true,
    useDrawerDispatch: () => ({
        close: closeMock,
        closeAll: closeAllMock,
    }),
}));

describe('마켓 플레이스 페이지 시나리오', () => {
    let container: ReactWrapper;
    let passcodeInput: ReactWrapper;
    let passcodeKeyPad: ReactWrapper;
    let deleteButton: ReactWrapper;

    beforeAll(() => {
        container = mount(
            <RecoilRoot>
                <ThemeProvider theme={theme as any}>
                    <HeadphoneDetail />
                </ThemeProvider>
            </RecoilRoot>
        );
        passcodeInput = container.find(PasscodeInput);
        passcodeKeyPad = container.find(Keypad);
        deleteButton = container.find('[data-test-id="delete-button"]').hostNodes();
    });
});

export {};
