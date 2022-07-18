import { chain, useNetwork } from "wagmi";

export default function PublicLinkList() {
  const { chain: activeChain } = useNetwork();

  return (
    <div className="flex gap-5 lg:gap-10 sm:flex-col lg:flex-row text-2xl sm:text-lg xl:text-2xl 2xl:text-3xl">
      <ul className="space-y-5 lg:space-y-10 w-1/2">
        <li><a target="_blank" rel="noopener noreferrer" href="http://discord.bktr.io" className="flex gap-2"><img src="/media/discord.png" alt="" className="h-[1.4em]" /> Discord</a></li>
        <li><a target="_blank" rel="noopener noreferrer" href="https://twitter.com/bktr_io"  className="flex gap-2"><img src="/media/twitter.png" alt="" className="h-[1.4em]" /> Twitter</a></li>
      </ul>
      <ul className="space-y-5 lg:space-y-10 w-1/2">
        <li><a target="_blank" rel="noopener noreferrer" href={`https://${activeChain?.id === chain.rinkeby.id ? "testnets." : ""}opensea.io/collection/pksl`}  className="flex gap-2"><img src="/media/opensea.png" alt="" className="h-[1.4em]" /> OpenSea</a></li>
        <li><a target="_blank" rel="noopener noreferrer" href={`https://${activeChain?.id === chain.rinkeby.id ? "rinkeby." : ""}looksrare.org/collections/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`} className="flex gap-2"><img src="/media/looksrare.png" alt="" className="h-[1.4em]" /> LooksRare</a></li>
      </ul>
    </div>
  )
}
