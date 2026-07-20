<script setup lang="ts">
const route = useRoute()
const { loggedIn, user } = useAuth()
const { price } = useFormat()
const toast = useToast()

const { data: v, refresh } = await useFetch(`/api/vehicles/${route.params.id}`)

const buying = ref(false)
const isOwner = computed(() => v.value && user.value && v.value.sellerId === (user.value as any).id)

async function buy() {
  if (!loggedIn.value) return navigateTo(`/connexion?redirect=/vehicules/${route.params.id}`)
  buying.value = true
  try {
    await $fetch(`/api/vehicles/${route.params.id}/buy`, { method: 'POST' })
    toast.add({ title: 'Achat enregistré ! Contactez le vendeur.', color: 'success', icon: 'i-lucide-check' })
    await refresh()
  } catch (e: any) {
    toast.add({ title: 'Achat impossible', description: errorMessage(e), color: 'error', icon: 'i-lucide-alert-circle' })
  } finally {
    buying.value = false
  }
}
</script>

<template>
  <UContainer class="py-8 max-w-4xl" v-if="v">
    <UButton to="/vehicules" variant="link" color="neutral" icon="i-lucide-arrow-left" class="mb-4 -ml-2">Retour</UButton>

    <div class="grid md:grid-cols-2 gap-8">
      <div class="rounded-xl overflow-hidden bg-elevated aspect-video">
        <img v-if="v.image" :src="v.image" :alt="v.title" class="w-full h-full object-cover" >
        <div v-else class="w-full h-full flex items-center justify-center text-muted">
          <UIcon :name="vehicleCategoryIcon(v.category)" class="size-16" />
        </div>
      </div>

      <div>
        <UBadge color="primary" variant="soft">{{ vehicleCategoryLabel(v.category) }}</UBadge>
        <h1 class="text-2xl font-bold mt-2">{{ v.title }}</h1>
        <p class="text-3xl font-extrabold text-primary mt-3">{{ price(v.price) }}</p>

        <div class="mt-4 space-y-2 text-sm">
          <p class="flex items-center gap-2"><UIcon name="i-lucide-map-pin" class="size-4 text-primary" /> {{ v.location }}</p>
          <p class="flex items-center gap-2"><UIcon name="i-lucide-badge-check" class="size-4 text-primary" /> État : {{ v.condition }}</p>
        </div>

        <div class="mt-4 flex items-center gap-3 border-t border-default pt-4">
          <UAvatar :src="v.seller?.avatar || undefined" :alt="v.seller?.name" size="md" />
          <div>
            <p class="text-xs text-muted">Vendeur</p>
            <p class="font-medium">{{ v.seller?.name }}</p>
          </div>
        </div>

        <div class="mt-6">
          <UBadge v-if="v.status === 'sold'" color="error" variant="soft" size="lg">Véhicule vendu</UBadge>
          <UBadge v-else-if="isOwner" color="primary" variant="soft" size="lg">Votre annonce</UBadge>
          <UButton v-else size="xl" block :loading="buying" icon="i-lucide-shopping-cart" @click="buy">
            Acheter ce véhicule
          </UButton>
        </div>
      </div>
    </div>

    <UCard class="mt-8">
      <template #header><h2 class="font-semibold">Description</h2></template>
      <p class="whitespace-pre-line text-default/90">{{ v.description }}</p>
    </UCard>
  </UContainer>
</template>
