<script setup lang="ts">
const { loggedIn, user, logout } = useAuth()
const route = useRoute()

const links = [
  { label: 'Forum', to: '/forum', icon: 'i-lucide-messages-square' },
  { label: 'Covoiturage', to: '/covoiturage', icon: 'i-lucide-car-front' },
  { label: 'Billets', to: '/billets', icon: 'i-lucide-ticket' },
  { label: 'Véhicules', to: '/vehicules', icon: 'i-lucide-bike' },
  { label: 'Bricolage', to: '/bricolage', icon: 'i-lucide-wrench' },
]

const open = ref(false)
watch(() => route.fullPath, () => (open.value = false))

const userMenu = computed(() => [
  [{ label: user.value?.name as string, type: 'label' as const }],
  [{ label: 'Mon espace', icon: 'i-lucide-layout-dashboard', to: '/mon-espace' }],
  [{ label: 'Se déconnecter', icon: 'i-lucide-log-out', onSelect: () => logout() }],
])
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-default bg-default/80 backdrop-blur">
    <UContainer class="flex items-center justify-between gap-4 h-16">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 font-bold text-lg shrink-0">
        <span class="flex items-center justify-center size-9 rounded-full bg-primary/10 text-primary">
          <UIcon name="i-lucide-leaf" class="size-5" />
        </span>
        <span class="hidden sm:inline">Éco<span class="text-primary">Transport</span></span>
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="hidden lg:flex items-center gap-1">
        <UButton
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          :icon="l.icon"
          :variant="route.path.startsWith(l.to) ? 'soft' : 'ghost'"
          :color="route.path.startsWith(l.to) ? 'primary' : 'neutral'"
          size="sm"
        >
          {{ l.label }}
        </UButton>
      </nav>

      <!-- Right side -->
      <div class="flex items-center gap-2">
        <UColorModeButton />

        <template v-if="loggedIn">
          <UDropdownMenu :items="userMenu">
            <UButton color="neutral" variant="ghost" trailing-icon="i-lucide-chevron-down">
              <UAvatar :src="user?.avatar || undefined" :alt="user?.name as string" size="xs" />
              <span class="hidden sm:inline">{{ user?.name }}</span>
            </UButton>
          </UDropdownMenu>
        </template>
        <template v-else>
          <UButton to="/connexion" color="neutral" variant="ghost" size="sm" class="hidden sm:inline-flex">
            Connexion
          </UButton>
          <UButton to="/inscription" color="primary" size="sm">S'inscrire</UButton>
        </template>

        <!-- Mobile menu button -->
        <UButton
          class="lg:hidden"
          color="neutral"
          variant="ghost"
          :icon="open ? 'i-lucide-x' : 'i-lucide-menu'"
          @click="open = !open"
        />
      </div>
    </UContainer>

    <!-- Mobile nav -->
    <div v-if="open" class="lg:hidden border-t border-default bg-default">
      <UContainer class="py-3 flex flex-col gap-1">
        <UButton
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          :icon="l.icon"
          variant="ghost"
          color="neutral"
          block
          class="justify-start"
        >
          {{ l.label }}
        </UButton>
        <UButton v-if="!loggedIn" to="/connexion" variant="ghost" color="neutral" block class="justify-start" icon="i-lucide-log-in">
          Connexion
        </UButton>
      </UContainer>
    </div>
  </header>
</template>
