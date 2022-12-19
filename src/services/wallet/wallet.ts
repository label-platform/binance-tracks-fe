import { getWeb3Instance, TokenInfos } from '@constants/jsonInterface/web3';
import { ERC20ABI } from '@constants/jsonInterface/ERC20ABI';
import { ERC721ABI } from '@constants/jsonInterface/ERC721ABI';
import { DepositABI } from '@constants/jsonInterface/DepositABI';
import { PancakeABI } from '@constants/jsonInterface/PancakeABI';
import Web3 from 'web3';
import axios from 'axios';
import { SECOND } from '@constants/common';
import { isNumber } from '@utils/utilities';
import { core } from '@utils/core/core';

export type ContractGuard = keyof Omit<typeof TokenInfos, 'prototype'>;
export type ContractType = 'TOKEN' | 'COIN' | 'NFT';

const pancakeContractAddress = '0xD99D1c33F9fC3444f8101754aBC46c52416550D1';
export interface NFTTransferProps {
    contract: ContractGuard;
    nftId: string;
    toAddress: string;
}
export interface NFTTransferToSpendingProps {
    contract: ContractGuard;
    nftId: string;
}
export interface TokenTransferProps {
    contract: ContractGuard;
    amount: string;
    toAddress: string;
}
export interface TokenTransferToSpendingProps {
    contract: ContractGuard;
    amount: string;
}
export interface GasFeeProps {
    toAddress: string;
    amount?: string;
    nftId?: string;
    contract: ContractGuard;
}
export interface GasFeeToSpendingProps {
    amount?: string;
    nftId?: string;
    contract: ContractGuard;
}
interface IWallet {
    trade(amount: number, sourceAddress: string, targetAddress: string): void;
    init(address: string, pk: string, userId: string): void;
    getBalanceByContract(contract?: ContractGuard): Promise<null | string>;
    getNftByContract(contract?: ContractGuard): Promise<null | string>;
    getEstimatedAmount(amount: number, sourceAddress: string, targetAddress: string): Promise<number>;
}

const TRANSACTION_DEADLINE_MS = SECOND * 60 * 10;
export class WalletSingleTon implements IWallet {
    private static _instance: any;
    private _privateKey = '';
    private _walletAddress = '';
    private _userId = '';
    private _web3Instance = getWeb3Instance();
    private _pancakeContract = new this._web3Instance.eth.Contract(PancakeABI as any, pancakeContractAddress);
    private _adminWalletAddress = '0x8eb9f52858d830aC99011eB1Bdf7095B0eE3B958';
    public static getInstance(): WalletSingleTon {
        return this._instance || (this._instance = new this());
    }

    get isWorkable() {
        return !!this._privateKey && this._walletAddress;
    }

    get privateKey() {
        if (!this.isWorkable) return null;
        return this._privateKey;
    }

    trade(amount: number, sourceAddress: string, targetAddress: string) {
        if (!this.isWorkable) return null;
        if (!isNumber(amount)) return null;
        this._pancakeContract.methods
            .swapExactTokensForTokens(
                +amount,
                0,
                [sourceAddress, targetAddress],
                this._walletAddress,
                this.getTransactionDeadline()
            )
            .send({
                from: this._walletAddress,
            });
    }

    transferNftToWallet(contract: ContractGuard, itemId: string) {
        // eslint-disable-next-line quotes
        if (!this.isWorkable) throw new Error("can't use wallet");
        return core.withdraw.sendNFT(contract, itemId, this._privateKey);
    }

    public async getEstimatedAmount(amount: number, sourceAddress?: string, targetAddress?: string) {
        if (!isNumber(amount)) return 0;
        sourceAddress = '0xe60A39A1D724817FeafA9Bc614eeb378A95F7a91';
        targetAddress = '0x4D26CEc272E3A9f5B91A49F3770dEC7942123A1C';
        try {
            const [_, estimatedAmount] = await this._pancakeContract.methods
                .getAmountsOut(+amount, [sourceAddress, targetAddress])
                .call();
            return estimatedAmount;
        } catch {
            return 0;
        }
    }

    init(address: string, pk: string, id: string): void {
        this._walletAddress = address;
        this._privateKey = pk;
        this._userId = id;
    }

    public async getBalanceByContract(contract?: ContractGuard) {
        if (!this.isWorkable) return null;
        if (this.getContractType(contract) === 'NFT') return null;
        if (this.getContractType(contract) === 'COIN') {
            return Number(
                this._web3Instance.utils.fromWei(await this._web3Instance.eth.getBalance(this._walletAddress), 'ether')
            ).toFixed(4);
        }
        const contractInstance = this.getTokenContract(contract);

        return Number(
            Web3.utils.fromWei(await contractInstance.methods.balanceOf(this._walletAddress).call(), 'ether')
        ).toFixed(4);
    }

    public async getNftByContract(contract: ContractGuard) {
        if (!this.isWorkable) return null;
        if (this.getContractType(contract) !== 'NFT') return null;
        const contractInstance = this.getNFTContract(contract);

        return contractInstance.methods.balanceOf(this._walletAddress).call();
    }

    public async getNFTList(contract: ContractGuard) {
        if (!this.isWorkable) return null;
        const contractInstance = this.getNFTContract(contract);
        const totalNftCount = await contractInstance.methods.balanceOf(this._walletAddress).call();
        const NFTArr = { data: [], meta: {} };
        for (let i = 0; i < totalNftCount; i++) {
            const nftKey = await contractInstance.methods.tokenOfOwnerByIndex(this._walletAddress, i).call();
            const nftURI = await contractInstance.methods.tokenURI(Number(nftKey)).call();
            const nftInfo = await axios.get(nftURI);
            nftInfo.data.id = nftKey;
            NFTArr.data.push(nftInfo.data);
        }
        return NFTArr;
    }

    public async sendNFTToAddress({ contract, nftId, toAddress }: NFTTransferProps) {
        if (!this.isWorkable) return null;
        await this._web3Instance.eth.accounts.wallet.add(this._privateKey);
        const contractInstance = this.getNFTContract(contract);
        const gasLimit = await this.getNFTGasFee(contractInstance, nftId);

        return await contractInstance.methods.safeTransferFrom(this._walletAddress, toAddress, nftId).send({
            from: this._walletAddress,
            gas: gasLimit,
        });
    }

    public async sendNFTToSpending({ contract, nftId }: NFTTransferToSpendingProps) {
        if (!this.isWorkable) return null;
        await this._web3Instance.eth.accounts.wallet.add(this._privateKey);
        await this.approveNFT(contract, nftId);
        const treasuryContract = this.getTreasuryContract();
        const gasLimit = await treasuryContract.methods
            .depositNft(TokenInfos[contract].address, nftId, this._userId)
            .estimateGas({ from: this._walletAddress });
        return await treasuryContract.methods
            .depositNft(TokenInfos[contract].address, nftId, this._userId)
            .send({ from: this._walletAddress, gas: gasLimit });
    }

    public async sendToken({ contract, amount, toAddress }: TokenTransferProps) {
        if (!this.isWorkable) return null;
        await this._web3Instance.eth.accounts.wallet.add(this._privateKey);
        const valueTransferred = Web3.utils.toWei(amount, 'ether');

        switch (this.getContractType(contract)) {
            case 'COIN': {
                const gasLimit = await this._web3Instance.eth.estimateGas({
                    from: this._walletAddress,
                    to: toAddress,
                    value: valueTransferred,
                });
                return await this._web3Instance.eth.sendTransaction({
                    from: this._walletAddress,
                    to: toAddress,
                    value: valueTransferred,
                    gas: gasLimit,
                });
            }
            case 'TOKEN': {
                const contractInstance = this.getTokenContract(contract);
                const gasLimit = await contractInstance.methods
                    .transfer(toAddress, valueTransferred)
                    .estimateGas({ from: this._walletAddress });

                return await await contractInstance.methods
                    .transfer(toAddress, valueTransferred)
                    .send({ from: this._walletAddress, gas: gasLimit });
            }
            default: {
                return null;
            }
        }
    }
    public async sendTokenToSpending({ contract, amount }: TokenTransferToSpendingProps) {
        if (!this.isWorkable) return null;
        await this._web3Instance.eth.accounts.wallet.add(this._privateKey);
        const valueTransferred = Web3.utils.toWei(amount, 'ether');
        const treasuryContract = this.getTreasuryContract();
        switch (this.getContractType(contract)) {
            case 'COIN': {
                const gasLimit = await treasuryContract.methods
                    .depositToken(TokenInfos[contract].address, valueTransferred, this._userId)
                    .estimateGas({
                        from: this._walletAddress,
                        value: valueTransferred,
                        to: TokenInfos[contract].address,
                    });

                return await treasuryContract.methods
                    .depositToken(TokenInfos[contract].address, valueTransferred, this._userId)
                    .send({
                        from: this._walletAddress,
                        gas: gasLimit,
                        value: valueTransferred,
                        to: TokenInfos.TREASURY.address,
                    });
            }
            case 'TOKEN': {
                await this.approveERC20(contract);
                const gasLimit = await treasuryContract.methods
                    .depositToken(TokenInfos[contract].address, valueTransferred, this._userId)
                    .estimateGas({ from: this._walletAddress });

                return await treasuryContract.methods
                    .depositToken(TokenInfos[contract].address, valueTransferred, this._userId)
                    .send({ from: this._walletAddress, gas: gasLimit });
            }
            default: {
                return null;
            }
        }
    }

    public async getGasFee({ toAddress, amount, nftId, contract }: GasFeeProps) {
        if (!this.isWorkable) return null;
        await this._web3Instance.eth.accounts.wallet.add(this._privateKey);

        switch (this.getContractType(contract)) {
            case 'COIN': {
                return await this._web3Instance.eth.estimateGas({
                    from: this._walletAddress,
                    to: toAddress,
                    value: Web3.utils.toWei(amount, 'ether'),
                });
            }
            case 'NFT': {
                const contractInstance = this.getNFTContract(contract);
                return await contractInstance.methods
                    .safeTransferFrom(this._walletAddress, toAddress, nftId)
                    .estimateGas({ from: this._walletAddress });
            }
            case 'TOKEN': {
                const contractInstance = this.getTokenContract(contract);
                return await contractInstance.methods
                    .transfer(toAddress, Web3.utils.toWei(amount, 'ether'))
                    .estimateGas({ from: this._walletAddress });
            }
            default: {
                return null;
            }
        }
    }

    public async getGasFeeToSpending({ amount, nftId, contract }: GasFeeToSpendingProps) {
        if (!this.isWorkable) return null;
        await this._web3Instance.eth.accounts.wallet.add(this._privateKey);

        const treasuryContract = await this.getTreasuryContract();

        switch (this.getContractType(contract)) {
            case 'COIN': {
                const valueTransferred = Web3.utils.toWei(amount, 'ether');
                return await treasuryContract.methods
                    .depositToken(TokenInfos[contract].address, valueTransferred, this._userId)
                    .estimateGas({
                        from: this._walletAddress,
                        value: valueTransferred,
                        to: TokenInfos[contract].address,
                    });
            }
            case 'NFT': {
                await this.approveNFT(contract, nftId);
                const NFTContract = await this.getNFTContract(contract);
                const depositGasFee = await treasuryContract.methods
                    .depositNft(TokenInfos[contract].address, nftId, this._userId)
                    .estimateGas({ from: this._walletAddress });
                const approveGasFee = await NFTContract.methods
                    .approve(TokenInfos.TREASURY.address, nftId)
                    .estimateGas({
                        from: this._walletAddress,
                    });
                const result = Number(depositGasFee) + Number(approveGasFee);

                return result;
            }
            case 'TOKEN': {
                await this.approveERC20(contract);
                const ERC20Contract = this.getTokenContract(contract);
                const valueTransferred = Web3.utils.toWei(amount, 'ether');

                const depositGasFee = await treasuryContract.methods
                    .depositToken(TokenInfos[contract].address, valueTransferred, this._userId)
                    .estimateGas({ from: this._walletAddress });
                const approveGasFee = await ERC20Contract.methods
                    .approve(TokenInfos.TREASURY.address, valueTransferred)
                    .estimateGas({ from: this._walletAddress });
                const result = Number(depositGasFee) + Number(approveGasFee);
                return result;
            }
            default: {
                return null;
            }
        }
    }

    private async approveERC20(contract: ContractGuard) {
        const valueTransferred = Web3.utils.toWei('100000000000000', 'ether');
        const ERC20Contract = this.getTokenContract(contract);
        const gasLimit = await ERC20Contract.methods
            .approve(TokenInfos.TREASURY.address, valueTransferred)
            .estimateGas({ from: this._walletAddress });
        return await ERC20Contract.methods
            .approve(TokenInfos.TREASURY.address, valueTransferred)
            .send({ from: this._walletAddress, gas: gasLimit });
    }

    private async approveNFT(contract: ContractGuard, id: string) {
        const NFTContract = this.getNFTContract(contract);

        const gasLimit = await NFTContract.methods.approve(TokenInfos.TREASURY.address, id).estimateGas({
            from: this._walletAddress,
        });
        return await NFTContract.methods.approve(TokenInfos.TREASURY.address, id).send({
            from: this._walletAddress,
            gas: gasLimit,
        });
    }

    private async getNFTGasFee(contractInstance: any, nftId: string) {
        return await contractInstance.methods
            .safeTransferFrom(this._walletAddress, this._adminWalletAddress, nftId)
            .estimateGas({ from: this._walletAddress });
    }

    private getTokenContract(contract: ContractGuard) {
        return new this._web3Instance.eth.Contract(ERC20ABI as any, TokenInfos[contract].address);
    }
    private getTreasuryContract() {
        return new this._web3Instance.eth.Contract(DepositABI as any, TokenInfos.TREASURY.address);
    }
    private getNFTContract(contract: ContractGuard) {
        return new this._web3Instance.eth.Contract(ERC721ABI as any, TokenInfos[contract].address);
    }

    private getContractType(contract: ContractGuard): ContractType {
        if (contract === 'BNB') return 'COIN';
        if (['HEADPHONE', 'HEADPHONEBOX', 'PINBALLHEAD'].includes(contract)) return 'NFT';
        return 'TOKEN';
    }

    private getTransactionDeadline() {
        return new Date().getTime() + TRANSACTION_DEADLINE_MS;
    }
}
