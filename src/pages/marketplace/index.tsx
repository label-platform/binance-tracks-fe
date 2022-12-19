import { AuthGuard } from '@components/authentication/auth-guard';
import { FlexItem } from '@components/common/flex';
import { MainLayout } from '@components/common/layouts/main-layout';
import { Tabs } from '@components/common/tabs';
import { Merchandise } from '@components/marketplace/merchandise';
import { Tickets } from '@components/marketplace/tickets';

const Marketplace = () => {
    return (
        <Tabs style={{ height: '100%', justifyContent: 'flex-start' }} gap={2}>
            <Tabs.Titles>
                <FlexItem>Ticket</FlexItem>
                <FlexItem>Merchandise</FlexItem>
            </Tabs.Titles>
            <Tabs.Panels justifyContent="flex-start" style={{ width: '100%', height: '100%' }}>
                <Tickets />
                <Merchandise />
            </Tabs.Panels>
        </Tabs>
    );
};

Marketplace.getLayout = (page: React.ReactElement) => (
    <AuthGuard>
        <MainLayout>{page}</MainLayout>
    </AuthGuard>
);

export default Marketplace;
