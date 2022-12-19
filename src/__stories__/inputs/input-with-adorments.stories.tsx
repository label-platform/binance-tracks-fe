import { InputWithAdorments } from '@components/common/inputs/input-with-adorments';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ComponentProps } from 'react';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
type ComponentType = typeof InputWithAdorments;

export default {
    title: 'Input/InputWithAdorments',
    component: InputWithAdorments,
    args: {
        asHelperText: '',
    },
    parameters: {
        docs: {
            description: {
                component: '아이콘 포함한 인풋',
            },
        },
    },
} as ComponentMeta<ComponentType>;

const Template: ComponentStory<ComponentType> = (args) => <InputWithAdorments {...args} />;

export const StartIcon = Template.bind({});
(StartIcon.args as ComponentProps<ComponentType>) = {
    asStart: <AccessAlarmIcon />,
    asHelperText: 'time',
};
export const EndIcon = Template.bind({});
(EndIcon.args as ComponentProps<ComponentType>) = {
    asEnd: <AccessAlarmIcon />,
    asHelperText: 'time',
};
