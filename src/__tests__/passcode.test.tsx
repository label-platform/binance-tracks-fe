import { Keypad, PasscodeInput } from '@components/common/passcode';
import { ResetChangePasscode } from '@components/setting/reset-change-passcode';
import { mount, ReactWrapper } from 'enzyme';
import { RecoilRoot } from 'recoil';
import { act } from 'react-dom/test-utils';
import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';

const closeMock = jest.fn();
const closeAllMock = jest.fn();

jest.mock('src/recoil/drawer', () => ({
    useDrawerState: () => true,
    useDrawerDispatch: () => ({
        close: closeMock,
        closeAll: closeAllMock,
    }),
}));

describe('reset change passcode 컴포넌트 시나리오', () => {
    let container: ReactWrapper;
    let passcodeInput: ReactWrapper;
    let passcodeKeyPad: ReactWrapper;
    let deleteButton: ReactWrapper;

    beforeAll(() => {
        container = mount(
            <RecoilRoot>
                <ThemeProvider theme={theme as any}>
                    <ResetChangePasscode />
                </ThemeProvider>
            </RecoilRoot>
        );
        passcodeInput = container.find(PasscodeInput);
        passcodeKeyPad = container.find(Keypad);
        deleteButton = container.find('[data-test-id="delete-button"]').hostNodes();
    });

    describe('키패드 시나리오', () => {
        it('키패드 렌더링 검사', () => {
            expect(passcodeInput.length).toEqual(1);
            expect(passcodeInput.find('[data-test-id="passcode-input"]').length).toEqual(6);
            expect(passcodeKeyPad.length).toEqual(12);
            expect(deleteButton.length).toEqual(1);
        });

        it('키패드 입력', () => {
            act(() => {
                (passcodeKeyPad.at(0).props() as any).onClick();
            });

            act(() => {
                (passcodeKeyPad.at(1).props() as any).onClick();
            });
            container.update();
            passcodeInput = container.find(PasscodeInput);
            expect((passcodeInput.props() as any).passcode).toEqual([1, 2]);
        });

        it('키패드 삭제', () => {
            deleteButton.simulate('click');
            container.update();
            passcodeInput = container.find(PasscodeInput);
            expect((passcodeInput.props() as any).passcode).toEqual([1]);
        });
    });

    it('뒤로가기 버튼 클릭 시 drawer close 실행', () => {
        container.find('.backButton').hostNodes().simulate('click');
        expect(closeMock).toBeCalledTimes(1);
    });
});

export {};
