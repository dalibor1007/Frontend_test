import React from "react";
import { Router } from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/authContext";
import { TitleProvider } from "./context/titleContext";
import { WalletProvider } from "./context/web3Context";

const App = () => {
  return (
    <React.Fragment>
      <ToastContainer />
      <WalletProvider>
        <AuthProvider>
          <TitleProvider>
            <Router />
          </TitleProvider>
        </AuthProvider>
      </WalletProvider>
    </React.Fragment>
  );
};

export default App;
