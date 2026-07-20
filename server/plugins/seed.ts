import { sql } from 'drizzle-orm'
import { useDb, tables } from '../utils/db'

/**
 * Seed the database with demo data on server startup.
 * Idempotent: does nothing if users already exist.
 */
export default defineNitroPlugin(async () => {
  const db = useDb()

  // Wait until the schema has been pushed (entrypoint runs drizzle-kit push first,
  // but be defensive in case the app boots slightly ahead).
  try {
    const existing = await db.select({ id: tables.users.id }).from(tables.users).limit(1)
    if (existing.length > 0) {
      console.log('[seed] Database already seeded, skipping.')
      return
    }
  } catch (err) {
    console.warn('[seed] Users table not ready yet, skipping seed for now.', (err as Error).message)
    return
  }

  console.log('[seed] Seeding demo data…')

  const pwd = await hashPassword('password123')

  const [alice, bob, chloe, driss] = await db
    .insert(tables.users)
    .values([
      { email: 'alice@eco.fr', name: 'Alice Vermeil', passwordHash: pwd, avatar: 'https://i.pravatar.cc/150?img=1' },
      { email: 'bob@eco.fr', name: 'Bob Lelièvre', passwordHash: pwd, avatar: 'https://i.pravatar.cc/150?img=12' },
      { email: 'chloe@eco.fr', name: 'Chloé Marchand', passwordHash: pwd, avatar: 'https://i.pravatar.cc/150?img=5' },
      { email: 'driss@eco.fr', name: 'Driss Amrani', passwordHash: pwd, avatar: 'https://i.pravatar.cc/150?img=15' },
    ])
    .returning()

  /* ---- Forum ---- */
  const cats = await db
    .insert(tables.forumCategories)
    .values([
      { name: 'Mobilité douce', slug: 'mobilite-douce', description: 'Vélo, marche, trottinette : partagez vos trajets', icon: 'i-lucide-bike' },
      { name: 'Transports en commun', slug: 'transports-commun', description: 'Train, bus, tram : astuces et actualités', icon: 'i-lucide-train-front' },
      { name: 'Énergie & environnement', slug: 'energie-environnement', description: 'Réduire son empreinte carbone au quotidien', icon: 'i-lucide-leaf' },
      { name: 'Le café du village', slug: 'cafe', description: 'Discussions libres de la communauté', icon: 'i-lucide-coffee' },
    ])
    .returning()

  const [t1, t2] = await db
    .insert(tables.forumThreads)
    .values([
      { categoryId: cats[0]!.id, userId: alice!.id, title: 'Quel VAE pour 25 km de trajet domicile-travail ?' },
      { categoryId: cats[1]!.id, userId: bob!.id, title: 'Astuces pour des billets de train pas chers' },
      { categoryId: cats[2]!.id, userId: chloe!.id, title: 'Retour d\'expérience : 1 an sans voiture' },
    ])
    .returning()

  await db.insert(tables.forumPosts).values([
    { threadId: t1!.id, userId: alice!.id, content: 'Bonjour à tous ! Je cherche un vélo à assistance électrique fiable pour 25 km par jour. Des recommandations ?' },
    { threadId: t1!.id, userId: driss!.id, content: 'Regarde du côté des moteurs central Bosch, l\'autonomie est top pour ce genre de distance.' },
    { threadId: t2!.id, userId: bob!.id, content: 'Pensez à réserver 3 mois à l\'avance et à comparer les cartes de réduction, on économise vite 40%.' },
  ])

  /* ---- Covoiturage ---- */
  const day = 24 * 60 * 60 * 1000
  const base = new Date('2026-08-01T08:00:00Z').getTime()
  const trips = await db
    .insert(tables.carpoolTrips)
    .values([
      { driverId: bob!.id, fromCity: 'Paris', toCity: 'Lyon', departureAt: new Date(base + day), seatsTotal: 3, pricePerSeat: 28, vehicleType: 'Renault Zoé (électrique)', description: 'Départ porte d\'Orléans, recharge prévue à mi-parcours.' },
      { driverId: chloe!.id, fromCity: 'Nantes', toCity: 'Rennes', departureAt: new Date(base + 2 * day), seatsTotal: 2, pricePerSeat: 12, vehicleType: 'Peugeot e-208', description: 'Trajet tranquille, petits bagages ok.' },
      { driverId: driss!.id, fromCity: 'Bordeaux', toCity: 'Toulouse', departureAt: new Date(base + 3 * day), seatsTotal: 4, pricePerSeat: 18, vehicleType: 'Tesla Model 3', description: 'Musique et bonne humeur au programme.' },
    ])
    .returning()

  await db.insert(tables.carpoolBookings).values([
    { tripId: trips[0]!.id, userId: alice!.id, seats: 1 },
  ])

  /* ---- Billets ---- */
  await db.insert(tables.tickets).values([
    { sellerId: alice!.id, type: 'train', fromCity: 'Paris', toCity: 'Marseille', company: 'SNCF TGV INOUI', travelAt: new Date(base + 5 * day), price: 39, originalPrice: 89, description: 'Billet échangeable, place côté fenêtre, voiture 12.' },
    { sellerId: bob!.id, type: 'train', fromCity: 'Lille', toCity: 'Paris', company: 'SNCF TER', travelAt: new Date(base + 4 * day), price: 15, originalPrice: 25, description: 'Ne peux plus voyager ce jour-là.' },
    { sellerId: chloe!.id, type: 'plane', fromCity: 'Paris CDG', toCity: 'Lisbonne', company: 'TAP Air Portugal', travelAt: new Date(base + 10 * day), price: 75, originalPrice: 120, description: 'Bagage cabine inclus, cession de billet possible.' },
  ])

  /* ---- Véhicules éco ---- */
  await db.insert(tables.vehicles).values([
    { sellerId: alice!.id, category: 'electrique', title: 'VAE Moustache Samedi 27', description: 'Vélo à assistance électrique, moteur Bosch, 800 km au compteur. Batterie comme neuve.', price: 1990, condition: 'Très bon état', location: 'Paris 11e', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800' },
    { sellerId: bob!.id, category: 'velo', title: 'Vélo de ville vintage restauré', description: 'Cadre acier, 3 vitesses, entièrement révisé. Idéal petits trajets urbains.', price: 220, condition: 'Bon état', location: 'Lyon 7e', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800' },
    { sellerId: chloe!.id, category: 'scooter', title: 'Scooter électrique NIU N1S', description: 'Scooter 50cc équivalent, 2 batteries, 70 km d\'autonomie.', price: 1450, condition: 'Bon état', location: 'Nantes', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800' },
    { sellerId: driss!.id, category: 'voiture', title: 'Renault Zoé R110 2020', description: 'Voiture 100% électrique, 45 000 km, batterie achetée (non louée).', price: 12500, condition: 'Très bon état', location: 'Bordeaux', image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800' },
    { sellerId: driss!.id, category: 'attelage', title: 'Charrette maraîchère + attelage', description: 'Charrette bois traditionnelle pour traction animale (âne ou cheval). Parfaite pour livraisons zéro carbone en circuit court.', price: 850, condition: 'Occasion', location: 'Périgord', image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800' },
  ])

  /* ---- Bricolage ---- */
  const articles = await db
    .insert(tables.diyArticles)
    .values([
      { authorId: driss!.id, title: 'Régler ses dérailleurs en 10 minutes', excerpt: 'Un guide pas à pas pour un passage de vitesses impeccable.', content: 'Commencez par mettre le vélo sur un pied d\'atelier…\n\n1. Réglez la butée haute\n2. Ajustez la tension du câble\n3. Réglez la butée basse\n4. Peaufinez au dérailleur avant\n\nAvec un peu de pratique, plus besoin du réparateur !', category: 'Réparation', difficulty: 'Facile', cover: 'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=800' },
      { authorId: alice!.id, title: 'Remplacer la batterie d\'un VAE', excerpt: 'Prolongez la vie de votre vélo électrique sans le remplacer.', content: 'Le remplacement d\'une batterie de VAE est accessible à tous…\n\nOutils nécessaires : tournevis, multimètre.\n\nAttention à bien recycler l\'ancienne batterie en déchetterie !', category: 'Électrique', difficulty: 'Moyen', cover: 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=800' },
      { authorId: chloe!.id, title: 'Entretenir un attelage en bois', excerpt: 'Huile de lin, graissage des moyeux : les bons gestes.', content: 'Une charrette bien entretenue peut durer des décennies…\n\nAppliquez de l\'huile de lin deux fois par an, graissez les essieux, vérifiez les cerclages métalliques.', category: 'Traction animale', difficulty: 'Facile', cover: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800' },
    ])
    .returning()

  await db.insert(tables.diyComments).values([
    { articleId: articles[0]!.id, userId: bob!.id, content: 'Merci, réglage nickel du premier coup !' },
    { articleId: articles[0]!.id, userId: chloe!.id, content: 'Top ce tuto, très clair.' },
  ])

  console.log('[seed] Done ✅  — comptes de démo : alice@eco.fr / password123')
})
