import siteMetaData from '@/data/siteMetaData'
import Link from './Link'
import ThemeSwitch from './ThemeSwitch'
import { Press_Start_2P } from 'next/font/google'
import ConnectButton from './ConnectButton'

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  preload: true,
})

const Header = () => {
  let headerClass =
    'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10 sticky top-0 z-50'

  return (
    <header className={headerClass}>
      <Link href="/" aria-label="Home">
        <div className={`${pressStart2P.className} flex items-center justify-start`}>
          {siteMetaData.title as string}
        </div>
      </Link>
      <div className="flex items-center justify-end space-x-2 leading-5">
        <ThemeSwitch />
        <ConnectButton />
      </div>
    </header>
  )
}

export default Header
