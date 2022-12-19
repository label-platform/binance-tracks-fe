import styled from '@emotion/styled';
import { DockBarIcon } from '@icons/index';
import { StickerIcon } from '@icons/stickers';
import { Dock } from '@models/dock/dock';
import { DOCK_STATUS } from '@models/dock/dock.interface';
import Image from 'next/image';

interface Props {
    dock: Dock;
    handleClick?: (dock: Dock) => void;
}

const StickerWithDockWrapper = styled.span`
    position: relative;
    border-radius: 999px;
    min-width: 126px;
    min-height: 126px;

    & > svg {
        position: absolute;
    }
`;

export function TRDock(props: Props) {
    const { dock, handleClick } = props;

    const handleDockClick = (e) => {
        if (typeof handleClick !== 'function') return;
        handleClick(dock);
    };

    if (dock.sticker) {
        return (
            <StickerWithDockWrapper onClick={handleDockClick}>
                <StickerIcon level={dock.sticker.level} attribute={dock.attribute} />
                <DockBarIcon quality={dock.quality} />
            </StickerWithDockWrapper>
        );
    }

    return (
        <StickerWithDockWrapper
            onClick={handleDockClick}
            style={{ opacity: dock.status === DOCK_STATUS.LOCK ? 0.5 : 1, width: 126, height: 126 }}
        >
            <Image
                src={
                    dock.status === DOCK_STATUS.NOT_OPENED || dock.status === DOCK_STATUS.LOCK
                        ? `/images/headphones/docks/${dock.attribute}.png`
                        : `/images/headphones/docks/${dock.attribute}-${dock.quality}.png`
                }
                alt="none"
                width={126}
                height={126}
            />
        </StickerWithDockWrapper>
    );
}
