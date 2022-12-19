import React, { MouseEventHandler, useState } from 'react';
import { Column, Row, TRDivider } from '@components/common/flex';
import { LabelRound } from '@components/common/labels/label-round';
import { Modal } from '@components/common/modals/modal';
import { MAX_MINT, MODAL_ID } from '@constants/common';

import Image from 'next/image';
import { useModalDispatch, useModalState } from 'src/recoil/modal';
import { Close } from '@mui/icons-material';
import { TRLabel } from '@components/common/labels/label';
import { TRButton } from '@components/common/buttons/button';
import { useTheme } from '@emotion/react';
import { useBuyQuery } from 'src/react-query/marketplace';
import { Item } from '@models/item/item';
import { Headphone } from '@models/headphone/headphone';
import { HeadphoneBox } from '@models/headphone-box/headphone-box';
import { QualityLabel } from '@components/common/labels/quality-label';
import { StickerIcon } from '@icons/stickers';
import { Sticker } from '@models/sticker/sticker';
import { Merchandise } from '@models/merchandise/merchandise';
import { Ticket } from '@models/ticket/ticket';
import styled from '@emotion/styled';

const CircleIcon = styled.div`
    width: 132px;
    height: 132px;
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 23px;
`;

export function ModalBuyItem() {
    const { close } = useModalDispatch();
    const { data: item } = useModalState<Item>(MODAL_ID.BUY_ITEM_MODAL);
    const { mutate } = useBuyQuery();
    const { palette, clesson } = useTheme();

    const handleConfirmClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        mutate(
            { itemId: item.sellId },
            {
                onSuccess() {
                    Modal.confirm({
                        title: 'Purchase success',
                        content: (
                            <Row alignSelf="stretch" justifyContent="space-between">
                                <TRLabel>Token consumption</TRLabel>
                                <Row style={{ gap: '8px' }}>
                                    <TRLabel weight="bold">{item.price}</TRLabel>
                                    <TRLabel>BNB</TRLabel>
                                </Row>
                            </Row>
                        ),
                        okText: 'Confirm',
                    });
                },
                onError() {
                    Modal.confirm({
                        title: 'Insufficient BNB in spending account',
                        content: (
                            <Column justifyContent="space-between">
                                <TRLabel style={{ lineHeight: '140%' }} color={palette.text.secondary}>
                                    Don&apos;t worry! Just transfer enough BNB from your wallet to the Spending Account
                                    and you are good to go!
                                </TRLabel>
                                <Row></Row>
                            </Column>
                        ),
                        okText: 'Transfer',
                    });
                },
                onSettled() {
                    close(MODAL_ID.BUY_ITEM_MODAL);
                },
            }
        );
    };

    if (!item) {
        return <></>;
    }

    return (
        <Modal
            asCloseIcon={<Close />}
            asTitle="Buy"
            modalID={MODAL_ID.BUY_ITEM_MODAL}
            asFooter={
                <Column sx={{ flex: 1 }}>
                    <Row alignSelf="stretch" justifyContent="space-between">
                        <TRLabel sizing="md">Cost</TRLabel>
                        <TRLabel color={palette.text.secondary} sizing="md">
                            <TRLabel style={{ marginRight: '4px' }} sizing="md" weight="bold">
                                {item.price}
                            </TRLabel>
                            BNB
                        </TRLabel>
                    </Row>
                    <TRButton onClick={handleConfirmClick} style={{ width: '100%', marginTop: 24 }}>
                        Confirm
                    </TRButton>
                </Column>
            }
        >
            <Column gap={2} style={{ marginTop: 24, marginBottom: 10 }}>
                {item instanceof Headphone ? (
                    <Column alignSelf="stretch">
                        <Image src={item.imgUrl} alt="" width={180} height={180} />
                        <LabelRound
                            color={clesson.quality[item.quality]}
                            variant="contained"
                            weight="bold"
                            sizing="xxs"
                            style={{
                                width: '72px',
                                height: '18px',
                                padding: '0px',
                                marginBottom: '12px',
                                marginTop: '24px',
                            }}
                            asLabel={item.quality}
                        />
                        <TRLabel style={{ fontWeight: 600 }} color={palette.text.secondary} sizing="sm">
                            {item.id}
                        </TRLabel>
                        <Column alignSelf="stretch" style={{ marginTop: 24 }}>
                            <Row alignSelf="stretch" justifyContent="space-between">
                                <TRLabel sizing="sm">Lv. {item.level}</TRLabel>
                                <TRLabel sizing="sm">
                                    Mint {item.mintCount || 0}/{MAX_MINT}
                                </TRLabel>
                            </Row>
                        </Column>
                    </Column>
                ) : item instanceof HeadphoneBox ? (
                    <Column alignSelf="stretch">
                        <CircleIcon>
                            <Image src={item.imgUrl} width={132} height={132} alt="" />
                        </CircleIcon>
                        <QualityLabel style={{ marginBottom: '12px' }} quality={item.quality} />
                        <TRLabel style={{ marginBottom: '28px' }} sizing="sm" color={palette.text.secondary}>
                            {item.id}
                        </TRLabel>
                    </Column>
                ) : item instanceof Sticker ? (
                    <Column gap={2} alignSelf="stretch">
                        <StickerIcon level={item.level} attribute={item.attribute} />
                        <LabelRound
                            weight="bold"
                            sizing="xxs"
                            variant="contained"
                            asLabel={item.attribute}
                            color={clesson.attribute[item.attribute]}
                            style={{ height: '18px', marginTop: '12px' }}
                        />
                        <TRLabel sizing="sm" color={palette.text.secondary}>
                            {item.id}
                        </TRLabel>

                        <Row alignSelf="stretch" justifyContent="space-between">
                            <TRLabel>Attribute</TRLabel>
                            <TRLabel weight="bold">
                                +{item.plusStat}
                                <TRLabel style={{ marginLeft: '8px' }}>{item.attribute}ability</TRLabel>
                            </TRLabel>
                        </Row>
                        <Row alignSelf="stretch" justifyContent="space-between">
                            <TRLabel>Effect</TRLabel>
                            <TRLabel weight="bold">
                                +{item.effect}%<TRLabel style={{ marginLeft: '8px' }}>Base {item.attribute}</TRLabel>
                            </TRLabel>
                        </Row>
                    </Column>
                ) : item instanceof Merchandise ? (
                    <Column alignSelf="stretch">
                        <CircleIcon>
                            <Image src={item.imgUrl} width={132} height={132} alt="" />
                        </CircleIcon>
                        <TRLabel style={{ marginBottom: '28px' }} sizing="sm" color={palette.text.secondary}>
                            {'#' + item.id}
                        </TRLabel>
                        <TRLabel style={{ marginBottom: '28px' }} sizing="sm" color={palette.text.secondary}>
                            {item.description}
                        </TRLabel>
                    </Column>
                ) : item instanceof Ticket ? (
                    <Column alignSelf="stretch">
                        <CircleIcon>
                            <Image src={item.imgUrl} width={132} height={132} alt="" />
                        </CircleIcon>
                        <TRLabel style={{ marginBottom: '28px' }} sizing="sm" color={palette.text.secondary}>
                            {'#' + item.id}
                        </TRLabel>
                        <TRLabel style={{ marginBottom: '28px' }} sizing="sm" color={palette.text.secondary}>
                            {item.description}
                        </TRLabel>
                    </Column>
                ) : null}
                <TRDivider.Column />
            </Column>
        </Modal>
    );
}
