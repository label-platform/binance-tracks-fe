import { Column, Row } from '@components/common/flex';
import { Modal } from '@components/common/modals/modal';
import { MODAL_ID } from '@constants/common';
import { Button } from '@mui/material';
import 'swiper/css';
import 'swiper/css/pagination';

import { useModalDispatch } from 'src/recoil/modal';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { useMintHeadphoneDispatch } from 'src/recoil/headphone';
import { Headphone } from '@models/headphone/headphone';
import { useState } from 'react';
import { useHeadphoneListQuery } from 'src/react-query/inventory';

const HeadPhonesInfoBox = styled(Column)`
    border: 1px solid ${(props) => props.theme.clesson.grey};
    border-radius: 3px;
    & > div {
        height: 40px;
        align-self: stretch;
        & > div {
            flex: 1;
            height: 100%;
        }
    }
`;
const ActiveColor = styled(Row)`
    border: 5px solid pink;
    border-radius: 100%;
`;

export function ModalMint() {
    const { query } = useRouter();
    const { close } = useModalDispatch();
    const [mintHeadPhone, setMintHeadPhone] = useState<Headphone>(null);
    const { set, clear } = useMintHeadphoneDispatch();

    const _headphones = useHeadphoneListQuery({}, true);

    const handleModalClose = () => {
        clear();
        close(MODAL_ID.MINT_MODAL);
    };

    const handleModalConfirmClick = () => {
        close(MODAL_ID.MINT_MODAL);
        if (!mintHeadPhone) return;
        set(mintHeadPhone);
    };

    const handleHeadPhoneClick = (headPhone: Headphone) => {
        setMintHeadPhone(headPhone);
    };

    const headphones = _headphones.data || [];

    return (
        <Modal
            asTitle={<Row>MATCHING HEADPHONES</Row>}
            modalID={MODAL_ID.MINT_MODAL}
            asFooter={
                <Row>
                    <Button onClick={handleModalClose} sx={{ backgroundColor: 'white' }}>
                        CANCEL
                    </Button>
                    <Button onClick={handleModalConfirmClick} color="primary">
                        CONFIRM
                    </Button>
                </Row>
            }
        >
            <Column style={{ width: '350px' }}>
                <Row style={{ height: '140px', width: '100%' }}>
                    <Swiper slidesPerView={3} spaceBetween={10} className="mySwiper" centeredSlides>
                        {headphones
                            .filter((headphone) => headphone.id !== query.id && headphone.level >= 5)
                            .map((headphone) => (
                                <SwiperSlide key={headphone.id}>
                                    {headphone.id === mintHeadPhone?.id ? (
                                        <ActiveColor>
                                            <Image
                                                onClick={() => handleHeadPhoneClick(headphone)}
                                                src={headphone.imgUrl}
                                                alt=""
                                                width={100}
                                                height={100}
                                            />
                                        </ActiveColor>
                                    ) : (
                                        <Image
                                            onClick={() => handleHeadPhoneClick(headphone)}
                                            src={headphone.imgUrl}
                                            alt=""
                                            width={100}
                                            height={100}
                                        />
                                    )}
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </Row>
            </Column>
            <HeadPhonesInfoBox></HeadPhonesInfoBox>
        </Modal>
    );
}
