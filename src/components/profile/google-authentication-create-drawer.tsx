import { TRButton } from '@components/common/buttons/button';
import { Drawer } from '@components/common/drawer';
import { Column, Row } from '@components/common/flex';
import { HeaderDrawer } from '@components/common/header-drawer';
import { TRInput } from '@components/common/inputs/input';
import { InputWithAdorments } from '@components/common/inputs/input-with-adorments';
import { TRLabel } from '@components/common/labels/label';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';
import { DRAWER_ID } from '@constants/common';
import { useTheme } from '@emotion/react';
import { useClipboard } from '@hooks/use-clipboard';
import { ChevronLeft } from '@mui/icons-material';
import { useGetOTPQuery } from 'src/react-query/auth';
import { useDrawerDispatch, useDrawerState } from 'src/recoil/drawer';
import { useMessageDispatch } from 'src/recoil/message';

export function GoogleAuthenticationCreateDrawer() {
    const { close, open } = useDrawerDispatch();
    const { palette } = useTheme();
    const visible = useDrawerState(DRAWER_ID.GOOGLE_AUTHENTICATOR_CREATE);
    const { data, isLoading } = useGetOTPQuery({ enabled: visible });
    const { message } = useMessageDispatch();
    const { write } = useClipboard();
    const handleCloseClick = () => {
        close(DRAWER_ID.GOOGLE_AUTHENTICATOR);
    };

    const handleLinkClick = () => {
        open(DRAWER_ID.GOOGLE_AUTHENTICATOR_CONFIRM);
    };

    const copyText = () => {
        write(data.secret);
        message.none('copied');
    };

    return (
        <Drawer paperSx={{ alignItems: 'center' }} widthPercent={100} drawerID={DRAWER_ID.GOOGLE_AUTHENTICATOR_CREATE}>
            {!isLoading && visible ? (
                <DrawerLayout>
                    <HeaderDrawer
                        asLeftIcon={<ChevronLeft onClick={handleCloseClick} sx={{ fill: 'white' }} />}
                        title="Backup Key"
                    />
                    <Row sx={{ mb: 2 }} alignSelf="stretch">
                        <InputWithAdorments
                            type="text"
                            value={data?.secret}
                            readOnly
                            fullWidth
                            asEnd={
                                <TRLabel weight="bold" color={palette.primary.light} sizing="sm" onClick={copyText}>
                                    Copy
                                </TRLabel>
                            }
                        />
                    </Row>
                    <TRLabel style={{ textAlign: 'center', lineHeight: '160%' }}>
                        Please save this backup key in a secure location. This key will allow you to recover your
                        Authenticator if you lose your phone. It will be very difficult to reset it if you lost your
                        key.
                    </TRLabel>
                    <Row alignSelf="stretch" sx={{ mt: 'auto', mb: 2 }}>
                        <TRButton onClick={handleLinkClick} sizing="xl">
                            Link
                        </TRButton>
                    </Row>
                </DrawerLayout>
            ) : null}
        </Drawer>
    );
}
