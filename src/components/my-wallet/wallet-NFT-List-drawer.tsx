import React, { useState, useEffect } from 'react';
import { DRAWER_ID } from '@constants/common';
import { Drawer } from '@components/common/drawer';
import { useDrawerDispatch, useDrawerState } from 'src/recoil/drawer';
import { Column, Row } from '@components/common/flex';
import { useTheme } from '@emotion/react';
import { ChevronLeft } from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import { SettingDrawer } from '@components/setting/setting-main';
import { Item } from '@models/item/item';
import { WalletNFT } from './wallet-NFT-drawer';
import { HeaderDrawer } from '@components/common/header-drawer';
import { ListContainer } from '@components/common/list-container';
import { useGetNFTLIst } from 'src/react-query/wallet';
import { TokenInfos } from '@constants/jsonInterface/web3';
import { ItemCard } from '@components/common/item-card';
import { ItemThumbnail } from '@components/common/item-thumbnail';
import { ContractGuard } from '@services/wallet/wallet';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';
import { usePullToRefresh } from '@hooks/use-pull-to-refresh';
import { MotionRefresh } from '@components/common/motion-refresh';

interface Props {
    NFTType: ContractGuard;
}

export const WalletNFTList = (props: Props) => {
    const { NFTType } = props;
    const drawerDispatch = useDrawerDispatch();
    const NFTList = useGetNFTLIst(NFTType, useDrawerState(DRAWER_ID.WALLET_NFT_LIST));
    const nftsItems = NFTList.data.data || [];
    const theme = useTheme();
    const [selectItem, setSelectItem] = useState<Item>();

    const { isOpen, isStart, percent, end, containerTarget } = usePullToRefresh({
        handleRefresh() {
            NFTList.refetch;
        },
        heightForRefresh: 60,
        depth: NFTList.isLoading,
    });

    useEffect(() => {
        setTimeout(() => {
            end();
        }, 1000);
    }, [isStart]);

    const handleClose = () => {
        drawerDispatch.close(DRAWER_ID.WALLET_NFT_LIST);
    };
    const handleSettingOpen = () => {
        drawerDispatch.open(DRAWER_ID.SETTING_MAIN);
    };
    const handleSelectItem = (item: any) => {
        item.contract = NFTType;
        setSelectItem(item);
        drawerDispatch.open(DRAWER_ID.WALLET_NFT);
    };

    return (
        <Drawer
            from="right"
            drawerID={DRAWER_ID.WALLET_NFT_LIST}
            widthPercent={100}
            heightPercent={100}
            onClose={handleClose}
        >
            <DrawerLayout isNoBottomBar>
                <Column width="100%">
                    <HeaderDrawer
                        asLeftIcon={<ChevronLeft onClick={handleClose} sx={{ fill: 'white' }} />}
                        asRightIcon={
                            <SettingsIcon style={{ color: theme.palette.light.main }} onClick={handleSettingOpen} />
                        }
                        title={NFTType === 'HEADPHONEBOX' ? 'Headphone Box' : 'Headphone'}
                    />
                    <MotionRefresh isOpen={isOpen} isStart={isStart} percent={percent} />

                    {NFTList.isLoading ? (
                        <Row style={{ width: '100%', flexWrap: 'wrap', padding: '0px 50px' }}>
                            <ListContainer.Skeleton />
                        </Row>
                    ) : (
                        <Row style={{ width: '100%' }} ref={containerTarget}>
                            <Row
                                style={{
                                    width: '296px',
                                    flexWrap: 'wrap',
                                    justifyContent: 'flex-start',
                                }}
                            >
                                {nftsItems.map((item: any) => {
                                    return (
                                        <React.Fragment key={item.name}>
                                            <ItemCard key={item.name} onClick={() => handleSelectItem(item)}>
                                                <ItemThumbnail
                                                    imgUrl={item.image}
                                                    itemId={`# ${item.id}`}
                                                    quality={item.attributes[1].value}
                                                />
                                            </ItemCard>
                                        </React.Fragment>
                                    );
                                })}
                            </Row>
                        </Row>
                    )}
                </Column>
            </DrawerLayout>
            <WalletNFT item={selectItem} />
            <SettingDrawer />
        </Drawer>
    );
};
