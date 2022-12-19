import { AppBar, Box, Stack, Toolbar } from '@mui/material';
import { Container } from '@mui/system';
import { DRAWER_ID } from '@constants/common';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { Row } from '@components/common/flex';
import Link from 'next/link';
import { useUserBalanceQuery } from 'src/react-query/user';
import Image from 'next/image';

interface MainNavBarProps {
    height: number;
}

export const MainNavBar = ({ height }: MainNavBarProps) => {
    const drawerDispatch = useDrawerDispatch();
    // const adjustableHeight = { minHeight: `${height}px`, maxHeight: `${height}px`, height: `${height}px` };

    const { balances } = useUserBalanceQuery();
    return (
        <>
            <AppBar elevation={0} position="fixed" sx={{ userDrag: 'none', backgroundColor: '#121212' }}>
                <Container>
                    <Toolbar disableGutters>
                        <Link href="/">
                            <Row>
                                <img src="/images/FrameText.png" alt="icon" />
                            </Row>
                        </Link>

                        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'end', alignItems: 'center' }}>
                            {balances.length > 0 ? (
                                <Stack
                                    spacing={1}
                                    direction="row"
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.12)',
                                        borderRadius: '24px',
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="center"
                                        spacing={1}
                                        sx={{ pl: 1 }}
                                    >
                                        <Image src="/images/blb-symbol.png" alt="" width={10} height={10} />
                                        <span
                                            style={{
                                                color: 'white',
                                                fontWeight: '900',
                                            }}
                                        >
                                            {balances[2].availableBalance}
                                        </span>
                                    </Stack>
                                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                                        <Image src="/images/lbl-symbol.png" alt="" width={10} height={10} />
                                        <span
                                            style={{
                                                color: 'white',
                                                fontWeight: '900',
                                            }}
                                        >
                                            {balances[1].availableBalance}
                                        </span>
                                    </Stack>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="center"
                                        spacing={1}
                                        sx={{ paddingLeft: '0.1rem' }}
                                    >
                                        <Image src="/images/bnb-symbol.png" alt="" width={10} height={10} />
                                        <span
                                            style={{
                                                color: 'white',
                                                fontWeight: '900',
                                            }}
                                        >
                                            {balances[0].availableBalance}
                                        </span>
                                    </Stack>
                                </Stack>
                            ) : null}

                            <Stack direction="row" alignItems="center" justifyContent="center">
                                <Link href="/wallet">
                                    <span>
                                        <Image src="/images/wallet.png" alt="icon" width={35} height={35} />
                                    </span>
                                </Link>
                            </Stack>
                            <Stack>
                                <Link href="/wallet">
                                    <span>
                                        <Image src="/images/user-avatar.png" alt="icon" width={35} height={35} />
                                    </span>
                                </Link>
                            </Stack>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
};
