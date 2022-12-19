import styled from '@emotion/styled';
import { Radio, RadioProps } from '@mui/material';

const RadioBase = styled(Radio)`
    color: rgba(255, 255, 255, 0.38);
    & svg {
        font-size: 20px;
    }
`;

type Props = RadioProps;

export function TRRadio(props: Props) {
    return <RadioBase {...props} />;
}
