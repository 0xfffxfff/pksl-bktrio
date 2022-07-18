import { initializeAlchemy, getNftsForOwner, Network, OwnedNft } from '@alch/alchemy-sdk';
import { useEffect, useState } from 'react';
import { chain } from 'wagmi';
import { useNetwork } from 'wagmi';

const alchemy = initializeAlchemy({
  apiKey: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  network: Network.ETH_MAINNET
});

export default function OwnedGrid({ ...props }) {
  const { chain: activeChain } = useNetwork();
  const { address, nonce, ...forwardProps } = props;
  const [nfts, setNfts] = useState<OwnedNft[]>([]);

  useEffect(() => {
    if (address) {
      getNftsForOwner(alchemy, address, {
        contractAddresses: [
          (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string)
        ]
      }).then((data) => {
        setNfts(data?.ownedNfts.sort((a, b) => (parseInt(b.tokenId,10) - parseInt(a.tokenId,10))))
      });
    } else {
      setNfts([])
    }
  }, [address, nonce])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5" {...forwardProps}>
      {nfts.map((n, i) => (
        <div key={i}>
          <img src={tokenUriToImg(n.tokenUri?.raw ?? '')} alt="" />
          <div className="flex gap-2 justify-between mt-2 text-xs">
            <div className="text-left">{n.tokenId}</div>
            <ul className="flex">
              <li>
                <a
                  href={`https://${activeChain?.id === chain.rinkeby.id ? "testnets." : ""}opensea.io/assets/${activeChain?.id === chain.rinkeby.id ? "rinkeby" : "ethereum"}/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}/${n.tokenId}`}
                  className="flex gap-2"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <img src="/media/opensea.png" alt="" className="h-[1em]" />
                </a>
              </li>
              <li>
                <a
                  href={`https://${activeChain?.id === chain.rinkeby.id ? "rinkeby." : ""}looksrare.org/collections/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}/${n.tokenId}`}
                  className="flex gap-2"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <img src="/media/looksrare.png" alt="" className="h-[1em]" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

function tokenUriToImg(uri: string) {
  if (!uri) return '';
  const pure = uri.replace('data:application/json;base64,','');
  const base64 = atob(pure);
  const json = JSON.parse(base64);
  return json.svg_image_data;
}
