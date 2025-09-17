"use client";

import { InputForm } from "@/components/ui/InputField";
import TxDetails from "@/components/ui/TxDetails";
import { useState, useMemo, CSSProperties, useEffect } from "react";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import {
  useChainId,
  useConfig,
  useAccount,
  useWriteContract,
  useReadContracts,
} from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { calculateTotal, formatTokenAmount } from "@/utils";
import { MoonLoader } from "react-spinners";
import { formatUnits } from "viem";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export default function AirdropForm() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  const [status, setStatus] = useState<
    "idle" | "awaiting-wallet-confirmation" | "mining"
  >("idle"); // This indicates that the status can either be idle, awaiting-wallet-confirmation, or mining
  const [color, setColor] = useState("#ffffff");
  const [contractAmountTokens, setcontractAmountTokens] = useState("");

  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  const total: number = useMemo(() => calculateTotal(amounts), [amounts]); // Anytime the amounts variable changes, the calculateTotal function runs and saves it to the total variable
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { data: tokenData } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "decimals",
      },
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "name",
      },
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "balanceOf",
        args: [account.address],
      },
    ],
  });
  const [hasEnoughTokens, setHasEnoughTokens] = useState(true);

  async function getApprovedAmount(
    tSenderAddress: string | null
  ): Promise<number> {
    if (!tSenderAddress) {
      alert("No address found, please use a supported chain!");
      return 0;
    }
    const response = await readContract(config, {
      abi: erc20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: "allowance",
      args: [account.address, tSenderAddress as `0x${string}`],
    });
    return response as number;
  }

  async function handleSubmit() {
    // Start the process. Disable the button and show the first loader. Disbaling the button is crucial to avoid users clicking the button why it's confirming/sending the treansaction.
    setStatus("awaiting-wallet-confirmation");

    try {
      const tSenderAddress = chainsToTSender[chainId]["tsender"];
      const approvedAmount = await getApprovedAmount(tSenderAddress);

      if (approvedAmount < total) {
        // PHASE 1: Request APPROVAL from the user's wallet
        const approvalHash = await writeContractAsync({
          abi: erc20Abi,
          address: tokenAddress as `0x${string}`,
          functionName: "approve",
          args: [tSenderAddress as `0x${string}`, BigInt(total)],
        });
        const approvalReceipt = await waitForTransactionReceipt(config, {
          hash: approvalHash,
        });
        console.log("Approval Receipt Confirmed: ", approvalReceipt);

        // User has confirmed in wallet. Transaction is now sent to the network.
        setStatus("mining"); // <-- Update status to mining after the approval for tx
        const airdropHash = await writeContractAsync({
          abi: tsenderAbi,
          address: tSenderAddress as `0x${string}`,
          functionName: "airdropERC20",
          args: [
            tokenAddress,
            recipients
              .split(/[,\n]+/)
              .map((addr) => addr.trim())
              .filter((addr) => addr !== ""),
            amounts
              .split(/[,\n]+/)
              .map((amt) => amt.trim())
              .filter((amt) => amt !== ""),
            BigInt(total),
          ],
        });

        const airdropReceipt = await waitForTransactionReceipt(config, {
          hash: airdropHash,
        });
        console.log("Airdrop Receipt Confirmed: ", airdropReceipt);

        setStatus("idle");
      } else {
        // PHASE 2: Request the AIRDROP from the user's wallet
        // Before calling the next writeContractAsync, we are again waiting for the user to confirm
        setStatus("awaiting-wallet-confirmation");

        const airdropHash = await writeContractAsync({
          abi: tsenderAbi,
          address: tSenderAddress as `0x${string}`,
          functionName: "airdropERC20",
          args: [
            tokenAddress,
            recipients
              .split(/[,\n]+/)
              .map((addr) => addr.trim())
              .filter((addr) => addr !== ""),
            amounts
              .split(/[,\n]+/)
              .map((amt) => amt.trim())
              .filter((amt) => amt !== ""),
            BigInt(total),
          ],
        });

        // User has confirmed the airdrop in their wallet. Transaction is now mining.
        setStatus("mining");
        const airdropReceipt = await waitForTransactionReceipt(config, {
          hash: airdropHash,
        });
        console.log("Airdrop Receipt Confirmed: ", airdropReceipt);

        // SUCCESS! Everything is done.
        // You could add a success message or reset the form here.
        setStatus("idle");
      }
    } catch (error) {
      // If anything fails (user rejects the tx, tx fails), catch the error and reset the button.
      console.error("Transaction failed:", error);
      setStatus("idle");
    }
  }

  useEffect(() => {
    const savedTokenAddress = localStorage.getItem("tokenAddress");
    const savedRecipients = localStorage.getItem("recipients");
    const savedAmounts = localStorage.getItem("amounts");

    savedTokenAddress ? setTokenAddress(savedTokenAddress) : null;
    savedRecipients ? setRecipients(savedRecipients) : null;
    savedAmounts ? setAmounts(savedAmounts) : null;
  }, []); // The empty [] means this effect runs only once on mount

  useEffect(() => {
    localStorage.setItem("tokenAddress", tokenAddress);
    localStorage.setItem("recipients", recipients);
    localStorage.setItem("amounts", amounts);
  }, [tokenAddress, recipients, amounts]); // This effect runs anytime tokenAddress, recipients, or amounts changes

  useEffect(() => {
    if (
      tokenAddress &&
      total > 0 &&
      (tokenData?.[2]?.result as number) !== undefined
    ) {
      const userBalance = tokenData?.[2].result as number;
      setHasEnoughTokens(userBalance >= total);
    } else {
      setHasEnoughTokens(true);
    }
  }, [tokenAddress, total, tokenData]);

  return (
    <div>
      <InputForm
        label="Token Address"
        placeholder="0x..."
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />
      <InputForm
        label="Recipients"
        placeholder="0x1234,0x56789033"
        value={recipients}
        large={true}
        onChange={(e) => setRecipients(e.target.value)}
      />
      <InputForm
        label="Amount"
        placeholder="100,200,300..."
        value={amounts}
        large={true}
        onChange={(e) => setAmounts(e.target.value)}
      />
      <TxDetails
        tokenName={tokenData?.[1]?.result as string}
        tokenAmountWei={total.toString()}
        tokenAmountTokens={formatTokenAmount(
          total,
          tokenData?.[0]?.result as number
        )}
      />
      <button
        onClick={handleSubmit}
        disabled={status !== "idle"} // Disable the button unless we are idle
        className="cursor-pointer flex items-center justify-center w-full py-3 rounded-[9px] text-white transition-colors font-semibold relative border disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {status === "idle" ? (
          "Send Tokens"
        ) : (
          // Show a spinner and message for both non-idle states
          <div className="flex items-center gap-2">
            <MoonLoader color="#ffffff" size="20" />{" "}
            <span>
              {status === "awaiting-wallet-confirmation"
                ? "Confirm in Wallet..."
                : "Mining Transaction..."}
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
