import merge from 'lodash.merge';

import 'react-toastify/dist/ReactToastify.css';
import '@rainbow-me/rainbowkit/styles.css';
import '../styles/global.css';
import type { AppProps } from 'next/app';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  wallet,
  lightTheme,
  Theme,
  darkTheme,
  AvatarComponent
} from '@rainbow-me/rainbowkit';
import { chain, createClient, configureChains, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { DefaultSeo } from 'next-seo';
import Head from 'next/head';

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.mainnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
      ? [chain.rinkeby]
      : []),
  ],
  [
    publicProvider(),
    alchemyProvider({ alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_APIKEY }),
  ]
);

const { wallets } = getDefaultWallets({
  appName: 'pksl bktrio',
  chains,
});

const appInfo = {
  appName: 'pksl bktrio',
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

const customTheme: Theme = merge(darkTheme({
    borderRadius: 'none'
  }),
  {
    colors: {
      accentColor: '#bbb',
      closeButtonBackground: '#fff',
      connectButtonBackground: '#000',
      connectButtonInnerBackground: '#000',
      modalBackground: '#000',

      profileForeground: '#000',

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
      dialog: 'none',
      profileDetailsAction: 'none',
      selectedOption: 'none',
      selectedWallet: 'none',
      walletLogo: 'none',
    },
  }
)


const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  return ensImage ? (
    <img
      src={ensImage}
      width={size}
      height={size}
      style={{ borderRadius: 999 }}
    />
  ) : (
    <div
      style={{
        backgroundColor: '#fff',
        backgroundImage: 'url("/media/primma-morph.gif")',
        backgroundSize: '50% auto',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        borderRadius: 999,
        height: size,
        width: size,
      }}
    >
      {/* :^) */}
    </div>
  );
};

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="fixed top-[-7%] right-[-7%] bottom-[-7%] left-[-7%] z-0">
        <img src="/media/bg32.gif" className="w-full h-full" />
      </div>
      <div className="relative z-1">
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
            appInfo={appInfo}
            chains={chains}
            theme={customTheme}
            showRecentTransactions={true}
            avatar={CustomAvatar}
          >
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      </div>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <DefaultSeo
        title="pksl bktrio"
        description="pksl bktrios are a new on-chain strain of the original bktr.io. brutally pixelated, irregularly animated, randomly combined, visually surprising. clean, cute, scary, overwhelming, brimming with life."
        canonical="https://pksl.bktr.io"
        openGraph={{
          url: 'https://pksl.bktr.io',
          title: 'pksl bktrio',
          description: 'pksl bktrios are a new on-chain strain of the original bktr.io. brutally pixelated, irregularly animated, randomly combined, visually surprising. clean, cute, scary, overwhelming, brimming with life.',
          images: [
            {
              url: 'https://pksl.bktr.io/og-image.jpg',
              width: 1800,
              height: 1280,
              alt: 'pksl bktrio',
              type: 'image/jpeg',
            }
          ],
          site_name: 'pksl bktrio',
        }}
        twitter={{
          handle: '@bktr_io',
          site: '@site',
          cardType: 'summary_large_image',
        }}
      />
    </>
  );
}

export default App;
