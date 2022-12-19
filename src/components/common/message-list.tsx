import { Snackbar } from '@mui/material';
import { useMessageState } from 'src/recoil/message';
import styled from '@emotion/styled';

const SnackbarStyle = styled.div`
    & .css-1jxnz57-MuiPaper-root-MuiSnackbarContent-root {
        background-color: black !important;
        padding: 12px 32px;
        min-width: 205px;
        text-align: center;
    }
    & .css-1exqwzz-MuiSnackbarContent-message {
        font-family: 'Gilroy';
        font-size: 12px;
        padding: 0;
        color: ${(props) => props.theme.palette.text.primary};
    }
`;
export function MessageList(): JSX.Element {
    const messages = useMessageState();

    //Snackbar를 중앙으로 위치시키기 위해서 height 을 100%를 설정해야하지만 sanckbar가 사리지지 않으면 다른컴포넌트가 터치 불가능 이슈
    return (
        <>
            {messages.map((message) => (
                <SnackbarStyle key={message.id}>
                    <Snackbar
                        sx={{ height: '100%' }}
                        open
                        anchorOrigin={{ ...(message.position as any) }}
                        message={message.content}
                    />
                </SnackbarStyle>
            ))}
        </>
    );
}
