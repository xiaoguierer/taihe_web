<template>
  <div class="about-page">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="nav-container">
        <a href="#" class="logo">
          <i class="fas fa-gem"></i>
          ZENIUL
        </a>
        <ul class="nav-links">
          <li v-for="item in navItems" :key="item.name">
            <a :href="item.link" :class="{ active: item.active }">
              {{ item.name }}
            </a>
          </li>
        </ul>
        <div class="nav-actions">
          <i class="fas fa-search"></i>
          <i class="fas fa-user"></i>
          <i class="fas fa-shopping-bag"></i>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1>{{ pageData.hero.title }}</h1>
          <p>{{ pageData.hero.description }}</p>
          <!-- <button class="cta-button">{{ pageData.hero.ctaText }}</button> -->
        </div>
      </section>

      <!-- Brand Story -->
      <section class="brand-story">
        <div class="container">
          <div class="story-grid">
            <div class="story-content">
              <h2>{{ pageData.story.title }}</h2>
              <p v-for="(paragraph, index) in pageData.story.content" :key="index">
                {{ paragraph }}
              </p>
            </div>
            <div class="story-image">

            </div>
          </div>
        </div>
      </section>

      <!-- Core Values -->
      <section class="core-values">
        <div class="container">
          <h2>{{ pageData.values.title }}</h2>
          <div class="values-grid">
            <div v-for="value in pageData.values.items" :key="value.title" class="value-card">
              <div class="value-icon">
                <i :class="value.icon"></i>
              </div>
              <h3>{{ value.title }}</h3>
              <p>{{ value.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Cultural Wisdom -->
      <section class="cultural-wisdom">
        <div class="container">
          <h2>{{ pageData.culturalWisdom.title }}</h2>
          <div class="regions-grid">
            <div v-for="region in pageData.culturalWisdom.regions" :key="region.name" class="region-card">
              <h3>{{ region.name }}</h3>
              <div class="region-elements">
                <span v-for="element in region.elements" :key="element" class="element-tag">
                  {{ element }}
                </span>
              </div>
              <p class="region-feature">{{ region.feature }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Statistics -->
      <section class="statistics">
        <div class="container">
          <h2>{{ pageData.stats.title }}</h2>
          <div class="stats-grid">
            <div v-for="stat in pageData.stats.items" :key="stat.label" class="stat-item">
              <div class="stat-number">{{ stat.value }}+</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Product Philosophy -->
      <section class="product-philosophy">
        <div class="container">
          <h2>{{ pageData.productPhilosophy.title }}</h2>
          <div class="philosophy-grid">
            <div v-for="dimension in pageData.productPhilosophy.dimensions" :key="dimension.title" class="philosophy-card">
              <h3>{{ dimension.title }}</h3>
              <p>{{ dimension.content }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
  data() {
    return {
      navItems: [
        { name: 'Home', link: '#', active: false },
        { name: 'Women', link: '#', active: false },
        { name: 'Men', link: '#', active: false },
        { name: 'Beauty', link: '#', active: false },
        { name: 'About Us', link: '#', active: true }
      ],
      pageData: {
        hero: {
          title: 'ZENIUL | Spiritual Jewelry · Cultural Choice',
          description: 'An intelligent jewelry configuration platform connecting Eastern and Western cultures, integrating wisdom and contemporary design to craft personalized talismans for your unique energy',
          ctaText: 'Start Energy Matching'
        },
        story: {
          title: 'Eastern Philosophy · Contemporary Interpretation',
          content: [
            'Zeniul was founded in 2025 by a team proficient in jewelry craftsmanship and cross-cultural research, dedicated to addressing modern needs for spiritual fulfillment and aesthetic expression.',
            'Through our AI energy matching system, we combine Southeast Asian Buddhist culture, Middle Eastern astrological philosophy, and Western symbolism to transform traditional esoteric wisdom into wearable art.',
            'We have provided personalized jewelry configuration services to users in 38 countries, making each piece a carrier of cultural codes and energy.'
          ],
          image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        },
        values: {
          title: 'Cultural Resonance · Four-Dimensional Philosophy',
          items: [
            {
              icon: 'fas fa-yin-yang',
              title: 'Mystery Decoding',
              description: 'Cross-cultural deconstruction of Southeast Asian Buddha amulet essence × Middle Eastern protective talismans × Western zodiac symbols'
            },
            {
              icon: 'fas fa-hand-holding-heart',
              title: 'Emotional Healing',
              description: 'Energy matching algorithm based on birth dates and personal needs, providing emotional healing solutions'
            },
            {
              icon: 'fas fa-gem',
              title: 'Artisan Heritage',
              description: 'Traditional craft masterpieces including gold engraving, antique jade, and agarwood carvings created by intangible cultural heritage inheritors'
            },
            {
              icon: 'fas fa-globe-asia',
              title: 'Cultural Empathy',
              description: 'Localized advisory teams interpreting regional cultural taboos and auspicious meanings'
            }
          ]
        },
        culturalWisdom: {
          title: 'Regional Spiritual Wisdom',
          regions: [
            {
              name: 'Southeast Asia',
              elements: ['Buddha Amulet Energy', 'Five Elements Fortune', 'Agarwood Meditation'],
              feature: 'Myanmar Jade Dragon Amulet · Thai Buddha Amulet Necklace · Agarwood Mala Beads'
            },
            {
              name: 'Middle East',
              elements: ['Crescent Protection', 'Arabic Inscriptions', 'Celestial Talismans'],
              feature: '22K Gold Crescent Pendant · Esoteric Inked Agate · Persian Emblem Ring'
            },
            {
              name: 'Europe & America',
              elements: ['Zodiac Symbols', 'Life Path Numbers', 'Tarot Guidance'],
              feature: 'Zodiac Diamond Bracelet · Sandalwood Divination Stick · Energy Crystal Array'
            }
          ]
        },
        stats: {
          title: 'Global Trust Imprint',
          items: [
            { value: '38', label: 'Countries & Regions Served' },
            { value: '88%', label: 'User Energy Compatibility' },
            { value: '1200+', label: 'Cultural Elements Database' },
            { value: '7', label: 'Integrated Esoteric Systems' }
          ]
        },
        productPhilosophy: {
          title: 'Three-Dimensional Energy Dimensions',
          dimensions: [
            {
              title: 'Form · Aesthetic Expression',
              content: 'Diverse style systems including New Chinese Minimalism / Middle Eastern Openwork Carving / European Court Style'
            },
            {
              title: 'Meaning · Cultural Narrative',
              content: 'Each piece comes with a cultural code card deciphering the millennia-old wisdom behind the symbols'
            },
            {
              title: 'Spirit · Energy Resonance',
              content: 'Supports birthstone customization and BaZi energy field matching services'
            }
          ]
        }
      }
    }
  },
  methods: {
    handleNavClick(item) {
      this.navItems.forEach(navItem => {
        navItem.active = navItem.name === item.name
      })
    }
  }
}
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #ffffff;
}

/* Navigation Bar Styles */
.navbar {
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffffff;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  color: #ffffff;
  text-decoration: none;
  transition: color 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.nav-links a:hover,
.nav-links a.active {
  color: #ffffff;
  /*background: rgba(255, 51, 102, 0.1);*/
}

.nav-actions {
  display: flex;
  gap: 1.5rem;
  color: #ffffff;
  font-size: 1.2rem;
}

/* Main Content Styles */
.main-content {
  padding-top: 2rem;
}

.hero-section {
  background: linear-gradient(135deg, #0a1128 0%, #1a237e 100%);
  padding: 6rem 0;
  text-align: center;
}

.hero-content h1 {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.hero-content p {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-button {
  background: #ffffff;
  color: #ffffff;
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Brand Story Styles */
.brand-story {
  padding: 5rem 0;
  background: rgba(255, 255, 255, 0.02);
}

.story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.story-content h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #ffffff;
}

.story-content p {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: #e0e0e0;
}

.story-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* Core Values Styles */
.core-values {
  padding: 5rem 0;
}

.core-values h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #ffffff;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.value-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 2.5rem 2rem;
  border-radius: 10px;
  text-align: center;
  transition: transform 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.value-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.08);
}

.value-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 51, 102, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: #ffffff;
  font-size: 2rem;
}

.value-card h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.value-card p {
  color: #b0b0b0;
  line-height: 1.6;
}

/* Cultural Wisdom Styles */
.cultural-wisdom {
  padding: 5rem 0;
  background: rgba(255, 255, 255, 0.02);
}

.cultural-wisdom h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #ffffff;
}

.regions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.region-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.region-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #ffffff;
  text-align: center;
}

.region-elements {
  margin-bottom: 1.5rem;
}

.element-tag {
  display: inline-block;
  /*background: rgba(255, 51, 102, 0.2);*/
  color: #ffffff;
  padding: 0.3rem 0.8rem;
  margin: 0.3rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.region-feature {
  color: #e0e0e0;
  line-height: 1.6;
  text-align: center;
  font-style: italic;
}

/* Statistics Styles */
.statistics {
  padding: 5rem 0;
  background: rgba(255, 255, 255, 0.02);
}

.statistics h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #ffffff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 3.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  color: #b0b0b0;
  font-weight: 500;
}

/* Product Philosophy Styles */
.product-philosophy {
  padding: 5rem 0;
  background: rgba(255, 255, 255, 0.02);
}

.product-philosophy h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #ffffff;
}

.philosophy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.philosophy-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.philosophy-card h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.philosophy-card p {
  color: #b0b0b0;
  line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-links {
    gap: 1rem;
  }

  .hero-content h1 {
    font-size: 2.5rem;
  }

  .story-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .values-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  .regions-grid,
  .philosophy-grid {
    grid-template-columns: 1fr;
  }
}
</style>