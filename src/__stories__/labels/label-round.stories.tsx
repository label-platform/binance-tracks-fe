import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ComponentProps } from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';
import { Row } from '@components/common/flex';
import { LabelRound } from '@components/common/labels/label-round';
type ComponentType = typeof LabelRound;

export default {
    title: 'Label/LabelRound',
    component: LabelRound,
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

const Template: ComponentStory<ComponentType> = (args) => <LabelRound {...args} />;

export const Default = Template.bind({});
(Default.args as ComponentProps<ComponentType>) = {
    asLabel: 'Label',
    labelColor: 'black',
    style: {
        backgroundColor: 'white',
        border: '1px solid black',
    },
};
