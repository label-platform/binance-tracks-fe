import React from 'react';
import { OptionCards } from '@components/setting/option-cards';
import { Column, Row } from '@components/common/flex';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import styled from '@emotion/styled';
import { Drawer } from '@components/common/drawer';
import { DRAWER_ID } from '@constants/common';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { TRLabel } from '@components/common/labels/label';
import Image from 'next/image';
import { Close } from '@mui/icons-material';
import { HeaderDrawer } from '@components/common/header-drawer';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';

export function SettingDrawer() {
    const { close } = useDrawerDispatch();

    const handleCloseDrawer = () => {
        close(DRAWER_ID.SETTING_MAIN);
    };
    return (
        <Drawer drawerID={DRAWER_ID.SETTING_MAIN} from="right" widthPercent={100} heightPercent={100}>
            <DrawerLayout isNoBottomBar>
                <HeaderDrawer asRightIcon={<Close onClick={handleCloseDrawer} />} title="Settings" />
                <OptionCards />
            </DrawerLayout>
        </Drawer>
    );
}
