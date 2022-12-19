import { AuthGuard } from '@components/authentication/auth-guard';
import { AttributePoint } from '@components/common/attribute-point';
import { TRButton } from '@components/common/buttons/button';
import { Column, Row } from '@components/common/flex';
import { HeadphoneInfoBox } from '@components/common/headphone-info-box';
import { TRLabel } from '@components/common/labels/label';
import { MainLayout } from '@components/common/layouts/main-layout';
import { useTheme } from '@emotion/react';
import React, { useState } from 'react';
import { useHeadphoneSingleQuery } from 'src/react-query/inventory';
import { Page } from 'types/page';
import { HeadphoneWithDocks } from '@components/common/headphone-with-docks';
import { ItemThumbnail } from '@components/common/item-thumbnail';
import styled from '@emotion/styled';
import { ChevronLeft } from '@mui/icons-material';
import { useTracksRouter } from '@hooks/use-tracks-router';
import { Skeleton } from '@mui/material';
import { MODAL_ID } from '@constants/common';
import { useModalDispatch } from 'src/recoil/modal';
import { useHeadphoneDispatch } from 'src/recoil/headphone';
import { ModalBuyItem } from '@components/marketplace/modal-buy-item';

const StyledFloatingBox = styled(Row)`
    position: fixed;
    bottom: 60px;
    height: 56px;
    width: 312px;
    background-color: black;
    border-radius: 999px;
    padding: 12px 24px;
    z-index: 999;
`;

const MarketplaceHeadphone: Page = () => {
    const { query, back } = useTracksRouter();
    const { palette } = useTheme();
    const { open } = useModalDispatch();
    const { set } = useHeadphoneDispatch();
    const [isBase, setIsBase] = useState<boolean>(false);
    const { headphone, isLoading } = useHeadphoneSingleQuery(String(query.id));

    const handleBaseClick = () => {
        setIsBase((status) => !status);
    };

    const handleGoBackClick = () => {
        back();
    };

    const handleSellRegisterModalOpen = (e) => {
        e.stopPropagation();
        open(MODAL_ID.BUY_ITEM_MODAL);
        set(headphone);
    };

    if (isLoading) {
        return (
            <Column gap={3}>
                <HeadphoneInfoBox.Skeleton />
                <Column alignSelf="stretch">
                    <Row alignSelf="stretch" gap={1}>
                        <Skeleton height={30} variant="text" sx={{ flex: 1 }} />
                        <Skeleton height={30} variant="text" sx={{ flex: 2 }} />
                    </Row>
                    <Row alignSelf="stretch" gap={1}>
                        <Skeleton height={30} variant="text" sx={{ flex: 1 }} />
                        <Skeleton height={30} variant="text" sx={{ flex: 2 }} />
                    </Row>
                    <Row alignSelf="stretch" gap={1}>
                        <Skeleton height={30} variant="text" sx={{ flex: 1 }} />
                        <Skeleton height={30} variant="text" sx={{ flex: 2 }} />
                    </Row>
                    <Row alignSelf="stretch" gap={1}>
                        <Skeleton height={30} variant="text" sx={{ flex: 1 }} />
                        <Skeleton height={30} variant="text" sx={{ flex: 2 }} />
                    </Row>
                </Column>
            </Column>
        );
    }

    return (
        <Column
            justifyContent="flex-start"
            style={{ position: 'relative', paddingBottom: 80, height: '100%', overflowY: 'auto' }}
        >
            <ChevronLeft
                onClick={handleGoBackClick}
                sx={{ fill: palette.text.primary, position: 'absolute', left: 0 }}
            />
            <HeadphoneInfoBox asHeadPhone={<HeadphoneWithDocks headphone={headphone} />} headphone={headphone} />
            <Row alignSelf="stretch" style={{ marginTop: '32px', marginBottom: '21px' }} justifyContent="space-between">
                <TRLabel weight="bold" sizing="lg">
                    Attribute
                </TRLabel>
                <TRButton
                    onClick={handleBaseClick}
                    style={{
                        fontSize: '12px',
                        lineHeight: '20px',
                        color: isBase ? palette.primary.main : palette.light.main,
                    }}
                    variant="outlined"
                    sizing="xs"
                >
                    Base
                </TRButton>
            </Row>
            <AttributePoint
                isBase={isBase}
                basePoints={headphone?.points.base}
                itemPoints={headphone?.points.item}
                levelupPoints={headphone?.points.level}
            />

            <StyledFloatingBox justifyContent="space-between">
                <Row style={{ gap: '8px' }}>
                    <TRLabel weight="bold">{headphone.price}</TRLabel>
                    <TRLabel color={palette.text.secondary}>BNB</TRLabel>
                </Row>
                <TRButton onClick={handleSellRegisterModalOpen} style={{ fontSize: '14px' }} sizing="sm">
                    Buy Now
                </TRButton>
            </StyledFloatingBox>
            <ModalBuyItem />
        </Column>
    );
};

MarketplaceHeadphone.getLayout = (page: React.ReactElement) => (
    <AuthGuard>
        <MainLayout>{page}</MainLayout>
    </AuthGuard>
);

export default MarketplaceHeadphone;
