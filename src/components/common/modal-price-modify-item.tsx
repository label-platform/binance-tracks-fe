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
import { useUpdateSellQuery } from 'src/react-query/marketplace';
import { useMessageDispatch } from 'src/recoil/message';
import { useEffect } from 'react';

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

export function ModalPriceModifyItem() {
    const { data: item } = useModalState<Item>(MODAL_ID.PRICE_MODIFY_ITEM_MODAL);
    const { closeAll, close } = useModalDispatch();
    const { palette, clesson } = useTheme();
    const { mutate } = useUpdateSellQuery();
    const { message } = useMessageDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        watch,
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    useEffect(() => {
        if (item.id) {
            setValue('price', item.price);
        }
    }, [item.id]);

    const handleModifyPriceClick = (data) => {
        mutate(
            { sellId: item.sellId, price: data.price },
            {
                onSettled() {
                    closeAll();
                },
                onSuccess() {
                    message.none('Listing Successfully!');
                },
                onError() {
                    message.none('fail!');
                },
            }
        );
    };
    const handleCloseClick = () => {
        close(MODAL_ID.PRICE_MODIFY_ITEM_MODAL);
    };
    return (
        <Modal
            asCloseIcon={<Close />}
            onClose={handleCloseClick}
            asFooter={
                <Row style={{ width: '100%', marginTop: '24px' }}>
                    <TRButton
                        disabled={!isValid || +watch('price') === item.price}
                        onClick={handleSubmit(handleModifyPriceClick)}
                        style={{ width: '100%' }}
                    >
                        Confirm
                    </TRButton>
                </Row>
            }
            asTitle="Sell"
            modalID={MODAL_ID.PRICE_MODIFY_ITEM_MODAL}
        >
            <Column gap={2} style={{ width: '100%', marginTop: 24 }}>
                {item instanceof Sticker ? (
                    <>
                        <StickerIcon level={item.level} attribute={item.attribute} />
                        <LabelRound
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
                        <TRLabel style={{ marginBottom: '28px' }} sizing="sm" color={palette.text.secondary}>
                            {item.id}
                        </TRLabel>
                    </>
                ) : item instanceof Headphone ? (
                    <HeadphoneInfoBox
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
                    helperText="Modified Price"
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
