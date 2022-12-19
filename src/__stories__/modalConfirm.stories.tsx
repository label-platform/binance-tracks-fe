import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';
import { Modal } from '@components/common/modals/modal';
import { Button } from '@mui/material';
type ComponentType = typeof Modal;

export default {
    title: 'Modal/Confirm',
    component: Modal,
    decorators: [
        (Story) => (
            <ThemeProvider theme={theme as any}>
                <Story />
            </ThemeProvider>
        ),
    ],
    argTypes: {
        title: {
            control: {
                type: 'text',
            },
        },
        content: {
            control: {
                type: 'text',
            },
        },
        okText: {
            control: {
                type: 'text',
            },
        },
        cancelText: {
            control: {
                type: 'text',
            },
        },
    },
} as ComponentMeta<ComponentType>;

const ConfirmTemplate: ComponentStory<any> = (args: Parameters<typeof Modal.confirm>[0]) => {
    const handleClick = () => {
        Modal.confirm({ ...args });
    };

    return <Button onClick={handleClick}>confirm</Button>;
};

export const Confirm = ConfirmTemplate.bind({});
Confirm.args = {
    title: 'CONFIRM',
    content: '스토리북 테스트!',
    okText: 'OK!',
    cancelText: 'Cancel',
};
Confirm.parameters = { controls: { include: ['title', 'content', 'okText', 'cancelText'] } };
