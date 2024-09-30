import { PrismaClient, RaffleState } from '@prisma/client'

const prisma = new PrismaClient()

async function mockData() {
  const generateRandomEthAddress = () => {
    const characters = '0123456789abcdef'
    let address = '0x'
    for (let i = 0; i < 40; i++) {
      address += characters[Math.floor(Math.random() * characters.length)]
    }
    return address
  }

  const mockRaffles = Array.from({ length: 20 }, (_, index) => {
    const playerCount = Math.floor(Math.random() * 10) + 2
    const players = Array.from({ length: playerCount }, () => generateRandomEthAddress())
    const winner = players[Math.floor(Math.random() * players.length)]
    return {
      orderId: index + 1,
      raffleState: index === 19 ? RaffleState.OPEN : RaffleState.END,
      players,
      winner,
    }
  })

  for (const raffle of mockRaffles) {
    await prisma.raffle.create({
      data: raffle,
    })
  }

  console.log('----------mock done----------')
}

async function main() {
  await prisma.raffle.deleteMany()
  await mockData()
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error)
    prisma.$disconnect()
    process.exit(1)
  })
