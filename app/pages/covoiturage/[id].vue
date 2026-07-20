<script setup lang="ts">
const route = useRoute()
const { loggedIn, user } = useAuth()
const { price, dateTime } = useFormat()
const toast = useToast()

const { data: trip, refresh } = await useFetch(`/api/carpool/trips/${route.params.id}`)

const seats = ref(1)
const booking = ref(false)

const isDriver = computed(() => trip.value && user.value && trip.value.driverId === (user.value as any).id)
const alreadyBooked = computed(() =>
  trip.value?.bookings?.some((b: any) => b.userId === (user.value as any)?.id && b.status === 'confirmed'),
)

async function book() {
  if (!loggedIn.value) return navigateTo(`/connexion?redirect=/covoiturage/${route.params.id}`)
  booking.value = true
  try {
    await $fetch(`/api/carpool/trips/${route.params.id}/book`, { method: 'POST', body: { seats: seats.value } })
    toast.add({ title: 'Réservation confirmée ! 🎉', color: 'success', icon: 'i-lucide-check' })
    await refresh()
  } catch (e: any) {
    toast.add({ title: e?.data?.statusMessage || 'Réservation impossible', color: 'error' })
  } finally {
    booking.value = false
  }
}
</script>

<template>
  <UContainer class="py-8 max-w-3xl" v-if="trip">
    <UButton to="/covoiturage" variant="link" color="neutral" icon="i-lucide-arrow-left" class="mb-4 -ml-2">
      Retour
    </UButton>

    <UCard>
      <div class="flex items-center gap-3 text-2xl font-bold mb-4">
        <span>{{ trip.fromCity }}</span>
        <UIcon name="i-lucide-arrow-right" class="size-6 text-primary" />
        <span>{{ trip.toCity }}</span>
      </div>

      <div class="grid sm:grid-cols-2 gap-4 text-sm">
        <div class="flex items-center gap-2"><UIcon name="i-lucide-calendar" class="size-5 text-primary" /> {{ dateTime(trip.departureAt) }}</div>
        <div class="flex items-center gap-2"><UIcon name="i-lucide-car" class="size-5 text-primary" /> {{ trip.vehicleType }}</div>
        <div class="flex items-center gap-2"><UIcon name="i-lucide-users" class="size-5 text-primary" /> {{ trip.seatsAvailable }} place(s) sur {{ trip.seatsTotal }}</div>
        <div class="flex items-center gap-2"><UIcon name="i-lucide-euro" class="size-5 text-primary" /> {{ price(trip.pricePerSeat) }} par passager</div>
      </div>

      <p v-if="trip.description" class="mt-4 text-default/90 whitespace-pre-line border-t border-default pt-4">
        {{ trip.description }}
      </p>

      <div class="mt-4 flex items-center gap-3 border-t border-default pt-4">
        <UAvatar :src="trip.driver?.avatar || undefined" :alt="trip.driver?.name" size="md" />
        <div>
          <p class="text-xs text-muted">Conducteur</p>
          <p class="font-medium">{{ trip.driver?.name }}</p>
        </div>
      </div>
    </UCard>

    <!-- Booking -->
    <UCard class="mt-6">
      <template #header><h2 class="font-semibold">Réserver</h2></template>

      <div v-if="isDriver" class="text-muted text-sm py-2">
        <UIcon name="i-lucide-info" class="size-4" /> Vous êtes le conducteur de ce trajet.
      </div>
      <div v-else-if="alreadyBooked" class="text-success text-sm py-2 flex items-center gap-2">
        <UIcon name="i-lucide-check-circle" class="size-5" /> Vous avez réservé ce trajet.
      </div>
      <div v-else-if="trip.seatsAvailable <= 0" class="text-error text-sm py-2">
        <UIcon name="i-lucide-x-circle" class="size-4" /> Complet.
      </div>
      <div v-else class="flex flex-col sm:flex-row sm:items-end gap-4">
        <UFormField label="Nombre de places" class="w-full sm:w-40">
          <UInput v-model.number="seats" type="number" min="1" :max="trip.seatsAvailable" class="w-full" />
        </UFormField>
        <div class="flex-1 text-sm text-muted">
          Total : <span class="font-bold text-primary text-lg">{{ price(seats * trip.pricePerSeat) }}</span>
        </div>
        <UButton size="lg" :loading="booking" icon="i-lucide-check" @click="book">Réserver</UButton>
      </div>
    </UCard>

    <!-- Passengers -->
    <UCard v-if="trip.bookings?.length" class="mt-6">
      <template #header><h2 class="font-semibold">Passagers</h2></template>
      <div class="flex flex-wrap gap-3">
        <div v-for="b in trip.bookings" :key="b.id" class="flex items-center gap-2">
          <UAvatar :src="b.user?.avatar || undefined" :alt="b.user?.name" size="sm" />
          <span class="text-sm">{{ b.user?.name }} <span class="text-muted">({{ b.seats }})</span></span>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
