import { AuthGuard } from '@components/authentication/auth-guard';
import { MainLayout } from '@components/common/layouts/main-layout';
import { usePlaylistSingleQuery } from 'src/react-query/playlist';
import { TRLabel } from '@components/common/labels/label';
import { Column, Row } from '@components/common/flex';
import Image from 'next/image';
import { useTracksRouter } from '@hooks/use-tracks-router';
import { doEither, sendToNative, useListenNativeEvent } from '@utils/native';
import { LISTEN_EVENT, NATIVE_EVENT } from '@constants/native-event';
import { ChevronLeft } from '@mui/icons-material';
import { useTheme } from '@emotion/react';
import { useState } from 'react';
import { convertTimeFormat } from '@utils/string';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import { useEffectOnce } from 'react-use';
import { SECOND } from '@constants/common';
const OnPlaylistDetail = () => {
    const router = useTracksRouter();
    const { data, isError, isLoading } = usePlaylistSingleQuery(+router.query.id);
    const { palette } = useTheme();
    const [nowSongId, setNowSongId] = useState(null);

    const handlePlaylistClick = (idTrack: number) => () => {
        if (nowSongId === idTrack) return;
        sendToNative({ name: NATIVE_EVENT.SEND_SONG_PLAY, params: { idTrack } });
    };

    const handleBack = () => {
        doEither(
            () => console.log('it works on mobile'),
            () => {
                sendToNative({ name: NATIVE_EVENT.BACK_TO_PLAYER });
            }
        );
    };

    useEffectOnce(() => {
        sendToNative({ name: NATIVE_EVENT.REQUEST_CURRENT_SONG_INFO });
    });

    useListenNativeEvent(({ data }) => {
        switch (data.type) {
            case LISTEN_EVENT.SEND_INFO_CURRENT_SONG: {
                setNowSongId(data.params.idTrack);
                return;
            }
            default: {
                return;
            }
        }
    });

    if (isError || isLoading) {
        return <></>;
    }

    return (
        <Column justifyContent="flex-start" gap={1} sx={{ overflowY: 'auto' }}>
            <Row sx={{ position: 'relative', mx: 3 }} alignSelf="stretch" justifyContent="center">
                <ChevronLeft style={{ color: 'white', position: 'absolute', left: 0 }} onClick={handleBack} />
                <TRLabel weight="bold" sizing="ml">
                    {data?.playlistName}
                </TRLabel>
            </Row>

            {data.playlistDetail.map((item) => (
                <Row
                    alignSelf="stretch"
                    justifyContent="flex-start"
                    sx={{
                        py: 2,
                        px: 3,
                        backgroundColor: nowSongId === item.id ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                    }}
                    onClick={handlePlaylistClick(item.id)}
                    key={item.id}
                    gap={1}
                >
                    {nowSongId === item.id ? (
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                position: 'relative',
                            }}
                        >
                            <Image alt="" src={data.playlistImg} width={40} height={40} />
                            <PauseRoundedIcon
                                sx={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                }}
                                htmlColor="white"
                            />
                        </div>
                    ) : (
                        <Image alt="" src={data.playlistImg} width={40} height={40} />
                    )}

                    <Column alignItems="flex-start">
                        <TRLabel weight="bold" sizing="sm">
                            {item.song.name}
                        </TRLabel>
                        <Row>
                            <TRLabel sizing="xs" color={palette.text.secondary}>
                                {item.song?.artists.map((artist) => artist.artistInfo.name).join(',')}
                            </TRLabel>
                            <TRLabel sizing="xs" color={palette.text.secondary}>
                                ·
                            </TRLabel>
                            <TRLabel sizing="xs" color={palette.text.secondary}>
                                {convertTimeFormat(item.song.playTime * SECOND, 'mm:ss')}
                            </TRLabel>
                        </Row>
                    </Column>
                </Row>
            ))}
        </Column>
    );
};

OnPlaylistDetail.getLayout = (page: React.ReactElement) => (
    <AuthGuard>
        <MainLayout maxWidth="md">{page}</MainLayout>
    </AuthGuard>
);

export default OnPlaylistDetail;
