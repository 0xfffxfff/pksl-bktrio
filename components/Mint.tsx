import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import contractInterface from '../contract-abi.json';
import { utils } from 'ethers';
import { useEffect, useState } from "react";


const contractConfig = {
  addressOrName: '0x4449C90E437d345Db0C2848F0F6D8CfBDe55f547',
  contractInterface: contractInterface,
};

export default function Mint() {
  const [totalMinted, setTotalMinted] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { isConnected } = useAccount();

  const { data: mintPriceData } = useContractRead({
    ...contractConfig,
    functionName: 'mintPrice',
    watch: true,
  });

  const {
    data: mintData,
    write: mint,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useContractWrite({ ...contractConfig, functionName: 'mint', args: [quantity], overrides: { value: mintPriceData?.mul(quantity), gasLimit: 2e6 } });

  const { data: totalSupplyData } = useContractRead({
    ...contractConfig,
    functionName: 'totalSupply',
    watch: true,
  });

  const { isSuccess: txSuccess, error: txError } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  useEffect(() => {
    if (totalSupplyData) {
      setTotalMinted(totalSupplyData.toNumber());
    }
  }, [totalSupplyData]);

  const isMinted = txSuccess;

  return (
    <div style={{ padding: '24px 24px 24px 0' }}>
      <h1>Mint</h1>
      <p style={{ margin: '12px 0 24px' }}>
        {totalMinted} minted so far!
      </p>
      <p>
        <label htmlFor={`quantity`} className="sr-only">
          Quantity
        </label>
        <select
          id={`quantity`}
          name={`quantity`}
          className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          onChange={(e) => setQuantity(parseInt(e?.target?.value, 10))}
          value={quantity}
        >
          {[...Array(32)].map((e, i) =>
            <option value={i+1}>{i+1}</option>
          )}
        </select>
      </p>

      <p>
        Price: {quantity} x {mintPriceData ? utils.formatEther(mintPriceData) : '–'} ETH<br />
        Total: {mintPriceData ? utils.formatEther(mintPriceData.mul(quantity)) : '–'} ETH
      </p>

      {mintError && (
        <p style={{ marginTop: 24, color: '#FF6257' }}>
          Error: {mintError.message}
        </p>
      )}
      {txError && (
        <p style={{ marginTop: 24, color: '#FF6257' }}>
          Error: {txError.message}
        </p>
      )}

      {isConnected && !isMinted && (
        <button
          style={{ marginTop: 24 }}
          disabled={isMintLoading || isMintStarted}
          className="button"
          data-mint-loading={isMintLoading}
          data-mint-started={isMintStarted}
          onClick={() => mint()}
        >
          {isMintLoading && 'Waiting for approval'}
          {isMintStarted && 'Minting...'}
          {!isMintLoading && !isMintStarted && 'Mint'}
        </button>
      )}
    </div>
  )
}
