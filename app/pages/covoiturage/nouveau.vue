<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const toast = useToast()
const loading = ref(false)

const state = reactive({
  fromCity: '',
  toCity: '',
  departureAt: '',
  seatsTotal: 3,
  pricePerSeat: 15,
  vehicleType: 'Voiture électrique',
  description: '',
})

async function onSubmit() {
  loading.value = true
  try {
    const res = await $fetch('/api/carpool/trips', { method: 'POST', body: { ...state } })
    toast.add({ title: 'Trajet publié !', color: 'success', icon: 'i-lucide-check' })
    await navigateTo(`/covoiturage/${res.id}`)
  } catch (e: any) {
    toast.add({ title: e?.data?.statusMessage || 'Erreur de publication', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UContainer class="py-10 max-w-2xl">
    <UButton to="/covoiturage" variant="link" color="neutral" icon="i-lucide-arrow-left" class="mb-4 -ml-2">
      Retour
    </UButton>
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">Proposer un trajet</h1>
        <p class="text-sm text-muted mt-1">Renseignez les détails de votre covoiturage.</p>
      </template>

      <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <div class="grid sm:grid-cols-2 gap-4">
          <UFormField label="Ville de départ" required>
            <UInput v-model="state.fromCity" class="w-full" icon="i-lucide-map-pin" placeholder="Paris" />
          </UFormField>
          <UFormField label="Ville d'arrivée" required>
            <UInput v-model="state.toCity" class="w-full" icon="i-lucide-flag" placeholder="Lyon" />
          </UFormField>
        </div>

        <UFormField label="Date et heure de départ" required>
          <UInput v-model="state.departureAt" type="datetime-local" class="w-full" />
        </UFormField>

        <div class="grid sm:grid-cols-2 gap-4">
          <UFormField label="Places disponibles" required>
            <UInput v-model.number="state.seatsTotal" type="number" min="1" max="8" class="w-full" />
          </UFormField>
          <UFormField label="Prix par passager (€)" required>
            <UInput v-model.number="state.pricePerSeat" type="number" min="0" step="0.5" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Véhicule" required>
          <UInput v-model="state.vehicleType" class="w-full" icon="i-lucide-car" placeholder="Renault Zoé (électrique)" />
        </UFormField>

        <UFormField label="Description">
          <UTextarea v-model="state.description" :rows="3" class="w-full" placeholder="Point de rendez-vous, bagages, animaux…" />
        </UFormField>

        <UButton type="submit" size="lg" block :loading="loading">Publier le trajet</UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
