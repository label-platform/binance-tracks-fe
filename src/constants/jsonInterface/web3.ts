import Web3 from 'web3';
import { ERC20ABI } from './ERC20ABI';
import { ERC721ABI } from './ERC721ABI';
// import { Logger } from '@nestjs/common';
// import { TokenInfos } from '../constants';

let singleWebInstance;

export class TokenInfos {
    public static readonly BNB = {
        address: '0x0000000000000000000000000000000000000000',
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
    };
    public static readonly BUSD = {
        // testnet
        address: '0x19315B3f8F9b75e754e024C39B7e872F367fbaBf',
        name: 'BUSD Token',
        symbol: 'BUSD',
        decimals: '18',
    };
    public static readonly BLB = {
        // testnet, 소문자 변환
        address: '0x4c17dbc1f2406886b63c463585226a8f04cec27e',
        name: 'Beyond listening behavior',
        symbol: 'BLB',
        decimals: '18',
    };
    public static readonly LBL = {
        // testnet, 소문자 변환
        address: '0xd375fdaba3dba88c160a278d01c68ddc8f46d549',
        name: 'Label',
        symbol: 'LBL',
        decimals: '18',
    };
    public static readonly HEADPHONE = {
        // testnet, 소문자 변환
        address: '0xfa067668f4ef5588a7a66d213ad2c5e376b04b16',
        name: 'TRACKS Headphone',
        symbol: 'TH',
        decimals: '18',
    };

    public static readonly HEADPHONEBOX = {
        // testnet, 소문자 변환
        address: '0x847b500692268587d7db3793f88e07ff52849376',
        name: 'TRACKS Headphone Box',
        symbol: 'THB',
        decimals: '18',
    };

    public static readonly PINBALLHEAD = {
        // testnet, 소문자 변환
        address: '0x8f74b37fcaef4434b74bcd8573ed758ce5c184bc',
        name: 'PINBALLHEAD',
        symbol: 'PH',
        decimals: '18',
    };
    public static readonly TREASURY = {
        // testnet
        address: '0x915e17C8da34Cc2fE4734432aAaB68CA12fc30DB',
        name: 'TREASURY',
    };
}

export const getWeb3Instance = (): Web3 => {
    if (!singleWebInstance) {
        singleWebInstance = new Web3(new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_PROVIDER));
    }

    return singleWebInstance;
};

export const getContract = (abi: any, contract: string) => {
    const web3Instance = getWeb3Instance();
    return new web3Instance.eth.Contract(abi, contract);
};

export const getGasPrice = () => {
    const web3Instance = getWeb3Instance();
    return web3Instance.eth.getGasPrice();
};

export const getTokenInformation = async (tokenAddress: string) => {
    if (tokenAddress === TokenInfos.BNB.address) {
        return {
            tokenSymbol: TokenInfos.BNB.symbol,
            tokenDecimals: TokenInfos.BNB.decimals,
        };
    }
    const tokenERC20ContractInstance = getContract(ERC20ABI, tokenAddress);
    const tokenSymbol = await tokenERC20ContractInstance.methods.name().call();
    const tokenDecimals = await tokenERC20ContractInstance.methods.decimals().call();

    return {
        tokenSymbol,
        tokenDecimals,
    };
};

export const estimateGasTransferToken = async (
    fromAddress: string,
    toAddress: string,
    tokenAddress: string,
    amount: string
) => {
    const tokenERC20ContractInstance = getContract(ERC20ABI, tokenAddress);
    const web3Instance = getWeb3Instance();
    const valueTransferred = Web3.utils.toWei(amount, 'ether');

    const gasLimit =
        tokenAddress === TokenInfos.BNB.address
            ? await web3Instance.eth.estimateGas({
                  from: fromAddress,
                  to: toAddress,
                  value: valueTransferred,
              })
            : await tokenERC20ContractInstance.methods
                  .transfer(toAddress, valueTransferred)
                  .estimateGas({ from: fromAddress });

    return Web3.utils.fromWei(String(gasLimit), 'ether');
};

export const estimateGasTransferNft = async (
    fromAddress: string,
    toAddress: string,
    collectionAddress: string,
    tokenId: number
) => {
    const tokenERC721ContractInstance = getContract(ERC721ABI, collectionAddress);
    const gasLimit = await tokenERC721ContractInstance.methods
        .transferFrom(fromAddress, toAddress, tokenId)
        .estimateGas({ from: fromAddress });
    return Web3.utils.fromWei(String(gasLimit), 'ether');
};

export const getOwner = async (collectionAddress: string, tokenId: number) => {
    const tokenERC721ContractInstance = getContract(ERC721ABI, collectionAddress);
    return await tokenERC721ContractInstance.methods.ownerOf(tokenId).call();
};

// export const getTransferNftTransaction = async (
//   fromAddress: string,
//   toAddress: string,
//   collectionAddress: string,
//   tokenId: number
// ) => {
//   const tokenERC721ContractInstance = getContract(ERC721ABI, collectionAddress);
//   const data = await tokenERC721ContractInstance.methods
//     .transferFrom(fromAddress, toAddress, tokenId)
//     .encodeABI();
//   const gas = await tokenERC721ContractInstance.methods
//     .transferFrom(fromAddress, toAddress, tokenId)
//     .estimateGas({ from: fromAddress });
//   const web3Instance = getWeb3Instance();
//   const gasPrice = await web3Instance.eth.getGasPrice();
//   // const nonce = (await web3Instance.eth.getTransactionCount()) + 1;

//   return {
//     from: fromAddress,
//     to: collectionAddress,
//     data,
//     gas,
//     gasPrice,
//     // nonce,
//   };
// };

// export const getSignedTransaction = async (
//   transaction: any,
//   privateKey: string
// ) => {
//   const web3Instance = getWeb3Instance();
//   return await web3Instance.eth.accounts.signTransaction(
//     transaction,
//     privateKey
//   );
// };

// export const sendRawTransaction = async (rawTransaction: string) => {
//   const web3Instance = getWeb3Instance();
//   return await web3Instance.eth.sendSignedTransaction(rawTransaction);
// };

export const sendTransferNftTransaction = async (
    fromAddress: string,
    toAddress: string,
    collectionAddress: string,
    tokenId: number,
    privateKey: string
) => {
    const tokenERC721ContractInstance = getContract(ERC721ABI, collectionAddress);
    const estimateGas = await tokenERC721ContractInstance.methods
        .transferFrom(fromAddress, toAddress, tokenId)
        .estimateGas({ from: fromAddress });

    const web3Instance = getWeb3Instance();
    await web3Instance.eth.accounts.wallet.add(privateKey);
    return await tokenERC721ContractInstance.methods
        .transferFrom(fromAddress, toAddress, tokenId)
        .send({ from: fromAddress, gas: estimateGas });

    // const testEvent = tokenERC721ContractInstance.events
    //   .Transfer(
    //     {
    //       fromBlock: 'latest',
    //     },
    //     (error, event) => {
    //       console.log(event);
    //     }
    //   )
    //   .on('connected', (subscriptionId) => {
    //     console.log(subscriptionId);
    //   })
    //   .on('data', (event) => {
    //     console.log(event);
    //   });

    // tokenERC721ContractInstance
    //   .getPastEvents('Transfer', { fromBlock: 'latest' }, (error, events) => {
    //     console.log(events);
    //   })
    //   .then((events) => {
    //     console.log(events);
    //   });
    // const subscription = web3Instance.eth.subscribe(
    //   'logs',
    //   {
    //     address: collectionAddress,
    //   },
    //   (error, result) => {
    //     if (!error) console.log(result);
    //   }
    // );

    // await new Promise((res) => setTimeout(res, 60000));

    // subscription.unsubscribe((error, success) => {
    //   if (success) console.log('Successfully unsubscribed!');
    // });

    // TODO: 꼬였을 경우에 처리 방안 추가 필요. 아래 예시는 이미 전송이 됐는데 DB 처리가 안된 경우임
    //  error: execution reverted: ERC721: transfer caller is not owner nor approved
    // return txResult;
};

export const mintNftTransaction = async (
    adminAddress: string,
    toAddress: string,
    collectionAddress: string,
    privateKey: string
) => {
    const tokenERC721ContractInstance = getContract(ERC721ABI, collectionAddress);
    const estimateGas = await tokenERC721ContractInstance.methods
        .mint(adminAddress, 1)
        .estimateGas({ from: adminAddress });

    const web3Instance = getWeb3Instance();
    await web3Instance.eth.accounts.wallet.add(privateKey);
    const txResult = await tokenERC721ContractInstance.methods
        .mint(adminAddress, 1)
        .send({ from: adminAddress, gas: estimateGas });

    // TODO: 꼬였을 경우에 처리 방안 추가 필요. 아래 예시는 이미 mint가 됐는데 DB 처리가 안된 경우임
    //  error: execution reverted: ERC721: mint caller is not owner nor approved
    return txResult;
};

export const sendTransferTokenTransaction = async (
    fromAddress: string,
    toAddress: string,
    tokenAddress: string,
    amount: string,
    privateKey: string
) => {
    const web3Instance = getWeb3Instance();
    await web3Instance.eth.accounts.wallet.add(privateKey);
    const valueTransferred = Web3.utils.toWei(amount, 'ether');

    let txResult;
    // BNB의 경우 admin wallet에서 전송
    switch (tokenAddress) {
        case TokenInfos.BNB.address: {
            const gasLimit = await web3Instance.eth.estimateGas({
                from: fromAddress,
                to: toAddress,
                value: valueTransferred,
            });
            txResult = await web3Instance.eth.sendTransaction({
                from: fromAddress,
                to: toAddress,
                value: valueTransferred,
                gas: gasLimit,
            });
            break;
        }

        case TokenInfos.LBL.address: {
            const tokenERC20ContractInstance = getContract(ERC20ABI, tokenAddress);
            const gasLimit = await tokenERC20ContractInstance.methods
                .transfer(toAddress, valueTransferred)
                .estimateGas({ from: fromAddress });
            txResult = await tokenERC20ContractInstance.methods
                .transfer(toAddress, valueTransferred)
                .send({ from: fromAddress, gas: gasLimit });
            break;
        }

        // BLB의 경우 대상 address로 바로 mint
        case TokenInfos.BLB.address: {
            try {
                const tokenERC20ContractInstance = getContract(ERC20ABI, tokenAddress);
                const gasLimit = await tokenERC20ContractInstance.methods
                    .mint(toAddress, valueTransferred)
                    .estimateGas({ from: fromAddress });

                txResult = await tokenERC20ContractInstance.methods
                    .mint(toAddress, valueTransferred)
                    .send({ from: fromAddress, gas: gasLimit });
            } catch (error) {
                // Logger.error(error);
                console.log('sendTransferTokenTransaction: tokenAddress is not valid');
            }

            break;
        }

        default:
            // Logger.error('sendTransferTokenTransaction: tokenAddress is not valid');
            console.log('sendTransferTokenTransaction: tokenAddress is not valid');
            break;
    }

    return txResult;
};

export const getTransactionReceipt = async (txHash: string) => {
    const web3Instance = getWeb3Instance();
    const transactionReceipt = await web3Instance.eth.getTransactionReceipt(txHash);
    return transactionReceipt;
};

export const getTokenBalanceOf = async (account: string, contractAddress: string) => {
    const tokenERC20ContractInstance = getContract(ERC20ABI, contractAddress);
    return Number(
        Number(Web3.utils.fromWei(await tokenERC20ContractInstance.methods.balanceOf(account).call(), 'ether')).toFixed(
            4
        )
    );
};

export const getBalanceOf = async (account: string) => {
    const web3Instance = getWeb3Instance();

    return Number(Number(Web3.utils.fromWei(await web3Instance.eth.getBalance(account), 'ether')).toFixed(4));
};
