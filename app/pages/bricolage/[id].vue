<script setup lang="ts">
const route = useRoute()
const { loggedIn } = useAuth()
const { dateTime } = useFormat()
const toast = useToast()

const { data: article, refresh } = await useFetch(`/api/diy/${route.params.id}`)

const comment = ref('')
const sending = ref(false)

async function sendComment() {
  if (!loggedIn.value) return navigateTo(`/connexion?redirect=/bricolage/${route.params.id}`)
  if (!comment.value.trim()) return
  sending.value = true
  try {
    await $fetch(`/api/diy/${route.params.id}/comments`, { method: 'POST', body: { content: comment.value } })
    comment.value = ''
    await refresh()
  } catch (e: any) {
    toast.add({ title: 'Commentaire impossible', description: errorMessage(e), color: 'error', icon: 'i-lucide-alert-circle' })
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <UContainer class="py-8 max-w-3xl" v-if="article">
    <UButton to="/bricolage" variant="link" color="neutral" icon="i-lucide-arrow-left" class="mb-4 -ml-2">Retour</UButton>

    <div class="flex items-center gap-2 mb-3">
      <UBadge color="neutral" variant="soft">{{ article.category }}</UBadge>
      <UBadge color="primary" variant="soft">{{ article.difficulty }}</UBadge>
    </div>
    <h1 class="text-3xl font-bold">{{ article.title }}</h1>

    <div class="flex items-center gap-2 mt-3 text-sm text-muted">
      <UAvatar :src="article.author?.avatar || undefined" :alt="article.author?.name" size="xs" />
      {{ article.author?.name }} · {{ dateTime(article.createdAt) }}
    </div>

    <img v-if="article.cover" :src="article.cover" :alt="article.title" class="w-full rounded-xl mt-6 aspect-video object-cover" >

    <div class="prose dark:prose-invert max-w-none mt-6">
      <p class="whitespace-pre-line text-default/90 leading-relaxed">{{ article.content }}</p>
    </div>

    <!-- Comments -->
    <div class="mt-10">
      <h2 class="text-xl font-bold mb-4">Commentaires ({{ article.comments?.length || 0 }})</h2>

      <div class="space-y-3 mb-6">
        <UCard v-for="c in article.comments" :key="c.id">
          <div class="flex gap-3">
            <UAvatar :src="c.author?.avatar || undefined" :alt="c.author?.name" size="sm" />
            <div>
              <div class="flex items-center gap-2">
                <span class="font-medium text-sm">{{ c.author?.name }}</span>
                <span class="text-xs text-muted">{{ dateTime(c.createdAt) }}</span>
              </div>
              <p class="text-sm text-default/90 mt-1">{{ c.content }}</p>
            </div>
          </div>
        </UCard>
        <p v-if="!article.comments?.length" class="text-muted text-sm">Soyez le premier à commenter.</p>
      </div>

      <div v-if="loggedIn" class="flex gap-2">
        <UInput v-model="comment" class="flex-1" placeholder="Ajouter un commentaire…" @keyup.enter="sendComment" />
        <UButton :loading="sending" icon="i-lucide-send" @click="sendComment">Envoyer</UButton>
      </div>
      <p v-else class="text-sm text-muted">
        <NuxtLink :to="`/connexion?redirect=/bricolage/${route.params.id}`" class="text-primary font-medium">Connectez-vous</NuxtLink>
        pour commenter.
      </p>
    </div>
  </UContainer>
</template>
