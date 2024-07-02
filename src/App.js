import React, { useState } from "react";
import "./App.css";
import Web3 from "web3";
import walletNetwork from './utils/helpers/walletNetwork';

function App() {
  const [isConnected, setIsConnected] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        const balance = await web3.eth.getBalance(accounts[0]);
        setIsConnected(web3);
        setWalletAddress(accounts[0]);
        setWalletBalance(web3.utils.fromWei(balance, "ether"));
        console.log("MetaMask connected");
      } catch (error) {
        console.log("User denied account access", error);
      }
    } else {
      console.log("MetaMask is not installed!");
    }
  };



const switchNetwork = async (networkKey) => {
  const network = walletNetwork[networkKey];
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network[0].chainId }],
      });
      console.log(`Switched to the ${networkKey} network`);
    } catch (switchError) {
      // The network has not been added to MetaMask
      if (switchError.code === 4902) {
        checkNetwork(networkKey);
      } else {
        console.error("Cannot switch to the network", switchError);
      }
    }
  } else {
    console.error("Ethereum provider is not available");
  }
};

const checkNetwork = async (networkKey) => {
  const network = walletNetwork[networkKey];
  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: network,
    });
    console.log(`Network ${networkKey} added`);
  } catch (addError) {
    console.error("Failed to add the network", addError);
  }
};

const handleSwitchNetwork = (networkKey) => {
  switchNetwork(networkKey);
};

  return (
    <div className="App">
      <header className="App-header">
        <button className="App-link" onClick={connectMetaMask}>
          {isConnected ? "MetaMask Connected" : "Connect to the metamask"}
        </button>
        <p>{walletAddress && `Wallet Address: ${walletAddress}`}</p>
        <p>{walletBalance && `Wallet Balance: ${walletBalance}`}</p>
        {isConnected && (
          <div style={{ display: "flex", columnGap: 50 }}>
            <button
              className="App-link"
              onClick={() => handleSwitchNetwork("polygon")}
            >
              Switch to the Polygon
            </button>
            <button
              className="App-link"
              // eslint-disable-next-line no-undef
              onClick={() => handleSwitchNetwork("sepolia")}
            >
              Switch to the Ethereum
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
