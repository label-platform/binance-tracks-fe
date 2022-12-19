import { TRButton } from '@components/common/buttons/button';
import { Column, Row, TRDivider } from '@components/common/flex';
import { TRLabel } from '@components/common/labels/label';
import { Modal } from '@components/common/modals/modal';
import { MODAL_ID } from '@constants/common';
import { NATIVE_EVENT } from '@constants/native-event';
import { useTracksRouter } from '@hooks/use-tracks-router';
import { Headphone } from '@models/headphone/headphone';
import { Item } from '@models/item/item';
import { Close } from '@mui/icons-material';
import { ContractGuard } from '@services/wallet/wallet';
import { doEither, sendToNative } from '@utils/native';
import { useTransferNftToWallet } from 'src/react-query/wallet';
import { useMessageDispatch } from 'src/recoil/message';
import { useModalDispatch, useModalState } from 'src/recoil/modal';

export function ModalTransfer() {
    const { close } = useModalDispatch();
    const { data } = useModalState<Item>(MODAL_ID.TRANSFER_MDOAL);
    const { message } = useMessageDispatch();
    const router = useTracksRouter();
    const transferDispatch = useTransferNftToWallet();
    const handleModalCloseClick = () => {
        close(MODAL_ID.TRANSFER_MDOAL);
    };

    const handleGotoConfirmClick = () => {
        transferDispatch.mutate(
            {
                itemType: data.type as ContractGuard,
                itemId: data.id,
            },
            {
                onSuccess() {
                    message.none('Successfully set');
                    handleModalCloseClick();
                    if (data instanceof Headphone) {
                        doEither(
                            () => {
                                router.back();
                            },
                            () => {
                                sendToNative({ name: NATIVE_EVENT.BACK });
                            }
                        );
                    }
                },
                onError() {
                    message.error('Error has been occurred');
                },
            }
        );
    };

    return (
        <Modal
            asTitle="Confirm Transfer"
            asCloseIcon={<Close />}
            modalID={MODAL_ID.TRANSFER_MDOAL}
            asFooter={
                <Row style={{ marginTop: 24, width: '100%' }}>
                    <TRButton style={{ width: '100%' }} onClick={handleGotoConfirmClick}>
                        Confirm
                    </TRButton>
                </Row>
            }
        >
            <Column gap={1} style={{ marginTop: 24, width: '100%' }}>
                <Row justifyContent="space-between" alignSelf="stretch">
                    <TRLabel>
                        From
                        <TRLabel style={{ marginLeft: 8 }} weight="bold">
                            Spending
                        </TRLabel>
                    </TRLabel>
                    <TRLabel>
                        To
                        <TRLabel style={{ marginLeft: 8 }} weight="bold">
                            Wallet
                        </TRLabel>
                    </TRLabel>
                </Row>
                <TRDivider.Column />
                <Row justifyContent="space-between" alignSelf="stretch">
                    <TRLabel>Fee</TRLabel>
                    <TRLabel weight="bold">
                        1<TRLabel style={{ marginLeft: 8 }}>BLB</TRLabel>
                    </TRLabel>
                </Row>
                <Row justifyContent="space-between" alignSelf="stretch">
                    <TRLabel>You will transfer</TRLabel>
                    <TRLabel weight="bold">
                        1<TRLabel style={{ marginLeft: 8 }}>NFT</TRLabel>
                    </TRLabel>
                </Row>
            </Column>
        </Modal>
    );
}
