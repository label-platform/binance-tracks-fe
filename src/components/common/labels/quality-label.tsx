import { useTheme } from '@emotion/react';
import { QUALITY_GUARD } from '@models/common.interface';
import { ExtendStyleProps } from 'types/track-const-types';
import { LabelRound } from './label-round';

interface Props extends ExtendStyleProps {
    quality: QUALITY_GUARD;
}

export function QualityLabel(props: Props) {
    const { quality, style = {} } = props;
    const theme = useTheme();
    if (!quality) return <></>;
    return (
        <LabelRound
            color={theme.clesson.quality[quality.toLocaleLowerCase()]}
            variant="contained"
            weight="bold"
            sizing="xxs"
            style={{
                width: '72px',
                height: '18px',
                padding: '0px',
                textTransform: 'capitalize',
                ...style,
            }}
            asLabel={quality.toLocaleLowerCase()}
        />
    );
}
