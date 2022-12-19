import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import React from 'react';
import { TRInput, Props as BaseInputProps } from './input';

interface Props extends Omit<OutlinedInputProps, 'endAdorment' | 'startAdorment'>, BaseInputProps {
    asEnd?: React.ReactNode;
    asStart?: React.ReactNode;
}

export const InputWithAdorments = React.forwardRef((props: Props, ref: any) => {
    const { asEnd, asStart, ...rest } = props;
    return <TRInput ref={ref} startAdornment={asStart} endAdornment={asEnd} {...rest} />;
});

InputWithAdorments.displayName = 'InputWithAdorments';

export type { Props as InputWithAdormentsProps };
