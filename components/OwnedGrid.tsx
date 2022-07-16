import { initializeAlchemy, getNftsForOwner, Network, OwnedNft } from '@alch/alchemy-sdk';
import { useEffect, useState } from 'react';

const alchemy = initializeAlchemy({
  apiKey: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  network: Network.ETH_RINKEBY
});

export default function OwnedGrid({ ...props }) {
  const { address, nonce, ...forwardProps } = props;
  const [nfts, setNfts] = useState<OwnedNft[]>([]);

  useEffect(() => {
    if (address) {
      getNftsForOwner(alchemy, address, {
        contractAddresses: [
          (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string)
        ]
      }).then((data) => {
        setNfts(data?.ownedNfts)
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
              <li><a href="#" className="flex gap-2"><img src="/media/opensea.png" alt="" className="h-[1em]" /></a></li>
              <li><a href="#" className="flex gap-2"><img src="/media/looksrare.png" alt="" className="h-[1em]" /></a></li>
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
