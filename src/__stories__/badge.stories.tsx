import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ComponentProps } from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';
import { Column, Row } from '@components/common/flex';
import { TRBadge } from '@components/common/badge';
type ComponentType = typeof TRBadge.Item;

export default {
    title: 'COMMON/Badge',
    component: TRBadge.Item,
    decorators: [
        (Story) => (
            <ThemeProvider theme={theme as any}>
                <Story />
            </ThemeProvider>
        ),
    ],
    argTypes: {
        ['anchorOrigin.horizon']: {
            control: 'select',
            options: ['left', 'center', 'right'],
        },
        ['anchorOrigin.vertical']: {
            control: 'select',
            options: ['top', 'center', 'bottom'],
        },
    },
} as ComponentMeta<ComponentType>;

const Template: ComponentStory<ComponentType> = (args) => {
    return (
        <TRBadge asRoot={<Column style={{ width: '200px', height: '200px', backgroundColor: 'red' }} />}>
            <TRBadge.Item anchorOrigin={args.anchorOrigin}>
                <span style={{ backgroundColor: 'yellow' }}>뱃지</span>
            </TRBadge.Item>
        </TRBadge>
    );
};

export const Default = Template.bind({});
(Default.args as Partial<ComponentProps<ComponentType>>) = {
    anchorOrigin: {
        horizon: 'center',
        vertical: 'top',
    },
};
