import { SCREEN_ID } from '@constants/common';
import Image from 'next/image';
import { useScreenDispatch, useScreenState } from 'src/recoil/screen';
import { Column } from '../flex';
import { DisplayOnScreen } from './display-on-screen';
import { motion, Variants } from 'framer-motion';
import { useState } from 'react';
import styled from '@emotion/styled';
import { HeadphoneBox } from '@models/headphone-box/headphone-box';
import { Sticker } from '@models/sticker/sticker';
import { BLBIcon } from '@icons';
import { TRLabel } from '../labels/label';
import { StickerIcon } from '@icons/stickers';

const variants: Variants = {
    open: {
        scale: 3,
        filter: 'blur(3px)',
        transition: {
            duration: 1.5,
            ease: 'easeInOut',
        },
    },
};

const ItemWrapper = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.36);
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    overflow: hidden;
    & > div > svg {
        width: 72px;
        height: 72px;
    }
`;

export function ScreenMysteryBox() {
    const { visible, data } = useScreenState(SCREEN_ID.MYSTERY_BOX);
    const { close } = useScreenDispatch();
    const [isAnimationEnd, setIsAnimationEnd] = useState(false);

    const handleCloseClick = () => {
        if (!isAnimationEnd) return;
        setIsAnimationEnd(false);
        close();
    };

    const handleAnimationEnd = () => {
        setIsAnimationEnd(true);
    };

    return (
        <DisplayOnScreen onClick={handleCloseClick} screenID={SCREEN_ID.MYSTERY_BOX}>
            {visible && data !== null ? (
                <Column gap={2}>
                    {!isAnimationEnd ? (
                        <motion.div
                            key="opening"
                            onAnimationComplete={handleAnimationEnd}
                            variants={variants}
                            animate="open"
                        >
                            <Image
                                quality={100}
                                src="/images/mystery-box/content.png"
                                width={130}
                                height={130}
                                alt=""
                            />
                        </motion.div>
                    ) : (
                        <ItemWrapper>
                            <motion.div
                                key="opened"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                initial={{ opacity: 0, filter: 'blur(3px)' }}
                                animate={{ opacity: 1, filter: 'blur(0px)' }}
                            >
                                {data instanceof Sticker ? (
                                    <StickerIcon attribute={data.attribute} level={data.level} />
                                ) : data instanceof HeadphoneBox ? (
                                    <Image quality={100} width={78} height={78} src={data.imgUrl} />
                                ) : (
                                    <Column
                                        justifyContent="flex-end"
                                        gap={1}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            paddingBottom: '6px',
                                            '& > svg': { transform: 'scale(3)' },
                                        }}
                                    >
                                        <BLBIcon />
                                        <TRLabel weight="bold" style={{ marginTop: '10px' }} sizing="xxs">
                                            {`${data} BLB`}
                                        </TRLabel>
                                    </Column>
                                )}
                            </motion.div>
                        </ItemWrapper>
                    )}
                </Column>
            ) : null}
        </DisplayOnScreen>
    );
}
