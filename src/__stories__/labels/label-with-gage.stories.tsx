import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ComponentProps } from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';
import { Row } from '@components/common/flex';
import { LabelWithGage } from '@components/common/labels/label-with-gage';
type ComponentType = typeof LabelWithGage;

export default {
    title: 'Label/LabelWithGage',
    component: LabelWithGage,
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

const Template: ComponentStory<ComponentType> = (args) => <LabelWithGage {...args} />;

export const Default = Template.bind({});
(Default.args as ComponentProps<ComponentType>) = {
    asLeftLabel: <div>left</div>,
    asRightLabel: <div>right</div>,
    color: 'black',
    gage: 80,
    gap: 2,
};
