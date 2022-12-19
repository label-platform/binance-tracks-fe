import { useIsMiniPlayerOn } from '@hooks/use-is-miniplayer-on';
import { Column } from '../flex';

export function DrawerLayout(props: any) {
    const { children, isNoBottomBar } = props;
    const isMiniPlayerOn = useIsMiniPlayerOn();
    return (
        <Column
            justifyContent="flex-start"
            sx={{
                maxWidth: 360,
                width: '100%',
                height: '100%',
                pb: isMiniPlayerOn && isNoBottomBar ? '106px' : isMiniPlayerOn ? '56px' : '0px',
                mx: 'auto',
                overflow: 'auto',
            }}
        >
            {children}
            {isNoBottomBar && isMiniPlayerOn ? (
                <div
                    style={{
                        height: '50px',
                        width: '100%',
                        backgroundColor: 'black',
                        position: 'fixed',
                        bottom: '0',
                        zIndex: '999',
                    }}
                />
            ) : (
                ''
            )}
        </Column>
    );
}
