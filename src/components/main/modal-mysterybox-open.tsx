import { TRButton } from '@components/common/buttons/button';
import { Column, Row } from '@components/common/flex';
import { IconCircle } from '@components/common/icon-circle';
import { TRLabel } from '@components/common/labels/label';
import { Modal } from '@components/common/modals/modal';
import { MODAL_ID, SCREEN_ID } from '@constants/common';
import { ITEM_STATUS } from '@models/common.interface';
import { HeadphoneBox, createHeadphoneBox } from '@models/headphone-box/headphone-box';
import { Item } from '@models/item/item';
import { MysteryBox } from '@models/mystery-box/mystery-box';
import { createSticker, Sticker } from '@models/sticker/sticker';
import { Close } from '@mui/icons-material';
import { convertToCapitalization } from '@utils/utilities';
import Image from 'next/image';

import { useMysteryBoxCostQuery, useMysteryBoxOpen } from 'src/react-query/inventory';
import { useMessageDispatch } from 'src/recoil/message';
import { useModalDispatch, useModalState } from 'src/recoil/modal';
import { useScreenDispatch } from 'src/recoil/screen';

export function ModalMysteryboxOpen() {
    const { data: mysteryBox } = useModalState<MysteryBox>(MODAL_ID.MYSTERYBOX_OPEN_MODAL);
    const { mutate } = useMysteryBoxOpen();
    const modalDispatch = useModalDispatch();
    const screenDispath = useScreenDispatch();
    const { message } = useMessageDispatch();
    const { data: cost, isSuccess } = useMysteryBoxCostQuery(mysteryBox.id, !mysteryBox.isCanBeOpened);

    const handleCloseClick = () => {
        modalDispatch.close(MODAL_ID.MYSTERYBOX_OPEN_MODAL);
    };

    const handleConfirmClick = () => {
        mutate(
            {
                itemId: mysteryBox.id,
                isBoost: !mysteryBox.isCanBeOpened,
            },
            {
                onSuccess({ content }) {
                    const { createdItemFromOpenedMysteryBox } = content;
                    modalDispatch.close(MODAL_ID.MYSTERYBOX_OPEN_MODAL);
                    switch (createdItemFromOpenedMysteryBox?.item?.type) {
                        case 'HEADPHONEBOX':
                            screenDispath.open(
                                SCREEN_ID.MYSTERY_BOX,
                                createHeadphoneBox(createdItemFromOpenedMysteryBox)
                            );
                            return;
                        case 'STICKER':
                            screenDispath.open(SCREEN_ID.MYSTERY_BOX, createSticker(createdItemFromOpenedMysteryBox));
                            return;
                        default:
                            screenDispath.open(SCREEN_ID.MYSTERY_BOX, createdItemFromOpenedMysteryBox?.newBlbAmount);
                            return;
                    }
                },
                onError() {
                    modalDispatch.close(MODAL_ID.MYSTERYBOX_OPEN_MODAL);
                    message.none('fail to open mysterybox');
                },
            }
        );
    };

    return (
        <Modal
            onClose={handleCloseClick}
            asFooter={
                <Row sx={{ width: '100%', mt: 3 }} gap={2}>
                    <TRButton sx={{ width: '100% !important' }} onClick={handleConfirmClick}>
                        <TRLabel weight="bold">
                            {isSuccess ? `${cost.requiredCost} ${cost.tokenSymbol} Open Now` : null}
                        </TRLabel>
                    </TRButton>
                </Row>
            }
            asCloseIcon={<Close />}
            modalID={MODAL_ID.MYSTERYBOX_OPEN_MODAL}
        >
            {!isSuccess ? (
                <></>
            ) : (
                <Column gap={2}>
                    <Row sx={{ '& > span > span': { position: 'absolute !important' } }}>
                        <IconCircle
                            size={132}
                            asIcon={
                                <>
                                    <Image
                                        src="/images/mystery-box/content.png"
                                        width={132}
                                        height={132}
                                        alt=""
                                        layout="fixed"
                                        style={{ zIndex: 2 }}
                                    />
                                    <Image
                                        src="/images/mystery-box/background.png"
                                        width={132}
                                        height={132}
                                        alt=""
                                        layout="fixed"
                                    />
                                </>
                            }
                        />
                    </Row>
                    <TRLabel style={{ textTransform: 'capitalize' }} weight="bold" sizing="sm">
                        {convertToCapitalization(mysteryBox.quality)} Mystery Box
                    </TRLabel>
                    {mysteryBox.isCanBeOpened ? null : (
                        <Row alignSelf="stretch" justifyContent="space-between">
                            <TRLabel>Unlocking takes</TRLabel>
                            <TRLabel weight="bold">{mysteryBox.remainLeftTimeToOpen}</TRLabel>
                        </Row>
                    )}
                </Column>
            )}
        </Modal>
    );
}
