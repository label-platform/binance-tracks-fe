import { MODAL_ID } from '@constants/common';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { StickerIcon } from '@icons/stickers';
import { HeadphoneBox } from '@models/headphone-box/headphone-box';
import { Headphone } from '@models/headphone/headphone';
import { Item } from '@models/item/item';
import { Sticker } from '@models/sticker/sticker';
import { Close } from '@mui/icons-material';
import Image from 'next/image';
import { useModalDispatch, useModalState } from 'src/recoil/modal';
import { TRButton } from './buttons/button';
import { Column, Row } from './flex';
import { InputWithAdorments } from './inputs/input-with-adorments';
import { TRLabel } from './labels/label';
import { LabelRound } from './labels/label-round';
import { QualityLabel } from './labels/quality-label';
import { Modal } from './modals/modal';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { HeadphoneInfoBox } from './headphone-info-box';
import { useSellQuery } from 'src/react-query/marketplace';
import { useMessageDispatch } from 'src/recoil/message';

const CircleIcon = styled.div`
    width: 132px;
    height: 132px;
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 23px;
`;

const schema = Yup.object().shape({
    price: Yup.number().required().min(0),
});

export function ModalSellItem() {
    const { data: item } = useModalState<Item>(MODAL_ID.SELL_ITEM_MODAL);
    const { closeAll } = useModalDispatch();
    const { palette, clesson } = useTheme();
    const { mutate } = useSellQuery();
    const { message } = useMessageDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        resetField,
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    const handleSellItemClick = (data) => {
        Modal.confirm({
            title: 'Confirm to Sell',
            content: (
                <Column gap={1}>
                    <Row alignSelf="stretch" justifyContent="space-between">
                        <TRLabel>List Price</TRLabel>
                        <TRLabel weight="bold">
                            {data.price} <TRLabel style={{ marginLeft: '8px' }}>BNB</TRLabel>
                        </TRLabel>
                    </Row>
                    <Row alignSelf="stretch" justifyContent="space-between">
                        <TRLabel>Artist Royalties</TRLabel>
                        <TRLabel weight="bold">
                            4<TRLabel style={{ marginLeft: '8px' }}>%</TRLabel>
                        </TRLabel>
                    </Row>
                    <Row alignSelf="stretch" justifyContent="space-between">
                        <TRLabel>Transaction Fee</TRLabel>
                        <TRLabel weight="bold">
                            2<TRLabel style={{ marginLeft: '8px' }}>%</TRLabel>
                        </TRLabel>
                    </Row>
                    <Row alignSelf="stretch" justifyContent="space-between">
                        <TRLabel>Listing/Cancel</TRLabel>
                        <TRLabel weight="bold">Free</TRLabel>
                    </Row>
                </Column>
            ),
            okText: 'Confirm',
            handleOkClick() {
                mutate(
                    { itemId: item.id, price: data.price },
                    {
                        onSettled() {
                            closeAll();
                            resetField('price');
                        },
                        onSuccess() {
                            message.none('Listing Successfully!');
                        },
                        onError() {
                            message.none('fail!');
                        },
                    }
                );
            },
        });
    };

    return (
        <Modal
            asCloseIcon={<Close />}
            asFooter={
                <Row style={{ width: '100%', marginTop: '24px' }}>
                    <TRButton disabled={!isValid} onClick={handleSubmit(handleSellItemClick)} style={{ width: '100%' }}>
                        Confirm
                    </TRButton>
                </Row>
            }
            asTitle={<></>}
            modalID={MODAL_ID.SELL_ITEM_MODAL}
        >
            <Column gap={2} style={{ width: '100%' }}>
                {item instanceof Sticker ? (
                    <>
                        <StickerIcon level={item.level} attribute={item.attribute} />
                        <LabelRound
                            data-test-id="sticker-content"
                            weight="bold"
                            sizing="xxs"
                            variant="contained"
                            asLabel={item.attribute}
                            color={clesson.attribute[item.attribute]}
                            style={{ height: '18px', margin: '24px 0px 12px 0px' }}
                        />
                        <TRLabel style={{ marginBottom: '28px' }} sizing="sm" color={palette.text.secondary}>
                            {item.id}
                        </TRLabel>
                    </>
                ) : item instanceof HeadphoneBox ? (
                    <>
                        <CircleIcon>
                            <Image src={item.imgUrl} width={132} height={132} alt="" />
                        </CircleIcon>
                        <QualityLabel style={{ marginBottom: '12px' }} quality={item.quality} />
                        <TRLabel
                            data-test-id="headphone-box-content"
                            style={{ marginBottom: '28px' }}
                            sizing="sm"
                            color={palette.text.secondary}
                        >
                            {item.id}
                        </TRLabel>
                    </>
                ) : item instanceof Headphone ? (
                    <HeadphoneInfoBox
                        data-test-id="headphone-content"
                        headphone={item}
                        asHeadPhone={<Image src={item.imgUrl} width={132} height={132} alt="" />}
                    />
                ) : (
                    <></>
                )}

                <InputWithAdorments
                    type="number"
                    data-test-id="selling-price"
                    asEnd={
                        <TRLabel data-test-id="send-btn" weight="bold" color="dark" sizing="xs">
                            BNB
                        </TRLabel>
                    }
                    sx={{ width: '100%' }}
                    helperText="Selling price"
                    {...register('price', {
                        onChange(event) {
                            if (+event.target.value < 0) {
                                event.target.value = 0;
                            }
                        },
                    })}
                />
            </Column>
        </Modal>
    );
}
