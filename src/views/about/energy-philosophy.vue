<template>
  <section class="energy-philosophy">
    <div class="particles-container">
      <div v-for="particle in particles"
           :key="particle.id"
           class="particle"
           :style="particleStyle(particle)">
      </div>
    </div>

    <div class="energy-container">
      <!-- Header Section -->
      <div class="energy-header">
        <div class="title-symbols">
          <span class="symbol">⚡</span>
          <span class="symbol">🌀</span>
          <span class="symbol">🌌</span>
        </div>
        <h1 class="main-title">Energy Philosophy</h1>
        <p class="subtitle">Where cosmic forces meet conscious existence</p>
        <div class="title-divider">
          <div class="divider-line"></div>
          <div class="divider-dot"></div>
          <div class="divider-line"></div>
        </div>
      </div>

      <!-- Energy Orb Section -->
      <div class="energy-orb-section">
        <div class="energy-orb-container">
          <div class="energy-orb"
               :style="orbStyle"
               @click="changeEnergyState"
               @mouseenter="orbHover = true"
               @mouseleave="orbHover = false">
            <div class="orb-core"></div>
            <div class="orb-text">{{ currentState }}</div>
          </div>
          <div class="energy-text">
            <h3>Energy Transformation</h3>
            <p>Click the orb to witness energy state transformation</p>
          </div>
        </div>
      </div>

      <!-- Energy Principles Section -->
      <div class="principles-section">
        <h2 class="section-title">Cosmic Principles</h2>
        <div class="principles-grid">
          <div v-for="principle in energyPrinciples"
               :key="principle.id"
               class="principle-card"
               @mouseenter="activePrinciple = principle.id"
               @mouseleave="activePrinciple = null">
            <div class="principle-icon">
              <i :class="principle.icon"></i>
            </div>
            <h4>{{ principle.title }}</h4>
            <p>{{ principle.description }}</p>
          </div>
        </div>
      </div>

      <!-- Energy Flow Section -->
      <div class="energy-flow-section">
        <h2 class="section-title">Energy Flow Dynamics</h2>
        <div class="flow-container">
          <div class="flow-path"></div>
          <div v-for="(node, index) in flowNodes"
               :key="node.id"
               class="flow-node"
               :style="nodeStyle(index)"
               @click="activateNode(index)">
            {{ node.label }}
          </div>
        </div>
        <p>{{ flowDescription }}</p>
      </div>

      <!-- Quotes Section -->
      <div class="quotes-section">
        <div class="quotes-carousel">
          <transition name="fade" mode="out-in">
            <div :key="currentQuoteIndex" class="quote-slide">
              <blockquote class="energy-quote">
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
              <span v-for="(quote, index) in energyQuotes"
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
  name: 'EnergyPhilosophy',
  data() {
    return {
      particles: [],
      particleCount: 50,
      energyStates: [
        { name: 'Potential', color: 'radial-gradient(circle at 30% 30%, #ff6b6b, #4ecdc4, #2a2f6e)' },
        { name: 'Kinetic', color: 'radial-gradient(circle at 30% 30%, #4ecdc4, #ffd166, #2a2f6e)' },
        { name: 'Thermal', color: 'radial-gradient(circle at 30% 30%, #ffd166, #ff6b6b, #2a2f6e)' },
        { name: 'Radiant', color: 'radial-gradient(circle at 30% 30%, #ff6b6b, #ffd166, #2a2f6e)' },
        { name: 'Conscious', color: 'radial-gradient(circle at 30% 30%, #4ecdc4, #ff6b6b, #2a2f6e)' }
      ],
      currentStateIndex: 0,
      orbHover: false,
      energyPrinciples: [
        {
          id: 1,
          icon: 'fas fa-atom',
          title: 'Conservation',
          description: 'Energy cannot be created or destroyed, only transformed from one form to another.'
        },
        {
          id: 2,
          icon: 'fas fa-wave-square',
          title: 'Vibration',
          description: 'All matter and energy exist in a state of constant vibration at different frequencies.'
        },
        {
          id: 3,
          icon: 'fas fa-infinity',
          title: 'Interconnection',
          description: 'All energy systems are interconnected and influence each other across space and time.'
        }
      ],
      activePrinciple: null,
      flowNodes: [
        { id: 1, label: '1', state: 'Potential' },
        { id: 2, label: '2', state: 'Kinetic' },
        { id: 3, label: '3', state: 'Thermal' },
        { id: 4, label: '4', state: 'Radiant' },
        { id: 5, label: '5', state: 'Conscious' }
      ],
      activeNodeIndex: 0,
      energyQuotes: [
        {
          text: "Energy is the currency of the universe. When you 'pay' attention to something, you buy that experience.",
          author: "Dr. Michio Kaku"
        },
        {
          text: "The energy of the mind is the essence of life. Control your energy, control your reality.",
          author: "Aristotle"
        },
        {
          text: "We are not human beings having a spiritual experience. We are spiritual beings having a human experience.",
          author: "Pierre Teilhard de Chardin"
        },
        {
          text: "Everything is energy and that's all there is to it. Match the frequency of the reality you want.",
          author: "Albert Einstein"
        }
      ],
      currentQuoteIndex: 0
    }
  },
  computed: {
    currentState() {
      return this.energyStates[this.currentStateIndex].name
    },
    orbStyle() {
      const scale = this.orbHover ? 1.05 : 1
      return {
        background: this.energyStates[this.currentStateIndex].color,
        transform: `scale(${scale})`,
        boxShadow: this.orbHover
            ? '0 0 70px rgba(78, 205, 196, 0.8)'
            : '0 0 50px rgba(78, 205, 196, 0.5)'
      }
    },
    flowDescription() {
      const states = ['Potential', 'Kinetic', 'Thermal', 'Radiant', 'Conscious']
      return `Energy flows through five transformational states: ${states.join(' → ')}`
    },
    currentQuote() {
      return this.energyQuotes[this.currentQuoteIndex]
    }
  },
  methods: {
    initParticles() {
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
          id: i,
          size: Math.random() * 5 + 1,
          left: Math.random() * 100,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 5,
          color: this.getRandomColor()
        })
      }
    },
    getRandomColor() {
      const colors = ['#ff6b6b', '#4ecdc4', '#ffd166']
      return colors[Math.floor(Math.random() * colors.length)]
    },
    particleStyle(particle) {
      return {
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        left: `${particle.left}%`,
        animationDuration: `${particle.duration}s`,
        animationDelay: `${particle.delay}s`,
        background: particle.color
      }
    },
    changeEnergyState() {
      this.currentStateIndex = (this.currentStateIndex + 1) % this.energyStates.length
    },
    nodeStyle(index) {
      const isActive = index === this.activeNodeIndex
      const scale = isActive ? 1.2 : 1
      const shadow = isActive
          ? '0 0 20px rgba(78, 205, 196, 0.8)'
          : '0 0 0 rgba(78, 205, 196, 0.4)'

      return {
        left: `${(index + 1) * 20}%`,
        transform: `translateY(-50%) scale(${scale})`,
        boxShadow: shadow
      }
    },
    activateNode(index) {
      this.activeNodeIndex = index
      this.currentStateIndex = index
    },
    nextQuote() {
      this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.energyQuotes.length
    },
    prevQuote() {
      this.currentQuoteIndex = (this.currentQuoteIndex - 1 + this.energyQuotes.length) % this.energyQuotes.length
    }
  },
  mounted() {
    this.initParticles()

    // Auto-advance quotes
    setInterval(() => {
      this.nextQuote()
    }, 7000)

    // Auto-rotate through energy states
    setInterval(() => {
      this.activateNode((this.activeNodeIndex + 1) % this.flowNodes.length)
    }, 3000)
  }
}
</script>

<style scoped>
.energy-philosophy {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e2a 0%, #1a1f4e 50%, #2a2f6e 100%);
  color: #ffffff;
  position: relative;
  overflow: hidden;
  padding-top: 100px;
}

.energy-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}

/* Particles */
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  animation: floatParticle linear infinite;
}

/* Header Styles */
.energy-header {
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
}

.title-symbols {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.symbol {
  font-size: 2.5rem;
  animation: pulse 3s infinite alternate;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
}

.symbol:nth-child(1) { color: #ff6b6b; animation-delay: 0s; }
.symbol:nth-child(2) { color: #4ecdc4; animation-delay: 0.5s; }
.symbol:nth-child(3) { color: #ffd166; animation-delay: 1s; }

.main-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #ffd166, #ff6b6b);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 5s infinite linear;
}

.subtitle {
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  font-weight: 300;
}

.title-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.divider-line {
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #4ecdc4, transparent);
}

.divider-dot {
  width: 10px;
  height: 10px;
  background: #ffd166;
  border-radius: 50%;
  animation: glow 2s infinite alternate;
}

/* Energy Orb Section */
.energy-orb-section {
  display: flex;
  justify-content: center;
  margin: 4rem 0;
}

.energy-orb-container {
  text-align: center;
  position: relative;
}

.energy-orb {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  margin: 0 auto 2rem;
  position: relative;
  cursor: pointer;
  transition: all 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  animation: orbFloat 6s ease-in-out infinite;
}

.orb-core {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.8);
  animation: corePulse 3s infinite alternate;
}

.orb-text {
  position: absolute;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.energy-text h3 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #4ecdc4;
}

/* Energy Principles Section */
.principles-section {
  margin: 5rem 0;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #ffd166;
  position: relative;
}

.section-title:after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #ff6b6b, transparent);
}

.principles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.principle-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.principle-card:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.principle-card:hover:before {
  left: 100%;
}

.principle-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-color: rgba(78, 205, 196, 0.5);
}

.principle-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: #ff6b6b;
}

.principle-card h4 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #4ecdc4;
}

/* Energy Flow Section */
.energy-flow-section {
  margin: 5rem 0;
  text-align: center;
}

.flow-container {
  position: relative;
  height: 200px;
  margin: 3rem 0;
}

.flow-path {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #ffd166);
  transform: translateY(-50%);
}

.flow-node {
  position: absolute;
  top: 50%;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #2a2f6e;
  border: 3px solid #4ecdc4;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: nodePulse 2s infinite;
}

.flow-node:hover {
  transform: translateY(-50%) scale(1.3);
  box-shadow: 0 0 30px rgba(78, 205, 196, 0.9);
}

/* Quotes Section */
.quotes-section {
  margin: 5rem 0;
  background: rgba(255, 255, 255, 0.03);
  padding: 3rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
}

.quotes-section:before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(78, 205, 196, 0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

.quote-slide {
  text-align: center;
  position: relative;
  z-index: 2;
}

.energy-quote {
  font-size: 1.8rem;
  font-style: italic;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: #ffd166;
}

.quote-author {
  color: #4ecdc4;
  font-size: 1.2rem;
}

.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  position: relative;
  z-index: 2;
}

.carousel-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #4ecdc4;
  color: #4ecdc4;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-btn:hover {
  background: rgba(78, 205, 196, 0.2);
  transform: scale(1.1);
}

.carousel-dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: #ff6b6b;
  transform: scale(1.2);
}

/* Animations */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(1.1); opacity: 1; }
}

@keyframes glow {
  0% { box-shadow: 0 0 5px #ffd166; }
  100% { box-shadow: 0 0 15px #ffd166, 0 0 30px #ffd166; }
}

@keyframes orbFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes corePulse {
  0% { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(1.2); opacity: 1; }
}

@keyframes nodePulse {
  0%, 100% { box-shadow: 0 0 0 rgba(78, 205, 196, 0.4); }
  50% { box-shadow: 0 0 20px rgba(78, 205, 196, 0.8); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes floatParticle {
  0% { transform: translateY(100vh) translateX(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100vh) translateX(100px); opacity: 0; }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .energy-container {
    padding: 0 1rem;
  }

  .main-title {
    font-size: 2.5rem;
  }

  .principles-grid {
    grid-template-columns: 1fr;
  }

  .energy-orb {
    width: 200px;
    height: 200px;
  }

  .orb-core {
    width: 60px;
    height: 60px;
  }
}
</style>