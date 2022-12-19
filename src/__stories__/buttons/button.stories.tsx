import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ComponentProps } from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';
import { TRButton } from '@components/common/buttons/button';
type ComponentType = typeof TRButton;

export default {
    title: 'Button/Button',
    component: TRButton,
    decorators: [
        (Story) => (
            <ThemeProvider theme={theme as any}>
                <Story />
            </ThemeProvider>
        ),
    ],
} as ComponentMeta<ComponentType>;

const Template: ComponentStory<ComponentType> = (args) => <TRButton {...args}>Button</TRButton>;

export const Default = Template.bind({});
(Default.args as ComponentProps<ComponentType>) = {
    color: 'primary',
    variant: 'contained',
    sizing: 'xs',
};
Default.parameters = { controls: { include: ['color', 'sizing', 'variant'] } };
