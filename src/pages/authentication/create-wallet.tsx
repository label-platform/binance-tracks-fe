import { AuthGuard } from '@components/authentication/auth-guard';
import { ExportWalletDrawer } from '@components/authentication/export-wallet-drawer';
import { TRButton } from '@components/common/buttons/button';
import { Column } from '@components/common/flex';

import { TRLabel } from '@components/common/labels/label';
import { DRAWER_ID } from '@constants/common';
import { useTracksRouter } from '@hooks/use-tracks-router';

import { Container } from '@mui/material';
import { HistoryManagerSingleTon } from '@services/history';
import { generateMnemonic } from 'bip39';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useUserSelfInfoQuery } from 'src/react-query/user';
import { useDrawerDispatch } from 'src/recoil/drawer';

import { Page } from 'types/page';

const CreateWallet: Page = () => {
    const { t } = useTranslation('auth', { keyPrefix: 'wallet' });
    /* 중복된 키 나올 때 있음 */
    const mnemonics = useMemo(() => generateMnemonic().split(' '), []);
    const router = useTracksRouter();
    const { user } = useUserSelfInfoQuery();
    const drawerDispatch = useDrawerDispatch();
    const handleWrittenDownClick = () => {
        drawerDispatch.open(DRAWER_ID.EXPORT_WALLET);
    };

    useEffect(() => {
        if (!user.hasWalletAddress) return;
        router.push('/');
        HistoryManagerSingleTon.getInstance().clear();
    }, [user]);

    return (
        <>
            <Column style={{ height: '100%' }}>
                <Column
                    style={{
                        width: '312px',
                        marginBottom: 'auto',
                    }}
                >
                    <TRLabel
                        style={{
                            fontSize: '14px',
                            marginTop: '50px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            textAlign: 'center',
                        }}
                    >
                        {t('newWallet')}
                    </TRLabel>
                    <Column
                        style={{
                            height: '402px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.87)',
                            marginBottom: '34px',
                            width: '312px',
                            marginTop: '32px',
                            gap: '10px',
                        }}
                    >
                        {mnemonics.map((keyword, index) => (
                            <TRLabel weight="bold" style={{ fontSize: '16px' }} key={keyword}>
                                {index + 1}. {keyword}
                            </TRLabel>
                        ))}
                    </Column>
                </Column>
                <Column>
                    <TRButton
                        data-test-id="open-drawer-exportwallet"
                        onClick={handleWrittenDownClick}
                        sx={{ marginBottom: '20px' }}
                        sizing="xl"
                        type="submit"
                    >
                        I have written down
                    </TRButton>
                </Column>
            </Column>
            <ExportWalletDrawer mnemonics={mnemonics} />
        </>
    );
};

CreateWallet.getLayout = (page) => (
    <AuthGuard>
        <Container style={{ height: '100%' }} maxWidth="sm">
            {page}
        </Container>
    </AuthGuard>
);

export default CreateWallet;

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['auth'])),
    },
});
