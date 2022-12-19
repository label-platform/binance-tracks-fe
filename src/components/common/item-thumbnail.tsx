import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { ITEM_STATUS_GUARD, QUALITY_GUARD } from '@models/common.interface';
import Image from 'next/image';
import { TRBadge } from './badge';
import { Column, Row } from './flex';
import { TRLabel } from './labels/label';
import { QualityLabel } from './labels/quality-label';

interface Props {
    itemId: string;
    imgUrl: string;
    quality?: QUALITY_GUARD;
    imageSize?: number;
    itemStatus?: ITEM_STATUS_GUARD;
}

const CircleIcon = styled.div<{ imageSize: number }>`
    width: ${(props) => props.imageSize}px;
    height: ${(props) => props.imageSize}px;
    border-radius: 999px;
    overflow: hidden;
`;

export function ItemThumbnail(props: Props) {
    const { itemId, imgUrl, quality, itemStatus, imageSize = 130 } = props;
    const theme = useTheme();
    return (
        <Column>
            <TRBadge
                asRoot={
                    <div style={{ position: 'relative' }}>
                        <CircleIcon imageSize={imageSize}>
                            <Image src={imgUrl} alt="" width={imageSize} height={imageSize} />
                        </CircleIcon>
                        {itemStatus ? (
                            <Row
                                sx={{
                                    position: 'absolute',
                                    top: 10,
                                    left: '50%',
                                    zIndex: 2,
                                    transform: 'translate(-50%, -50%) scale(0.7)',
                                }}
                            >
                                <TRLabel weight="bold" color="dark" sizing="xxs">
                                    {itemStatus}
                                </TRLabel>
                            </Row>
                        ) : null}
                    </div>
                }
            >
                {quality && (
                    <TRBadge.Item anchorOrigin={{ vertical: 'bottom', horizon: 'center' }}>
                        <QualityLabel quality={quality} />
                    </TRBadge.Item>
                )}
            </TRBadge>
            <TRLabel style={{ fontWeight: 600, marginTop: '16px' }} color={theme.palette.text.secondary} sizing="sm">
                {'#' + itemId}
            </TRLabel>
        </Column>
    );
}
