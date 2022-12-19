import { Drawer } from '@components/common/drawer';
import { Column, Row } from '@components/common/flex';
import { HeaderDrawer } from '@components/common/header-drawer';
import { TRLabel } from '@components/common/labels/label';
import { DRAWER_ID } from '@constants/common';
import { useTheme } from '@emotion/react';
import { ChevronLeft } from '@mui/icons-material';
import moment from 'moment';
import { useMemo } from 'react';
import { useUserActivationCodesQuery } from 'src/react-query/user';
import { useDrawerDispatch } from 'src/recoil/drawer';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { useMessageDispatch } from 'src/recoil/message';
import { useClipboard } from '@hooks/use-clipboard';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';
export function ActivationCodeDrawer() {
    const { close } = useDrawerDispatch();
    const { isLoading, activationCodes } = useUserActivationCodesQuery();
    const { palette } = useTheme();
    const { write } = useClipboard();
    const { message } = useMessageDispatch();
    const availableCount = useMemo(() => {
        return activationCodes.filter((code) => code.register === null).length;
    }, [activationCodes.length]);

    const handleCloseClick = () => {
        close(DRAWER_ID.MY_PROFILE_ACTIVATION_CODE);
    };

    const handleCopyclick = (code: string) => () => {
        write(code);
        message.none('Successfully copied');
    };

    return (
        <Drawer paperSx={{ alignItems: 'center' }} widthPercent={100} drawerID={DRAWER_ID.MY_PROFILE_ACTIVATION_CODE}>
            {!isLoading ? (
                <DrawerLayout>
                    <HeaderDrawer
                        style={{ marginBottom: '20px' }}
                        asLeftIcon={<ChevronLeft onClick={handleCloseClick} sx={{ fill: 'white' }} />}
                        title="Activation Code"
                    />
                    <Column
                        gap={2}
                        sx={{
                            py: '20px',
                            px: 2,
                            borderRadius: '6px',
                            mb: 2,
                            border: `1px solid ${palette.primary.main}`,
                        }}
                        alignSelf="stretch"
                    >
                        <Row>
                            <TRLabel color={palette.text.secondary}>Available/Total</TRLabel>
                        </Row>
                        <Row>
                            <TRLabel sizing="xxl" weight="bold">
                                {availableCount} / {activationCodes.length}
                            </TRLabel>
                        </Row>
                    </Column>
                    {activationCodes.map((activationCode, i) => (
                        <Row
                            sx={{ py: 2 }}
                            alignSelf="stretch"
                            justifyContent="space-between"
                            key={activationCode.code}
                        >
                            <TRLabel weight="bold" sizing="ml">
                                {i + 1}
                            </TRLabel>
                            <Column>
                                <TRLabel
                                    sizing="sm"
                                    color={activationCode.register !== null ? palette.text.secondary : null}
                                >
                                    Activation Code
                                </TRLabel>
                                {activationCode.register !== null ? (
                                    <TRLabel sizing="xs" color={palette.text.secondary}>
                                        {moment(activationCode.createdAt).utc().format('MM/DD hh:mm')}
                                    </TRLabel>
                                ) : null}
                            </Column>
                            {activationCode.register !== null ? (
                                <TRLabel sizing="xs" color={palette.text.secondary}>
                                    Used
                                </TRLabel>
                            ) : (
                                <ContentCopyRoundedIcon
                                    onClick={handleCopyclick(activationCode.code)}
                                    color="primary"
                                />
                            )}
                        </Row>
                    ))}
                </DrawerLayout>
            ) : null}
        </Drawer>
    );
}
