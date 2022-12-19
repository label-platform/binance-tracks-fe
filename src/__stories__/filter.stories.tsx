import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ComponentProps } from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@constants/theme';
import { Row } from '@components/common/flex';
import { RecoilRoot } from 'recoil';
import { DrawerFilter, FilterIdContext } from '@components/marketplace/drawer-filter';

type ComponentType = typeof DrawerFilter;
type ComponentSingleType = typeof DrawerFilter.Single;
type ComponentMultiType = typeof DrawerFilter.Multi;
type ComponentSliderType = typeof DrawerFilter.Slider;

const FILTER_ID = 'stories-book-filter';
const DRAWER_ID = 'stories-book-filter-drawer';

export default {
    title: 'COMMON/Filter',
    component: DrawerFilter,
    decorators: [
        (Story) => (
            <FilterIdContext.Provider value={FILTER_ID}>
                <RecoilRoot>
                    <ThemeProvider theme={theme as any}>
                        <Story />
                    </ThemeProvider>
                </RecoilRoot>
            </FilterIdContext.Provider>
        ),
    ],
} as ComponentMeta<ComponentType>;

const Template: ComponentStory<ComponentType> = (args) => {
    return (
        <DrawerFilter {...args}>
            <DrawerFilter.Single title="single" options={['Sneakers', 'Shoeboxes']} />
            <DrawerFilter.Multi title="multi" options={['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']} />
            <DrawerFilter.Slider title="slider" max={30} />
        </DrawerFilter>
    );
};
const SingleTemplate: ComponentStory<ComponentSingleType> = (args) => {
    return (
        <Row style={{ backgroundColor: 'black', padding: '20px', color: 'white' }}>
            <DrawerFilter.Single {...args} />
        </Row>
    );
};
const MultiTemplate: ComponentStory<ComponentMultiType> = (args) => {
    return (
        <Row style={{ backgroundColor: 'black', padding: '20px', color: 'white' }}>
            <DrawerFilter.Multi {...args} />
        </Row>
    );
};
const SliderTemplate: ComponentStory<ComponentSliderType> = (args) => {
    return (
        <Row style={{ backgroundColor: 'black', padding: '20px', color: 'white' }}>
            <DrawerFilter.Slider {...args} />
        </Row>
    );
};

export const Default = Template.bind({});
(Default.args as ComponentProps<ComponentType>) = {
    drawerId: DRAWER_ID,
    filterId: FILTER_ID,
};
export const Single = SingleTemplate.bind({});
(Single.args as ComponentProps<ComponentSingleType>) = {
    title: 'single',
    options: ['Sneakers', 'Shoeboxes'],
};
export const Multi = MultiTemplate.bind({});
(Multi.args as ComponentProps<ComponentMultiType>) = {
    title: 'multi',
    options: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
};
export const Slider = SliderTemplate.bind({});
(Slider.args as ComponentProps<ComponentSliderType>) = {
    title: 'slider',
    max: 30,
};
