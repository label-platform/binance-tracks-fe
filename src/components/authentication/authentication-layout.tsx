import { Column } from '@components/common/flex';
import { LogoIcon } from '@icons/index';
import { Container } from '@mui/material';

interface AuthenticationLayoutProps {
    children: React.ReactNode;
}

export const AuthenticationLayout = ({ children }: AuthenticationLayoutProps) => {
    return (
        <Container maxWidth="sm" style={{ height: '100%', paddingTop: '100px', paddingBottom: '40px' }}>
            <Column justifyContent="flex-start" style={{ height: '100%' }}>
                <LogoIcon />
                {children}
            </Column>
        </Container>
    );
};
AuthenticationLayout.DisplayName = 'AuthenticationLayout';
