export function useFormat() {
  const price = (value: number | string | null | undefined) => {
    const n = Number(value ?? 0)
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)
  }

  const date = (value: string | Date | null | undefined) => {
    if (!value) return ''
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value))
  }

  const dateTime = (value: string | Date | null | undefined) => {
    if (!value) return ''
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
  }

  const relative = (value: string | Date | null | undefined) => {
    if (!value) return ''
    return date(value)
  }

  return { price, date, dateTime, relative }
}
