<script setup lang="ts">
const { register } = useAuth()
const toast = useToast()

const state = reactive({ name: '', email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  loading.value = true
  error.value = ''
  try {
    await register(state.name, state.email, state.password)
    toast.add({ title: 'Compte créé 🎉', color: 'success', icon: 'i-lucide-check' })
    await navigateTo('/mon-espace')
  } catch (e: any) {
    error.value = e?.data?.statusMessage || e?.data?.message || 'Inscription impossible.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UContainer class="py-16 max-w-md">
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">Créer un compte</h1>
        <p class="text-sm text-muted mt-1">Rejoignez la communauté de la mobilité douce.</p>
      </template>

      <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <UAlert v-if="error" color="error" variant="soft" icon="i-lucide-alert-circle" :title="error" />

        <UFormField label="Nom" name="name" required>
          <UInput v-model="state.name" placeholder="Camille Durand" class="w-full" icon="i-lucide-user" />
        </UFormField>

        <UFormField label="Email" name="email" required>
          <UInput v-model="state.email" type="email" placeholder="vous@exemple.fr" class="w-full" icon="i-lucide-mail" />
        </UFormField>

        <UFormField label="Mot de passe" name="password" required hint="6 caractères minimum">
          <UInput v-model="state.password" type="password" placeholder="••••••••" class="w-full" icon="i-lucide-lock" />
        </UFormField>

        <UButton type="submit" block size="lg" :loading="loading">Créer mon compte</UButton>
      </UForm>

      <template #footer>
        <p class="text-sm text-muted text-center">
          Déjà inscrit ? <NuxtLink to="/connexion" class="text-primary font-medium">Se connecter</NuxtLink>
        </p>
      </template>
    </UCard>
  </UContainer>
</template>
