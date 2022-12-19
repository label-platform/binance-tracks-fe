import React from 'react';
import { Backdrop, Drawer as MuiDrawer, DrawerProps, SxProps } from '@mui/material';
import { useDrawerState } from 'src/recoil/drawer';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';

interface Props extends DrawerProps {
    widthPercent?: number;
    heightPercent?: number;
    paperSx?: SxProps;
    from?: DrawerProps['anchor'];
    drawerID: string;
}

const WhiteBackDrop = styled(Backdrop)`
    background-color: rgba(44, 44, 44, 0.8);
    opacity: 0.6;
`;

export function Drawer(props: Props) {
    const theme = useTheme();

    const { from = 'right', drawerID, widthPercent = 30, heightPercent = 30, children, paperSx = {}, ...rest } = props;
    const isVisible = useDrawerState(drawerID);

    const defaultPaperStyle =
        from === 'left' || from === 'right'
            ? {
                  width: `${widthPercent}%`,
                  height: '100%',
                  backgroundColor: theme.palette.dark.main,
              }
            : {
                  width: `${widthPercent}%`,
                  height: `${heightPercent}%`,
                  backgroundColor: theme.palette.dark.main,
                  borderRadius: '16px 16px 0px 0px',
              };

    return (
        <MuiDrawer
            {...rest}
            anchor={from}
            ModalProps={{
                BackdropComponent: WhiteBackDrop,
            }}
            PaperProps={{
                sx: { ...defaultPaperStyle, ...paperSx },
            }}
            open={isVisible}
        >
            {children}
        </MuiDrawer>
    );
}
