import { Drawer } from '@components/common/drawer';
import { Column, Row } from '@components/common/flex';
import { HeaderDrawer } from '@components/common/header-drawer';
import { TRInput } from '@components/common/inputs/input';
import { TRLabel } from '@components/common/labels/label';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';
import { DRAWER_ID } from '@constants/common';
import { useTheme } from '@emotion/react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Image from 'next/image';
import { useUserSelfInfoQuery } from 'src/react-query/user';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { ChangeNameDrawer } from './change-name-drawer';
import { ChangePasswordDrawer } from './change-password-drawer';

export function ProfileUserDetailDrawer() {
    const { close, open } = useDrawerDispatch();
    const { user, isLoading } = useUserSelfInfoQuery();
    const { palette } = useTheme();

    const handleCloseClick = () => {
        close(DRAWER_ID.MY_PROFILE_USER_DETAIL);
    };

    const handleChangeNameClick = () => {
        open(DRAWER_ID.MY_PROFILE_USER_NAME);
    };

    const handleChangePasswordClick = () => {
        open(DRAWER_ID.MY_PROFILE_USER_CHANGE_PASSWORD);
    };

    return (
        <>
            <Drawer paperSx={{ alignItems: 'center' }} widthPercent={100} drawerID={DRAWER_ID.MY_PROFILE_USER_DETAIL}>
                {!isLoading ? (
                    <DrawerLayout>
                        <HeaderDrawer
                            style={{ marginBottom: '20px' }}
                            asLeftIcon={<ChevronLeft onClick={handleCloseClick} sx={{ fill: 'white' }} />}
                            title="Profile"
                        />
                        <Row sx={{ mb: 4 }}>
                            <Image
                                src="/images/temp-profile.png"
                                alt=""
                                width={120}
                                height={120}
                                style={{ borderRadius: '120px' }}
                            />
                        </Row>
                        <Row sx={{ mb: 2 }} alignSelf="stretch">
                            <TRInput sx={{ width: '100%' }} helperText="E-mail" disabled value={user.email} />
                        </Row>
                        <Row
                            onClick={handleChangeNameClick}
                            sx={{ py: 2, px: 1 }}
                            alignSelf="stretch"
                            justifyContent="space-between"
                        >
                            <TRLabel>Name</TRLabel>
                            <Row gap={1}>
                                <TRLabel sizing="sm" color={palette.text.secondary}>
                                    {user.name}
                                </TRLabel>
                                <ChevronRight color="primary" sx={{ width: 16, height: 16 }} />
                            </Row>
                        </Row>
                        <Row
                            onClick={handleChangePasswordClick}
                            sx={{ py: 2, px: 1 }}
                            alignSelf="stretch"
                            justifyContent="space-between"
                        >
                            <TRLabel>Password Setting</TRLabel>
                            <ChevronRight color="primary" sx={{ width: 16, height: 16 }} />
                        </Row>
                        {/* <Row sx={{ py: 2, px: 1 }} alignSelf="stretch" justifyContent="space-between">
                            <TRLabel color="error">Delete Account</TRLabel>
                            <ChevronRight color="primary" sx={{ width: 16, height: 16 }} />
                        </Row> */}
                    </DrawerLayout>
                ) : null}
            </Drawer>
            <ChangeNameDrawer />
            <ChangePasswordDrawer />
        </>
    );
}
