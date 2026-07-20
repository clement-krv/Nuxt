<script setup lang="ts">
const { price, dateTime } = useFormat()

const filters = reactive({ from: '', to: '' })
const query = reactive({ from: '', to: '' })

const { data: trips, refresh } = await useFetch('/api/carpool/trips', { query })

function search() {
  query.from = filters.from
  query.to = filters.to
  refresh()
}
function reset() {
  filters.from = ''
  filters.to = ''
  query.from = ''
  query.to = ''
  refresh()
}
</script>

<template>
  <div>
    <SectionHeader
      title="Covoiturage"
      subtitle="Partagez la route en véhicule éco et divisez vos frais."
      icon="i-lucide-car-front"
    >
      <template #actions>
        <UButton to="/covoiturage/nouveau" icon="i-lucide-plus" size="lg">Proposer un trajet</UButton>
      </template>
      <template #filters>
        <div class="mt-6 flex flex-col sm:flex-row gap-3">
          <UInput v-model="filters.from" icon="i-lucide-map-pin" placeholder="Départ" class="flex-1" @keyup.enter="search" />
          <UInput v-model="filters.to" icon="i-lucide-flag" placeholder="Arrivée" class="flex-1" @keyup.enter="search" />
          <UButton icon="i-lucide-search" @click="search">Rechercher</UButton>
          <UButton v-if="query.from || query.to" color="neutral" variant="ghost" @click="reset">Réinitialiser</UButton>
        </div>
      </template>
    </SectionHeader>

    <UContainer class="py-8">
      <div v-if="trips && trips.length" class="grid gap-4">
        <NuxtLink v-for="t in trips" :key="t.id" :to="`/covoiturage/${t.id}`" class="block">
          <UCard class="hover:ring-2 hover:ring-primary/30 transition">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 font-semibold text-lg">
                  <span>{{ t.fromCity }}</span>
                  <UIcon name="i-lucide-arrow-right" class="size-4 text-primary" />
                  <span>{{ t.toCity }}</span>
                </div>
                <p class="text-sm text-muted mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span class="inline-flex items-center gap-1"><UIcon name="i-lucide-calendar" class="size-4" /> {{ dateTime(t.departureAt) }}</span>
                  <span class="inline-flex items-center gap-1"><UIcon name="i-lucide-car" class="size-4" /> {{ t.vehicleType }}</span>
                </p>
              </div>
              <div class="flex items-center gap-6 shrink-0">
                <div class="text-center">
                  <UBadge :color="t.seatsAvailable > 0 ? 'success' : 'error'" variant="soft">
                    <UIcon name="i-lucide-users" class="size-3.5 mr-1" />
                    {{ t.seatsAvailable }} / {{ t.seatsTotal }}
                  </UBadge>
                  <p class="text-xs text-muted mt-1">places</p>
                </div>
                <div class="text-right">
                  <p class="text-xl font-bold text-primary">{{ price(t.pricePerSeat) }}</p>
                  <p class="text-xs text-muted">/ passager</p>
                </div>
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>
      <div v-else class="text-center py-20 text-muted">
        <UIcon name="i-lucide-car-front" class="size-12 mx-auto mb-3" />
        <p>Aucun trajet trouvé. Proposez le vôtre !</p>
      </div>
    </UContainer>
  </div>
</template>
