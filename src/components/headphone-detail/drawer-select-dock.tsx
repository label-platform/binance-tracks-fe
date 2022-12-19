import { TRButton } from '@components/common/buttons/button';
import { Drawer } from '@components/common/drawer';
import { Column, Row } from '@components/common/flex';
import { TRCheckbox } from '@components/common/inputs/checkbox';
import { TRLabel } from '@components/common/labels/label';
import { ListContainer } from '@components/common/list-container';
import { DRAWER_ID } from '@constants/common';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { useIsMiniPlayerOn } from '@hooks/use-is-miniplayer-on';
import { StickerCheckedIcon } from '@icons/index';
import { StickerIcon } from '@icons/stickers';
import { ATTRIBUTE_GUARD, ITEM_STATUS } from '@models/common.interface';
import { Dock } from '@models/dock/dock';
import { Headphone } from '@models/headphone/headphone';
import { Close } from '@mui/icons-material';
import { capitalize } from '@mui/material';
import { useEffect, useState } from 'react';
import { useInsertSticker, useStickerListByAttributeQuery } from 'src/react-query/inventory';
import { useDrawerDispatch, useDrawerState } from 'src/recoil/drawer';
import { useMessageDispatch } from 'src/recoil/message';

const StickerIconWrapper = styled.div`
    display: inline-block;
    padding: 4px;
    border-radius: 6px;
    box-sizing: border-box;
    opacity: 0.7;
    border: 1px solid transparent;
    margin: auto;
    position: relative;
    width: 68px;
    height: 68px;
    & > svg {
        width: 100%;
        height: 100%;
    }
    &.active {
        opacity: 1;
        border: 1px solid rgba(255, 255, 255, 0.12);
    }
`;

interface Props {
    selectedDock?: Dock;
    headphone?: Headphone;
}

export function DrawerSelectDock(props: Props) {
    const { selectedDock, headphone } = props;
    const { close } = useDrawerDispatch();
    const isOpen = useDrawerState(DRAWER_ID.SELECT_DOCK);
    const { message } = useMessageDispatch();
    const isMiniplayerOn = useIsMiniPlayerOn();
    const { data = [] } = useStickerListByAttributeQuery(
        { take: 12 },
        selectedDock ? selectedDock.attribute : undefined
    );
    const { clesson } = useTheme();
    const { mutate } = useInsertSticker();
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        setActiveId('');
    }, [isOpen]);

    const handleStickerItemClick = (stickerId: string) => () => {
        setActiveId(stickerId);
    };
    const handleSelectDockeClose = () => {
        close(DRAWER_ID.SELECT_DOCK);
    };

    const handleConfirmClick = () => {
        if (headphone.status === ITEM_STATUS.SELLING) {
            // eslint-disable-next-line quotes
            message.none("Sticker can't be mounted on selling headphone.");
            return;
        }
        mutate(
            {
                headphoneId: headphone.id,
                dockPosition: selectedDock.position,
                stickerId: activeId,
            },
            {
                onSuccess() {
                    message.none('Successfully set');
                    close(DRAWER_ID.SELECT_DOCK);
                },
                onError() {
                    message.none('error has been occurred');
                },
            }
        );
    };

    return (
        <Drawer
            paperSx={{
                marginBottom: isMiniplayerOn ? '105px' : '10px',
                minHeight: 368,
            }}
            onClose={handleSelectDockeClose}
            from="bottom"
            drawerID={DRAWER_ID.SELECT_DOCK}
            widthPercent={100}
            heightPercent={0}
        >
            {selectedDock ? (
                <Column style={{ padding: '16px 32px', width: '100%' }}>
                    <Row style={{ width: '100%' }} justifyContent="flex-end">
                        <Close onClick={handleSelectDockeClose} />
                    </Row>
                    <TRLabel sizing="lg" weight="bold">
                        {capitalize(selectedDock.attribute)} stickers
                    </TRLabel>
                    <ListContainer
                        style={{ width: '100%', marginTop: 24, rowGap: 24, maxWidth: 296, maxHeight: 200 }}
                        columns={4}
                    >
                        {data.map((sticker) => (
                            <StickerIconWrapper
                                onClick={handleStickerItemClick(sticker.id)}
                                className={activeId === sticker.id ? 'active' : ''}
                                key={sticker.id}
                            >
                                <TRLabel
                                    weight="bold"
                                    sizing="xxs"
                                    color={clesson.attribute[sticker.attribute]}
                                    style={{ position: 'absolute', top: 0, left: 2, transform: 'scale(0.8)' }}
                                >
                                    +{sticker.plusStat}
                                </TRLabel>
                                <StickerIcon attribute={sticker.attribute} level={sticker.level} />
                                {activeId === sticker.id ? (
                                    <span style={{ position: 'absolute', bottom: -3, right: 1 }}>
                                        <StickerCheckedIcon />
                                    </span>
                                ) : (
                                    <></>
                                )}
                            </StickerIconWrapper>
                        ))}
                        {data.map((sticker) => (
                            <StickerIconWrapper
                                onClick={handleStickerItemClick(sticker.id)}
                                className={activeId === sticker.id ? 'active' : ''}
                                key={sticker.id}
                            >
                                <TRLabel
                                    weight="bold"
                                    sizing="xxs"
                                    color={clesson.attribute[sticker.attribute]}
                                    style={{ position: 'absolute', top: 0, left: 2, transform: 'scale(0.8)' }}
                                >
                                    +{sticker.plusStat}
                                </TRLabel>
                                <StickerIcon attribute={sticker.attribute} level={sticker.level} />
                                {activeId === sticker.id ? (
                                    <span style={{ position: 'absolute', bottom: -3, right: 1 }}>
                                        <StickerCheckedIcon />
                                    </span>
                                ) : (
                                    <></>
                                )}
                            </StickerIconWrapper>
                        ))}
                    </ListContainer>
                    <TRButton onClick={handleConfirmClick} style={{ position: 'absolute', bottom: 20, width: 296 }}>
                        Confirm
                    </TRButton>
                </Column>
            ) : (
                <></>
            )}
        </Drawer>
    );
}
