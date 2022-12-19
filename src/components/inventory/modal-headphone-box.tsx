import { TRButton } from '@components/common/buttons/button';
import { DrawerCheckPasscode } from '@components/common/drawer-check-passcode';
import { Column, Row } from '@components/common/flex';
import { TRLabel } from '@components/common/labels/label';
import { QualityLabel } from '@components/common/labels/quality-label';
import { Modal } from '@components/common/modals/modal';
import { DRAWER_ID, MODAL_ID, SCREEN_ID } from '@constants/common';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { HeadphoneBox } from '@models/headphone-box/headphone-box';
import { Headphone } from '@models/headphone/headphone';
import { Close } from '@mui/icons-material';
import Image from 'next/image';

import { useHeadphoneBoxOpenQuery } from 'src/react-query/inventory';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { useMessageDispatch } from 'src/recoil/message';

import { useModalDispatch, useModalState } from 'src/recoil/modal';
import { useScreenDispatch } from 'src/recoil/screen';

const CircleIcon = styled.div`
    width: 132px;
    height: 132px;
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 23px;
`;

export function ModalHeadphoneBox() {
    const { data } = useModalState<HeadphoneBox>(MODAL_ID.HEADPHONE_BOX_MODAL);
    const { palette } = useTheme();
    const { close, open, setData } = useModalDispatch();
    const screenDispatch = useScreenDispatch();
    const { message } = useMessageDispatch();
    const { mutate } = useHeadphoneBoxOpenQuery();
    const drawerDispatch = useDrawerDispatch();
    const handleCloseClick = () => {
        close(MODAL_ID.HEADPHONE_BOX_MODAL);
    };

    const handleBoxOpenClick = () => {
        Modal.confirm({
            title: 'Confirm Open',
            content: 'Are you sure you want to open this headphone box?',
            okText: 'Confirm',
            handleOkClick() {
                close(MODAL_ID.HEADPHONE_BOX_MODAL);
                mutate(data.id, {
                    onSuccess(response) {
                        screenDispatch.open(SCREEN_ID.HEADPHONE_BOX, {
                            box: data,
                            headphone: new Headphone(response.content),
                        });
                    },
                    onError() {
                        message.none('fail to open headphone box');
                    },
                });
            },
        });
    };

    const handleBoxSellClick = () => {
        close(MODAL_ID.HEADPHONE_BOX_MODAL);
        setData(MODAL_ID.SELL_ITEM_MODAL, data);
        open(MODAL_ID.SELL_ITEM_MODAL);
    };

    const handleBoxTransferClick = () => {
        drawerDispatch.open(DRAWER_ID.CHECK_PASSCODE);
        close(MODAL_ID.HEADPHONE_BOX_MODAL);
    };

    const checkPasscodeSuccess = () => {
        drawerDispatch.close(DRAWER_ID.CHECK_PASSCODE);
        open(MODAL_ID.TRANSFER_MDOAL, data);
    };

    if (!data?.id) {
        return <></>;
    }

    return (
        <>
            <Modal
                asCloseIcon={<Close />}
                onClose={handleCloseClick}
                modalID={MODAL_ID.HEADPHONE_BOX_MODAL}
                asFooter={
                    <Column gap={2} style={{ width: '100%' }}>
                        <Row gap={2} style={{ width: '100%' }}>
                            <TRButton data-test-id="sell-btn" onClick={handleBoxSellClick} variant="text">
                                Sell
                            </TRButton>
                            <TRButton onClick={handleBoxTransferClick} variant="text">
                                Transfer
                            </TRButton>
                        </Row>
                        <Row justifyContent="space-between" style={{ width: '100%' }}>
                            <TRButton onClick={handleBoxOpenClick} variant="contained" sx={{ flex: 1 }}>
                                Open
                            </TRButton>
                        </Row>
                    </Column>
                }
            >
                <Column>
                    <CircleIcon>
                        <Image src={data.imgUrl} width={132} height={132} alt="" />
                    </CircleIcon>
                    <QualityLabel style={{ marginBottom: '12px' }} quality={data.quality} />
                    <TRLabel style={{ marginBottom: '28px' }} sizing="sm" color={palette.text.secondary}>
                        {data.id}
                    </TRLabel>
                </Column>
            </Modal>
            <DrawerCheckPasscode handleSuccess={checkPasscodeSuccess} />
        </>
    );
}
