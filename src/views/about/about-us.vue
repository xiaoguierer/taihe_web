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
          <p class="hero-subtitle">{{ pageData.hero.subtitle }}</p>
          <p class="hero-description">{{ pageData.hero.description }}</p>
          <div class="impact-stats">
            <div class="stat-item" v-for="stat in pageData.impactStats" :key="stat.label">
              <div class="stat-number">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="cultural-symbols">
            <div class="symbol" v-for="symbol in culturalSymbols" :key="symbol.name">
              <i :class="symbol.icon"></i>
              <span class="symbol-name">{{ symbol.name }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Brand Story -->
      <section class="brand-story">
        <div class="container">
          <div class="story-header">
            <h2>{{ pageData.story.title }}</h2>
            <div class="title-underline"></div>
          </div>
          <div class="story-grid">
            <div class="story-content">
              <div class="story-paragraphs">
                <p v-for="(paragraph, index) in pageData.story.content" :key="index">
                  {{ paragraph }}
                </p>
              </div>
              <div class="cultural-heritage">
                <h3>Cultural Heritage</h3>
                <div class="heritage-items">
                  <div class="heritage-item" v-for="item in pageData.culturalHeritage" :key="item.title">
                    <i :class="item.icon"></i>
                    <span>{{ item.title }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="story-visual">
              <div class="visual-element">
                <div class="floating-shapes">
                  <div class="shape" v-for="shape in floatingShapes" :key="shape.id" :style="shapeStyle(shape)"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Core Values -->
      <section class="core-values">
        <div class="container">
          <h2 class="section-title">{{ pageData.values.title }}</h2>
          <p class="section-subtitle">{{ pageData.values.subtitle }}</p>
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

      <!-- Design Philosophy -->
      <section class="design-philosophy">
        <div class="container">
          <h2 class="section-title">{{ pageData.designPhilosophy.title }}</h2>
          <div class="philosophy-grid">
            <div v-for="principle in pageData.designPhilosophy.principles" :key="principle.title" class="philosophy-card">
              <div class="philosophy-icon">
                <i :class="principle.icon"></i>
              </div>
              <h3>{{ principle.title }}</h3>
              <p>{{ principle.description }}</p>
              <div class="philosophy-examples">
                <span v-for="example in principle.examples" :key="example" class="example-tag">
                  {{ example }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Craftsmanship -->
      <section class="craftsmanship">
        <div class="container">
          <h2 class="section-title">{{ pageData.craftsmanship.title }}</h2>
          <div class="craftsmanship-content">
            <div class="craftsmanship-text">
              <p>{{ pageData.craftsmanship.description }}</p>
              <div class="craftsmanship-stats">
                <div class="craft-stat" v-for="stat in pageData.craftsmanship.stats" :key="stat.label">
                  <span class="stat-value">{{ stat.value }}</span>
                  <span class="stat-label">{{ stat.label }}</span>
                </div>
              </div>
            </div>
            <div class="craftsmanship-visual">
              <div class="craft-elements">
                <div class="craft-element" v-for="element in pageData.craftsmanship.elements" :key="element.name">
                  <i :class="element.icon"></i>
                  <span>{{ element.name }}</span>
                </div>
              </div>
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
        { name: 'Aesthetics', link: '#', active: false },
        { name: 'About Us', link: '#', active: true }
      ],
      culturalSymbols: [
        { name: 'Harmony', icon: 'fas fa-yin-yang' },
        { name: 'Balance', icon: 'fas fa-balance-scale' },
        { name: 'Nature', icon: 'fas fa-leaf' },
        { name: 'Eternity', icon: 'fas fa-infinity' }
      ],
      floatingShapes: [
        { id: 1, size: 60, delay: 0 },
        { id: 2, size: 80, delay: 0.5 },
        { id: 3, size: 100, delay: 1 },
        { id: 4, size: 70, delay: 1.5 },
        { id: 5, size: 90, delay: 2 }
      ],
      pageData: {
        hero: {
          title: 'ZENIUL | Cultural Jewelry · Modern Interpretation',
          subtitle: 'Perfect Fusion of Eastern Aesthetics and Contemporary Design',
          description: 'An intelligent jewelry configuration platform connecting Eastern and Western cultural wisdom, combining traditional aesthetics with modern design to create unique pieces that reflect personal style'
        },
        impactStats: [
          { value: '38', label: 'Countries & Regions Served' },
          { value: '1200+', label: 'Cultural Elements Database' },
          { value: '88%', label: 'Customer Satisfaction' },
          { value: '15+', label: 'Expert Craftsmanship Teams' }
        ],
        story: {
          title: 'Eastern Philosophy · Contemporary Interpretation',
          content: [
            'ZENIUL was founded in 2025 by a team proficient in jewelry craftsmanship and cross-cultural research, dedicated to meeting modern needs for aesthetic expression and cultural identity.',
            'Through our intelligent configuration system, we integrate the essence of Eastern aesthetics, Middle Eastern geometric art, and Western contemporary design, transforming traditional cultural wisdom into wearable art.',
            'We have provided personalized jewelry configuration services to users in 38 countries, making each piece a carrier of cultural symbols and personal style.'
          ]
        },
        culturalHeritage: [
          { icon: 'fas fa-palette', title: 'Color Philosophy' },
          { icon: 'fas fa-mountain', title: 'Natural Imagery' },
          { icon: 'fas fa-infinity', title: 'Timeless Aesthetics' },
          { icon: 'fas fa-chess-board', title: 'Geometric Rhythm' }
        ],
        values: {
          title: 'Cultural Resonance · Four-Dimensional Philosophy',
          subtitle: 'Core values based on Eastern wisdom',
          items: [
            {
              icon: 'fas fa-eye',
              title: 'Aesthetic Deconstruction',
              description: 'Cross-cultural deconstruction of Eastern color philosophy × Middle Eastern geometric art × Western contemporary design language'
            },
            {
              icon: 'fas fa-heart',
              title: 'Emotional Connection',
              description: 'Intelligent matching based on personal temperament and aesthetic preferences, establishing emotional bonds between jewelry and wearer'
            },
            {
              icon: 'fas fa-hands',
              title: 'Craftsmanship Heritage',
              description: 'Traditional masterpieces including metal engraving, ancient jade carving, agarwood carving, and other intangible cultural heritage'
            },
            {
              icon: 'fas fa-globe-asia',
              title: 'Cultural Resonance',
              description: 'Localized advisory teams interpreting regional cultural characteristics and aesthetic preferences'
            }
          ]
        },
        designPhilosophy: {
          title: 'Three-Dimensional Design Approach',
          principles: [
            {
              icon: 'fas fa-drafting-compass',
              title: 'Form · Aesthetic Expression',
              description: 'Diverse style systems including Neo-Chinese minimalism / Middle Eastern openwork carving / European court style',
              examples: ['Clean Lines', 'Geometric Symmetry', 'Flowing Curves']
            },
            {
              icon: 'fas fa-book-open',
              title: 'Meaning · Cultural Narrative',
              description: 'Each piece comes with a cultural code card interpreting the millennia of wisdom behind the symbols',
              examples: ['Semiotics', 'Color Psychology', 'Material Language']
            },
            {
              icon: 'fas fa-atom',
              title: 'Essence · Personal Resonance',
              description: 'Custom birthstone services and personal style matching',
              examples: ['Color Coordination', 'Material Balance', 'Proportion Harmony']
            }
          ]
        },
        craftsmanship: {
          title: 'Craftsmanship Heritage & Innovation',
          description: 'We respect traditional craftsmanship while integrating modern technological innovation - each piece is a unique work of art with soul',
          stats: [
            { value: '50+', label: 'Traditional Techniques' },
            { value: '100+', label: 'Master Artisans' },
            { value: '1000+', label: 'Hours of Craftsmanship' }
          ],
          elements: [
            { icon: 'fas fa-gem', name: 'Gem Cutting' },
            { icon: 'fas fa-hammer', name: 'Metalwork' },
            { icon: 'fas fa-paint-brush', name: 'Enamel Painting' },
            { icon: 'fas fa-cut', name: 'Openwork Carving' }
          ]
        }
      }
    }
  },
  methods: {
    shapeStyle(shape) {
      return {
        width: `${shape.size}px`,
        height: `${shape.size}px`,
        animationDelay: `${shape.delay}s`
      }
    },
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
  background: linear-gradient(135deg, #0a1128 0%, #1a237e 50%, #2d3b8c 100%);
  color: #ffffff;
  font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
}

/* Navigation Bar Styles */
.navbar {
  background: rgba(10, 17, 40, 0.95);
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
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
}

.nav-links a:hover,
.nav-links a.active {
  color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
}

.nav-actions {
  display: flex;
  gap: 1.5rem;
  color: #ffffff;
  font-size: 1.2rem;
}

.nav-actions i {
  cursor: pointer;
  transition: color 0.3s ease;
}

.nav-actions i:hover {
  color: #d4af37;
}

/* Hero Section Styles */
.hero-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  min-height: 80vh;
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  gap: 3rem;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #d4af37, #ffd700, #d4af37);
  background-size: 300% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 3s infinite linear;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #d4af37;
  margin-bottom: 1rem;
  font-weight: 300;
}

.hero-description {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.impact-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #d4af37;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.8;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.cultural-symbols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.symbol {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.symbol:hover {
  transform: translateY(-5px);
  border-color: rgba(212, 175, 55, 0.5);
}

.symbol i {
  font-size: 2.5rem;
  color: #d4af37;
  margin-bottom: 1rem;
  display: block;
}

.symbol-name {
  font-size: 1.1rem;
  font-weight: 500;
}

/* Brand Story Styles */
.brand-story {
  padding: 6rem 2rem;
  background: rgba(255, 255, 255, 0.02);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.story-header {
  text-align: center;
  margin-bottom: 4rem;
}

.story-header h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #d4af37;
}

.title-underline {
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #d4af37, #ffd700);
  margin: 0 auto;
  border-radius: 2px;
}

.story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.story-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.story-paragraphs p {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: #e0e0e0;
}

.cultural-heritage h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #d4af37;
}

.heritage-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.heritage-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.heritage-item i {
  color: #d4af37;
}

.story-visual {
  display: flex;
  justify-content: center;
}

.visual-element {
  width: 100%;
  height: 400px;
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.floating-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Core Values Styles */
.core-values {
  padding: 6rem 2rem;
}

.section-title {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #d4af37;
}

.section-subtitle {
  text-align: center;
  font-size: 1.2rem;
  opacity: 0.8;
  margin-bottom: 4rem;
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
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.value-card:hover {
  transform: translateY(-5px);
  border-color: rgba(212, 175, 55, 0.5);
}

.value-icon {
  width: 80px;
  height: 80px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
  color: #d4af37;
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

/* Design Philosophy Styles */
.design-philosophy {
  padding: 6rem 2rem;
  background: rgba(255, 255, 255, 0.02);
}

.philosophy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.philosophy-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.philosophy-card:hover {
  transform: translateY(-5px);
  border-color: rgba(212, 175, 55, 0.5);
}

.philosophy-icon {
  width: 70px;
  height: 70px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #d4af37;
}

.philosophy-card h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.philosophy-card p {
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.philosophy-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.example-tag {
  background: rgba(212, 175, 55, 0.2);
  color: #d4af37;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
}

/* Craftsmanship Styles */
.craftsmanship {
  padding: 6rem 2rem;
}

.craftsmanship-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.craftsmanship-text p {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  color: #e0e0e0;
}

.craftsmanship-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.craft-stat {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: #d4af37;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.craftsmanship-visual {
  display: flex;
  justify-content: center;
}

.craft-elements {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.craft-element {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.craft-element:hover {
  transform: translateY(-5px);
  border-color: rgba(212, 175, 55, 0.5);
}

.craft-element i {
  font-size: 2rem;
  color: #d4af37;
  margin-bottom: 0.8rem;
}

/* Animations */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

@keyframes float {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translate(-50%, -60%) scale(1.05);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }

  .hero-content h1 {
    font-size: 2.5rem;
  }

  .impact-stats {
    grid-template-columns: 1fr;
  }

  .story-grid {
    grid-template-columns: 1fr;
  }

  .cultural-symbols {
    grid-template-columns: 1fr;
  }

  .values-grid {
    grid-template-columns: 1fr;
  }

  .craftsmanship-content {
    grid-template-columns: 1fr;
  }

  .craft-elements {
    grid-template-columns: 1fr;
  }

  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .cultural-symbols {
    grid-template-columns: 1fr;
  }
}
</style>