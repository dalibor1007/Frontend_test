import React from "react";
import { Button } from "@mui/material";
import { useWallet } from "../../context/web3Context";

export const formatAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}.....${address.slice(-6)}`;
};

const MetaMaskConnect = () => {
  const { walletAddress, setWalletAddress } = useWallet();

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = accounts[0];
        setWalletAddress(address); // Update context with the wallet address
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask to continue.");
    }
  };

  const disconnectMetaMask = () => {
    setWalletAddress(null); // Clear the wallet address in the context
  };

  return (
    <div>
      {walletAddress ? (
        <Button
          variant="contained"
          color="error"
          onClick={disconnectMetaMask}
          sx={{ fontSize: { xs: 10, sm: 14 } }}
        >
          {formatAddress(walletAddress)}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="success"
          onClick={connectMetaMask}
          sx={{ fontSize: { xs: 10, sm: 14 } }}
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default MetaMaskConnect;
