<template>
  <section class="eastern-wisdom">
    <div class="wisdom-container">
      <!-- Header Section -->
      <div class="wisdom-header">
        <div class="title-symbols">
          <span class="symbol">🜁</span>
          <span class="symbol">☯</span>
          <span class="symbol">🜂</span>
        </div>
        <h1 class="main-title">Eastern Wisdom · Modern Life</h1>
        <p class="subtitle">Ancient insights for contemporary living</p>
        <div class="title-divider">
          <div class="divider-line"></div>
          <div class="divider-dot"></div>
          <div class="divider-line"></div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="wisdom-content">
        <!-- Balance Concept -->
        <div class="balance-section">
          <div class="balance-container">
            <div class="balance-text">
              <h3>Balance · Harmonious Coexistence</h3>
              <p>Light and dark represent the complementary forces that exist in all aspects of life</p>
            </div>
          </div>
        </div>

        <!-- Natural Elements -->
        <div class="elements-section">
          <h2 class="section-title">Natural Elements · Life Cycle</h2>
          <div class="elements-grid">
            <div v-for="element in naturalElements" :key="element.name"
                 class="element-card"
                 :class="`element-${element.name.toLowerCase()}`"
                 @mouseenter="activateElement(element.name)">
              <div class="element-icon">
                <i :class="element.icon"></i>
              </div>
              <h4>{{ element.name }}</h4>
              <p>{{ element.description }}</p>
              <div class="element-properties">
                <span v-for="prop in element.properties" :key="prop" class="property-tag">
                  {{ prop }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Wisdom Principles -->
        <div class="wisdom-principles-section">
          <div class="wisdom-principles-content">
            <div class="wisdom-principles-text">
              <h2>True Knowledge Knows Its Limits</h2>
              <p class="wisdom-quote">"The wise speak because they have something to say; the foolish because they have to say something"</p>
              <div class="wisdom-principles">
                <div v-for="principle in wisdomPrinciples" :key="principle.title" class="principle-item">
                  <div class="principle-icon">
                    <i :class="principle.icon"></i>
                  </div>
                  <div class="principle-content">
                    <h4>{{ principle.title }}</h4>
                    <p>{{ principle.description }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="wisdom-visual">
              <div class="harmony-circle">
                <div class="harmony-symbol">
                  <div class="direction" v-for="(direction, index) in harmonyDirections"
                       :key="direction.name"
                       :style="{ transform: `rotate(${index * 45}deg)` }">
                    <span class="direction-name">{{ direction.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Life Wisdom -->
        <div class="life-wisdom-section">
          <h2 class="section-title">Life Wisdom · Personal Growth</h2>
          <div class="wisdom-cards">
            <div v-for="wisdom in lifeWisdom" :key="wisdom.id" class="wisdom-card">
              <div class="wisdom-number">{{ wisdom.id }}</div>
              <div class="wisdom-content">
                <p class="wisdom-text">{{ wisdom.text }}</p>
                <p class="wisdom-meaning">{{ wisdom.meaning }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quotes Carousel -->
      <div class="wisdom-quotes">
        <div class="quotes-carousel">
          <transition name="fade" mode="out-in">
            <div :key="currentQuoteIndex" class="quote-slide">
              <blockquote class="wisdom-quote">
                "{{ currentQuote.text }}"
              </blockquote>
              <cite class="quote-author">— {{ currentQuote.author }}</cite>
            </div>
          </transition>
          <div class="carousel-controls">
            <button @click="prevQuote" class="carousel-btn">
              <i class="fas fa-chevron-left"></i>
            </button>
            <div class="carousel-dots">
              <span v-for="(quote, index) in wisdomQuotes"
                    :key="index"
                    class="dot"
                    :class="{ active: index === currentQuoteIndex }"
                    @click="currentQuoteIndex = index">
              </span>
            </div>
            <button @click="nextQuote" class="carousel-btn">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'EasternWisdom',
  data() {
    return {
      naturalElements: [
        {
          name: 'Wood',
          icon: 'fas fa-tree',
          description: 'Growth, creativity, and flexibility',
          properties: ['Spring', 'New Beginnings', 'Growth', 'Flexibility']
        },
        {
          name: 'Fire',
          icon: 'fas fa-fire',
          description: 'Passion, transformation, and energy',
          properties: ['Summer', 'Transformation', 'Energy', 'Vitality']
        },
        {
          name: 'Earth',
          icon: 'fas fa-mountain',
          description: 'Stability, nourishment, and balance',
          properties: ['Harmony', 'Stability', 'Nourishment', 'Balance']
        },
        {
          name: 'Metal',
          icon: 'fas fa-gem',
          description: 'Structure, value, and precision',
          properties: ['Autumn', 'Structure', 'Precision', 'Value']
        },
        {
          name: 'Water',
          icon: 'fas fa-tint',
          description: 'Flow, wisdom, and adaptability',
          properties: ['Winter', 'Flow', 'Wisdom', 'Adaptability']
        }
      ],
      wisdomPrinciples: [
        {
          title: 'Go with the Flow',
          icon: 'fas fa-leaf',
          description: 'Working with natural currents rather than against them'
        },
        {
          title: 'Simple Living',
          icon: 'fas fa-seedling',
          description: 'Finding richness in simplicity and essential things'
        },
        {
          title: 'Flexibility Overcomes Rigidity',
          icon: 'fas fa-water',
          description: 'Adaptability and resilience triumph over rigid strength'
        }
      ],
      harmonyDirections: [
        { name: 'Balance', meaning: 'Equilibrium' },
        { name: 'Harmony', meaning: 'Unity' },
        { name: 'Nature', meaning: 'Natural' },
        { name: 'Simplicity', meaning: 'Essential' },
        { name: 'Inclusion', meaning: 'Wholeness' },
        { name: 'Growth', meaning: 'Development' },
        { name: 'Peace', meaning: 'Tranquility' },
        { name: 'Wisdom', meaning: 'Knowledge' }
      ],
      lifeWisdom: [
        {
          id: '01',
          text: 'True wisdom is knowing the extent of ones ignorance',
          meaning: 'The beginning of wisdom is recognizing the limits of our knowledge'
        },
        {
          id: '02',
          text: 'A journey of a thousand miles begins with a single step',
          meaning: 'Great achievements begin with small, consistent actions'
        },
        {
          id: '03',
          text: 'Gentleness overcomes strength, stillness moves action',
          meaning: 'Soft power and patience often achieve more than force'
        }
      ],
      wisdomQuotes: [
        {
          text: 'The wise man adapts himself to circumstances, as water shapes itself to the vessel that contains it',
          author: 'Chinese Proverb'
        },
        {
          text: 'When the winds of change blow, some people build walls, while others build windmills',
          author: 'Chinese Proverb'
        },
        {
          text: 'Better to light a candle than to curse the darkness',
          author: 'Chinese Proverb'
        },
        {
          text: 'A journey of a thousand miles begins with a single step',
          author: 'Lao Tzu'
        },
        {
          text: 'Knowing others is intelligence; knowing yourself is true wisdom',
          author: 'Lao Tzu'
        }
      ],
      currentQuoteIndex: 0,
      activeElement: null
    }
  },
  computed: {
    currentQuote() {
      return this.wisdomQuotes[this.currentQuoteIndex]
    }
  },
  methods: {
    toggleSymbol() {
      const symbol = document.querySelector('.balance-symbol')
      symbol.classList.toggle('active')
    },
    activateElement(elementName) {
      this.activeElement = elementName
    },
    nextQuote() {
      this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.wisdomQuotes.length
    },
    prevQuote() {
      this.currentQuoteIndex = (this.currentQuoteIndex - 1 + this.wisdomQuotes.length) % this.wisdomQuotes.length
    }
  },
  mounted() {
    // Auto-rotate quotes
    setInterval(() => {
      this.nextQuote()
    }, 5000)
  }
}
</script>

<style scoped>
.eastern-wisdom {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a1128 0%, #1a237e 100%);
  color: #ffffff;
  padding: 4rem 0;
  padding-top: 100px;
}

.wisdom-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.wisdom-header {
  text-align: center;
  margin-bottom: 4rem;
}

.title-symbols {
  margin-bottom: 1.5rem;
}

.symbol {
  font-size: 2.5rem;
  margin: 0 1rem;
  opacity: 0.7;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
}

.symbol:nth-child(2) {
  animation-delay: 0.5s;
}

.symbol:nth-child(3) {
  animation-delay: 1s;
}

.main-title {
  font-size: 3rem;
  font-weight: 300;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #d4af37, #ffd700, #d4af37);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.8;
  margin-bottom: 2rem;
}

.title-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.divider-line {
  width: 100px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
}

.divider-dot {
  width: 8px;
  height: 8px;
  background: #d4af37;
  border-radius: 50%;
}

/* Balance Symbol Styles */
.balance-section {
  display: flex;
  justify-content: center;
  margin: 4rem 0;
}

.balance-container {
  text-align: center;
}

.balance-symbol {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(90deg, #2c3e50 50%, #ecf0f1 50%);
  position: relative;
  margin: 0 auto 2rem;
  cursor: pointer;
  transition: transform 1s ease;
}

.balance-symbol:hover {
  transform: rotate(180deg);
}

.light, .dark {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.light {
  background: #ecf0f1;
  top: 0;
  left: 50px;
}

.dark {
  background: #2c3e50;
  bottom: 0;
  left: 50px;
}

.light-dot, .dark-dot {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  z-index: 2;
}

.light-dot {
  background: #2c3e50;
  top: 40px;
  left: 90px;
}

.dark-dot {
  background: #ecf0f1;
  bottom: 40px;
  left: 90px;
}

.balance-text h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #d4af37;
}

/* Elements Section Styles */
.elements-section {
  margin: 5rem 0;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #d4af37;
}

.elements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.element-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.element-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.08);
}

.element-wood:hover { border-color: #4CAF50; }
.element-fire:hover { border-color: #FF5722; }
.element-earth:hover { border-color: #795548; }
.element-metal:hover { border-color: #607D8B; }
.element-water:hover { border-color: #2196F3; }

.element-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #d4af37;
}

.element-card h4 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.element-properties {
  margin-top: 1rem;
}

.property-tag {
  display: inline-block;
  background: rgba(212, 175, 55, 0.2);
  color: #d4af37;
  padding: 0.3rem 0.8rem;
  margin: 0.2rem;
  border-radius: 15px;
  font-size: 0.8rem;
}

/* Wisdom Principles Styles */
.wisdom-principles-section {
  margin: 5rem 0;
}

.wisdom-principles-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.wisdom-principles-text h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #d4af37;
}

.wisdom-quote {
  font-style: italic;
  margin-bottom: 2rem;
  opacity: 0.8;
}

.wisdom-principles {
  margin-top: 2rem;
}

.principle-item {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.principle-icon {
  width: 50px;
  height: 50px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: #d4af37;
  font-size: 1.2rem;
}

.harmony-circle {
  display: flex;
  justify-content: center;
  align-items: center;
}

.harmony-symbol {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 2px solid #d4af37;
  position: relative;
  animation: rotate 20s linear infinite;
}

.direction {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: 0 0;
  text-align: center;
}

.direction-name {
  display: inline-block;
  transform: rotate(-45deg);
  color: #d4af37;
  font-weight: bold;
}

/* Life Wisdom Styles */
.life-wisdom-section {
  margin: 5rem 0;
}

.wisdom-cards {
  display: grid;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.wisdom-card {
  background: rgba(255, 255, 255, 0.03);
  padding: 2rem;
  border-radius: 10px;
  border-left: 4px solid #d4af37;
  display: flex;
  gap: 1.5rem;
}

.wisdom-number {
  font-size: 2rem;
  color: #d4af37;
  font-weight: bold;
  min-width: 50px;
}

.wisdom-text {
  font-style: italic;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.wisdom-meaning {
  opacity: 0.7;
  font-size: 0.9rem;
}

/* Quotes Carousel Styles */
.wisdom-quotes {
  margin: 5rem 0;
  background: rgba(255, 255, 255, 0.02);
  padding: 3rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.quotes-carousel {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.wisdom-quote {
  font-size: 1.5rem;
  font-style: italic;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.quote-author {
  color: #d4af37;
  font-size: 1.1rem;
}

.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.carousel-btn {
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid #d4af37;
  color: #d4af37;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-btn:hover {
  background: rgba(212, 175, 55, 0.2);
}

.carousel-dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: #d4af37;
  transform: scale(1.2);
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .wisdom-container {
    padding: 0 1rem;
  }

  .main-title {
    font-size: 2rem;
  }

  .wisdom-principles-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .harmony-symbol {
    width: 250px;
    height: 250px;
  }

  .wisdom-card {
    flex-direction: column;
    text-align: center;
  }

  .elements-grid {
    grid-template-columns: 1fr;
  }
}
</style>