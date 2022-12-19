import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ComponentProps } from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';
import { Row } from '@components/common/flex';
import { LabelWithIcon } from '@components/common/labels/label-with-icon';
import { AttributeLuckIcon } from '@icons/index';

type ComponentType = typeof LabelWithIcon;

export default {
    title: 'Label/LabelWithIcon',
    component: LabelWithIcon,
    decorators: [
        (Story) => (
            <ThemeProvider theme={theme as any}>
                <Row style={{ width: '400px' }}>
                    <Story />
                </Row>
            </ThemeProvider>
        ),
    ],
} as ComponentMeta<ComponentType>;

const Template: ComponentStory<ComponentType> = (args) => <LabelWithIcon {...args} />;

export const StartIcon = Template.bind({});
(StartIcon.args as ComponentProps<ComponentType>) = {
    asIcon: <AttributeLuckIcon />,
    label: 'Luck',
};

export const EndIcon = Template.bind({});
(EndIcon.args as ComponentProps<ComponentType>) = {
    asIcon: <AttributeLuckIcon />,
    label: 'Luck',
    iconPosition: 'end',
};
