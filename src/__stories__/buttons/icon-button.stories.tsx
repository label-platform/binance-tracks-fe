import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ComponentProps } from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';
import { TRIconButton } from '@components/common/buttons/icon-button';
import { Close } from '@mui/icons-material';
type ComponentType = typeof TRIconButton;

export default {
    title: 'Button/IconButton',
    component: TRIconButton,
    decorators: [
        (Story) => (
            <ThemeProvider theme={theme as any}>
                <Story />
            </ThemeProvider>
        ),
    ],
} as ComponentMeta<ComponentType>;

const Template: ComponentStory<ComponentType> = (args) => <TRIconButton {...args} />;

export const Default = Template.bind({});
(Default.args as ComponentProps<ComponentType>) = {
    asIcon: <Close />,
    color: 'primary',
    variant: 'contained',
    sizing: 'md',
};

Default.parameters = { controls: { include: ['color', 'sizing', 'variant'] } };
