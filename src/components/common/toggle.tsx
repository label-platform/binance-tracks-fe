import styled from '@emotion/styled';
import { Switch } from '@mui/material';

interface Props {
    isOn: boolean;
    setIsOn: (isOn: boolean) => void;
}

const StyledSwitch = styled(Switch)`
    padding: 4px;

    & > .MuiSwitch-switchBase > .MuiSwitch-thumb {
        background-color: rgba(255, 255, 255, 0.38);
    }
    & > .MuiSwitch-track {
        border-radius: 999px;
        background-color: rgba(255, 255, 255, 0.12);
    }
`;

export function TRToggle(props: Props) {
    const { isOn, setIsOn } = props;
    const handleToggleChange = (_, checked: boolean) => {
        setIsOn(checked);
    };
    return <StyledSwitch checked={isOn} onChange={handleToggleChange} />;
}
