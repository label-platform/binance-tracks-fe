import styled from '@emotion/styled';
import { Dock } from '@models/dock/dock';
import { Headphone } from '@models/headphone/headphone';
import Image from 'next/image';
import { TRDock } from './dock';

interface Props {
    headphone: Headphone;
    handleClick?: (dock: Dock) => void;
}

const HeadphoneWrapper = styled.div`
    width: 256px;
    height: 256px;
    position: relative;

    & > .img-container {
        position: absolute !important;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 200px;
        height: 200px;
        z-index: -1;
    }

    & > .dock {
        display: inline-block;
        position: absolute;
    }
    & > .position-1 {
        left: 0px;
        top: 0px;
    }
    & > .position-2 {
        right: 0px;
        top: -2px;
        transform: rotate(90deg);
    }
    & > .position-3 {
        transform: rotate(270deg);
        left: 1px;
        bottom: -2px;
    }
    & > .position-4 {
        transform: rotate(180deg);
        right: -1px;
        bottom: 0px;
    }
`;

export function HeadphoneWithDocks({ headphone, handleClick }: Props) {
    const { imgUrl } = headphone;

    return (
        <HeadphoneWrapper>
            {headphone.docks.map((dock) => (
                <span key={dock.position} className={`dock position-${dock.position}`}>
                    <TRDock handleClick={handleClick} dock={dock} />
                </span>
            ))}
            <span className="img-container">
                <Image src={imgUrl} width={200} height={200} alt="" />
            </span>
        </HeadphoneWrapper>
    );
}
