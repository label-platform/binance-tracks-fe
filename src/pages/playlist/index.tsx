import { AuthGuard } from '@components/authentication/auth-guard';
import { MainLayout } from '@components/common/layouts/main-layout';
import { useCategoryPlaylistQuery } from 'src/react-query/categoryPlaylist';
import { TRLabel } from '@components/common/labels/label';
import { Column, Row } from '@components/common/flex';
import { Stack } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import { useTheme } from '@emotion/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from 'next/image';
import { useTracksRouter } from '@hooks/use-tracks-router';
import { Skeleton } from '@mui/material';

const Playlist = () => {
    const { palette } = useTheme();
    const { data, isError, isLoading } = useCategoryPlaylistQuery();
    const router = useTracksRouter();
    const banner = [1, 2, 3];

    const handleCardClick = (playlistID: string, categoryPlaylistID: string) => () => {
        router.push(`/playlist/${categoryPlaylistID}/${playlistID}`);
    };

    const handleCategoryMenuClick = (categoryPlaylistID: string) => () => {
        router.push(`/playlist/${categoryPlaylistID}`);
    };

    if (isError || isLoading) {
        return (
            <Column style={{ paddingBottom: '60px' }}>
                <Swiper
                    slidesPerView={banner.length > 1 ? 1.1 : 1}
                    centeredSlides={false}
                    spaceBetween={0}
                    grabCursor={true}
                    modules={[Pagination]}
                    className="mySwiper"
                    style={{ paddingBottom: '28px', width: '360px' }}
                >
                    {banner.map((item) => (
                        <SwiperSlide
                            style={{
                                backgroundColor: palette.dark.main,
                                justifyContent: 'flex-start',
                                borderRadius: '6px',
                            }}
                            key={item}
                        >
                            <Skeleton
                                width={312}
                                height={200}
                                style={{
                                    borderRadius: '6px',
                                }}
                                variant="rectangular"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                {[1, 2, 3].map((item) => (
                    <Column
                        sx={{ paddingBottom: 3 }}
                        gap={2}
                        key={item}
                        style={{ width: '360px' }}
                        alignItems="flex-start"
                    >
                        <Row alignSelf="stretch" justifyContent="space-between">
                            <Skeleton
                                width={120}
                                height={20}
                                style={{
                                    borderRadius: '6px',
                                }}
                                variant="rectangular"
                            />
                        </Row>

                        <Row style={{ position: 'relative', width: '100%' }}>
                            <Swiper
                                slidesPerView={2.2}
                                // centeredSlides={true}
                                centeredSlides={false}
                                spaceBetween={8}
                                grabCursor={true}
                                modules={[Pagination]}
                                className="mySwiper"
                            >
                                {[1, 2, 3].map((detailItem) => (
                                    <SwiperSlide
                                        style={{
                                            backgroundColor: palette.dark.main,
                                            justifyContent: 'flex-start',
                                        }}
                                        key={detailItem}
                                    >
                                        <Column style={{ alignItems: 'flex-start' }}>
                                            <Skeleton
                                                width={152}
                                                height={152}
                                                style={{
                                                    borderRadius: '6px',
                                                }}
                                                variant="rectangular"
                                            />
                                            <Skeleton
                                                width={130}
                                                height={10}
                                                style={{
                                                    borderRadius: '6px',
                                                    marginTop: '5px',
                                                }}
                                                variant="rectangular"
                                            />
                                        </Column>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </Row>
                    </Column>
                ))}
            </Column>
        );
    }

    return (
        <Column justifyContent="flex-start" sx={{ pt: 1, pb: 4, overflowY: 'auto', height: '100%' }}>
            <Row sx={{ pb: 4, width: '100%' }}>
                <Swiper
                    slidesPerView={banner.length > 1 ? 1.1 : 1}
                    centeredSlides={false}
                    grabCursor={true}
                    modules={[Pagination]}
                    className="mySwiper"
                    spaceBetween={8}
                >
                    {banner.map((item) => (
                        <SwiperSlide
                            style={{
                                backgroundColor: palette.dark.main,
                                justifyContent: 'flex-start',
                                borderRadius: '6px',
                            }}
                            key={item}
                        >
                            <Column sx={{ width: 312, height: 180, borderRadius: 6, bgcolor: 'primary.main' }}>
                                <TRLabel weight="bold">Coming Soon!</TRLabel>
                            </Column>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Row>
            {data.map((item) => (
                <Column sx={{ paddingBottom: 3, width: '100%' }} gap={2} key={item.id} alignItems="flex-start">
                    <Row alignSelf="stretch" justifyContent="space-between">
                        <TRLabel sizing="ml" weight="bold" style={{ lineHeight: '110%', color: palette.light.main }}>
                            {item.categoryName}
                        </TRLabel>
                        <TRLabel onClick={handleCategoryMenuClick(item.id)} sizing="ml" weight="bold">
                            <Image alt="" src="/images/icons/left-arrow.png" width={16} height={16} />
                        </TRLabel>
                    </Row>

                    <Stack style={{ position: 'relative', width: '100%' }}>
                        <Swiper
                            slidesPerView={item.playlistCategoryDetails.length > 1 ? 2.2 : 1}
                            // centeredSlides={true}
                            centeredSlides={item.playlistCategoryDetails.length > 1 ? false : false}
                            spaceBetween={8}
                            grabCursor={true}
                            modules={[Pagination]}
                            className="mySwiper"
                        >
                            {item.playlistCategoryDetails.map((detailItem) => (
                                <SwiperSlide
                                    style={{
                                        backgroundColor: palette.dark.main,
                                        alignItems: 'flex-start',
                                        justifyContent: 'flex-start',
                                    }}
                                    key={detailItem.id}
                                >
                                    <Column
                                        onClick={handleCardClick(detailItem.playlist.id, item.id)}
                                        style={{ alignItems: 'flex-start' }}
                                    >
                                        <Image
                                            alt=""
                                            src={detailItem.playlist.playlistImg}
                                            width={152}
                                            height={152}
                                            style={{
                                                borderRadius: '6px',
                                            }}
                                        />
                                        <TRLabel
                                            style={{
                                                wordBreak: 'break-word',
                                                paddingTop: '8px',
                                            }}
                                        >
                                            {detailItem.playlist.playlistName}
                                        </TRLabel>
                                    </Column>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Stack>
                </Column>
            ))}
        </Column>
    );
};

Playlist.getLayout = (page: React.ReactElement) => (
    <AuthGuard>
        <MainLayout>{page}</MainLayout>
    </AuthGuard>
);

export default Playlist;
