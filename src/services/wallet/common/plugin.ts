import { IWallet } from './wallet';

export interface IPlugin {
    // createWalletByMnemonic(mnemonic: string): IWallet;
    createWalletByMnemonic(mnemonic: string): Promise<IWallet>;
    // createWalletByMnemonic(mnemonic: string): any;
    // generateWallet(): IWallet;
    signTransaction(...args): any;
    // createDeterministicWallets(...args): IWallet[];
}
