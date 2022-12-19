import styled from '@emotion/styled';
import { OutlinedInput, OutlinedInputProps } from '@mui/material';
import React, { CSSProperties } from 'react';
import { Column } from '../flex';

const BaseHelperText = styled.span`
    color: rgb(255, 255, 255, 0.6);
    margin-bottom: 8px;
`;

const BaseInput = styled(OutlinedInput)`
    border-radius: 6px;
    background: #4e4e4e;
    box-shadow: inset 0px 1px 4px #000000;
    color: black;

    &:focus-within {
        color: white;
    }
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
    }

    & fieldset {
        border: none;
    }

    & > input:disabled {
        color: #7c7c7c;
    }
`;

const ErrorText = styled.span`
    color: ${(props) => props.theme.palette.error.main};
    margin-top: 8px;
`;

export interface Props extends OutlinedInputProps {
    asHelperText?: React.ReactNode;
    helperText?: string;
    helperTextPosition?: 'top' | 'bottom';
    inputStyle?: CSSProperties;
    errors?: {
        message?: string;
    };
}

export const TRInput = React.forwardRef((props: Props, ref: any) => {
    const {
        asHelperText,
        helperText,
        helperTextPosition = 'top',
        errors = { message: '' },
        style = {},
        inputStyle = {},
        ...rest
    } = props;

    return (
        <Column alignItems="flex-start" style={{ width: '100%', ...style }}>
            {helperTextPosition === 'top' ? (
                helperText ? (
                    <BaseHelperText>{helperText}</BaseHelperText>
                ) : (
                    asHelperText
                )
            ) : null}
            <BaseInput inputRef={ref} style={inputStyle} {...rest} />
            {helperTextPosition === 'bottom' ? (
                helperText ? (
                    <BaseHelperText>{helperText}</BaseHelperText>
                ) : (
                    asHelperText
                )
            ) : null}
            {errors.message && <ErrorText data-test-id="input-error-text">{errors.message}</ErrorText>}
        </Column>
    );
});

TRInput.displayName = 'TRInput';
