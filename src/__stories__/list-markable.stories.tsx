import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ComponentProps } from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';
import { Row } from '@components/common/flex';
import { ListMarkable } from '@components/common/list-markable';
import { IconCircle } from '@components/common/icon-circle';
type ComponentType = typeof ListMarkable;

export default {
    title: 'COMMON/ListMarkable',
    component: ListMarkable,
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

const Template: ComponentStory<ComponentType> = (args) => <ListMarkable {...args} />;

export const Default = Template.bind({});
(Default.args as ComponentProps<ComponentType>) = {
    asMark: <IconCircle asIcon={<span>ㅇ</span>} backgroundColor="pink" size={15} />,
    asNotMark: <IconCircle asIcon={<span>X</span>} backgroundColor="yellow" size={15} />,
    markedKey: 1,
    datas: [0, 1, 2, 3, 5],
    gap: 1,
};
