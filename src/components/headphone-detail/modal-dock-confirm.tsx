import { TRButton } from '@components/common/buttons/button';
import { Column, Row } from '@components/common/flex';
import { Modal } from '@components/common/modals/modal';
import { HTTP_STATUS, MODAL_ID } from '@constants/common';
import { useRouter } from 'next/router';
import Close from '@mui/icons-material/Close';
import Image from 'next/image';
import { useOpenHeadphoneDock } from 'src/react-query/inventory';
import { useCostToOpenHeadphoneDock } from 'src/react-query/inventory';
import { useModalState } from 'src/recoil/modal';
import { useModalDispatch } from 'src/recoil/modal';
import { TRLabel } from '@components/common/labels/label';
import { Dock } from '@models/dock/dock';
import { useMessageDispatch } from 'src/recoil/message';
import { ServerError } from '@utils/core/exceptions';

export function ModalDockOpen() {
    const { data: dock } = useModalState(MODAL_ID.DOCK_OPEN_MODAL) as { data: Dock };
    const { query } = useRouter();
    const openHeadphoneDock = useOpenHeadphoneDock();
    const { message } = useMessageDispatch();
    const { openDockCost } = useCostToOpenHeadphoneDock(String(query?.id), dock?.position);
    const dockCost = openDockCost.costs ? openDockCost.costs[0] : null;
    const modalDispatch = useModalDispatch();

    const openDockSuccess = () => {
        Modal.confirm({
            title: '개방 성공!',
            content: (
                <Row justifyContent="space-between" alignSelf="stretch">
                    <TRLabel>Token consumption</TRLabel>
                    <TRLabel weight="bold">
                        10 <TRLabel>BLB</TRLabel>
                    </TRLabel>
                </Row>
            ),
            okText: 'Confirm',
        });
    };

    const handleOpenConfirmClick = () => {
        openHeadphoneDock.mutate(
            {
                headphoneId: query?.id as string,
                dockPosition: dock.position,
            },
            {
                onSuccess: () => {
                    openDockSuccess();
                    modalDispatch.close(MODAL_ID.DOCK_OPEN_MODAL);
                },
                onError: (error: ServerError) => {
                    if (error.code === HTTP_STATUS.NOT_FOUND) {
                        // eslint-disable-next-line quotes
                        message.none("You don't have enought token to open dock, Please earn more tokens");
                        return;
                    }
                    message.none('error has been occurred');
                },
            }
        );
    };

    if (!dock?.position) {
        return <></>;
    }

    return (
        <Modal
            asCloseIcon={<Close />}
            asFooter={
                <Row style={{ width: '100%' }}>
                    <TRButton onClick={handleOpenConfirmClick} style={{ width: '100%' }}>
                        {`${dockCost?.requiredCost} ${dockCost?.tokenSymbol} OPEN`}
                    </TRButton>
                </Row>
            }
            asTitle={`${dock.attribute} dock`}
            modalID={MODAL_ID.DOCK_OPEN_MODAL}
        >
            <Column style={{ width: '100%', gap: '18px', margin: '24px 0px' }}>
                <Image src={`/images/headphones/docks/${dock.attribute}.png`} alt="" width={126} height={126} />
            </Column>
        </Modal>
    );
}
