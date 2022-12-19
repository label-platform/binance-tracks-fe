import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ComponentProps } from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';
import { FlexItem, Row } from '@components/common/flex';
import { ToggleTabs } from '@components/common/toggle-tabs';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

type ComponentType = typeof ToggleTabs;

export default {
    title: 'COMMON/ToggleTabs',
    component: ToggleTabs,
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
    <ToggleTabs {...args}>
        <ToggleTabs.Contents match="spending">
            <FlexItem>spending</FlexItem>
        </ToggleTabs.Contents>
        <ToggleTabs.Contents match="transfer">
            <FlexItem>Transfer</FlexItem>
        </ToggleTabs.Contents>
    </ToggleTabs>
);

export const Default = Template.bind({});
(Default.args as ComponentProps<ComponentType>) = {
    gap: 1,
    initValue: 'spending',
    titles: ['spending', 'transfer'],
    asStartIcon: <ChevronLeftIcon />,
    asLastIcon: <SettingsIcon />,
};
