export interface IUser {
  id: string
  fullName: string
  email: string
  accountNumber: string
  checkingBalance: number
  cryptoBalance: number
  investmentTotal: number
}

export interface ITransaction {
  id: string
  type: string
  amount: number
  status: string
  reference: string
}
