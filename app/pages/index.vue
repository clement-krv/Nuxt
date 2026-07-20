<script setup lang="ts">
const features = [
  { title: 'Forum de discussion', description: 'Échangez conseils et bons plans avec la communauté de la mobilité douce.', icon: 'i-lucide-messages-square', to: '/forum', color: 'text-primary bg-primary/10' },
  { title: 'Covoiturage', description: 'Proposez ou réservez des trajets partagés en véhicule éco.', icon: 'i-lucide-car-front', to: '/covoiturage', color: 'text-blue-500 bg-blue-500/10' },
  { title: 'Revente de billets', description: 'Donnez une seconde vie à vos billets de train et d\'avion.', icon: 'i-lucide-ticket', to: '/billets', color: 'text-amber-500 bg-amber-500/10' },
  { title: 'Véhicules éco', description: 'Vélos, scooters, voitures électriques… et même attelages !', icon: 'i-lucide-bike', to: '/vehicules', color: 'text-emerald-500 bg-emerald-500/10' },
  { title: 'Bricolage & entraide', description: 'Tutoriels pour réparer et entretenir vos moyens de transport.', icon: 'i-lucide-wrench', to: '/bricolage', color: 'text-rose-500 bg-rose-500/10' },
  { title: 'Attelages traditionnels', description: 'Charrettes tirées par bœufs, ânes ou chevaux : la mobilité zéro carbone.', icon: 'i-lucide-tractor', to: '/vehicules?category=attelage', color: 'text-orange-500 bg-orange-500/10' },
]

const steps = [
  { title: 'Créez votre compte', description: 'Rejoignez gratuitement la communauté en quelques secondes.', icon: 'i-lucide-user-plus' },
  { title: 'Publiez ou cherchez', description: 'Trajet, annonce, billet, question : tout se passe au même endroit.', icon: 'i-lucide-search' },
  { title: 'Déplacez-vous mieux', description: 'Réservez, achetez, échangez et réduisez votre empreinte carbone.', icon: 'i-lucide-sparkles' },
]

useHead({ title: 'ÉcoTransport — La mobilité douce, ensemble' })
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-primary/10 via-default to-default" />
      <UContainer class="relative py-20 sm:py-28 text-center">
        <UBadge color="primary" variant="soft" size="lg" class="mb-6">
          <UIcon name="i-lucide-leaf" class="size-4 mr-1" /> Mobilité durable & solidaire
        </UBadge>
        <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto">
          Se déplacer <span class="text-primary">autrement</span>, ensemble.
        </h1>
        <p class="mt-6 text-lg text-muted max-w-2xl mx-auto">
          Forum, covoiturage, revente de billets, marché de véhicules éco et bricolage :
          une seule communauté pour une mobilité plus verte.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <UButton to="/covoiturage" size="xl" icon="i-lucide-car-front">Trouver un trajet</UButton>
          <UButton to="/vehicules" size="xl" color="neutral" variant="subtle" icon="i-lucide-store">
            Explorer le marché
          </UButton>
        </div>
      </UContainer>
    </section>

    <!-- Features -->
    <UContainer class="py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold">Tout pour bouger vert</h2>
        <p class="mt-3 text-muted">Cinq services au service de la planète et de votre porte-monnaie.</p>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <UCard
          v-for="f in features"
          :key="f.title"
          class="hover:ring-2 hover:ring-primary/40 transition cursor-pointer"
          @click="navigateTo(f.to)"
        >
          <div class="flex flex-col gap-3">
            <span :class="['flex items-center justify-center size-12 rounded-xl', f.color]">
              <UIcon :name="f.icon" class="size-6" />
            </span>
            <h3 class="font-semibold text-lg">{{ f.title }}</h3>
            <p class="text-sm text-muted">{{ f.description }}</p>
            <span class="text-sm text-primary font-medium inline-flex items-center gap-1">
              Découvrir <UIcon name="i-lucide-arrow-right" class="size-4" />
            </span>
          </div>
        </UCard>
      </div>
    </UContainer>

    <!-- How it works -->
    <section class="bg-elevated/30 border-y border-default">
      <UContainer class="py-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold">Comment ça marche ?</h2>
        </div>
        <div class="grid gap-8 md:grid-cols-3">
          <div v-for="(s, i) in steps" :key="s.title" class="text-center">
            <div class="relative inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mb-4">
              <UIcon :name="s.icon" class="size-7" />
              <span class="absolute -top-1 -right-1 size-6 rounded-full bg-primary text-inverted text-xs font-bold flex items-center justify-center">
                {{ i + 1 }}
              </span>
            </div>
            <h3 class="font-semibold text-lg">{{ s.title }}</h3>
            <p class="mt-2 text-sm text-muted max-w-xs mx-auto">{{ s.description }}</p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- CTA -->
    <UContainer class="py-20 text-center">
      <UCard class="bg-primary/5 border-primary/20">
        <h2 class="text-2xl sm:text-3xl font-bold">Prêt à rejoindre le mouvement ?</h2>
        <p class="mt-3 text-muted max-w-xl mx-auto">
          Créez votre compte gratuit et commencez à partager vos trajets dès aujourd'hui.
        </p>
        <div class="mt-6 flex justify-center gap-3">
          <UButton to="/inscription" size="lg" icon="i-lucide-user-plus">Créer un compte</UButton>
          <UButton to="/forum" size="lg" color="neutral" variant="subtle">Visiter le forum</UButton>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
