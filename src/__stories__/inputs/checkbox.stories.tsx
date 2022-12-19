import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ComponentProps } from 'react';

import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';
import { TRCheckbox } from '@components/common/inputs/checkbox';
import { TRLabel } from '@components/common/labels/label';

type ComponentType = typeof TRCheckbox;

export default {
    title: 'Input/CheckBox',
    component: TRCheckbox,
    decorators: [
        (Story) => (
            <ThemeProvider theme={theme as any}>
                <Story />
            </ThemeProvider>
        ),
    ],
    argTypes: {
        color: {
            control: 'select',
            options: ['primary', 'error', 'warning', 'dark', 'light', 'success'],
        },
    },
} as ComponentMeta<ComponentType>;

const Template: ComponentStory<ComponentType> = (args) => <TRCheckbox {...args} />;

export const Default = Template.bind({});
(Default.args as ComponentProps<ComponentType>) = {
    asLabel: <TRLabel color="light">Primary</TRLabel>,
    color: 'primary',
};
Default.parameters = { controls: { include: ['color'] } };
