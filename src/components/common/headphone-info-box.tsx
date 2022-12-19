import { Column, Row } from './flex';
import { Headphone } from '@models/headphone/headphone';
import { MAX_MINT } from '@constants/common';
import { QualityLabel } from './labels/quality-label';
import { LabelRoundBarPercent, LabelRoundPercent } from './labels/label-round-percent';
import { TRLabel } from './labels/label';
import { useTheme } from '@emotion/react';
import { Skeleton } from '@mui/material';

interface Props {
    asHeadPhone: React.ReactNode;
    headphone: Headphone;
}

export function HeadphoneInfoBox(props: Props) {
    const { asHeadPhone, headphone } = props;
    const { palette } = useTheme();
    return (
        <Column style={{ width: '100%' }}>
            <Row alignSelf="stretch" sx={{ mb: 3 }}>
                {asHeadPhone}
            </Row>
            <QualityLabel style={{ marginBottom: '10px' }} quality={headphone.quality} />
            <TRLabel style={{ marginBottom: '10px' }} color={palette.text.secondary} sizing="sm">
                {headphone.id}
            </TRLabel>
            <Row style={{ width: '100%', gap: '12px' }} alignItems="center" justifyContent="space-around">
                <LabelRoundPercent
                    sizing="xxs"
                    percent={Math.ceil((headphone.level / 30) * 100)}
                    width={96}
                    height={20}
                    color="white"
                    asLabel={`Lv. ${headphone.level}`}
                />
                <LabelRoundBarPercent
                    height={20}
                    width={96}
                    maxGage={10}
                    gage={headphone.batteryGage}
                    sizing="xxs"
                    asLabel=""
                />
                <LabelRoundPercent
                    percent={Math.ceil((headphone?.mintCount / MAX_MINT) * 100)}
                    width={96}
                    height={20}
                    sizing="xxs"
                    color="white"
                    asLabel={`Mint ${headphone?.mintCount || 0}/${MAX_MINT}`}
                />
            </Row>
        </Column>
    );
}

function SelfSkeleton({ size = 200 }: any) {
    return (
        <Column style={{ width: '100%' }} gap={2}>
            <Skeleton variant="circular" width={size} height={size} />
            <Row alignSelf="stretch" gap={1}>
                <Skeleton sx={{ flex: 1 }} variant="rounded" />
            </Row>
            <Row alignSelf="stretch" gap={1}>
                <Skeleton sx={{ flex: 1 }} variant="rounded" />
            </Row>
            <Row alignSelf="stretch" gap={1}>
                <Skeleton sx={{ flex: 1 }} variant="rounded" />
                <Skeleton sx={{ flex: 1 }} variant="rounded" />
                <Skeleton sx={{ flex: 1 }} variant="rounded" />
            </Row>
        </Column>
    );
}

HeadphoneInfoBox.Skeleton = SelfSkeleton;
