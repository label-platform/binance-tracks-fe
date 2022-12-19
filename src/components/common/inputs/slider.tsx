import styled from '@emotion/styled';
import { Slider, SliderProps } from '@mui/material';
import { Row } from '../flex';

type Props = SliderProps;

const SliderBase = styled(Slider)`
    height: 10px;
    & > .MuiSlider-track {
        color: white;
        height: 4px;
        border: 0px;
    }

    & > .MuiSlider-rail {
        height: 4px;
        border-radius: 0px;
        color: #9a9a9a;
        box-shadow: inset 0px 1px 4px #000000;
    }

    & .MuiSlider-valueLabel {
        background-color: unset;
        &:before {
            display: 'none';
        }
        & * {
            background: transparent;
            font-size: 10px;
            position: absolute;
            top: 100%;
            left: 30%;
            transform: translate(-50%, -50%);
            color: ${(props) => props.theme.palette.text.secondary};
        }
    }
`;

const MetalThumbBase = styled.div`
    position: absolute;
    top: 50%;
    border-radius: 999px;
    width: 12px;
    height: 12px;
    z-index: 1;
    transform: translateY(-50%);
    background: ${(props) => props.theme.palette.primary.light};
`;

const MetalThumb = (props: any) => {
    const { children, ...rest } = props;
    return (
        <MetalThumbBase {...rest}>
            <div className="inline" />
            {children}
        </MetalThumbBase>
    );
};

export function TRSlider(props: Props) {
    return (
        <Row sx={{ px: '20px', width: '100%' }}>
            <SliderBase valueLabelDisplay="on" components={{ Thumb: MetalThumb }} disableSwap {...props} />
        </Row>
    );
}
