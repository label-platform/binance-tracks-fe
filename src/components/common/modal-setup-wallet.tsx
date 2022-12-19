import { MODAL_ID } from '@constants/common';
import { Modal } from '@components/common/modals/modal';
import { TRButton } from '@components/common/buttons/button';
import { Close } from '@mui/icons-material';
import { useModalDispatch } from 'src/recoil/modal';
import { Column } from '@components/common/flex';
import { useTracksRouter } from '@hooks/use-tracks-router';
import { RestoreConfirm } from '@components/setting/restore-wallet-confirm';
import { DRAWER_ID } from '@constants/common';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { WalletNewCreate } from '@components/my-wallet/wallet-new-create';
export const ModalSetUpWallet = () => {
    const { open } = useDrawerDispatch();
    const modalDispatch = useModalDispatch();
    const router = useTracksRouter();
    const handleCloseClick = () => {
        modalDispatch.close(MODAL_ID.SET_UP_WALLET_MODAL);
    };

    const handleCreateWalletClick = () => {
        modalDispatch.close(MODAL_ID.SET_UP_WALLET_MODAL);
        open(DRAWER_ID.WALLET_NEW_CREATE);

        // router.push('/authentication/create-wallet');
    };
    const handleImportWalletClick = () => {
        modalDispatch.close(MODAL_ID.SET_UP_WALLET_MODAL);
        open(DRAWER_ID.RESTORE_WALLET_CONFIRM);
    };

    return (
        <>
            <Modal
                asCloseIcon={<Close />}
                onClose={handleCloseClick}
                asTitle="Set up wallet"
                modalID={MODAL_ID.SET_UP_WALLET_MODAL}
            >
                <Column gap="16px" style={{ width: '100%', marginTop: '24px' }}>
                    <TRButton onClick={handleCreateWalletClick} sizing="md" style={{ width: '100%' }}>
                        Create a new wallet
                    </TRButton>
                    <TRButton variant="text" style={{ width: '100%' }} onClick={handleImportWalletClick}>
                        Import using seed phrase
                    </TRButton>
                </Column>
            </Modal>
            <RestoreConfirm title="import Wallet" />
            <WalletNewCreate title="Create Wallet" />
        </>
    );
};
