import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ComponentProps } from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';
import { Modal } from '@components/common/modals/modal';
import { RecoilRoot } from 'recoil';
import { useModalDispatch } from 'src/recoil/modal';
import { Close } from '@mui/icons-material';
import { Button } from '@mui/material';
type ComponentType = typeof Modal;

export default {
    title: 'Modal/Modal',
    component: Modal,
    decorators: [
        (Story) => (
            <RecoilRoot>
                <ThemeProvider theme={theme as any}>
                    <Story />
                </ThemeProvider>
            </RecoilRoot>
        ),
    ],
} as ComponentMeta<ComponentType>;

const MODAL_ID = 'stories-book-modal';

const Template: ComponentStory<ComponentType> = (args) => {
    const { open } = useModalDispatch();
    return (
        <>
            <Button
                onClick={() => {
                    open(MODAL_ID);
                }}
            >
                open
            </Button>
            <Modal {...args} />
        </>
    );
};

export const Default = Template.bind({});
(Default.args as ComponentProps<ComponentType>) = {
    modalID: MODAL_ID,
    children: <>aaa</>,
    asCloseIcon: <Close />,
    asTitle: <>Title</>,
};

const ConfirmTemplate: ComponentStory<any> = (args: Parameters<typeof Modal.confirm>[0]) => {
    const handleClick = () => {
        Modal.confirm({ ...args });
    };

    return <Button onClick={handleClick}>open</Button>;
};

export const Confirm = ConfirmTemplate.bind({});
