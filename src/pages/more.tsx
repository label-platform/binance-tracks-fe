import { AuthGuard } from '@components/authentication/auth-guard';
import { Column } from '@components/common/flex';
import { TRLabel } from '@components/common/labels/label';
import { MainLayout } from '@components/common/layouts/main-layout';

const More = () => {
    return (
        <Column sx={{ height: '100%' }}>
            <TRLabel weight="bold">Comming soon</TRLabel>
        </Column>
    );
};

More.getLayout = (page: React.ReactElement) => (
    <AuthGuard>
        <MainLayout>{page}</MainLayout>
    </AuthGuard>
);

export default More;
