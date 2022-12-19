import React, { MouseEvent, useEffect, useState } from 'react';
import { Column, Row } from '@components/common/flex';
import { Modal } from '@components/common/modals/modal';
import { MODAL_ID } from '@constants/common';
import Image from 'next/image';
import { useModalDispatch, useModalState } from 'src/recoil/modal';
import { useRouter } from 'next/router';
import {
    useHeadphoneSingleQuery,
    useHeadphoneCalculateChargeBattery,
    useHeadphoneChargeBattery,
} from 'src/react-query/inventory';
import { useMessageDispatch } from 'src/recoil/message';
import { TRButton } from '@components/common/buttons/button';
import { TRSlider } from '@components/common/inputs/slider';
import { TRLabel } from '@components/common/labels/label';
import { useTheme } from '@emotion/react';
import { Close } from '@mui/icons-material';
import { useUnmount } from 'react-use';
import { sendToNative } from '@utils/native';
import { NATIVE_EVENT } from '@constants/native-event';
import { Headphone } from '@models/headphone/headphone';

const ModalChargeContent = () => {
    const { close } = useModalDispatch();
    const { data: headphone } = useModalState<Headphone>(MODAL_ID.CHARGE_MODAL);
    const [chargedCost, setChargedCost] = useState(0);
    const { chargeBatteryCost } = useHeadphoneCalculateChargeBattery(headphone);
    const [chargedBattery, setChargedBattery] = useState(0);
    const { mutate } = useHeadphoneChargeBattery();
    const { message } = useMessageDispatch();

    const { palette } = useTheme();

    const handleAmountOfChargeBattery = (e, value) => {
        let _battery = value;
        if (value < headphone.battery) {
            _battery = headphone.battery;
        }
        if (headphone.battery > 100) {
            _battery = 100;
        }
        setChargedBattery(_battery);
        setChargedCost(
            (chargeBatteryCost.costs[0].requiredCost / (100 - headphone.battery)) * (_battery - headphone.battery)
        );
    };

    const handleChargeBattery = () => {
        const amountCharging = chargedBattery - Number(headphone.battery);
        mutate(
            { headphoneId: headphone.id, chargingAmount: amountCharging },
            {
                onSuccess: () => {
                    sendToNative({
                        name: NATIVE_EVENT.CHARGE_HEADPHONE,
                        params: { headphoneID: headphone.id, energy: chargedBattery },
                    });
                    close(MODAL_ID.CHARGE_MODAL);
                },
                onError: (error) => {
                    message.warning(error);
                },
            }
        );
    };

    useEffect(() => {
        if (headphone?.id) {
            setChargedBattery(headphone.battery);
        }
    }, [headphone?.id]);

    useUnmount(() => {
        setChargedBattery(0);
        setChargedCost(0);
    });

    return chargeBatteryCost?.costs ? (
        <Column gap={2} style={{ marginTop: 24, overflowX: 'hidden' }}>
            <Image src={headphone.imgUrl} alt="" width={132} height={132} />
            <Column gap={1} width="100%" style={{ padding: '0px' }}>
                <TRLabel style={{ marginTop: 12 }} color={palette.text.secondary} sizing="sm">
                    Battery: {chargedBattery}/100
                </TRLabel>
                <TRSlider
                    onChange={handleAmountOfChargeBattery}
                    aria-label="Temperature"
                    defaultValue={headphone.battery}
                    value={chargedBattery}
                    max={100}
                    valueLabelDisplay="auto"
                />
            </Column>
            <Row alignSelf="stretch" justifyContent="space-between">
                <TRLabel>Cost</TRLabel>
                <TRLabel weight="bold">
                    {chargedCost.toFixed(2)}
                    <TRLabel style={{ marginLeft: 8 }}>{chargeBatteryCost?.costs[0].tokenSymbol}</TRLabel>
                </TRLabel>
            </Row>
            <Row style={{ width: '100%' }}>
                <TRButton style={{ width: '100%' }} onClick={handleChargeBattery}>
                    Confirm
                </TRButton>
            </Row>
        </Column>
    ) : null;
};

export function ModalCharge() {
    const { close } = useModalDispatch();
    const { visible } = useModalState(MODAL_ID.CHARGE_MODAL);

    const handleModalClose = () => {
        close(MODAL_ID.CHARGE_MODAL);
    };

    return (
        <Modal asTitle="Charge" modalID={MODAL_ID.CHARGE_MODAL} asCloseIcon={<Close />} onClose={handleModalClose}>
            {visible ? <ModalChargeContent /> : null}
        </Modal>
    );
}
