import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ComponentProps } from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';
import { TRLabel } from '@components/common/labels/label';

type ComponentType = typeof TRLabel;

export default {
    title: 'Label/Label',
    component: TRLabel,
    decorators: [
        (Story) => (
            <ThemeProvider theme={theme as any}>
                <Story />
            </ThemeProvider>
        ),
    ],
} as ComponentMeta<ComponentType>;

const Template: ComponentStory<ComponentType> = (args) => <TRLabel {...args}>Label</TRLabel>;

export const Default = Template.bind({});
(Default.args as ComponentProps<ComponentType>) = {
    color: 'primary',
    weight: 'medium',
    sizing: 'md',
    variant: 'none',
};

Default.parameters = { controls: { include: ['color', 'weight', 'sizing', 'variant'] } };
