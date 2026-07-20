<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { user, logout } = useAuth()

const actions = [
  { label: 'Proposer un trajet', to: '/covoiturage/nouveau', icon: 'i-lucide-car-front' },
  { label: 'Vendre un billet', to: '/billets/nouveau', icon: 'i-lucide-ticket' },
  { label: 'Déposer une annonce véhicule', to: '/vehicules/nouveau', icon: 'i-lucide-store' },
  { label: 'Écrire un tutoriel', to: '/bricolage/nouveau', icon: 'i-lucide-wrench' },
  { label: 'Lancer une discussion', to: '/forum', icon: 'i-lucide-messages-square' },
]
</script>

<template>
  <UContainer class="py-10 max-w-3xl">
    <div class="flex items-center gap-4 mb-8">
      <UAvatar :src="(user as any)?.avatar || undefined" :alt="(user as any)?.name" size="xl" />
      <div>
        <h1 class="text-2xl font-bold">Bonjour {{ (user as any)?.name }} 👋</h1>
        <p class="text-muted">{{ (user as any)?.email }}</p>
      </div>
      <UButton class="ml-auto" color="neutral" variant="ghost" icon="i-lucide-log-out" @click="logout">
        Déconnexion
      </UButton>
    </div>

    <h2 class="font-semibold mb-4">Que voulez-vous faire ?</h2>
    <div class="grid gap-4 sm:grid-cols-2">
      <NuxtLink v-for="a in actions" :key="a.to" :to="a.to">
        <UCard class="hover:ring-2 hover:ring-primary/30 transition">
          <div class="flex items-center gap-3">
            <span class="flex items-center justify-center size-11 rounded-xl bg-primary/10 text-primary">
              <UIcon :name="a.icon" class="size-5" />
            </span>
            <span class="font-medium">{{ a.label }}</span>
            <UIcon name="i-lucide-arrow-right" class="size-4 ml-auto text-muted" />
          </div>
        </UCard>
      </NuxtLink>
    </div>
  </UContainer>
</template>
