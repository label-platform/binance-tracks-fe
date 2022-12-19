import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ComponentProps } from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';
import { Drawer } from '@components/common/drawer';
import { RecoilRoot } from 'recoil';
import { useModalDispatch } from 'src/recoil/modal';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { Button } from '@mui/material';
type ComponentType = typeof Drawer;

export default {
    title: 'Drawer/Drawer',
    component: Drawer,
    decorators: [
        (Story) => (
            <RecoilRoot>
                <ThemeProvider theme={theme as any}>
                    <Story />
                </ThemeProvider>
            </RecoilRoot>
        ),
    ],
} as ComponentMeta<ComponentType>;

const DRAWER_ID = 'stories-book-drawer';

const Template: ComponentStory<ComponentType> = (args) => {
    const { open, close } = useDrawerDispatch();
    return (
        <>
            <Button
                onClick={() => {
                    open(DRAWER_ID);
                }}
            >
                open
            </Button>
            <Drawer
                {...args}
                onClose={() => {
                    close(DRAWER_ID);
                }}
            />
        </>
    );
};

export const Default = Template.bind({});

(Default.args as ComponentProps<ComponentType>) = {
    drawerID: DRAWER_ID,
    children: <>aaa</>,
    from: 'right',
    widthPercent: 80,
    heightPercent: 100,
};
