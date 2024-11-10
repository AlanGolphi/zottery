<a id="readme-top"></a>

<div align="center">
  <a href="https://github.com/AlanGolphi/zottery">
    <img src="app/favicon-96.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Zottery</h3>

  <p align="center">
    A lottery fullstack nextjs app in Ethereum
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://zottery.wuds.run)

Inspired by [chainlink lottery](https://github.com/Cyfrin/foundry-smart-contract-lottery-cu)  I wrote my own lottery app, I call it [**zottery**](https://zottery.wuds.run).  

Improved:  
* Sync and display [each lottery history](https://zottery.wuds.run/history) (story off-chain in a postgres database, sync with [this cron-job](app/jobs/update-raffle/route.ts))  
* enable One-Off bet and multi-bet (for saving gas)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Next][Next.js]][Next-url]
* [![Wagmi][Wagmi]][Wagmi-url]
* [![Prisma][Prisma]][Prisma-url]
* [![Solidity][Solidity]][Solidity-url]
* [![Shadcn][Shadcn]][Shadcn-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started


### Prerequisites

1.develop environment: 

* nodejs 18+


2.set all [environment variables](.env.example):  

* first and foremost, deploy [this contract](./hardhat-contracts/contracts/MyRaffle.sol),for [this example](https://zottery.wuds.run),I deploy in [sepolia](https://sepolia.etherscan.io/address/0xb7e15aeb6573adacb1f3351add865aadd46a0366), the contract address is **0xb7e15aeb6573adacb1f3351add865aadd46a0366**

* go [reown](https://cloud.reown.com/) (previous web3modal),create your project, get the project id and set as **NEXT_PUBLIC_WEB3_PROJECT_ID**

* go [alchemy](https://dashboard.alchemy.com/) create you project, get the RPC_URL, for [this example](https://zottery.wuds.run), I use SEPOLIA_RPC_URL. Set it as **NEXT_PUBLIC_ALCHEMY_SEPOLIA_RPC_URL**
  
* in [alchemy](https://dashboard.alchemy.com/), get API_KEY and set as **ALCHEMY_API_KEY**

* prepare the postgresql database. e.g.[neon](https://neon.tech/), create you database connect url and set as **DATABASE_URL**


### Start
1. install all packages
   ```sh
   yarn install
   ```

2. deploy prisma migrate to your database
   ```sh
   npx prisma migrate deploy
   ```
3. generate prisma client
   ```sh
   npx prisma generate
   ```
4. run it
   ```sh
   yarn dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Alan Golphi - [@linkedin](https://www.linkedin.com/in/golphi-alan-b1607828a/) - alanwgolphi@gmail.com

Project Link: [https://zottery.wuds.run](https://zottery.wuds.run)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Below would be a list of resource that you'll find it helpful

* [Next.js](https://nextjs.org/docs)
* [Wagmi](https://wagmi.sh/react/getting-started)
* [Shadcn/ui](https://ui.shadcn.com/docs)
* [Prisma](https://www.prisma.io/docs)
* [Solidity](https://soliditylang.org/)
* [WTF Academy](https://www.wtf.academy/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[product-screenshot]: https://pandora.wuds.run/images/241110-LVYYfath1f.png
[Next.js]: https://img.shields.io/badge/next.js-fff?style=for-the-badge&logo=nextdotjs&logoColor=%23000000
[Next-url]: https://nextjs.org/
[Wagmi]: https://img.shields.io/badge/wagmi-fff?style=for-the-badge&logo=wagmi&logoColor=%23000000
[Wagmi-url]: https://wagmi.sh/
[Prisma]: https://img.shields.io/badge/prisma-fff?style=for-the-badge&logo=prisma&logoColor=%232D3748
[Prisma-url]: https://www.prisma.io/docs
[Solidity]: https://img.shields.io/badge/solidity-fff?style=for-the-badge&logo=solidity&logoColor=%23363636
[Solidity-url]: https://soliditylang.org/
[Shadcn]: https://img.shields.io/badge/shadcn%2Fui-fff?style=for-the-badge&logo=shadcnui&logoColor=%23000000
[Shadcn-url]:https://ui.shadcn.com/docs
