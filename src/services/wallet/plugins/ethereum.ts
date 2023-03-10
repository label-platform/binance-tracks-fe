import { mnemonicToSeed, generateMnemonic } from 'bip39';
import { hdkey } from 'ethereumjs-wallet';

import * as EthereumWallet from 'ethereumjs-wallet';
import * as EthereumTx from '@ethereumjs/tx';
import * as EthereumUtil from 'ethereumjs-util';

import { IWallet } from '../common/wallet';
import { IPlugin } from '../common/plugin';

export interface IEthereumTransaction {
    transaction?: IEthereumRawTrasnactionParams;
}

export interface IEthereumPlugin extends IPlugin {
    fromEthSale(walletInstance, password): any;
    fromV1(walletInstance, password): any;
    fromV3(walletInstance, password): any;
    toV3(walletInstance): any;
}

export interface IEthereumRawTrasnactionParams {
    from?: string | number;
    to?: string;
    value?: number | string;
    gas?: number | string;
    gasPrice?: number | string;
    data?: string;
    nonce?: number;
    chainId?: number;
}

export const plugin: IEthereumPlugin = {
    async createWalletByMnemonic(mnemonic) {
        // eslint-disable-next-line quotes
        const derivationPath = "m/44'/60'/0'/0";
        const seed = await mnemonicToSeed(mnemonic);
        const hdKey = hdkey.fromMasterSeed(seed);
        const derivedHdKey = hdKey.derivePath(derivationPath).deriveChild(0);
        const wallet = derivedHdKey.getWallet();

        return {
            type: 'ethereum',
            mnemonic: mnemonic,
            derivationPath: derivationPath,
            address: wallet.getAddressString(),
            keyPair: {
                publicKey: wallet.getPublicKeyString(),
                privateKey: wallet.getPrivateKeyString(),
            },
        };
    },

    // Ledger (ETH)      - m/44'/60'/x'/0/0
    // Ledger Live (ETH) - m/44'/60'/0'/0/x
    // derivationPathTemplate shuld contain x in it, to tell us where we should increment the index ie: m/44'/60'/x'/0/0)
    // check this for more info https://github.com/MyCryptoHQ/MyCrypto/issues/2070
    // createDeterministicWallets(
    //   mnemonic: string,
    //   derivationPathTemplate: string,
    //   limit: number = 0,
    //   offset: number = 20
    // ): IWallet[] {
    //   const seed = mnemonicToSeed(mnemonic);
    //   const hdKey = hdkey.fromMasterSeed(seed);
    //   const wallets = [];
    //   for (let i = 0; i < limit; i++) {
    //     const index = i + offset;
    //     const dPath = derivationPathTemplate.replace('x', index.toString());
    //     const derivedHdKey = hdKey.derivePath(dPath);
    //     const wallet = derivedHdKey.getWallet();

    //     wallets.push({
    //       type: 'ethereum',
    //       mnemonic: mnemonic,
    //       address: wallet.getAddressString(),
    //       derivationPath: dPath,
    //       keyPair: {
    //         publicKey: wallet.getPublicKeyString(),
    //         privateKey: wallet.getPrivateKeyString(),
    //       },
    //     });
    //   }

    //   return wallets;
    // },

    // generateWallet(): IWallet {
    //   const mnemonic = generateMnemonic();
    //   return plugin.createWalletByMnemonic(mnemonic);
    // },

    signTransaction(ethereumTransaction: IEthereumTransaction, privateKey: string) {
        const bufferPrivateKey = EthereumUtil.toBuffer(privateKey);

        const rawTransaction = ethereumTransaction.transaction ? ethereumTransaction.transaction : ethereumTransaction;

        const ethereumTx = new (EthereumTx as any)(rawTransaction);
        ethereumTx.sign(bufferPrivateKey);

        const serializedTransaction = ethereumTx.serialize();
        const ethereumTxData = serializedTransaction.toString('hex');
        return EthereumUtil.addHexPrefix(ethereumTxData);
    },

    fromEthSale(...args) {
        return (EthereumWallet as any).fromEthSale(...args);
    },

    fromV1(...args) {
        return (EthereumWallet as any).fromV1(...args);
    },

    fromV3(...args) {
        return (EthereumWallet as any).fromV3(...args);
    },

    toV3(...args) {
        return (EthereumWallet as any).toV3(...args);
    },
};
