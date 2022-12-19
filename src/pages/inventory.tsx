// import { AuthGuard } from '@components/authentication/auth-guard';
// import { MainLayout } from '@components/common/layouts/main-layout';

// import { Tabs } from '@components/common/tabs';

// import { Others } from '@components/inventory/others';
// import { ModalHeadphoneBox } from '@components/inventory/modal-headphone-box';
// import styled from '@emotion/styled';
// import Image from 'next/image';
// import { HeadphoneBoxes } from '@components/inventory/headphone-boxes-tab';
// import { ModalSellItem } from '@components/common/modal-sell-item';
// import { ModalPriceModifyItem } from '@components/common/modal-price-modify-item';
// import { HeadphoneTab } from '@components/inventory/headphone-tab';
// import { StickerTab } from '@components/inventory/sticker-tab';

// const InventoryTabTitle = styled(Tabs.Titles)`
//     border-bottom: none;
//     justify-content: space-between;
//     padding: 0px 10px;
//     & > .active {
//         &::before {
//             display: none;
//         }
//     }
// `;

// const StyledTabTitleItem = styled.div`
//     opacity: 0.2;
//     max-width: 48px;
//     max-height: 48px;
//     border-radius: 999px;
//     border: 2px solid #ffffff;
//     overflow: hidden;
//     &.active {
//         opacity: 1;
//         box-shadow: 0px 0px 8px 0px #387deb, 0px 0px 12px 0px #387deb, 0px 0px 4px 0px #387deb, 0px 0px 2px 0px #ffffff;
//     }
// `;

// const Inventory = () => {
//     return (
//         <>
//             <Tabs style={{ height: '100%', justifyContent: 'flex-start' }} gap={2}>
//                 <InventoryTabTitle>
//                     <StyledTabTitleItem>
//                         <Image alt="" src="/images/headphone-side.png" width={45} height={45} />
//                     </StyledTabTitleItem>
//                     <StyledTabTitleItem>
//                         <Image alt="" src="/images/headphone-box-side.png" layout="fill" />
//                     </StyledTabTitleItem>
//                     <StyledTabTitleItem>
//                         <Image alt="" src="/images/sticker-side.png" layout="fill" />
//                     </StyledTabTitleItem>
//                 </InventoryTabTitle>
//                 <Tabs.Panels justifyContent="flex-start" style={{ width: '100%', height: '100%' }}>
//                     <HeadphoneTab />
//                     <HeadphoneBoxes />
//                     <StickerTab />
//                 </Tabs.Panels>
//             </Tabs>
//             <ModalHeadphoneBox />
//             <ModalSellItem />
//             <ModalPriceModifyItem />
//         </>
//     );
// };

// Inventory.getLayout = (page: React.ReactElement) => (
//     <AuthGuard>
//         <MainLayout>{page}</MainLayout>
//     </AuthGuard>
// );

// export default Inventory;

import { AuthGuard } from '@components/authentication/auth-guard';
import { Column } from '@components/common/flex';
import { TRLabel } from '@components/common/labels/label';
import { MainLayout } from '@components/common/layouts/main-layout';

const Inventory = () => {
    return (
        <Column sx={{ height: '100%' }}>
            <TRLabel weight="bold">Comming soon</TRLabel>
        </Column>
    );
};

Inventory.getLayout = (page: React.ReactElement) => (
    <AuthGuard>
        <MainLayout>{page}</MainLayout>
    </AuthGuard>
);

export default Inventory;
