import { generateMnemonic, mnemonicToSeed } from 'bip39';
import { bip32, networks } from 'bitcoinjs-lib';

// @ts-ignore
import hdkey from 'hdkey';

import { Currency } from '@tatumio/tatum-core'
import { TESTNET_DERIVATION_PATH, BTC_DERIVATION_PATH } from '../constants';

const algosdk = require('algosdk');
const base32 = require('base32.js');

export interface Wallet {

    /**
     * mnemonic seed
     */
    mnemonic: string;

    /**
     * extended public key to derive addresses from
     */
    xpub: string;
}


/**
 * Generate Bitcoin wallet
 * @param testnet testnet or mainnet version of address
 * @param mnem mnemonic seed to use
 * @returns wallet
 */
export const generateBtcWallet = async (testnet: boolean, mnem: string): Promise<Wallet> => {
    const hdwallet = hdkey.fromMasterSeed(await mnemonicToSeed(mnem), testnet ? networks.testnet.bip32 : networks.bitcoin.bip32)
    return {
        mnemonic: mnem,
        xpub: hdwallet.derive(testnet ? TESTNET_DERIVATION_PATH : BTC_DERIVATION_PATH).toJSON().xpub
    }
}
/**
 * Generate wallet
 * @param currency blockchain to generate wallet for
 * @param testnet testnet or mainnet version of address
 * @param mnemonic mnemonic seed to use. If not present, new one will be generated
 * @returns wallet or a combination of address and private key
 */
export const generateWallet = (currency: Currency, testnet: boolean, mnemonic?: string) => {
    const mnem = mnemonic ? mnemonic : generateMnemonic(256)
    return generateBtcWallet(testnet, mnem)
}
