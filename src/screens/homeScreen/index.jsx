import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { ActivityIndicator, Alert, ToastAndroid } from "react-native";
import walletStore from "../../store/wallet/walletStore";
import TabContainer from "../../components/tabContainer";
import ImportWallet from "./components/importWallet";
import CurrencyPrice from "./components/currencyPrice";
import { BITCOIN, POLYGON } from "../../constants/commonConstants";
import WalletComponent from "./components/walletComponent";

const HomeScreen = () => {
    const tabOptions = [BITCOIN, POLYGON]
    const [activeTab, setActiveTab] = useState(tabOptions[0]);
    const [showWallet, setShowWallet] = useState(false);
    const [loading, setLoading] = useState(false);

    const [fetchWallet, setFetchWallet] = useState({
        state: false,
        key: ''
    });

    const checkWalletStatus = async (selectedOption) => {
        setLoading(true);
        const isWalletActive = await walletStore.isWalletActive(walletStore, selectedOption);
        if (isWalletActive.status) {
            setFetchWallet({
                state: true,
                key: isWalletActive.key
            })
        } else {
            setShowWallet(false);
        }
        setLoading(false)
    };

    const handleTabPress = (selectedOption) => {
        if (!loading && activeTab != selectedOption) {
            setActiveTab(selectedOption);
            checkWalletStatus(selectedOption);
        }
    };

    const performWalletImport = async () => {
        setLoading(true);
        const walletImported = await walletStore.importWallet({ walletStore: walletStore, walletType: activeTab, privateKey: fetchWallet.key });
        setLoading(false);
        if (walletImported) {
            setShowWallet(true);
        }
        else {
            Alert.alert("Something went wrong... Try again later!")
        }
    }
    useEffect(() => {
        if (fetchWallet.state) {
            setLoading(true);
            performWalletImport();
        }
    }, [fetchWallet])


    useEffect(() => {
        setLoading(true);
        checkWalletStatus(activeTab);
    }, []);

    return (
        <HomeConatainer>
            <TopContainer>
                <TabContainer
                    options={tabOptions}
                    onTabPress={handleTabPress}
                    activeTab={activeTab}
                />
            </TopContainer>

            {
                loading ?
                    <ActivityIndicator size="large" color="#3498db" />
                    :
                    <Container>
                        {showWallet ? (
                            <WalletComponent walletFetch={setShowWallet} />
                        ) : (
                            <ImportWallet updateFetchWallet={setFetchWallet} />
                        )}
                    </Container>
            }

            {/* <CurrencyPrice /> */}
        </HomeConatainer>
    );
};

export default HomeScreen;

const HomeConatainer = styled.ScrollView`
background-color: #ffffffab;
flex: 1;

`
const Container = styled.View`
  padding: 0px 20px;
`;

const TopContainer = styled.View`
  align-items: center;
  padding: 20px;
`;
