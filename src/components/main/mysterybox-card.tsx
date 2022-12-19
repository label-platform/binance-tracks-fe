import { TRBadge } from '@components/common/badge';
import { Column, Row } from '@components/common/flex';
import { TRLabel } from '@components/common/labels/label';
import { MysteryBox } from '@models/mystery-box/mystery-box';
import Image from 'next/image';
import TimerRoundedIcon from '@mui/icons-material/TimerRounded';
import { useTheme } from '@emotion/react';

interface Props {
    item: MysteryBox | null;
    onClick: () => void;
}

export function MysteryboxCard(props: Props) {
    const { item, onClick, ...rest } = props;
    const { palette } = useTheme();

    return (
        <TRBadge
            {...rest}
            asRoot={
                <Row
                    sx={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '6px',
                        background:
                            'linear-gradient(0deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12)), #000000',
                        '& > span': {
                            position: 'absolute',
                        },
                    }}
                    onClick={onClick}
                >
                    {item !== null ? (
                        <>
                            <Image
                                src="/images/mystery-box/content.png"
                                width={62}
                                height={62}
                                alt=""
                                layout="fixed"
                                style={{ opacity: 0.8 }}
                            />
                            {item.isCanBeOpened ? null : (
                                <TRLabel style={{ textAlign: 'center', lineHeight: '10px' }} sizing="xxs">
                                    <TimerRoundedIcon sx={{ fontSize: '10px' }} />
                                    {item.remainLeftTimeToOpen}
                                </TRLabel>
                            )}
                        </>
                    ) : (
                        <>
                            <Image
                                src="/images/mystery-box/content.png"
                                width={62}
                                height={62}
                                alt=""
                                layout="fixed"
                                style={{ mixBlendMode: 'luminosity' }}
                            />
                            <TRLabel style={{ textAlign: 'center' }} sizing="xxs" color={palette.text.secondary}>
                                Empty
                            </TRLabel>
                        </>
                    )}
                </Row>
            }
        >
            {item !== null ? (
                <TRBadge.Item
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizon: 'center',
                    }}
                >
                    <Column
                        sx={{
                            width: '45px',
                            height: '28px',
                            border: `1px solid ${palette.primary.light}`,
                            backgroundColor: palette.primary.dark,
                            borderRadius: '6px',
                            letterSpacing: '-0.3px',
                            padding: '4px',
                            lineHeight: '7px',
                        }}
                    >
                        {item.isCanBeOpened ? (
                            <TRLabel
                                color={palette.primary.light}
                                weight="bold"
                                sizing="xxs"
                                style={{ whiteSpace: 'nowrap', transform: 'scale(0.7)' }}
                            >
                                Open
                            </TRLabel>
                        ) : (
                            <>
                                <TRLabel
                                    color={palette.primary.light}
                                    weight="bold"
                                    sizing="xxs"
                                    style={{ whiteSpace: 'nowrap', transform: 'scale(0.7)' }}
                                >
                                    Open Now
                                </TRLabel>
                            </>
                        )}
                    </Column>
                </TRBadge.Item>
            ) : (
                <></>
            )}
        </TRBadge>
    );
}
