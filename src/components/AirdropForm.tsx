"use client";

import { InputForm } from "@/components/ui/InputField";
import { useState } from "react";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import { useChainId, useConfig, useAccount } from "wagmi";
import { readContract } from "@wagmi/core";

export default function AirdropForm() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();

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
    // If already approved, moved to step 2
    // Approve our tsender contract to send our tokens
    // Call the airdrop function on our tsender contract
    // Wait for the transaction to be mined
    const tSenderAddress = chainsToTSender[chainId]["tsender"];
    const approvedAmount = await getApprovedAmount(tSenderAddress);
    console.log("Approved Amount: ", approvedAmount);
  }
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
      <button
        onClick={handleSubmit}
        className="cursor-pointer flex items-center justify-center w-full py-3 rounded-[9px] text-white transition-colors font-semibold relative border "
      >
        Send Tokens
      </button>
    </div>
  );
}
