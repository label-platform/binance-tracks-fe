import { AuthGuard } from '@components/authentication/auth-guard';
import { MainLayout } from '@components/common/layouts/main-layout';
import { usePlaylistSingleQuery } from 'src/react-query/playlist';
import { TRLabel } from '@components/common/labels/label';
import { Column, Row } from '@components/common/flex';
import Image from 'next/image';
import { useTracksRouter } from '@hooks/use-tracks-router';
import { PlayerIcon } from '@icons/index';
import { TRIconButton } from '@components/common/buttons/icon-button';
import { doEither, sendToNative } from '@utils/native';
import { NATIVE_EVENT } from '@constants/native-event';
import { ChevronLeft } from '@mui/icons-material';
import { Skeleton } from '@mui/material';
import { useTheme } from '@emotion/react';
import { convertTimeFormat } from '@utils/string';
import { SECOND } from '@constants/common';

const PlaylistDetail = () => {
    const router = useTracksRouter();
    const { palette } = useTheme();
    const { data, isError, isLoading } = usePlaylistSingleQuery(+router.query.id);

    const handleBack = () => {
        router.back();
    };

    const handleCardClick = () => {
        doEither(
            () => console.log('it works on mobile'),
            () => sendToNative({ name: NATIVE_EVENT.GO_TO_PLAY, params: data })
        );
    };
    const handlePlaylistClick = (idTrack: number) => () => {
        sendToNative({ name: NATIVE_EVENT.SEND_SONG_PLAY, params: { idTrack } });
    };

    if (isLoading) {
        return (
            <Column gap={1} style={{ paddingBottom: '70px' }}>
                <Row alignSelf="stretch" justifyContent="center" style={{ paddingBottom: '20px', lineHeight: '100%' }}>
                    <Skeleton width={120} height={20} variant="rounded" />
                </Row>
                <Skeleton
                    width={220}
                    height={220}
                    style={{
                        borderRadius: '6px',
                        alignItems: 'center',
                    }}
                    variant="rectangular"
                />
                <Row alignSelf="stretch" justifyContent="space-between" style={{ padding: '21px 0 21px 0' }}>
                    <Column style={{ alignItems: 'flex-start' }}>
                        <Skeleton width={120} height={40} variant="rounded" style={{ paddingBottom: '2px' }} />
                        <Row>
                            <Skeleton width={120} height={10} variant="rounded" />
                        </Row>
                    </Column>
                    <Skeleton width={40} height={40} variant="circular" />
                </Row>
                {[1, 2, 3, 4].map((item) => (
                    <Row alignSelf="stretch" justifyContent="space-between" key={item}>
                        <Column style={{ alignItems: 'flex-start' }}>
                            <Skeleton
                                width={130}
                                height={40}
                                style={{
                                    borderRadius: '6px',
                                }}
                                variant="rectangular"
                            />
                            <Row>
                                <Skeleton
                                    width={150}
                                    height={15}
                                    style={{
                                        borderRadius: '6px',
                                        marginTop: '5px',
                                    }}
                                    variant="rectangular"
                                />
                            </Row>
                        </Column>
                    </Row>
                ))}
            </Column>
        );
    }

    return (
        <Column justifyContent="flex-start" gap={1} sx={{ overflowY: 'auto' }}>
            <Row
                alignSelf="stretch"
                justifyContent="space-between"
                style={{ paddingBottom: '20px', lineHeight: '100%' }}
            >
                <ChevronLeft style={{ color: 'white' }} onClick={handleBack} />
                <TRLabel sizing="ml">{data?.playlistName}</TRLabel>
                <ChevronLeft style={{ color: 'rgb(18, 18, 18)' }} />
            </Row>
            <Column style={{ height: '220px' }}>
                <Image alt="" src={data?.playlistImg} width={220} height={220} />
            </Column>
            <Column alignSelf="stretch" gap={2} alignItems="flex-start">
                <Row>
                    <TRLabel sizing="sm" color={palette.text.secondary}>
                        {data?.description}
                    </TRLabel>
                </Row>
                <Row alignSelf="stretch" justifyContent="space-between">
                    <TRLabel weight="bold">{data?.name}</TRLabel>
                </Row>
            </Column>
            <Row alignSelf="stretch" justifyContent="space-between" style={{ padding: '21px 0 21px 0' }}>
                <Column style={{ alignItems: 'flex-start' }}>
                    <TRLabel sizing="lg" style={{ maxWidth: '200px', wordBreak: 'break-word' }}>
                        {data?.playlistName}
                    </TRLabel>
                    <Row>
                        <TRLabel sizing="xs" color={palette.text.secondary}>
                            {data?.totalSongsCount} songs
                        </TRLabel>
                        <TRLabel sizing="xs" color={palette.text.secondary}>
                            ·
                        </TRLabel>
                        <TRLabel sizing="xs" color={palette.text.secondary}>
                            {convertTimeFormat(data?.totalPlayTime * SECOND, 'hh [hours] mm [mins] ss [secs]')}
                        </TRLabel>
                    </Row>
                </Column>

                <TRIconButton
                    onClick={handleCardClick}
                    asIcon={<PlayerIcon />}
                    variant="filled"
                    color="#ffffff58"
                    sx={{ width: 48, height: 48 }}
                />
            </Row>
            {data?.playlistDetail.map((item) => (
                <Row
                    alignSelf="stretch"
                    justifyContent="space-between"
                    style={{ padding: '18px 0 18px 0' }}
                    key={item.song.id}
                >
                    <Column onClick={handlePlaylistClick(item.song.id)} style={{ alignItems: 'flex-start' }}>
                        <TRLabel color={palette.text.primary} style={{ maxWidth: '200px', wordBreak: 'break-word' }}>
                            {item.song.name}
                        </TRLabel>
                        <Row>
                            {item.song?.artists.map((artist) => (
                                <TRLabel
                                    key={item.song.id}
                                    sizing="xs"
                                    color={palette.text.secondary}
                                    style={{ maxWidth: '190px', wordBreak: 'break-word' }}
                                >
                                    {artist.artistInfo.name}
                                </TRLabel>
                            ))}
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

PlaylistDetail.getLayout = (page: React.ReactElement) => (
    <AuthGuard>
        <MainLayout>{page}</MainLayout>
    </AuthGuard>
);

export default PlaylistDetail;
