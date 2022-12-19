import { SCREEN_ID } from '@constants/common';
import Image from 'next/image';
import { useScreenDispatch, useScreenState } from 'src/recoil/screen';
import { Column } from '../flex';
import { DisplayOnScreen } from './display-on-screen';
import { motion, Variants } from 'framer-motion';
import { useState } from 'react';
import { HeadphoneBox } from '@models/headphone-box/headphone-box';
import { TRButton } from '../buttons/button';
import { IconCircle } from '../icon-circle';
import { Headphone } from '@models/headphone/headphone';
import { AttributePoint } from '../attribute-point';
import { TRLabel } from '../labels/label';
import { useTheme } from '@emotion/react';
import { convertToCapitalization } from '@utils/utilities';

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

export function ScreenHeadphoneBox() {
    const { visible, data } = useScreenState<{ box: HeadphoneBox; headphone: Headphone }>(SCREEN_ID.HEADPHONE_BOX);
    const { close } = useScreenDispatch();
    const [isAnimationEnd, setIsAnimationEnd] = useState(false);
    const { clesson, palette } = useTheme();
    const handleAnimationEnd = () => {
        setIsAnimationEnd(true);
    };

    const handleConfirmClick = () => {
        setIsAnimationEnd(false);
        close();
    };

    return (
        <DisplayOnScreen screenID={SCREEN_ID.HEADPHONE_BOX}>
            {visible && data !== null ? (
                <Column gap={2}>
                    {!isAnimationEnd ? (
                        <motion.div
                            key="opening"
                            onAnimationComplete={handleAnimationEnd}
                            variants={variants}
                            animate="open"
                        >
                            <IconCircle
                                size={130}
                                asIcon={<Image quality={100} src={data.box.imgUrl} width={130} height={130} alt="" />}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="opened"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '24px',
                            }}
                            initial={{ opacity: 0, filter: 'blur(3px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            transition={{ ease: 'easeInOut' }}
                        >
                            <Column gap={2}>
                                <Image src={data.headphone.imgUrl} width={180} height={180} alt="" />
                                <TRLabel sizing="sm" weight="bold" color={clesson.quality[data.headphone.quality]}>
                                    {convertToCapitalization(data.headphone.quality)} Headphone
                                </TRLabel>
                                <TRLabel weight="bold" sizing="xs" color={palette.text.secondary}>
                                    {data.headphone.id}
                                </TRLabel>
                            </Column>
                            <AttributePoint basePoints={data.headphone.points.base} />
                            <TRButton onClick={handleConfirmClick} variant="text">
                                Confirm
                            </TRButton>
                        </motion.div>
                    )}
                </Column>
            ) : null}
        </DisplayOnScreen>
    );
}
