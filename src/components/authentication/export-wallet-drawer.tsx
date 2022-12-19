import { TRButton } from '@components/common/buttons/button';
import { Drawer } from '@components/common/drawer';
import { Column, Row } from '@components/common/flex';
import { TRLabel } from '@components/common/labels/label';
import { LabelActive } from '@components/common/labels/label-active';
import { Modal } from '@components/common/modals/modal';
import { DRAWER_ID } from '@constants/common';
import { NATIVE_EVENT } from '@constants/native-event';
import { Container } from '@mui/material';
import { getPluginByType } from '@services/wallet/plugins';
import { sendToNative } from '@utils/native';
import { shuffle } from '@utils/utilities';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';
import { useUserRegistWalletAddress } from 'src/react-query/user';

interface Props {
    mnemonics: string[];
}

export function ExportWalletDrawer(props: Props) {
    const { mnemonics } = props;
    const { t } = useTranslation('auth', { keyPrefix: 'wallet' });
    const [selected, setSelected] = useState<string[]>([]);
    const shuffledMnemonics = useMemo(() => shuffle([...mnemonics]), []);
    const { mutate } = useUserRegistWalletAddress();
    const handleSelectClick = (keyword) => () => {
        setSelected((prev) => [...prev, keyword]);
    };
    const handleDeSelectClick = (keyword) => () => {
        setSelected((prev) => prev.filter((value) => value !== keyword));
    };

    const handleConfirmClick = async () => {
        const isMatched = mnemonics.every((keyword, index) => selected[index] === keyword);

        if (!isMatched) {
            Modal.confirm({
                title: t('exportWallteWarn.title'),
                content: t('exportWallteWarn.content'),
                okText: 'Try Again',
                handleOkClick: () => {
                    setSelected([]);
                },
            });
            return;
        }
        try {
            const result = await getPluginByType('ethereum').createWalletByMnemonic(mnemonics.join(' '));
            mutate(result.address, {
                onSuccess() {
                    sendToNative({
                        name: NATIVE_EVENT.SAVE_PRIVATE_KEY,
                        params: { pk: result.keyPair.privateKey, address: result.address },
                    });
                },
                onError() {
                    Modal.confirm({
                        title: t('exportWallteWarn.title'),
                        content: t('exportWallteWarn.content'),
                        okText: 'Try Again',
                        handleOkClick: () => {
                            setSelected([]);
                        },
                    });
                },
            });
        } catch (error) {
            Modal.confirm({
                title: t('exportWallteWarn.title'),
                content: t('exportWallteWarn.content'),
                okText: 'Try Again',
                handleOkClick: () => {
                    setSelected([]);
                },
            });
        }
    };

    return (
        <Drawer
            paperSx={{ '& > div': { height: '100%' } }}
            from="right"
            widthPercent={100}
            drawerID={DRAWER_ID.EXPORT_WALLET}
        >
            <Container style={{ height: '100%', display: 'flex', flexDirection: 'column' }} maxWidth="xs">
                <Column style={{ marginBottom: 'auto' }}>
                    <TRLabel
                        style={{
                            fontSize: '14px',
                            marginTop: '50px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            textAlign: 'center',
                        }}
                    >
                        {t('exportWallet')}
                    </TRLabel>
                    <Row
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        flexWrap="wrap"
                        alignContent="flex-start"
                        style={{
                            height: '189px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.87)',
                            width: '100%',
                            marginTop: '48px',
                            marginBottom: '16px',
                            padding: '32px 46px',
                            gap: '10px',
                        }}
                    >
                        {selected.map((keyword) => (
                            <TRLabel data-test-id="selected-mnemonic" key={keyword}>
                                {keyword}
                            </TRLabel>
                        ))}
                    </Row>
                    <Row style={{ gap: '8px' }} alignItems="flex-start" flexWrap="wrap">
                        {shuffledMnemonics.map((keyword) => (
                            <LabelActive
                                key={keyword}
                                isActive={selected.includes(keyword)}
                                asActive={
                                    <TRLabel
                                        data-test-id="active-label"
                                        style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                            borderRadius: '4px',
                                            padding: '4px 8px',
                                        }}
                                        onClick={handleDeSelectClick(keyword)}
                                    />
                                }
                                asInActive={
                                    <TRLabel
                                        color="dark"
                                        data-test-id="inactive-label"
                                        style={{ backgroundColor: 'white', borderRadius: '4px', padding: '4px 8px' }}
                                        onClick={handleSelectClick(keyword)}
                                    />
                                }
                            >
                                {keyword}
                            </LabelActive>
                        ))}
                    </Row>
                </Column>
                <Column>
                    <TRButton
                        data-test-id="mnemonics-confirm"
                        onClick={handleConfirmClick}
                        disabled={selected.length !== 12}
                        sx={{ marginBottom: '20px' }}
                        sizing="xl"
                        type="submit"
                    >
                        Confirm
                    </TRButton>
                </Column>
            </Container>
        </Drawer>
    );
}
