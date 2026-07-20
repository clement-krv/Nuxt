<script setup lang="ts">
const { loggedIn, user } = useAuth()
const { price, dateTime } = useFormat()
const toast = useToast()

const type = ref<string | undefined>(undefined)
const { data: tickets, refresh } = await useFetch('/api/tickets', { query: { type } })

const buying = ref<number | null>(null)

function discount(t: any) {
  if (!t.originalPrice || t.originalPrice <= t.price) return null
  return Math.round((1 - t.price / t.originalPrice) * 100)
}

async function buy(t: any) {
  if (!loggedIn.value) return navigateTo('/connexion?redirect=/billets')
  buying.value = t.id
  try {
    await $fetch(`/api/tickets/${t.id}/buy`, { method: 'POST' })
    toast.add({ title: 'Billet acheté ! Contactez le vendeur.', color: 'success', icon: 'i-lucide-check' })
    await refresh()
  } catch (e: any) {
    toast.add({ title: 'Achat impossible', description: errorMessage(e), color: 'error', icon: 'i-lucide-alert-circle' })
  } finally {
    buying.value = null
  }
}
</script>

<template>
  <div>
    <SectionHeader
      title="Revente de billets"
      subtitle="Train et avion : offrez une seconde vie à vos billets non utilisés."
      icon="i-lucide-ticket"
    >
      <template #actions>
        <UButton to="/billets/nouveau" icon="i-lucide-plus" size="lg">Vendre un billet</UButton>
      </template>
      <template #filters>
        <div class="mt-6 flex gap-2">
          <UButton size="sm" :variant="!type ? 'solid' : 'outline'" :color="!type ? 'primary' : 'neutral'" @click="type = undefined; refresh()">Tous</UButton>
          <UButton size="sm" icon="i-lucide-train-front" :variant="type === 'train' ? 'solid' : 'outline'" :color="type === 'train' ? 'primary' : 'neutral'" @click="type = 'train'; refresh()">Train</UButton>
          <UButton size="sm" icon="i-lucide-plane" :variant="type === 'plane' ? 'solid' : 'outline'" :color="type === 'plane' ? 'primary' : 'neutral'" @click="type = 'plane'; refresh()">Avion</UButton>
        </div>
      </template>
    </SectionHeader>

    <UContainer class="py-8">
      <div v-if="tickets && tickets.length" class="grid gap-4 md:grid-cols-2">
        <UCard v-for="t in tickets" :key="t.id" :class="t.status === 'sold' ? 'opacity-60' : ''">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                <UIcon :name="t.type === 'train' ? 'i-lucide-train-front' : 'i-lucide-plane'" class="size-5" />
              </span>
              <div>
                <p class="font-semibold">{{ t.fromCity }} → {{ t.toCity }}</p>
                <p class="text-xs text-muted">{{ t.company }}</p>
              </div>
            </div>
            <UBadge v-if="discount(t)" color="success" variant="soft">-{{ discount(t) }}%</UBadge>
          </div>

          <div class="mt-3 text-sm text-muted flex items-center gap-2">
            <UIcon name="i-lucide-calendar" class="size-4" /> {{ dateTime(t.travelAt) }}
          </div>
          <p v-if="t.description" class="mt-2 text-sm text-default/80">{{ t.description }}</p>

          <div class="mt-4 flex items-end justify-between border-t border-default pt-3">
            <div>
              <span class="text-2xl font-bold text-primary">{{ price(t.price) }}</span>
              <span v-if="t.originalPrice" class="ml-2 text-sm text-muted line-through">{{ price(t.originalPrice) }}</span>
              <p class="text-xs text-muted mt-0.5">Vendu par {{ t.seller?.name }}</p>
            </div>
            <UBadge v-if="t.status === 'sold'" color="neutral" variant="soft">Vendu</UBadge>
            <UButton
              v-else-if="!(user && t.sellerId === (user as any).id)"
              :loading="buying === t.id"
              icon="i-lucide-shopping-cart"
              @click="buy(t)"
            >
              Acheter
            </UButton>
            <UBadge v-else color="primary" variant="soft">Votre annonce</UBadge>
          </div>
        </UCard>
      </div>
      <div v-else class="text-center py-20 text-muted">
        <UIcon name="i-lucide-ticket" class="size-12 mx-auto mb-3" />
        <p>Aucun billet en vente pour le moment.</p>
      </div>
    </UContainer>
  </div>
</template>
