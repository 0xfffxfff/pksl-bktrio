import merge from 'lodash.merge';

import '../styles/global.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  wallet,
  lightTheme,
  Theme
} from '@rainbow-me/rainbowkit';
import { chain, createClient, configureChains, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.rinkeby,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
      ? [chain.rinkeby]
      : []),
  ],
  [
    alchemyProvider({ alchemyId: '_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC' }),
    publicProvider(),
  ]
);

const { wallets } = getDefaultWallets({
  appName: 'RainbowKit Mint NFT Demo',
  chains,
});

const demoAppInfo = {
  appName: 'RainbowKit Mint NFT Demo',
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [wallet.argent({ chains }), wallet.trust({ chains })],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const customTheme: Theme = merge(lightTheme(),
  {
    colors: {
      accentColor: '#000',
      closeButtonBackground: '#fff',

      actionButtonSecondaryBackground: '#fff',

      actionButtonBorder: "rgba(0, 0, 0, 0)",
      actionButtonBorderMobile: "rgba(0, 0, 0, 0)",
      generalBorder: "rgba(0, 0, 0, 0)",
      generalBorderDim: "rgba(0, 0, 0, 0)",
    },
    fonts: {
      body: 'NeueBit-Bold'
    },
    radii: {
      actionButton: '0',
      connectButton: '0',
      menuButton: '0',
      modal: '0',
      modalMobile: '0'
    },
    shadows: {
      connectButton: 'none',
      // dialog: '...',
      // profileDetailsAction: '...',
      // selectedOption: '...',
      // selectedWallet: '...',
      // walletLogo: '...',
    },
  }
)

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="fixed h-screen w-screen top-0 right-0 bottom-0 left-0 z-0">
        <img src="/media/bg32.gif" className="w-full h-full" />
      </div>
      <div className="relative z-1">
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider appInfo={demoAppInfo} chains={chains} theme={customTheme}>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      </div>
    </>
  );
}

export default App;
