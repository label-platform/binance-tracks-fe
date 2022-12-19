import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ComponentProps } from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';
import { Row } from '@components/common/flex';
import { LabelRoundPercent } from '@components/common/labels/label-round-percent';
type ComponentType = typeof LabelRoundPercent;

export default {
    title: 'Label/LabelRoundPercent',
    component: LabelRoundPercent,
    decorators: [
        (Story) => (
            <ThemeProvider theme={theme as any}>
                <Row style={{ width: '400px', backgroundColor: '#121212', padding: 10 }}>
                    <Story />
                </Row>
            </ThemeProvider>
        ),
    ],
} as ComponentMeta<ComponentType>;

const Template: ComponentStory<ComponentType> = (args) => <LabelRoundPercent {...args} />;

export const Default = Template.bind({});
(Default.args as ComponentProps<ComponentType>) = {
    asLabel: '50/100',
    percent: 50,
};
