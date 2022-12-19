import styled from '@emotion/styled';

import { TRLabel, TRLabelProps } from './label';

interface Props extends TRLabelProps {
    asLabel: React.ReactNode;
}

export const LabelRoundBase = styled(TRLabel)`
    display: inline-flex;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    border-radius: 999px;
    padding: 6px 12px;
`;

export function LabelRound(props: Props) {
    const { asLabel, variant = 'outlined', ...rest } = props;

    return (
        <LabelRoundBase variant={variant} {...rest}>
            {asLabel}
        </LabelRoundBase>
    );
}

export type { Props as LabelRoundProps };
