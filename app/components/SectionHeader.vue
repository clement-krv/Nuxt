<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  icon?: string
}>()
</script>

<template>
  <div class="bg-elevated/30 border-b border-default">
    <UContainer class="py-10">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-start gap-4">
          <span v-if="icon" class="flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary shrink-0">
            <UIcon :name="icon" class="size-6" />
          </span>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold">{{ title }}</h1>
            <p v-if="subtitle" class="mt-1 text-muted">{{ subtitle }}</p>
          </div>
        </div>
        <div class="shrink-0">
          <slot name="actions" />
        </div>
      </div>
      <slot name="filters" />
    </UContainer>
  </div>
</template>
