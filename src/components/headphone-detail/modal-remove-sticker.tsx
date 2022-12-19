import React, { useState } from 'react';
import { Column, Row, TRDivider } from '@components/common/flex';
import { Modal } from '@components/common/modals/modal';
import { MODAL_ID } from '@constants/common';
import { capitalize } from '@mui/material';
import { useModalDispatch, useModalState } from 'src/recoil/modal';
import { useRouter } from 'next/router';
import Close from '@mui/icons-material/Close';
import { TRButton } from '@components/common/buttons/button';
import { StickerIcon } from '@icons/stickers';
import { TRLabel } from '@components/common/labels/label';
import { useTheme } from '@emotion/react';
import { ATTRIBUTE } from '@models/common.interface';
import {
    AttributeComfortIcon,
    AttributeEfficiencyIcon,
    AttributeResilienceIcon,
    AttributeLuckIcon,
} from '@icons/index';

import { Dock } from '@models/dock/dock';
import styled from '@emotion/styled';
import { useRemoveSticker } from 'src/react-query/inventory';
import { toInteger2Digits } from '@utils/string';
import { decimalCeil } from '@utils/utilities';

const StickerIconWrapper = styled.div`
    width: 44px;
    height: 44px;
    padding: 2px;
    box-sizing: border-box;
    & > svg {
        width: 100%;
        height: 100%;
    }
`;

const QualityBar = styled.div<{ color: string }>`
    height: 12px;
    width: 4px;
    background-color: ${(props) => props.color};
`;

export function ModalRemoveSticker() {
    const { close } = useModalDispatch();
    const { data: dock } = useModalState<Dock>(MODAL_ID.REMOVE_STICKER_MODAL);
    const removeSticker = useRemoveSticker();
    const { query } = useRouter();
    const { palette, clesson } = useTheme();

    const handleRemoveClick = () => {
        Modal.confirm({
            title: 'Confirm',
            content: (
                <Row justifyContent="space-between" alignSelf="stretch">
                    <TRLabel>Token consumption</TRLabel>
                    <TRLabel weight="bold">
                        0<TRLabel style={{ marginLeft: '8px' }}>BLB</TRLabel>
                    </TRLabel>
                </Row>
            ),
            okText: 'Remove Sticker',
            handleOkClick() {
                removeSticker.mutate({
                    headphoneId: String(query.id),
                    dockPosition: dock.position,
                    stickerId: dock.sticker.id,
                });
            },
        });
        close(MODAL_ID.REMOVE_STICKER_MODAL);
    };

    return (
        <Modal
            asCloseIcon={<Close />}
            modalID={MODAL_ID.REMOVE_STICKER_MODAL}
            asFooter={
                <TRButton
                    style={{ width: '100%', marginTop: 24 }}
                    onClick={handleRemoveClick}
                    sx={{ backgroundColor: 'white' }}
                >
                    Remove Sticker
                </TRButton>
            }
        >
            {dock.position ? (
                <Column alignItems="flex-start" style={{ width: '100%', padding: 4 }}>
                    <Row gap={1} justifyContent="flex-start" style={{ height: 48 }}>
                        <StickerIconWrapper>
                            <StickerIcon level={dock.sticker.level} attribute={dock.attribute} />
                        </StickerIconWrapper>
                        <Column alignSelf="stretch" style={{ gap: '4px' }} alignItems="flex-start">
                            <TRLabel color={clesson.attribute[dock.attribute]} sizing="sm" weight="bold">
                                {capitalize(dock.attribute)} Stickers (Lv.{toInteger2Digits(dock.sticker.level)})
                            </TRLabel>
                            <TRLabel sizing="sm" weight="bold">
                                #24572
                            </TRLabel>
                        </Column>
                    </Row>
                    <Column
                        gap={3}
                        style={{
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: 6,
                            padding: 20,
                            width: '100%',
                            marginTop: 24,
                        }}
                    >
                        <TRLabel
                            style={{ alignSelf: 'stretch' }}
                            weight="bold"
                            color={clesson.attribute[dock.attribute]}
                            sizing="xs"
                        >
                            LEVEL.{toInteger2Digits(dock.sticker.level)}
                            <TRLabel weight="bold" style={{ marginLeft: 'auto' }}>
                                + {toInteger2Digits(dock.sticker.plusStat)}
                            </TRLabel>
                        </TRLabel>
                        <TRLabel
                            style={{ alignSelf: 'stretch' }}
                            weight="bold"
                            color={clesson.attribute[dock.attribute]}
                            sizing="xs"
                        >
                            <Row style={{ gap: 3 }} justifyContent="space-between">
                                {Array(dock.quliatyToNumber)
                                    .fill('')
                                    .map((_, index) => (
                                        <QualityBar color={clesson.attribute[dock.attribute]} key={index} />
                                    ))}
                            </Row>
                            <TRLabel weight="bold" style={{ marginLeft: 'auto' }}>
                                x {1 + dock.effect / 100}
                            </TRLabel>
                        </TRLabel>
                        <TRDivider.Column />
                        <TRLabel style={{ alignSelf: 'stretch' }} weight="bold" sizing="xs">
                            {
                                {
                                    [ATTRIBUTE.COMFORT]: <AttributeComfortIcon />,
                                    [ATTRIBUTE.RESILIENCE]: <AttributeResilienceIcon />,
                                    [ATTRIBUTE.LUCK]: <AttributeLuckIcon />,
                                    [ATTRIBUTE.EFFICIENCY]: <AttributeEfficiencyIcon />,
                                }[dock.attribute]
                            }
                            {capitalize(dock.attribute)}
                            <TRLabel
                                color={clesson.attribute[dock.attribute]}
                                weight="bold"
                                style={{ marginLeft: 'auto' }}
                            >
                                + {toInteger2Digits(decimalCeil(dock.sticker.plusStat * (1 + dock.effect / 100), 1))}
                            </TRLabel>
                        </TRLabel>
                    </Column>
                </Column>
            ) : (
                <></>
            )}
        </Modal>
    );
}
