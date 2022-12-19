import React from 'react';
import { AppBar } from '@mui/material';
import { Container } from '@mui/system';
import { useTheme } from '@emotion/react';

interface Props {
    children: React.ReactNode;
    height: number;
}

export function NavBarBottom(props: Props) {
    const { children, height } = props;

    return (
        <AppBar
            position="fixed"
            sx={{
                top: 'auto',
                bottom: 0,
                height: `${height}px`,
                backgroundColor: 'black',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
            }}
        >
            <Container maxWidth="sm">{children}</Container>
        </AppBar>
    );
}
