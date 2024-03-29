import React, { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import { chain, useAccount, useContractRead, useContractWrite, useNetwork, useWaitForTransaction } from 'wagmi';
import contractInterface from '../contract-abi.json';
import { toast, ToastContainer } from 'react-toastify';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { handleTxError } from '../common/handleTxError';
import OwnedGrid from '../components/OwnedGrid';
import PublicLinkList from '../components/PublicLinkList';

import allowlist from '../allowlist';
import AllowlistTree from '../common/AllowlistTree';

const tree = new AllowlistTree(allowlist);

const contractConfig = {
  addressOrName: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string),
  contractInterface: contractInterface,
};

const Home: NextPage = () => {
  const addRecentTransaction = useAddRecentTransaction();
  const { isConnected, address } = useAccount();
  const { chain: activeChain } = useNetwork();
  const [balanceOf, setBalanceOf] = useState(0);
  const [totalMinted, setTotalMinted] = useState(0);
  const [maxSupply, setMaxSupply] = useState(4096);
  const [maxPerAddress, setMaxPerAddress] = useState(0);
  const [maxPerAllowlist, setMaxPerAllowlist] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isOnAllowList, setIsOnAllowList] = useState(false);
  const [isAllowListActive, setIsAllowListActive] = useState(false);
  const [isPublicMintActive, setIsPublicMintActive] = useState(false);

  useEffect(() => {
    setIsOnAllowList(
      isConnected && address
      ? !!(allowlist.find((e) => e.address.toLowerCase() === address?.toLowerCase()))
      : false
    )
  }, [isConnected, address])

  const { data: balanceOfData, refetch: refetchBalanceOf } = useContractRead({ ...contractConfig, functionName: 'balanceOf', args: address, enabled: isConnected, watch: true });
  const { data: totalSupplyData, refetch: refetchTotalSupply } = useContractRead({ ...contractConfig, functionName: 'totalSupply', watch: true });
  const { data: isAllowListActiveData } = useContractRead({ ...contractConfig, functionName: 'isAllowListActive', watch: true });
  const { data: isPublicMintActiveData } = useContractRead({ ...contractConfig, functionName: 'isPublicMintActive', watch: true });
  const { data: maxSupplyData } = useContractRead({ ...contractConfig, functionName: 'maxSupply' });
  const { data: maxPerAddressData } = useContractRead({ ...contractConfig, functionName: 'maxPerAddress' });
  const { data: maxPerAllowlistData } = useContractRead({ ...contractConfig, functionName: 'maxPerAllowList' });
  // const { data: mintPriceData } = useContractRead({ ...contractConfig, functionName: 'publicMintPrice', watch: false });
  useEffect(() => { if (balanceOfData) setBalanceOf(balanceOfData.toNumber()); }, [balanceOfData]);
  useEffect(() => { if (totalSupplyData) setTotalMinted(totalSupplyData.toNumber()); }, [totalSupplyData]);
  useEffect(() => { if (isPublicMintActiveData) setIsPublicMintActive(!!isPublicMintActiveData); }, [isPublicMintActiveData]);
  useEffect(() => { if (isAllowListActiveData) setIsAllowListActive(!!isAllowListActiveData); }, [isAllowListActiveData]);
  useEffect(() => { if (maxSupplyData) setMaxSupply(maxSupplyData.toNumber()); }, [maxSupplyData]);
  useEffect(() => { if (maxPerAddressData) setMaxPerAddress(maxPerAddressData.toNumber()); }, [maxPerAddressData]);
  useEffect(() => { if (maxPerAllowlistData) setMaxPerAllowlist(maxPerAllowlistData.toNumber()); }, [maxPerAllowlistData]);

  const {
    data: mintData, writeAsync: mint, isLoading: isMintLoading, isSuccess: isMintStarted, error: mintError,
  } = useContractWrite({
    ...contractConfig, functionName: 'mint', args: [quantity, tree.getProofForAddress(address ?? '')], overrides: { /*value: mintPriceData?.mul(quantity),*/ gasLimit: 2e6 }
  });
  const { isSuccess: txSuccess, error: txError } = useWaitForTransaction({
    hash: mintData?.hash,
  });
  const isMinted = txSuccess;

  async function handleMint(quantity: number) {
    try {
      const tx = await mint();
      const desc = `Minting ${quantity} Pksl Bktrios`;
      toast.promise(
        tx.wait(),
        {
          pending: desc,
          success: `Minted ${quantity} Pksl Bktrios`,
          error: `Failed to mint ${quantity} Pksl BKtrios`
        },
        {
          onClick: () => {
            const chainurl = activeChain?.id === chain.rinkeby.id ? chain.rinkeby.blockExplorers?.etherscan?.url : chain.mainnet.blockExplorers?.etherscan?.url
            if (activeChain?.id !== chain.hardhat.id && chainurl) {
              const url = `${chainurl}/tx/${tx.hash}`
              window.open(url, '_blank')
            }
          },
          closeButton: true,
          closeOnClick: false
        }
      ).then(() => {
        refetchBalanceOf();
        refetchTotalSupply();
      })
      addRecentTransaction({
        hash: tx.hash,
        description: desc,
      })
    } catch (error) { handleTxError(error) }
  }

  return (
    <div className="p-5">
      <div className="flex flex-col sm:flex-row gap-10 sm:gap-5 lg:gap-10 items-stretch justify-items-stretch">

        {/* LEFT SIDE */}
        <div className="basis-4/12 flex flex-col gap-5 md:gap-10">

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

          <div className="hidden sm:block"><img src="/media/mrgm1.png" className="w-full" /></div>

          <svg viewBox="0 0 195 22">
            <text x="0" y="20">mint now. it&apos;s free.</text>
          </svg>

          <div className="flex gap-5 lg:gap-10">
            <img src="/media/pakki-expand.gif" className="w-5/12" />
            <img src="/media/pakki-expand.gif" className="w-5/12" />
          </div>

          <div className="hidden sm:block">
            <PublicLinkList />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="basis-8/12 nobg-zinc-100 flex flex-col gap-5">

          {/* TOP ROW */}
          <div className="flex gap-5 lg:gap-10">
            <div className="w-6/12"><img src="/media/pksl.png" className="w-full"/></div>
            <div className="w-6/12 flex flex-col justify-between gap-5 lg:gap-10">
              <div className="connectButton grow flex gap-5 lg:gap-10 flex-col items-stretch sm:items-end top-5 right-5">
                  <ConnectButton accountStatus="address" />
              </div>
              <div className="flex">
                <img src="/media/telli.gif" className="w-1/3" />
                <img src="/media/primma-morph.gif" className="w-1/3" />
                <img src="/media/robba.gif" className="w-1/3" />
              </div>
              <div className="flex justify-between items-end gap-5 lg:gap-10">
                <img src="/media/excl.gif" className="w-6/12" />
                <img src="/media/backgrounds.gif" className="w-5/12" />
              </div>
            </div>
          </div>

          <img src="/media/border.gif" className="non-pixelated" />

          {/* MID ROW */}
          <div className="flex flex-col items-start">
            <svg viewBox={"0 0 " + (95 + (totalMinted < 10 ? 0 : (totalMinted < 100 ? 14 : (totalMinted < 1000 ? 28 : 42)))) + " 22"}>
              <text x="0" y="20">{totalMinted === 0 ? '-' : totalMinted} minted</text>
            </svg>
            <svg viewBox="0 0 300 22">
              <text x="0" y="20">{maxSupply} max population</text>
            </svg>
          </div>
          <div>
            {/* MINT */}
            <div>
              {
                totalMinted >= maxSupply
                ? <button
                    className="py-5 px-16 bg-black text-white text-3xl"
                    disabled={true}
                  >
                    Minted out
                  </button>
                : isPublicMintActive || (isAllowListActive && isOnAllowList)
                  ? isConnected && !activeChain?.unsupported
                    ? <div className="flex gap-5">
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
                              {[...Array(((isPublicMintActive ? maxPerAddress : maxPerAllowlist) - balanceOf))].map((e, i) =>
                                <option value={i+1} key={i+1}>{i+1}</option>
                              )}
                            </select>
                            <div className="absolute right-4 top-0 bottom-0 w-5 flex items-center pointer-events-none">
                              <img src="/media/arrow.png" className="w-5" />
                            </div>
                          </div>
                        </div>
                        <button
                          className="py-5 px-16 bg-black text-white text-3xl"
                          disabled={isMintLoading}
                          onClick={(e) => handleMint(quantity)}
                        >
                          {isMintLoading && 'Waiting for approval'}
                          {!isMintLoading && ('Mint ' + quantity + ' pksl')}

                        </button>
                      </div>
                    : <div className={"connectButton connectButton--large text-3xl " + (activeChain?.unsupported ? "connectButton--unsupported" : "")}>
                        <ConnectButton accountStatus="address" />
                      </div>
                  : <button
                      className="py-5 px-16 bg-black text-white text-3xl"
                      disabled={true}
                    >
                      { !isPublicMintActive && isAllowListActive && !isOnAllowList ? 'Not on allow list' : 'Minting not active'}
                    </button>
              }
            </div>
            <p className="mt-3">
              {
                !isAllowListActive && !isPublicMintActive
                ? 'minting is not active.'
                : !isPublicMintActive && isAllowListActive
                  ? 'allow list minting is active.'
                  : 'public minting is active.'
              }
              <br/>
              { (isAllowListActive && isOnAllowList) || isPublicMintActive
                ? `${balanceOf > 0 ? ('You already own ' + balanceOf + ' pksl bktrios.') : ''} You can mint up to ${(isPublicMintActive ? maxPerAddress : maxPerAllowlist) - balanceOf} ${balanceOf > 0 ? 'more.' : 'pksl bktrios.'}`
                : !isPublicMintActive && isAllowListActive && !isOnAllowList
                  ? 'You are not on the allow list.'
                  : ''
              }
            </p>

            {/* <p>
              Price: {quantity} x {mintPriceData ? utils.formatEther(mintPriceData) : '–'} ETH<br />
              Total: {mintPriceData ? utils.formatEther(mintPriceData.mul(quantity)) : '–'} ETH
            </p> */}

          </div>

          <div className="text-3xl lg:text-5xl" style={{ lineHeight: 1.4 }}>pksl bktrios are a new on-chain strain of the original bktr.io. <br/>
            brutally pixelated, irregularly animated, randomly combined, visually surprising. clean, cute, scary, overwhelming, brimming with life.
          </div>

          <div className="block sm:hidden">
            <PublicLinkList />
          </div>
        </div>
      </div>

      { isConnected ?
        <div className="mt-10">
          <h2 className="text-6xl mb-7">you own {balanceOf} pksl bktrios <img src="/media/fluffi-climb-crop.gif" alt="" className="inline-block h-[1em]" /></h2>
          <OwnedGrid address={address} nonce={balanceOf} />
        </div>
      : null }

      <div className="text-sm">
        <ToastContainer
          position="bottom-right"
          autoClose={10000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          />
      </div>

      <div className="text-2xl mt-8 leading-relaxed">
        art by <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/siggieggertsson" className="underline">Siggi Eggertson</a>,
        minting page made by ♥ <a target="_blank" rel="noopener noreferrer" href="https://0xfff.love" className="underline">0xfff</a>,
        contract deployed with <a target="_blank" rel="noopener noreferrer" href="https://indeliblelabs.io/" className="underline">indellible</a>
      </div>
    </div>
  );
};

export default Home;
