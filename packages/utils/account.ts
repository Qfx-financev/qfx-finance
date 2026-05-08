export const formatCurrency = (n:number) => {
  return new Intl.NumberFormat('en-US', {
    style:'currency',
    currency:'USD'
  }).format(n)
}

export const generateReference = (prefix:string) => `${prefix}-${Date.now()}`
