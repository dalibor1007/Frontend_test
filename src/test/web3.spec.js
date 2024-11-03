import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MetaMaskConnect from "../components/web3/walletConnect";
import { useWallet } from "../context/web3Context";
import { waitFor } from "@testing-library/react";

// Mock useWallet context
jest.mock("../context/web3Context", () => ({
  useWallet: jest.fn(),
}));

describe("MetaMaskConnect Component", () => {
  let mockSetWalletAddress;

  beforeEach(() => {
    mockSetWalletAddress = jest.fn();
    useWallet.mockReturnValue({
      walletAddress: null,
      setWalletAddress: mockSetWalletAddress,
    });
    window.ethereum = {
      request: jest
        .fn()
        .mockResolvedValue(["0x1234567890abcdef1234567890abcdef12345678"]),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("connectMetaMask: calls MetaMask and sets wallet address", async () => {
    render(<MetaMaskConnect />);

    // Find and click the "Connect Wallet" button
    const connectButton = screen.getByRole("button", {
      name: /connect wallet/i,
    });
    fireEvent.click(connectButton);

    // Ensure request to MetaMask was made
    expect(window.ethereum.request).toHaveBeenCalledWith({
      method: "eth_requestAccounts",
    });

    // Wait for the setWalletAddress call with the wallet address
    await waitFor(() => {
      expect(mockSetWalletAddress).toHaveBeenCalledWith(
        "0x1234567890abcdef1234567890abcdef12345678"
      );
    });
  });

  test("disconnectMetaMask: clears the wallet address", () => {
    // Mock wallet address to simulate a connected state
    useWallet.mockReturnValue({
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      setWalletAddress: mockSetWalletAddress,
    });

    render(<MetaMaskConnect />);

    // Find and click the button with the formatted wallet address
    const addressButton = screen.getByText("0x1234.....345678");
    fireEvent.click(addressButton);

    // Assert that setWalletAddress was called with null
    expect(mockSetWalletAddress).toHaveBeenCalledWith(null);
  });

  test("formatAddress: correctly formats a given address", () => {
    const { formatAddress } = require("../components/web3/walletConnect");

    // Define test cases
    const testCases = [
      {
        input: "0x1234567890abcdef1234567890abcdef12345678",
        expected: "0x1234.....345678",
      },
      { input: null, expected: "" },
      { input: "", expected: "" },
    ];

    // Loop through each test case and assert the formatted result
    testCases.forEach(({ input, expected }) => {
      expect(formatAddress(input)).toBe(expected);
    });
  });

  test("shows an alert if MetaMask is not installed", () => {
    // Delete window.ethereum to simulate MetaMask not being installed
    delete window.ethereum;
    window.alert = jest.fn();

    render(<MetaMaskConnect />);

    // Click the "Connect Wallet" button
    const connectButton = screen.getByRole("button", {
      name: /connect wallet/i,
    });
    fireEvent.click(connectButton);

    // Assert that alert is called with the correct message
    expect(window.alert).toHaveBeenCalledWith(
      "MetaMask is not installed. Please install MetaMask to continue."
    );
  });
});
