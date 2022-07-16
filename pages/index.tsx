import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import contractInterface from '../contract-abi.json';
import { utils } from 'ethers';

const contractConfig = {
  addressOrName: '0x4449C90E437d345Db0C2848F0F6D8CfBDe55f547',
  contractInterface: contractInterface,
};

const Home: NextPage = () => {
  const [totalMinted, setTotalMinted] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { isConnected } = useAccount();

  const { data: mintPriceData } = useContractRead({
    ...contractConfig,
    functionName: 'mintPrice',
    watch: true,
  });

  const {
    data: mintData, write: mint, isLoading: isMintLoading, isSuccess: isMintStarted, error: mintError,
  } = useContractWrite({
    ...contractConfig, functionName: 'mint', args: [quantity], overrides: { value: mintPriceData?.mul(quantity), gasLimit: 2e6 }
  });
  const { isSuccess: txSuccess, error: txError } = useWaitForTransaction({
    hash: mintData?.hash,
  });
  const isMinted = txSuccess;

  const { data: totalSupplyData } = useContractRead({
    ...contractConfig,
    functionName: 'totalSupply',
    watch: true,
  });
  useEffect(() => {
    if (totalSupplyData) {
      setTotalMinted(totalSupplyData.toNumber());
    }
  }, [totalSupplyData]);


  return (
    <div className="p-5">

      {/* LEFT SIDE */}
      <div className="flex flex-col sm:flex-row gap-5 lg:gap-10 items-stretch justify-items-stretch">
        <div className="basis-4/12 flex flex-col gap-10">

          <div className="flex gap-5 sm:gap-10 items-start">
            {/* <FluffiFace className="w-full sm:min-h-[75px] lg:min-h-[150px]" /> */}
            <div className="flex flex-col basis-4/12">
              <img src="/media/fluffi-climb-crop.gif" />
              <svg viewBox="0 0 45 22">
                <text x="0" y="20">pksl</text>
              </svg>
              <svg viewBox="0 0 120 22">
                <text x="15" y="20">on-chain</text>
              </svg>
            </div>
            <img src="/media/headbot.png" className="w-3/12"/>
            <img src="/media/green-pink.png" className="w-4/12"/>
          </div>

          <div className="flex">
            <svg viewBox="0 0 70 22" className="w-[70%] font-light">
              <text x="0" y="20">bktrio</text>
            </svg>
            <img src="/media/heads-grid.gif" className="w-[30%]" />
          </div>

          <img src="/media/mrgm1.png" />

          <svg viewBox="0 0 195 22">
            <text x="0" y="20">mint now. it&apos;s free.</text>
          </svg>

          <div className="flex gap-5 lg:gap-10">
            <img src="/media/pakki-expand.gif" className="w-5/12" />
            <img src="/media/pakki-expand.gif" className="w-5/12" />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="basis-8/12 nobg-zinc-100 flex flex-col gap-5">

          {/* TOP ROW */}
          <div className="flex items-start gap-5 lg:gap-10">
            <img src="/media/pksl.png" className="w-1/2"/>
            <div className="flex flex-col justify-between self-stretch gap-5 lg:gap-10">
              <div className="connectButton grow flex gap-5 lg:gap-10 flex-col items-end nobg-blue-400">
                {/* <FitText className="w-full h-full">Test</FitText> */}
                {/* <FitText> */}
                  <ConnectButton accountStatus="address" />
                {/* </FitText> */}
                {/* <FitText>mint now. it’s free.</FitText> */}
              </div>
              <div className="flex justify-between items-end gap-5 lg:gap-10">
                {/* <FitText className="w-full h-full">Test</FitText> */}
                {/* <FitText> */}
                <img src="/media/excl.gif" className="w-6/12" />
                <img src="/media/pkslgrid.png" className="w-5/12" />
                {/* </FitText> */}
              </div>
            </div>
          </div>

          <img src="/media/border.gif" className="non-pixelated" />

          {/* MID ROW */}
          <div className="flex items-start gap-5 lg:gap-10">
            <svg viewBox={"0 0 " + (95 + (totalMinted < 10 ? 0 : (totalMinted < 100 ? 14 : (totalMinted < 1000 ? 28 : 42)))) + " 22"}>
              <text x="0" y="20">{totalMinted === 0 ? '-' : totalMinted} minted</text>
            </svg>
          </div>
          <div>
            {/* MINT (isConnected: {isConnected ? 'true' : 'false'}) */}
            {/* MINT */}
            <div className="flex gap-5">
              <div>
                <label htmlFor={`quantity`} className="sr-only">
                  Quantity
                </label>
                <div className="relative">
                  <select
                    id={`quantity`}
                    name={`quantity`}
                    className="max-w-full bg-black text-white pl-6 pr-12 py-5 text-center text-3xl appearance-none"
                    onChange={(e) => setQuantity(parseInt(e?.target?.value, 10))}
                    value={quantity}
                  >
                    {[...Array(32)].map((e, i) =>
                      <option value={i+1} key={i+1}>{i+1}</option>
                    )}
                  </select>
                  <div className="absolute right-4 top-0 bottom-0 w-5 flex items-center pointer-events-none">
                    <img src="/media/arrow.png" className="w-5" />
                  </div>
                </div>
              </div>
              {/* <div className="flex items-center text-3xl">×</div> */}
              <button
                className="py-5 px-16 bg-black text-white text-3xl"
                disabled={isMintLoading || isMintStarted}
                data-mint-loading={isMintLoading}
                data-mint-started={isMintStarted}
                onClick={() => mint()}
              >
                {isMintLoading && 'Waiting for approval'}
                {isMintStarted && 'Minting...'}
                {!isMintLoading && !isMintStarted && ('Mint ' + quantity + ' pksl')}

              </button>
            </div>

            {/* <p>
              Price: {quantity} x {mintPriceData ? utils.formatEther(mintPriceData) : '–'} ETH<br />
              Total: {mintPriceData ? utils.formatEther(mintPriceData.mul(quantity)) : '–'} ETH
            </p> */}

          </div>
          <div className="text-3xl lg:text-5xl" style={{ lineHeight: 1.4 }}>pksl bktrios are a new on-chain strain of the original bktr.io. <br/>
            brutally pixelated, irregularly animated, randomly combined, visually surprising. clean, cute, scary, overwhelming, brimming with life.
          </div>
          {/* </FitText> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
