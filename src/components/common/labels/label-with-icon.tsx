import styled from '@emotion/styled';
import { DOMAttributes } from 'react';
import { ExtendStyleProps } from 'types/track-const-types';
import { Row } from '../flex';
import { TRLabel, TRLabelProps } from './label';

const InlineRow = styled(Row)`
    display: inline-flex;
    & span {
        height: 24px;
        line-height: 30px;
    }
`;

interface Props extends DOMAttributes<HTMLDivElement>, ExtendStyleProps {
    asIcon: React.ReactNode;
    iconPosition?: 'start' | 'end';
    label: string;
    gap?: number;
    labelProps?: TRLabelProps;
}

export function LabelWithIcon(props: Props) {
    const { asIcon, label, labelProps = {}, gap = 0, iconPosition = 'start', ...rest } = props;
    return (
        <InlineRow {...rest} gap={gap}>
            {iconPosition === 'start' && <span>{asIcon}</span>}
            <TRLabel {...labelProps}>{label}</TRLabel>
            {iconPosition === 'end' && <span>{asIcon}</span>}
        </InlineRow>
    );
}
