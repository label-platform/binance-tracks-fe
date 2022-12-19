import { AuthGuard } from '@components/authentication/auth-guard';
import { MainLayout } from '@components/common/layouts/main-layout';
import { ContainerPullToRefresh } from '@components/common/pullToRefresh';
import { useCategoryPlaylistSingleQuery } from 'src/react-query/categoryPlaylist';
import { TRLabel } from '@components/common/labels/label';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import { Column, Row } from '@components/common/flex';
import Image from 'next/image';
import { useTracksRouter } from '@hooks/use-tracks-router';
import { Skeleton } from '@mui/material';
import { useTheme } from '@emotion/react';

const CategoryPlaylistDetail = () => {
    const router = useTracksRouter();
    const { palette } = useTheme();
    const { data, isError, isLoading } = useCategoryPlaylistSingleQuery(+router.query.categoryId);

    const handleBack = () => {
        router.back();
    };

    const handlePlaylistCardClick = (categoryID: string, playlistID: string) => () => {
        router.push(`/playlist/${categoryID}/${playlistID}`);
    };

    if (isLoading) {
        return (
            <Column gap={1} style={{ paddingBottom: '70px' }}>
                <Row alignSelf="stretch" justifyContent="space-between">
                    <ChevronLeft style={{ color: 'rgb(18, 18, 18)' }} />
                    <Skeleton
                        width={120}
                        height={20}
                        style={{
                            borderRadius: '6px',
                        }}
                        variant="rectangular"
                    />
                    <ChevronLeft style={{ color: 'rgb(18, 18, 18)' }} />
                </Row>
                {[1, 2, 3, 4].map((items) => (
                    <Row alignSelf="stretch" style={{ padding: '18px 0 18px 0' }} key={items}>
                        <Column style={{ alignItems: 'flex-start' }}>
                            <Skeleton
                                width={320}
                                height={320}
                                style={{
                                    borderRadius: '6px',
                                }}
                                variant="rectangular"
                            />
                            <Skeleton
                                width={120}
                                height={20}
                                style={{
                                    borderRadius: '6px',
                                    marginTop: '5px',
                                }}
                                variant="rectangular"
                            />
                        </Column>
                    </Row>
                ))}
            </Column>
        );
    }

    return (
        <Column justifyContent="flex-start" gap={1} sx={{ overflowY: 'auto' }}>
            <Row alignSelf="stretch" justifyContent="space-between">
                <ChevronLeft style={{ color: 'white' }} onClick={handleBack} />
                <TRLabel weight="bold" sizing="ml">
                    {data?.categoryName}
                </TRLabel>
                <ChevronLeft style={{ color: palette.dark.main }} />
            </Row>
            {data?.playlistCategoryDetails.map((items) => (
                <Row alignSelf="stretch" key={items.id} style={{ paddingTop: '20px' }}>
                    <Column
                        onClick={handlePlaylistCardClick(data.id, items.playlist.id)}
                        style={{
                            alignItems: 'flex-start',
                        }}
                    >
                        <Image
                            alt=""
                            src={items.playlist.playlistImg}
                            width={320}
                            height={320}
                            style={{
                                borderRadius: '6px',
                                paddingBottom: '8px',
                            }}
                        />
                        <TRLabel
                            style={{
                                paddingTop: '8px',
                            }}
                        >
                            {items.playlist.playlistName}
                        </TRLabel>
                    </Column>
                </Row>
            ))}
        </Column>
    );
};

CategoryPlaylistDetail.getLayout = (page: React.ReactElement) => (
    <AuthGuard>
        <MainLayout>{page}</MainLayout>
    </AuthGuard>
);

export default CategoryPlaylistDetail;
