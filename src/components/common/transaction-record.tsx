import react from 'react';
import styled from '@emotion/styled';
import { Column, Row } from '@components/common/flex/index';
import { TRLabel } from './labels/label';
import { useUserSelfInfoQuery } from 'src/react-query/user';
const RecordBox = styled(Row)`
    width: 100%;
    height: 76px;
    border: 1px solid ${(props) => props.theme.palette.text.primary};
    border-radius: 6px;
    padding: 15px 12px;
    &:last-child {
        margin-bottom: 90px;
    }
    .Row {
        height: 21px;
        width: 100%;
        justify-content: space-between;
        font-size: 14px;
        .state {
            font-family: 'Gilroy-bold';
            color: ${(props) => props.theme.palette.text.primary};
        }
        .content {
            font-family: 'Gilroy-bold';
            color: ${(props) => props.theme.palette.success.main};
        }
        .minusContent {
            font-family: 'Gilroy-bold';
            color: ${(props) => props.theme.palette.error.main};
        }
        .date {
            font-family: 'Gilroy';
            color: ${(props) => props.theme.palette.text.secondary};
            font-size: 12px;
        }
        .walletAddress {
            font-family: 'Gilroy';
            color: ${(props) => props.theme.palette.text.secondary};
            font-size: 12px;
        }
    }
`;
interface Props {
    state: string;
    amountOfCoin: string;
    date: string;
    walletAddress: string;
    tokenAddress: string;
    isPending?: boolean;
    category?: 'DEPOSIT' | 'WITHDRAW';
}
const TokenSymbol = {
    '0x0000000000000000000000000000000000000000': 'BNB',
    '0x4c17dbc1f2406886b63c463585226a8f04cec27e': 'BLB',
    '0xd375fdaba3dba88c160a278d01c68ddc8f46d549': 'LBL',
    '0xfa067668f4ef5588a7a66d213ad2c5e376b04b16': 'HEADPHONE',
    '0x847b500692268587d7db3793f88e07ff52849376': 'HEADPHONEBOX',
};
export const TransactionRecord = (props: Props) => {
    const { state, amountOfCoin, date, walletAddress, isPending, tokenAddress, category } = props;
    const dateFormat = new Date(date).toUTCString();

    return (
        <RecordBox>
            {isPending ? (
                <Column gap="4px" style={{ width: '100%' }}>
                    <Row className="Row">
                        <div className="state">{state}</div>
                        <div className={category === 'DEPOSIT' ? 'content' : 'minusContent'}>
                            {!amountOfCoin
                                ? 'NFT'
                                : category === 'DEPOSIT'
                                ? `+ ${amountOfCoin} ${TokenSymbol[tokenAddress]}`
                                : `- ${amountOfCoin} ${TokenSymbol[tokenAddress]}`}
                        </div>
                    </Row>
                    <Row className="Row">
                        <div className="date">{dateFormat}</div>
                    </Row>
                </Column>
            ) : (
                <Column gap="4px" style={{ width: '100%' }}>
                    <Row className="Row">
                        <div className="state">{state}</div>
                        <div className={category === 'DEPOSIT' ? 'content' : 'minusContent'}>
                            {!amountOfCoin
                                ? 'NFT'
                                : category === 'DEPOSIT'
                                ? `+ ${amountOfCoin} ${TokenSymbol[tokenAddress]}`
                                : `- ${amountOfCoin} ${TokenSymbol[tokenAddress]}`}
                        </div>
                    </Row>
                    <Row className="Row">
                        <div className="date">{dateFormat}</div>
                        <div className="walletAddress">
                            {walletAddress.slice(0, 7)}...{walletAddress.slice(-7)}
                        </div>
                    </Row>
                </Column>
            )}
        </RecordBox>
    );
};
