import { useTheme } from '@emotion/react';
import { Checkbox, CheckboxProps, FormControlLabel, FormControlLabelProps } from '@mui/material';
import React from 'react';
import { ColorGuard } from 'types/track-const-types';

interface Props extends Pick<FormControlLabelProps, 'labelPlacement'>, Omit<CheckboxProps, 'color'> {
    asLabel?: React.ReactNode;
    color?: ColorGuard;
}

const NoneCheckedIcon = React.memo(() => {
    return (
        <span
            style={{
                width: '20px',
                height: '20px',
                position: 'relative',
                border: '2px solid white',
                borderRadius: '4px',
                opacity: '0.38',
            }}
        >
            <svg
                style={{ position: 'absolute', transform: 'translate(-50%, -50%)', left: '50%', top: '50%' }}
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M1 4.02586L4.71082 7.13152L10.8699 1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </span>
    );
});

const CheckedIcon = React.memo((props: any) => {
    const theme = useTheme();

    return (
        <span
            style={{
                width: '24px',
                height: '24px',
                position: 'relative',
                borderRadius: '4px',
                backgroundColor: theme.palette[props.color].main,
            }}
        >
            <svg
                style={{ position: 'absolute', transform: 'translate(-50%, -50%)', left: '50%', top: '50%' }}
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M1 4.02586L4.71082 7.13152L10.8699 1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </span>
    );
});

export const TRCheckbox = React.forwardRef((props: Props, ref: any) => {
    const {
        asLabel,
        labelPlacement = 'end',
        icon = <NoneCheckedIcon />,
        checkedIcon,
        color = 'primary',
        ...rest
    } = props;

    return (
        <FormControlLabel
            control={
                <Checkbox
                    ref={ref}
                    color={color as any}
                    icon={icon}
                    checkedIcon={checkedIcon || <CheckedIcon color={color} />}
                    {...rest}
                />
            }
            label={asLabel}
            labelPlacement={labelPlacement}
        />
    );
});

NoneCheckedIcon.displayName = 'NoneCheckedIcon';
CheckedIcon.displayName = 'CheckedIcon';
TRCheckbox.displayName = 'TRCheckbox';
