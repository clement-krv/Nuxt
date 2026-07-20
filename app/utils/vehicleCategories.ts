export const vehicleCategories = [
  { value: 'velo', label: 'Vélo mécanique', icon: 'i-lucide-bike' },
  { value: 'electrique', label: 'Vélo électrique / VAE', icon: 'i-lucide-zap' },
  { value: 'scooter', label: 'Scooter électrique', icon: 'i-lucide-bike' },
  { value: 'voiture', label: 'Voiture éco', icon: 'i-lucide-car-front' },
  { value: 'attelage', label: 'Attelage (bœuf, âne, cheval)', icon: 'i-lucide-tractor' },
] as const

export function vehicleCategoryLabel(value: string) {
  return vehicleCategories.find((c) => c.value === value)?.label ?? value
}

export function vehicleCategoryIcon(value: string) {
  return vehicleCategories.find((c) => c.value === value)?.icon ?? 'i-lucide-package'
}
