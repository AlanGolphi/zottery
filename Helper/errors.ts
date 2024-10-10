export class RaffleCalculationgError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RaffleCalculationgError'
  }
}
