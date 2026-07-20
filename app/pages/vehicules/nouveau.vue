<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const toast = useToast()
const loading = ref(false)

const conditionItems = ['Neuf', 'Très bon état', 'Bon état', 'Occasion', 'À réparer']
const categoryItems = vehicleCategories.map((c) => ({ label: c.label, value: c.value }))

const state = reactive({
  category: 'velo',
  title: '',
  description: '',
  price: 0,
  condition: 'Bon état',
  location: '',
  image: '',
})

async function onSubmit() {
  loading.value = true
  try {
    const res = await $fetch('/api/vehicles', { method: 'POST', body: { ...state } })
    toast.add({ title: 'Annonce publiée !', color: 'success', icon: 'i-lucide-check' })
    await navigateTo(`/vehicules/${res.id}`)
  } catch (e: any) {
    toast.add({ title: 'Publication impossible', description: errorMessage(e), color: 'error', icon: 'i-lucide-alert-circle' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UContainer class="py-10 max-w-2xl">
    <UButton to="/vehicules" variant="link" color="neutral" icon="i-lucide-arrow-left" class="mb-4 -ml-2">Retour</UButton>
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">Déposer une annonce</h1>
        <p class="text-sm text-muted mt-1">Vendez votre véhicule éco à la communauté.</p>
      </template>

      <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Catégorie" required>
          <USelect v-model="state.category" :items="categoryItems" class="w-full" />
        </UFormField>

        <UFormField label="Titre" required>
          <UInput v-model="state.title" class="w-full" placeholder="VAE Moustache Samedi 27" />
        </UFormField>

        <UFormField label="Description" required>
          <UTextarea v-model="state.description" :rows="4" class="w-full" placeholder="État, kilométrage, accessoires inclus…" />
        </UFormField>

        <div class="grid sm:grid-cols-2 gap-4">
          <UFormField label="Prix (€)" required>
            <UInput v-model.number="state.price" type="number" min="0" class="w-full" />
          </UFormField>
          <UFormField label="État" required>
            <USelect v-model="state.condition" :items="conditionItems" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Localisation" required>
          <UInput v-model="state.location" class="w-full" icon="i-lucide-map-pin" placeholder="Lyon 7e" />
        </UFormField>

        <UFormField label="Image (URL)" hint="optionnel">
          <UInput v-model="state.image" class="w-full" icon="i-lucide-image" placeholder="https://…" />
        </UFormField>

        <UButton type="submit" size="lg" block :loading="loading">Publier l'annonce</UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
