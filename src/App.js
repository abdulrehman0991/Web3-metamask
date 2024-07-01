import React,{ useState } from 'react';
import './App.css';
import Web3 from "web3";

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

  return (
    <div className="App">
      <header className="App-header">
        <button className="App-link" onClick={connectMetaMask}>
          {isConnected ? "MetaMask Connected" : "Connect to the metamask"}
        </button>
        <p>{walletAddress && `Wallet Address: ${walletAddress}`}</p>
        <p>{walletBalance && `Wallet Balance: ${walletBalance} ETH`}</p>
      </header>
    </div>
  );
}

export default App;
