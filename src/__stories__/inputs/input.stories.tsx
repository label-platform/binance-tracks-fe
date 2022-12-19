import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ComponentProps } from 'react';

import { TRInput } from '@components/common/inputs/input';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';
import { TRLabel } from '@components/common/labels/label';
type ComponentType = typeof TRInput;

export default {
    title: 'Input/Input',
    component: TRInput,
    decorators: [
        (Story) => (
            <ThemeProvider theme={theme as any}>
                <Story />
            </ThemeProvider>
        ),
    ],
} as ComponentMeta<ComponentType>;

const Template: ComponentStory<ComponentType> = (args) => <TRInput {...args} />;

export const Default = Template.bind({});
(Default.args as ComponentProps<ComponentType>) = {
    helperText: 'password',
    helperTextPosition: 'top',
};
Default.parameters = { controls: { include: ['helperText', 'helperTextPosition', 'errors'] } };

export const ErrorText = Template.bind({});
(ErrorText.args as ComponentProps<ComponentType>) = {
    errors: {
        message: 'Error!',
    },
};
ErrorText.parameters = { controls: { include: ['errors'] } };

export const CustomHelperText = Template.bind({});
(CustomHelperText.args as ComponentProps<ComponentType>) = {
    asHelperText: <TRLabel color="primary">Primary label</TRLabel>,
    helperTextPosition: 'top',
    inputProps: {
        placeholder: 'placeholder',
    },
};
CustomHelperText.parameters = { controls: { include: ['asHelperText', 'helperTextPosition'] } };
