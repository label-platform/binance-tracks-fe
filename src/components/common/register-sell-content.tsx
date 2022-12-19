import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Column, Row } from './flex';
import { InputWithAdorments } from './inputs/input-with-adorments';

interface Props {
    setPrice: (price: number) => void;
    beforePrice?: number;
}

export function RegisterSellContent(props: Props) {
    const { setPrice, beforePrice } = props;
    const { register, watch } = useForm({
        defaultValues: {
            price: beforePrice ? beforePrice : 0,
        },
    });
    useEffect(() => {
        const subscription = watch(({ price }) => {
            setPrice(price);
        });
        return () => subscription.unsubscribe();
    }, [watch]);
    return (
        <Column style={{ width: '100%' }} gap={1}>
            <Row style={{ width: '100%' }} justifyContent="flex-start">
                Selling Price
            </Row>
            <Row style={{ width: '100%' }} justifyContent="flex-start">
                <InputWithAdorments type="number" style={{ width: '100%' }} {...register('price')} asEnd={<b>BNB</b>} />
            </Row>
        </Column>
    );
}
