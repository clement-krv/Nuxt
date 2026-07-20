<script setup lang="ts">
const { login } = useAuth()
const route = useRoute()
const toast = useToast()

const state = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  loading.value = true
  error.value = ''
  try {
    await login(state.email, state.password)
    toast.add({ title: 'Bienvenue !', color: 'success', icon: 'i-lucide-check' })
    await navigateTo((route.query.redirect as string) || '/mon-espace')
  } catch (e: any) {
    error.value = errorMessage(e, 'Connexion impossible.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UContainer class="py-16 max-w-md">
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">Connexion</h1>
        <p class="text-sm text-muted mt-1">Ravi de vous revoir sur ÉcoTransport.</p>
      </template>

      <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          icon="i-lucide-alert-circle"
          :title="error"
        />

        <UFormField label="Email" name="email" required>
          <UInput v-model="state.email" type="email" placeholder="vous@exemple.fr" class="w-full" icon="i-lucide-mail" />
        </UFormField>

        <UFormField label="Mot de passe" name="password" required>
          <UInput v-model="state.password" type="password" placeholder="••••••••" class="w-full" icon="i-lucide-lock" />
        </UFormField>

        <UButton type="submit" block size="lg" :loading="loading">Se connecter</UButton>
      </UForm>

      <template #footer>
        <div class="text-sm text-muted text-center space-y-2">
          <p>Pas encore de compte ? <NuxtLink to="/inscription" class="text-primary font-medium">Créer un compte</NuxtLink></p>
          <p class="text-xs">Démo : <code class="text-default">alice@eco.fr</code> / <code class="text-default">password123</code></p>
        </div>
      </template>
    </UCard>
  </UContainer>
</template>
