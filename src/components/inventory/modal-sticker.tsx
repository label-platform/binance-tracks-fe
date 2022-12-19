import { TRButton } from '@components/common/buttons/button';
import { Column, Row } from '@components/common/flex';
import { TRLabel } from '@components/common/labels/label';
import { LabelRound } from '@components/common/labels/label-round';
import { Modal } from '@components/common/modals/modal';
import { MODAL_ID } from '@constants/common';
import { useTheme } from '@emotion/react';
import { StickerIcon } from '@icons/stickers';
import { Sticker } from '@models/sticker/sticker';
import { Close } from '@mui/icons-material';

import { useModalDispatch, useModalState } from 'src/recoil/modal';

export function ModalSticker() {
    const { close, setData, open } = useModalDispatch();
    const { data } = useModalState<Sticker>(MODAL_ID.STICKER_MODAL);
    const { palette, clesson } = useTheme();
    const handleCloseClick = () => {
        close(MODAL_ID.STICKER_MODAL);
    };

    const handleGotoSellClick = () => {
        close(MODAL_ID.STICKER_MODAL);
        setData(MODAL_ID.SELL_ITEM_MODAL, data);
        open(MODAL_ID.SELL_ITEM_MODAL);
    };

    if (!data?.id) {
        return <></>;
    }

    return (
        <Modal
            onClose={handleCloseClick}
            modalID={MODAL_ID.STICKER_MODAL}
            asCloseIcon={<Close />}
            asFooter={
                <TRButton
                    data-test-id="sell-btn"
                    onClick={handleGotoSellClick}
                    style={{ width: '100%', marginTop: '28px' }}
                >
                    SELL
                </TRButton>
            }
        >
            <Column style={{ width: '100%' }} gap={2}>
                <StickerIcon level={data.level} attribute={data.attribute} />
                <LabelRound
                    weight="bold"
                    sizing="xxs"
                    variant="contained"
                    asLabel={data.attribute}
                    color={clesson.attribute[data.attribute]}
                    style={{ height: '18px', marginTop: '12px' }}
                />
                <TRLabel sizing="sm" color={palette.text.secondary}>
                    {data.id}
                </TRLabel>

                <Row alignSelf="stretch" justifyContent="space-between">
                    <TRLabel>Attribute</TRLabel>
                    <TRLabel weight="bold">
                        +{data.plusStat}
                        <TRLabel style={{ marginLeft: '8px' }}>{data.attribute}ability</TRLabel>
                    </TRLabel>
                </Row>
                <Row alignSelf="stretch" justifyContent="space-between">
                    <TRLabel>Effect</TRLabel>
                    <TRLabel weight="bold">
                        +{data.effect}%<TRLabel style={{ marginLeft: '8px' }}>Base {data.attribute}</TRLabel>
                    </TRLabel>
                </Row>
            </Column>
        </Modal>
    );
}
