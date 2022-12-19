import { Drawer } from '@components/common/drawer';
import { Column } from '@components/common/flex';
import { TRLabel } from '@components/common/labels/label';
import { Passcode, usePasscode } from '@components/common/passcode';
import { DRAWER_ID } from '@constants/common';
import { HeaderDrawer } from '@components/common/header-drawer';
import { ChevronLeft, Close } from '@mui/icons-material';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';

interface Props {
    passcode: any;
}

export function CreatePasscodeDrawer(props: Props) {
    const { passcode } = props;
    const drawerDispatch = useDrawerDispatch();

    const handleClose = () => {
        drawerDispatch.close(DRAWER_ID.CREATE_PASSCODE);
    };
    return (
        <Drawer from="right" widthPercent={100} drawerID={DRAWER_ID.CREATE_PASSCODE}>
            <DrawerLayout isNoBottomBar>
                <HeaderDrawer
                    asLeftIcon={<ChevronLeft onClick={handleClose} sx={{ fill: 'white' }} />}
                    title="Secured Wallet"
                />
                <Column>
                    <TRLabel weight="bold" sizing="ml" style={{ marginBottom: '24px' }}>
                        Create your passcode
                    </TRLabel>
                    <Passcode {...passcode} />
                </Column>
            </DrawerLayout>
        </Drawer>
    );
}
