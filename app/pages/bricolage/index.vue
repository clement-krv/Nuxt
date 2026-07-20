<script setup lang="ts">
const { date } = useFormat()
const { data: articles } = await useFetch('/api/diy')

const diffColor = (d: string) =>
  d === 'Facile' ? 'success' : d === 'Moyen' ? 'warning' : 'error'
</script>

<template>
  <div>
    <SectionHeader
      title="Bricolage & entraide"
      subtitle="Tutoriels pour réparer et entretenir vos moyens de transport."
      icon="i-lucide-wrench"
    >
      <template #actions>
        <UButton to="/bricolage/nouveau" icon="i-lucide-plus" size="lg">Écrire un tutoriel</UButton>
      </template>
    </SectionHeader>

    <UContainer class="py-8">
      <div v-if="articles && articles.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink v-for="a in articles" :key="a.id" :to="`/bricolage/${a.id}`" class="block">
          <UCard class="overflow-hidden hover:ring-2 hover:ring-primary/30 transition h-full" :ui="{ body: 'p-0 sm:p-0' }">
            <div class="relative aspect-video bg-elevated">
              <img v-if="a.cover" :src="a.cover" :alt="a.title" class="w-full h-full object-cover" >
              <div v-else class="w-full h-full flex items-center justify-center text-muted">
                <UIcon name="i-lucide-wrench" class="size-12" />
              </div>
              <UBadge class="absolute top-2 left-2" :color="diffColor(a.difficulty)" variant="solid">
                {{ a.difficulty }}
              </UBadge>
            </div>
            <div class="p-4">
              <UBadge color="neutral" variant="soft" size="sm">{{ a.category }}</UBadge>
              <h3 class="font-semibold mt-2 line-clamp-2">{{ a.title }}</h3>
              <p class="text-sm text-muted mt-1 line-clamp-2">{{ a.excerpt }}</p>
              <div class="mt-3 flex items-center justify-between text-xs text-muted">
                <span class="flex items-center gap-1">
                  <UAvatar :src="a.author?.avatar || undefined" :alt="a.author?.name" size="2xs" /> {{ a.author?.name }}
                </span>
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-message-circle" class="size-3.5" /> {{ a.commentCount }}
                </span>
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>
      <div v-else class="text-center py-20 text-muted">
        <UIcon name="i-lucide-wrench" class="size-12 mx-auto mb-3" />
        <p>Aucun tutoriel pour l'instant. Partagez votre savoir-faire !</p>
      </div>
    </UContainer>
  </div>
</template>
