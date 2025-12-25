<template>
  <section class="brand-story">
    <div class="container">
      <div class="story-header">
        <h2>{{ pageData.story.title }}</h2>
        <div class="title-underline"></div>
      </div>

      <div class="story-grid">
        <div class="story-content">
          <div class="story-intro">
            <div class="origin-symbol">☯☯</div>
            <p class="intro-text">
              In a world where materialism often eclipses meaning, ZENIUL emerges as a sanctuary where jewelry transcends ornamentation to become a vessel of cultural wisdom and personal energy.
            </p>
          </div>

          <div class="story-chapters">
            <div class="chapter" v-for="(paragraph, index) in pageData.story.content" :key="index">
              <div class="chapter-number">{{ String(index + 1).padStart(2, '0') }}</div>
              <div class="chapter-content">
                <h3 class="chapter-title">{{ getChapterTitle(index) }}</h3>
                <p class="chapter-text">{{ paragraph }}</p>
                <div class="chapter-reflection" v-if="index === 1">
                  <div class="reflection-quote">"As above, so below; as within, so without"</div>
                  <div class="reflection-text">
                    Our AI energy matching system is rooted in this ancient Hermetic principle, translating celestial patterns and cultural symbols into wearable harmonics that resonate with your unique vibrational frequency.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="story-conclusion">
            <div class="legacy-circle">
              <div class="circle-inner">
                <span class="legacy-number">38</span>
                <span class="legacy-unit">countries</span>
              </div>
            </div>
            <p class="conclusion-text">
              From the sacred geometry of Southeast Asian Buddhist amulets to the celestial cartography of Middle Eastern star charts, and the symbolic language of Western astrology, ZENIUL weaves a tapestry of human spiritual expression into each meticulously crafted piece.
            </p>
            <div class="essence-statement">
              <i class="fas fa-diamond"></i>
              <span>We don't just create jewelry; we craft conduits of cultural continuity and personal transformation.</span>
            </div>
          </div>
        </div>

        <div class="story-image">
          <div class="image-placeholder">
            <div class="symbolic-elements">
              <div class="floating-element" v-for="n in 5" :key="n" :class="`element-${n}`">
                <div class="element-symbol">{{ getSymbol(n) }}</div>
              </div>
            </div>
            <div class="light-overlay"></div>
          </div>
          <div class="image-caption">
            <i class="fas fa-map-marked-alt"></i>
            <span>Where ancient wisdom meets contemporary craftsmanship</span>
          </div>
        </div>
      </div>

      <div class="philosophical-footer">
        <div class="philosophy-cards">
          <div class="philosophy-card" v-for="philosophy in philosophicalInsights" :key="philosophy.title">
            <div class="card-icon">
              <i :class="philosophy.icon"></i>
            </div>
            <h4>{{ philosophy.title }}</h4>
            <p>{{ philosophy.insight }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'BrandStory',
  data() {
    return {
      pageData: {
        story: {
          title: 'Eastern Philosophy · Contemporary Interpretation',
          content: [
            'Zeniul was founded in 2025 by a team proficient in jewelry craftsmanship and cross-cultural research, dedicated to addressing modern needs for spiritual fulfillment and aesthetic expression.',
            'Through our AI energy matching system, we combine Southeast Asian Buddhist culture, Middle Eastern astrological philosophy, and Western symbolism to transform traditional esoteric wisdom into wearable art.',
            'We have provided personalized jewelry configuration services to users in 38 countries, making each piece a carrier of cultural codes and energy.'
          ]
        }
      },
      philosophicalInsights: [
        {
          icon: 'fas fa-compass',
          title: 'The Compass of Meaning',
          insight: 'In an age of navigation by algorithms, ZENIUL offers a compass that points not to destinations, but to deeper understanding of self through cultural symbology.'
        },
        {
          icon: 'fas fa-scarab',
          title: 'Sacred Geometry of Self',
          insight: 'Each piece is designed with geometric precision that mirrors the Fibonacci sequences found in nature and the sacred patterns recognized across civilizations.'
        },
        {
          icon: 'fas fa-eye',
          title: 'The Third Eye of Craftsmanship',
          insight: 'Our artisans do not merely craft jewelry; they engrave centuries of wisdom into every facet, creating objects that serve as mirrors to the soul.'
        }
      ]
    }
  },
  methods: {
    getChapterTitle(index) {
      const titles = [
        'The Genesis of Meaning',
        'Alchemy of Cultures',
        'Global Resonance'
      ];
      return titles[index] || '';
    },
    getSymbol(n) {
      const symbols = ['☸☸', '☯☯', '★', '◈◈', '△'];
      return symbols[n - 1] || '';
    }
  }
}
</script>

<style scoped>
.brand-story {
  padding: 5rem 0;
  background: linear-gradient(135deg, #0a1128 0%, #1a237e 100%);
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.story-header {
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
}

.story-header h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #ffffff;
  font-weight: 700;
}

.title-underline {
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #ffffff, #ffffff);
  margin: 0 auto;
  border-radius: 2px;
}

.story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: start;
}

.story-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.story-intro {
  text-align: center;
  margin-bottom: 2rem;
}

.origin-symbol {
  font-size: 3rem;
  margin: 0 auto 1.5rem;
  opacity: 0.8;
}

.intro-text {
  font-size: 1.2rem;
  color: #e0e0e0;
  line-height: 1.8;
  font-style: italic;
  max-width: 600px;
  margin: 0 auto;
}

.story-chapters {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.chapter {
  display: flex;
  gap: 2rem;
  position: relative;
  padding: 2rem 0;
}

.chapter-number {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #ffffff, #ffffff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 1.1rem;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(255, 51, 102, 0.3);
}

.chapter-content {
  flex: 1;
}

.chapter-title {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #ffffff;
  font-weight: 600;
}

.chapter-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #e0e0e0;
  margin-bottom: 1.5rem;
}

.chapter-reflection {
  background: rgba(255, 51, 102, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #ffffff;
  margin-top: 1.5rem;
}

.reflection-quote {
  font-style: italic;
  font-size: 1rem;
  color: #ffffff;
  margin-bottom: 0.8rem;
  font-family: serif;
}

.reflection-text {
  color: #b0b0b0;
  line-height: 1.6;
  font-size: 0.95rem;
}

.story-conclusion {
  text-align: center;
  margin-top: 3rem;
}

.legacy-circle {
  width: 120px;
  height: 120px;
  border: 2px solid rgba(255, 51, 102, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  position: relative;
  background: rgba(255, 51, 102, 0.02);
}

.circle-inner {
  text-align: center;
}

.legacy-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
}

.legacy-unit {
  font-size: 0.9rem;
  color: #b0b0b0;
}

.conclusion-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #e0e0e0;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.essence-statement {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  font-style: italic;
  color: #ffffff;
  font-weight: 500;
}

.essence-statement i {
  font-size: 1.2rem;
}

.story-image {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-placeholder {
  position: relative;
  width: 100%;
  height: 500px;
  background: linear-gradient(135deg, #0a1128 0%, #1a237e 100%);
  border-radius: 15px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.symbolic-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-element {
  position: absolute;
  font-size: 2rem;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.element-1 { top: 10%; left: 10%; animation-delay: 0s; }
.element-2 { top: 20%; right: 15%; animation-delay: 1s; }
.element-3 { bottom: 30%; left: 20%; animation-delay: 2s; }
.element-4 { bottom: 15%; right: 10%; animation-delay: 3s; }
.element-5 { top: 50%; left: 50%; transform: translate(-50%, -50%); animation-delay: 4s; }

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.light-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  z-index: 1;
}

.image-caption {
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #b0b0b0;
  font-style: italic;
  font-size: 0.9rem;
}

.image-caption i {
  color: #ffffff;
}

.philosophical-footer {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.philosophy-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.philosophy-card {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.philosophy-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(255, 51, 102, 0.1);
  background: rgba(255, 255, 255, 0.08);
}

.card-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 51, 102, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: #ffffff;
  font-size: 1.5rem;
}

.philosophy-card h4 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #ffffff;
  font-weight: 600;
}

.philosophy-card p {
  color: #b0b0b0;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .story-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .chapter {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .chapter-number {
    align-self: center;
  }

  .philosophy-cards {
    grid-template-columns: 1fr;
  }

  .story-header h2 {
    font-size: 2rem;
  }

  .image-placeholder {
    height: 300px;
  }
}
</style>