import { MODAL_ID } from '@constants/common';
import { Close } from '@mui/icons-material';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useGetOTPQuery } from 'src/react-query/auth';
import { useModalDispatch, useModalState } from 'src/recoil/modal';
import { TRButton } from './buttons/button';
import { Column, Row } from './flex';
import { TRLabel } from './labels/label';
import { Modal } from './modals/modal';

const ModalContent = () => {
    const { data, isLoading } = useGetOTPQuery();
    if (isLoading) return null;
    return (
        <Column>
            <Image alt="" src={data.url} width={220} height={220} />
            <TRLabel>{data.secret || ''}</TRLabel>
        </Column>
    );
};

export function ModalRegisterQR() {
    const { visible } = useModalState(MODAL_ID.REGISTER_QR_MODAL);
    const { close } = useModalDispatch();
    const [isCreated, setIsCreated] = useState(false);

    useEffect(() => {
        if (!visible) {
            setIsCreated(false);
        }
    }, [visible]);
    const handleCloseClick = () => {
        close(MODAL_ID.REGISTER_QR_MODAL);
    };
    const handleCreateClick = () => {
        setIsCreated(true);
    };

    return (
        <Modal
            asTitle="OTP Register"
            asFooter={
                <Row style={{ width: '100%' }}>
                    <TRButton onClick={handleCreateClick} style={{ width: '100%' }}>
                        Create QR
                    </TRButton>
                </Row>
            }
            asCloseIcon={<Close />}
            onClose={handleCloseClick}
            modalID={MODAL_ID.REGISTER_QR_MODAL}
        >
            {visible && isCreated ? <ModalContent /> : null}
        </Modal>
    );
}
