import styled from '@emotion/styled';
import { render as reactRender, unmountComponentAtNode as reactUnmount } from 'react-dom';
import { TRButton } from '../buttons/button';
import { Column } from '../flex';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { CustomDialog } from './dialog';
import { theme } from '@constants/theme';
import { ReactNode } from 'react';
import { Close } from '@mui/icons-material';

export let isModalConfirmOpen = false;
let containers = [];

export const unmountContainerAll = () => {
    containers.forEach((container) => {
        reactUnmount(container);
    });
    isModalConfirmOpen = false;
    containers = [];
};
interface ConfirmProps {
    title: string;
    content: ReactNode;
    okText?: string;
    cancelText?: string;
    handleOkClick?: () => void;
    handleCancelClick?: () => void;
}

const ConfirmTitle = styled.div`
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;
    width: 100%;
    text-align: center;
    color: rgba(255, 255, 255, 0.87);
`;

const ConfirmDialog = styled(CustomDialog)`
    & .MuiDialog-container {
        & > .MuiPaper-root {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            max-width: 312px;
            background-color: #121212;
            border-radius: 16px;

            & > * {
                padding: 0px;
            }

            & > .MuiDialogContent-root {
                color: rgba(255, 255, 255, 0.6);
                text-align: center;
                white-space: pre-wrap;
                margin-top: 16px;
                margin-bottom: 34px;
            }
        }
    }
`;

export default function confirm(config: ConfirmProps) {
    const container = document.createDocumentFragment();
    function destory() {
        reactUnmount(container);
        isModalConfirmOpen = false;
        containers.pop();
    }

    function handleOkClick() {
        config.handleOkClick && config.handleOkClick();
        destory();
    }

    function handleCancelClick() {
        config.handleCancelClick && config.handleCancelClick();
        destory();
    }

    function render() {
        isModalConfirmOpen = true;
        containers.push(container);

        reactRender(
            <EmotionThemeProvider theme={theme as any}>
                <ConfirmDialog
                    open
                    asTitle={<ConfirmTitle>{config.title}</ConfirmTitle>}
                    asFooter={
                        <Column style={{ width: '100%', gap: '18px' }}>
                            {config.okText && (
                                <TRButton
                                    data-test-id="confirm-ok-btn"
                                    onClick={handleOkClick}
                                    sizing="md"
                                    style={{ width: '100%' }}
                                >
                                    {config.okText}
                                </TRButton>
                            )}
                            {config.cancelText && (
                                <TRButton
                                    data-test-id="confirm-cancel-btn"
                                    onClick={handleCancelClick}
                                    sizing="md"
                                    style={{ width: '100%' }}
                                    variant="outlined"
                                >
                                    {config.cancelText}
                                </TRButton>
                            )}
                        </Column>
                    }
                    onClose={destory}
                    asCloseIcon={<Close />}
                >
                    {config.content}
                </ConfirmDialog>
            </EmotionThemeProvider>,
            container
        );
    }

    render();
}
