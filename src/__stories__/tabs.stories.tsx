import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ComponentProps } from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';
import { FlexItem, Row } from '@components/common/flex';
import { Tabs } from '@components/common/tabs';
type ComponentType = typeof Tabs;

export default {
    title: 'COMMON/Tabs',
    component: Tabs,
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

const Template: ComponentStory<ComponentType> = (args) => (
    <Tabs {...args}>
        <Tabs.Titles gap={2}>
            <FlexItem>a</FlexItem>
            <FlexItem>b</FlexItem>
            <FlexItem>c</FlexItem>
        </Tabs.Titles>
        <Tabs.Panels>
            <FlexItem style={{ width: '400px', minHeight: '250px', backgroundColor: 'yellow' }}>a</FlexItem>
            <FlexItem style={{ width: '400px', minHeight: '250px', backgroundColor: 'blue' }}>b</FlexItem>
            <FlexItem style={{ width: '400px', minHeight: '250px', backgroundColor: 'red' }}>c</FlexItem>
        </Tabs.Panels>
    </Tabs>
);

export const Default = Template.bind({});
(Default.args as ComponentProps<ComponentType>) = {
    gap: 1,
    defaultValue: 0,
};
