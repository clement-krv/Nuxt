<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const toast = useToast()
const loading = ref(false)

const difficultyItems = ['Facile', 'Moyen', 'Difficile']

const state = reactive({
  title: '',
  excerpt: '',
  content: '',
  category: 'Réparation',
  difficulty: 'Facile',
  cover: '',
})

async function onSubmit() {
  loading.value = true
  try {
    const res = await $fetch('/api/diy', { method: 'POST', body: { ...state } })
    toast.add({ title: 'Tutoriel publié !', color: 'success', icon: 'i-lucide-check' })
    await navigateTo(`/bricolage/${res.id}`)
  } catch (e: any) {
    toast.add({ title: e?.data?.statusMessage || 'Erreur', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UContainer class="py-10 max-w-2xl">
    <UButton to="/bricolage" variant="link" color="neutral" icon="i-lucide-arrow-left" class="mb-4 -ml-2">Retour</UButton>
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">Écrire un tutoriel</h1>
        <p class="text-sm text-muted mt-1">Partagez une astuce de réparation ou d'entretien.</p>
      </template>

      <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Titre" required>
          <UInput v-model="state.title" class="w-full" placeholder="Régler ses dérailleurs en 10 minutes" />
        </UFormField>

        <UFormField label="Résumé" required hint="1 à 2 phrases">
          <UInput v-model="state.excerpt" class="w-full" placeholder="Un guide pas à pas pour…" />
        </UFormField>

        <div class="grid sm:grid-cols-2 gap-4">
          <UFormField label="Catégorie" required>
            <UInput v-model="state.category" class="w-full" placeholder="Réparation" />
          </UFormField>
          <UFormField label="Difficulté" required>
            <USelect v-model="state.difficulty" :items="difficultyItems" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Image de couverture (URL)" hint="optionnel">
          <UInput v-model="state.cover" class="w-full" icon="i-lucide-image" placeholder="https://…" />
        </UFormField>

        <UFormField label="Contenu" required>
          <UTextarea v-model="state.content" :rows="8" class="w-full" placeholder="Rédigez votre tutoriel étape par étape…" />
        </UFormField>

        <UButton type="submit" size="lg" block :loading="loading">Publier le tutoriel</UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
