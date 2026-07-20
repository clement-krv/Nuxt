<script setup lang="ts">
const route = useRoute()
const { price } = useFormat()

const category = ref<string | undefined>((route.query.category as string) || undefined)
const { data: vehicles, refresh } = await useFetch('/api/vehicles', { query: { category } })

function setCategory(c?: string) {
  category.value = c
  refresh()
}
</script>

<template>
  <div>
    <SectionHeader
      title="Marché de véhicules éco"
      subtitle="Vélos, scooters, voitures électriques et attelages traditionnels."
      icon="i-lucide-store"
    >
      <template #actions>
        <UButton to="/vehicules/nouveau" icon="i-lucide-plus" size="lg">Déposer une annonce</UButton>
      </template>
      <template #filters>
        <div class="mt-6 flex flex-wrap gap-2">
          <UButton size="sm" :variant="!category ? 'solid' : 'outline'" :color="!category ? 'primary' : 'neutral'" @click="setCategory(undefined)">Tout</UButton>
          <UButton
            v-for="c in vehicleCategories"
            :key="c.value"
            size="sm"
            :icon="c.icon"
            :variant="category === c.value ? 'solid' : 'outline'"
            :color="category === c.value ? 'primary' : 'neutral'"
            @click="setCategory(c.value)"
          >
            {{ c.label }}
          </UButton>
        </div>
      </template>
    </SectionHeader>

    <UContainer class="py-8">
      <div v-if="vehicles && vehicles.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink v-for="v in vehicles" :key="v.id" :to="`/vehicules/${v.id}`" class="block">
          <UCard class="overflow-hidden hover:ring-2 hover:ring-primary/30 transition h-full" :ui="{ body: 'p-0 sm:p-0' }">
            <div class="relative aspect-video bg-elevated">
              <img v-if="v.image" :src="v.image" :alt="v.title" class="w-full h-full object-cover" >
              <div v-else class="w-full h-full flex items-center justify-center text-muted">
                <UIcon :name="vehicleCategoryIcon(v.category)" class="size-12" />
              </div>
              <UBadge class="absolute top-2 left-2" color="neutral" variant="solid">
                {{ vehicleCategoryLabel(v.category) }}
              </UBadge>
              <UBadge v-if="v.status === 'sold'" class="absolute top-2 right-2" color="error" variant="solid">Vendu</UBadge>
            </div>
            <div class="p-4">
              <h3 class="font-semibold truncate">{{ v.title }}</h3>
              <p class="text-sm text-muted flex items-center gap-1 mt-1">
                <UIcon name="i-lucide-map-pin" class="size-4" /> {{ v.location }}
              </p>
              <div class="mt-3 flex items-center justify-between">
                <span class="text-xl font-bold text-primary">{{ price(v.price) }}</span>
                <UBadge color="neutral" variant="soft" size="sm">{{ v.condition }}</UBadge>
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>
      <div v-else class="text-center py-20 text-muted">
        <UIcon name="i-lucide-package-open" class="size-12 mx-auto mb-3" />
        <p>Aucune annonce dans cette catégorie.</p>
      </div>
    </UContainer>
  </div>
</template>
