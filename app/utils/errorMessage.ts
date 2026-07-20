/**
 * Extracts a human-readable message from a $fetch / h3 error.
 * Falls back to a generic French message when nothing usable is found.
 */
export function errorMessage(e: any, fallback = 'Une erreur est survenue.'): string {
  return (
    e?.data?.data?.message ||
    e?.data?.message ||
    e?.data?.statusMessage ||
    e?.statusMessage ||
    e?.message ||
    fallback
  )
}
