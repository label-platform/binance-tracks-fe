import { useTheme } from '@emotion/react';
import { AnimatePresence, motion } from 'framer-motion';
import CachedIcon from '@mui/icons-material/Cached';
interface Props {
    isOpen: boolean;
    isStart: boolean;
    percent: number;
}

const variants = {
    open: (percent: number) => ({
        opacity: 1 * percent,
    }),
    start: {},
};

export function MotionRefresh(props: Props) {
    const { isOpen, isStart, percent } = props;
    const height = 50 * percent;
    const { palette } = useTheme();
    return (
        <AnimatePresence>
            {isOpen ? (
                <motion.div
                    animate="open"
                    custom={percent}
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 0, minHeight: 0 }}
                    style={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        minHeight: `${height}px`,
                        transition: 'min-height 0s linear',
                        background: `linear-gradient(0deg, rgba(18, 18, 18, 0.8), rgba(18, 18, 18, 0.8)), linear-gradient(180deg, #121212 0%, ${palette.primary.main} 49.48%, #121212 100%)`,
                    }}
                    transition={{ ease: 'linear' }}
                    variants={variants}
                >
                    {isStart ? (
                        <motion.span
                            animate={{
                                rotate: 360,
                            }}
                            transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
                        >
                            <CachedIcon htmlColor={palette.light.main} />
                        </motion.span>
                    ) : null}
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}
