interface TxDetailsProps {
  tokenName: string;
  tokenAmountWei?: string;
  tokenAmountTokens?: string;
}

export default function TxDetails({
  tokenName,
  tokenAmountWei,
  tokenAmountTokens,
}: TxDetailsProps) {
  return (
    <div className="bg-white my-8 border border-zinc-300 rounded-lg py-2 px-4 flex flex-col gap-1.5">
      <div className="text-zinc-900">
        <p>Transaction Details</p>
      </div>

      <div className="flex justify-between">
        <p className="text-zinc-600">Token Name:</p>
        <p className="text-zinc-900">{tokenName}</p>
      </div>

      <div className="flex justify-between">
        <p className="text-zinc-600">Amount (wei):</p>
        <p className="text-zinc-900">{tokenAmountWei}</p>
      </div>

      <div className="flex justify-between">
        <p className="text-zinc-600">Amount (tokens):</p>
        <p className="text-zinc-900">{tokenAmountTokens}</p>
      </div>
    </div>
  );
}
