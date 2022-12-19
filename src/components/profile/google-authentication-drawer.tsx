import { TRButton } from '@components/common/buttons/button';
import { Drawer } from '@components/common/drawer';
import { Column, Row } from '@components/common/flex';
import { HeaderDrawer } from '@components/common/header-drawer';
import { TRLabel } from '@components/common/labels/label';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';
import { DRAWER_ID } from '@constants/common';
import { useTheme } from '@emotion/react';
import { GoogleAuthenticatorIcon } from '@icons';
import { ChevronLeft } from '@mui/icons-material';
import { useDrawerDispatch } from 'src/recoil/drawer';

export function GoogleAuthenticationDrawer() {
    const { close, open } = useDrawerDispatch();
    const { palette } = useTheme();
    const handleCloseClick = () => {
        close(DRAWER_ID.GOOGLE_AUTHENTICATOR);
    };

    const handleLinkClick = () => {
        open(DRAWER_ID.GOOGLE_AUTHENTICATOR_CREATE);
    };

    return (
        <Drawer paperSx={{ alignItems: 'center' }} widthPercent={100} drawerID={DRAWER_ID.GOOGLE_AUTHENTICATOR}>
            <DrawerLayout>
                <HeaderDrawer
                    asLeftIcon={<ChevronLeft onClick={handleCloseClick} sx={{ fill: 'white' }} />}
                    title="Link"
                />
                <Column
                    gap={1}
                    sx={{ mb: 3, py: 3, border: `1px solid ${palette.primary.main}`, borderRadius: '8px' }}
                    alignSelf="stretch"
                >
                    <GoogleAuthenticatorIcon />
                    <TRLabel weight="bold" sizing="ml" color="primary" style={{ textAlign: 'center' }}>
                        Download
                        <br />
                        Google Authenticator
                    </TRLabel>
                </Column>
                <TRLabel style={{ textAlign: 'center', lineHeight: '160%' }}>
                    Please download and install Google Authenticator. Then, tap Link to llink it to your TRACKS account
                </TRLabel>
                <Row alignSelf="stretch" sx={{ mt: 'auto', mb: 2 }}>
                    <TRButton onClick={handleLinkClick} sizing="xl">
                        Link
                    </TRButton>
                </Row>
            </DrawerLayout>
        </Drawer>
    );
}
