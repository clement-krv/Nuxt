<script setup lang="ts">
const route = useRoute()
const { loggedIn } = useAuth()
const { dateTime } = useFormat()
const toast = useToast()

const { data: thread, refresh } = await useFetch(`/api/forum/threads/${route.params.id}`)

const reply = ref('')
const sending = ref(false)

async function sendReply() {
  if (!loggedIn.value) return navigateTo(`/connexion?redirect=/forum/${route.params.id}`)
  if (reply.value.trim().length < 1) return
  sending.value = true
  try {
    await $fetch(`/api/forum/threads/${route.params.id}/posts`, {
      method: 'POST',
      body: { content: reply.value },
    })
    reply.value = ''
    await refresh()
  } catch (e: any) {
    toast.add({ title: e?.data?.statusMessage || 'Erreur', color: 'error' })
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <UContainer class="py-8 max-w-3xl" v-if="thread">
    <UButton to="/forum" variant="link" color="neutral" icon="i-lucide-arrow-left" class="mb-4 -ml-2">
      Retour au forum
    </UButton>

    <div class="mb-6">
      <UBadge color="primary" variant="soft">{{ thread.category?.name }}</UBadge>
      <h1 class="text-2xl sm:text-3xl font-bold mt-2">{{ thread.title }}</h1>
    </div>

    <div class="space-y-4">
      <UCard v-for="(post, i) in thread.posts" :key="post.id" :class="i === 0 ? 'ring-1 ring-primary/30' : ''">
        <div class="flex gap-4">
          <UAvatar :src="post.author?.avatar || undefined" :alt="post.author?.name" size="md" />
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold">{{ post.author?.name }}</span>
              <UBadge v-if="i === 0" color="primary" variant="soft" size="sm">Auteur</UBadge>
              <span class="text-xs text-muted ml-auto">{{ dateTime(post.createdAt) }}</span>
            </div>
            <p class="whitespace-pre-line text-default/90">{{ post.content }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Reply box -->
    <UCard class="mt-6">
      <template #header>
        <h2 class="font-semibold">Répondre</h2>
      </template>
      <div v-if="loggedIn" class="space-y-3">
        <UTextarea v-model="reply" :rows="4" class="w-full" placeholder="Votre réponse…" />
        <div class="flex justify-end">
          <UButton :loading="sending" icon="i-lucide-send" @click="sendReply">Envoyer</UButton>
        </div>
      </div>
      <div v-else class="text-center py-4 text-muted">
        <NuxtLink :to="`/connexion?redirect=/forum/${route.params.id}`" class="text-primary font-medium">
          Connectez-vous
        </NuxtLink>
        pour participer à la discussion.
      </div>
    </UCard>
  </UContainer>
</template>
