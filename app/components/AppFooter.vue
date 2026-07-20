<script setup lang="ts">
const year = new Date().getFullYear()
const cols = [
  {
    title: 'Communauté',
    links: [
      { label: 'Forum', to: '/forum' },
      { label: 'Bricolage', to: '/bricolage' },
    ],
  },
  {
    title: 'Se déplacer',
    links: [
      { label: 'Covoiturage', to: '/covoiturage' },
      { label: 'Billets train/avion', to: '/billets' },
    ],
  },
  {
    title: 'Acheter',
    links: [
      { label: 'Véhicules éco', to: '/vehicules' },
      { label: 'Attelages', to: '/vehicules?category=attelage' },
    ],
  },
]
</script>

<template>
  <footer class="border-t border-default mt-16 bg-elevated/30">
    <UContainer class="py-12">
      <div class="grid gap-8 md:grid-cols-4">
        <div>
          <div class="flex items-center gap-2 font-bold text-lg mb-3">
            <span class="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary">
              <UIcon name="i-lucide-leaf" class="size-4" />
            </span>
            Éco<span class="text-primary">Transport</span>
          </div>
          <p class="text-sm text-muted">
            La communauté française de la mobilité durable. Se déplacer mieux, ensemble.
          </p>
        </div>

        <div v-for="c in cols" :key="c.title">
          <h3 class="font-semibold mb-3 text-sm">{{ c.title }}</h3>
          <ul class="space-y-2">
            <li v-for="l in c.links" :key="l.to">
              <NuxtLink :to="l.to" class="text-sm text-muted hover:text-primary transition">
                {{ l.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-10 pt-6 border-t border-default flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
        <p>© {{ year }} ÉcoTransport — Projet pédagogique ESGI.</p>
        <p class="flex items-center gap-1">
          Fait avec <UIcon name="i-lucide-heart" class="text-primary size-4" /> pour la planète
        </p>
      </div>
    </UContainer>
  </footer>
</template>
