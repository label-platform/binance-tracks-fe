import { RestoreModal } from './restore-modal';
import { useModalDispatch } from 'src/recoil/modal';
import { MODAL_ID, DRAWER_ID } from '@constants/common';
import { useDrawerDispatch } from 'src/recoil/drawer';
import styled from '@emotion/styled';
import React, { DOMAttributes, useState, useEffect } from 'react';
import { Column } from '@components/common/flex';
import { Row } from '@components/common/flex';
import { TRLabel } from '@components/common/labels/label';
import { useTheme } from '@emotion/react';
import { DrawerCheckPasscode } from '@components/common/drawer-check-passcode';
import { BackupGetAgree } from '@components/setting/backup-get-agree';
import { usePasscode } from '@components/common/passcode';
import { CreatePasscodeDrawer } from '@components/authentication/create-passcode/create-passcode-drawer';
import { RecheckPasscodeDrawer } from '@components/authentication/create-passcode/recheck-passcode-drawer';
import { useMessageDispatch } from 'src/recoil/message';

interface OptionProps extends DOMAttributes<HTMLOrSVGElement> {
    iconImage: string;
    optionName: string;
    description: string;
}
const Container = styled(Column)`
    width: 100%;
    height: 92px;
    border: 1px solid ${(props) => props.theme.palette.primary.main};
    border-radius: 6px;
    margin-bottom: 20px;
    position: relative;
    padding: 16px;
    align-items: flex-start;
    gap: 8px;
    & .description {
        font-family: 'Gilroy';
        font-size: 10px;
        color: ${(props) => props.theme.palette.text.secondary};
    }
`;

function OptionCard(props: OptionProps) {
    const { iconImage, optionName, description, ...rest } = props;
    const { palette } = useTheme();

    return (
        <Container onClick={rest.onClick}>
            <Row gap="3px">
                <img src={iconImage} alt="image" />
                {optionName}
            </Row>
            <TRLabel sizing="xxs" color={palette.text.secondary}>
                {description}
            </TRLabel>
        </Container>
    );
}

export function OptionCards() {
    // const backUp = useSlider();
    const [successFunc, setSuccessFunc] = useState('');
    const passcode = usePasscode();
    const recheckPasscode = usePasscode();
    const { message } = useMessageDispatch();

    useEffect(() => {
        if (passcode.passcode.length === 6) {
            drawerDispatch.close(DRAWER_ID.CREATE_PASSCODE);
            drawerDispatch.open(DRAWER_ID.CREATE_PASSCODE_RECHECK);
        }
    }, [passcode.passcode, recheckPasscode.passcode]);

    const settingData = [
        {
            optionName: 'Backup',
            description:
                'Your 12-word Seed Phrase is the ONLY way to recover your funds if you lose access to your wallet.',
            image: '/images/backup-symbol.png',
            event: () => handleBackUpClickButton(),
        },
        {
            optionName: 'Reset with Passcode',
            description: 'Keep your assets safe by enabling passcode protection.',
            image: '/images/resetWithPasscode-symbol.png',
            event: () => handleResetPassCodeOpenClickButton(),
        },
        {
            optionName: 'Resotre Wallet',
            description: 'Overwrite your current Mobile wallet using a Seed Phrase.',
            image: '/images/restoreWallet-symbol.png',
            event: () => handleRestoreModalOpenClickButton(),
        },
    ];
    const modalDispatch = useModalDispatch();
    const drawerDispatch = useDrawerDispatch();

    const handleBackUpClickButton = () => {
        drawerDispatch.open(DRAWER_ID.CHECK_PASSCODE);
        setSuccessFunc('backup');
    };

    const handleResetPassCodeOpenClickButton = () => {
        drawerDispatch.open(DRAWER_ID.CHECK_PASSCODE);
        setSuccessFunc('resetPasscode');
    };

    const handleRestoreModalOpenClickButton = () => {
        // modalDispatch.open(MODAL_ID.RESTORE_MODAL);
        message.success('comming soon');
    };
    const handleOpenAfterSuccess = () => {
        if (successFunc === 'backup') {
            drawerDispatch.open(DRAWER_ID.BACKUP_GET_AGREE);
        } else if (successFunc === 'resetPasscode') {
            drawerDispatch.open(DRAWER_ID.CREATE_PASSCODE);
        }
    };

    return (
        <Column>
            {settingData.map((value, index) => (
                <>
                    <OptionCard
                        key={index}
                        iconImage={value.image}
                        optionName={value.optionName}
                        description={value.description}
                        onClick={value.event}
                    />
                </>
            ))}
            <RestoreModal />
            <BackupGetAgree />
            <DrawerCheckPasscode title="Secure Wallet" handleSuccess={handleOpenAfterSuccess} />
            <CreatePasscodeDrawer passcode={passcode} />
            <RecheckPasscodeDrawer originalPasscode={passcode} passcode={recheckPasscode} />
        </Column>
    );
}
