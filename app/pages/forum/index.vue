<script setup lang="ts">
const { loggedIn } = useAuth()
const { date } = useFormat()
const toast = useToast()

const activeCategory = ref<string | undefined>(undefined)

const { data: categories } = await useFetch('/api/forum/categories')
const { data: threads, refresh } = await useFetch('/api/forum/threads', {
  query: { category: activeCategory },
})

const showNew = ref(false)
const submitting = ref(false)
const form = reactive({ categoryId: undefined as number | undefined, title: '', content: '' })

const categoryOptions = computed(() =>
  (categories.value || []).map((c) => ({ label: c.name, value: c.id })),
)

function openNew() {
  if (!loggedIn.value) return navigateTo('/connexion?redirect=/forum')
  form.categoryId = categories.value?.[0]?.id
  showNew.value = true
}

async function createThread() {
  submitting.value = true
  try {
    const res = await $fetch('/api/forum/threads', { method: 'POST', body: { ...form } })
    showNew.value = false
    form.title = ''
    form.content = ''
    await navigateTo(`/forum/${res.id}`)
  } catch (e: any) {
    toast.add({ title: 'Publication impossible', description: errorMessage(e), color: 'error', icon: 'i-lucide-alert-circle' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <SectionHeader
      title="Forum de discussion"
      subtitle="Posez vos questions, partagez vos astuces de mobilité douce."
      icon="i-lucide-messages-square"
    >
      <template #actions>
        <UButton icon="i-lucide-plus" size="lg" @click="openNew">Nouvelle discussion</UButton>
      </template>
    </SectionHeader>

    <UContainer class="py-8">
      <!-- Category chips -->
      <div class="flex flex-wrap gap-2 mb-6">
        <UButton
          size="sm"
          :variant="!activeCategory ? 'solid' : 'outline'"
          :color="!activeCategory ? 'primary' : 'neutral'"
          @click="activeCategory = undefined; refresh()"
        >
          Toutes
        </UButton>
        <UButton
          v-for="c in categories"
          :key="c.slug"
          size="sm"
          :icon="c.icon || undefined"
          :variant="activeCategory === c.slug ? 'solid' : 'outline'"
          :color="activeCategory === c.slug ? 'primary' : 'neutral'"
          @click="activeCategory = c.slug; refresh()"
        >
          {{ c.name }}
          <UBadge color="neutral" variant="soft" size="sm">{{ c.threadCount }}</UBadge>
        </UButton>
      </div>

      <!-- Threads -->
      <div v-if="threads && threads.length" class="space-y-3">
        <NuxtLink v-for="t in threads" :key="t.id" :to="`/forum/${t.id}`" class="block">
          <UCard class="hover:ring-2 hover:ring-primary/30 transition">
            <div class="flex items-center gap-4">
              <UAvatar :src="t.author?.avatar || undefined" :alt="t.author?.name" size="md" />
              <div class="min-w-0 flex-1">
                <h3 class="font-semibold truncate">{{ t.title }}</h3>
                <p class="text-sm text-muted">
                  par {{ t.author?.name }} · <UBadge color="neutral" variant="soft" size="sm">{{ t.category?.name }}</UBadge>
                </p>
              </div>
              <div class="text-right shrink-0 hidden sm:block">
                <p class="text-sm font-medium flex items-center gap-1 justify-end">
                  <UIcon name="i-lucide-message-circle" class="size-4" /> {{ t.replies }}
                </p>
                <p class="text-xs text-muted">{{ date(t.createdAt) }}</p>
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>
      <div v-else class="text-center py-20 text-muted">
        <UIcon name="i-lucide-message-square-dashed" class="size-12 mx-auto mb-3" />
        <p>Aucune discussion pour le moment. Lancez la première !</p>
      </div>
    </UContainer>

    <!-- New thread modal -->
    <UModal v-model:open="showNew" title="Nouvelle discussion" description="Partagez votre question avec la communauté.">
      <template #body>
        <div class="space-y-4">
          <UFormField label="Catégorie" required>
            <USelect v-model="form.categoryId" :items="categoryOptions" class="w-full" placeholder="Choisir une catégorie" />
          </UFormField>
          <UFormField label="Titre" required>
            <UInput v-model="form.title" class="w-full" placeholder="Ex : Quel vélo pour la ville ?" />
          </UFormField>
          <UFormField label="Message" required>
            <UTextarea v-model="form.content" class="w-full" :rows="5" placeholder="Décrivez votre question…" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton color="neutral" variant="ghost" @click="showNew = false">Annuler</UButton>
          <UButton :loading="submitting" @click="createThread">Publier</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
