import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import ThemeProviders from '@/context/theme-providers'
import siteMetaData from '@/data/siteMetaData'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'

import { cookieToInitialState } from 'wagmi'

import { config } from '@/config'
import Web3ModalProvider from '@/context'

export const metadata: Metadata = {
  //TODO: Add metadataBase
  metadataBase: undefined,
  title: {
    default: siteMetaData.title as string,
    template: `%s | ${siteMetaData.title}`,
  },
  description: siteMetaData.description,
  authors: siteMetaData.authors,
  keywords: siteMetaData.keywords,
  referrer: siteMetaData.referrer,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialState = cookieToInitialState(config, headers().get('cookie'))
  return (
    <html lang="en" className={`${inter.className} h-full scroll-smooth`} suppressHydrationWarning>
      <link rel="apple-touch-icon" href="./favicon-96.png" type="image/png" sizes="96x96" />
      <link rel="icon" type="image/png" sizes="32x32" href="./favicon-32.png" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <body className="h-full bg-white pl-[calc(100vw-100%)] font-sans text-black antialiased dark:bg-gray-950 dark:text-white">
        <ThemeProviders>
          <Web3ModalProvider initialState={initialState}>
            <SectionContainer>
              <Header />
              <main className="mb-auto">{children}</main>
            </SectionContainer>
          </Web3ModalProvider>
        </ThemeProviders>
      </body>
    </html>
  )
}
