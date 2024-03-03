import { ethers } from 'ethers';
import { BitcoinJS } from 'bitcoinjs-lib';
import { isPolygonPrivateKeyValid } from './stringValidation';
import { POLYGON, BITCOIN, POLYGON_TESTNET_CODE, ALCHEMY_API_KEY, POLYGON_STORAGE_KEY } from '../constants/commonConstants';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const importPolygonWallet = async (walletStore, privateKey) => {
    if (isPolygonPrivateKeyValid(privateKey)) {
        try {
            // const wallet = new Wallet(privateKey);
            const provider = new ethers.AlchemyProvider(POLYGON_TESTNET_CODE, ALCHEMY_API_KEY)
            const wallet = new ethers.Wallet(privateKey, provider);
            const address = await wallet.getAddress();
            const bal = await provider.getBalance(address);
            const balance = ethers.formatEther(bal)

            //updating store values
            walletStore.privateKey = privateKey;
            walletStore.activeWallet = POLYGON;
            walletStore.address = address;
            walletStore.balance = balance;

            //storing key in storage
            await AsyncStorage.setItem(POLYGON_STORAGE_KEY, privateKey);

            return true;
        }
        catch (err) {
            console.log("error importing wallet", err)
            return false;
        }

    }
    else {
        return false;
    }
}

export const importBitcoinWallet = async () => {
    try {
        const network = BitcoinJS.networks.testnet; // Use testnet network
        const keyPair = BitcoinJS.ECPair.fromWIF(privateKey, network);

        // Perform wallet operations here (e.g., get balance)

        // **Important:** Clear the private key after usage
        privateKey = null;
    } catch (error) {
        console.error('Error importing wallet:', error);
    }
}