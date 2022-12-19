import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ComponentProps } from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';
import { IconCircle } from '@components/common/icon-circle';
import { MysteryBoxIcon } from '@icons/index';
type ComponentType = typeof IconCircle;

export default {
    title: 'COMMON/IconCircle',
    component: IconCircle,
    decorators: [
        (Story) => (
            <ThemeProvider theme={theme as any}>
                <Story />
            </ThemeProvider>
        ),
    ],
} as ComponentMeta<ComponentType>;

const Template: ComponentStory<ComponentType> = (args) => <IconCircle {...args} />;

export const Default = Template.bind({});
(Default.args as ComponentProps<ComponentType>) = {
    asIcon: <MysteryBoxIcon />,
    backgroundColor: 'yellow',
    size: 20,
};
