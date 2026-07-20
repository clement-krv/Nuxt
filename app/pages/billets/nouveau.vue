<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const toast = useToast()
const loading = ref(false)

const typeItems = [
  { label: 'Train', value: 'train' },
  { label: 'Avion', value: 'plane' },
]

const state = reactive({
  type: 'train',
  fromCity: '',
  toCity: '',
  company: '',
  travelAt: '',
  price: 0,
  originalPrice: undefined as number | undefined,
  description: '',
})

async function onSubmit() {
  loading.value = true
  try {
    const res = await $fetch('/api/tickets', { method: 'POST', body: { ...state } })
    toast.add({ title: 'Billet mis en vente !', color: 'success', icon: 'i-lucide-check' })
    await navigateTo('/billets')
    return res
  } catch (e: any) {
    toast.add({ title: 'Mise en vente impossible', description: errorMessage(e), color: 'error', icon: 'i-lucide-alert-circle' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UContainer class="py-10 max-w-2xl">
    <UButton to="/billets" variant="link" color="neutral" icon="i-lucide-arrow-left" class="mb-4 -ml-2">Retour</UButton>
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">Vendre un billet</h1>
        <p class="text-sm text-muted mt-1">Décrivez votre billet de train ou d'avion.</p>
      </template>

      <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Type" required>
          <USelect v-model="state.type" :items="typeItems" class="w-full" />
        </UFormField>

        <div class="grid sm:grid-cols-2 gap-4">
          <UFormField label="Ville de départ" required>
            <UInput v-model="state.fromCity" class="w-full" placeholder="Paris" />
          </UFormField>
          <UFormField label="Ville d'arrivée" required>
            <UInput v-model="state.toCity" class="w-full" placeholder="Marseille" />
          </UFormField>
        </div>

        <UFormField label="Compagnie" required>
          <UInput v-model="state.company" class="w-full" placeholder="SNCF TGV INOUI" />
        </UFormField>

        <UFormField label="Date et heure du voyage" required>
          <UInput v-model="state.travelAt" type="datetime-local" class="w-full" />
        </UFormField>

        <div class="grid sm:grid-cols-2 gap-4">
          <UFormField label="Prix de vente (€)" required>
            <UInput v-model.number="state.price" type="number" min="0" step="0.5" class="w-full" />
          </UFormField>
          <UFormField label="Prix d'origine (€)" hint="optionnel">
            <UInput v-model.number="state.originalPrice" type="number" min="0" step="0.5" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Description">
          <UTextarea v-model="state.description" :rows="3" class="w-full" placeholder="Conditions d'échange, numéro de place…" />
        </UFormField>

        <UButton type="submit" size="lg" block :loading="loading">Mettre en vente</UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
