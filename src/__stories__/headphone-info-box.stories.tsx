import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ComponentProps } from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';

import { HeadphoneInfoBox } from '@components/common/headphone-info-box';

import { Row } from '@components/common/flex';
type ComponentType = typeof HeadphoneInfoBox;

export default {
    title: 'COMMON/HeadphoneInfoBox',
    component: HeadphoneInfoBox,
    decorators: [
        (Story) => (
            <ThemeProvider theme={theme as any}>
                <Row style={{ backgroundColor: '#121212', display: 'inline-block', padding: '10px' }}>
                    <Story />
                </Row>
            </ThemeProvider>
        ),
    ],
} as ComponentMeta<ComponentType>;

const Template: ComponentStory<ComponentType> = (args) => <HeadphoneInfoBox {...args} />;
const headphone = {
    battery: 100,
    quality: 'common',
    level: 2,
    mintCount: 0,
    image: '/images/headphones/headphone_legendary.png',
} as any;
export const Default = Template.bind({});
(Default.args as ComponentProps<ComponentType>) = {
    asHeadPhone: <img src={headphone.image as any} style={{ width: '100px' }} alt="" />,
    headphone,
};
