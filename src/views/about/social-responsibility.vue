<template>
  <section class="social-responsibility">
    <!-- Hero Section -->
    <div class="sr-hero">
      <div class="hero-content">
        <h1 class="hero-title">Social Responsibility</h1>
        <p class="hero-subtitle">Building a Better Future Through Conscious Action</p>
        <p class="hero-description">Our commitment to making a positive impact on society, environment, and communities</p>
        <div class="impact-stats">
          <div class="impact-stat" v-for="stat in impactStats" :key="stat.label">
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Our Commitments -->
    <div class="commitments-section">
      <h2 class="section-title">Our Core Commitments</h2>
      <div class="commitments-grid">
        <div class="commitment-card"
             v-for="commitment in commitments"
             :key="commitment.id"
             @mouseenter="activeCommitment = commitment.id"
             @mouseleave="activeCommitment = null">
          <div class="commitment-icon">
            <i :class="commitment.icon"></i>
          </div>
          <h3 class="commitment-title">{{ commitment.title }}</h3>
          <p class="commitment-description">{{ commitment.description }}</p>
          <div class="commitment-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: commitment.progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ commitment.progress }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Environmental Initiatives -->
    <div class="environment-section">
      <h2 class="section-title">Environmental Initiatives</h2>
      <div class="initiatives-container">
        <div class="initiative-tabs">
<!--          <button v-for="initiative in environmentalInitiatives"
                  :key="initiative.id"
                  class="tab-btn"
                  :class="{ active: activeInitiative === initiative.id }"
                  @click="activeInitiative = initiative.id">
            {{ initiative.title }}
          </button>-->
        </div>
        <div class="initiative-content">
          <div v-if="activeInitiative" class="initiative-details">
            <h3>{{ currentInitiative.title }}</h3>
            <p>{{ currentInitiative.description }}</p>
            <div class="initiative-stats">
              <div class="initiative-stat" v-for="stat in currentInitiative.stats" :key="stat.label">
                <span class="stat-value">{{ stat.value }}</span>
                <span class="stat-label">{{ stat.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Community Programs -->
    <div class="community-section">
      <h2 class="section-title">Community Programs</h2>
      <div class="programs-carousel">
        <div class="program-slide" v-for="program in communityPrograms" :key="program.id">
          <div class="program-card">
            <div class="program-image">
              <i :class="program.icon"></i>
            </div>
            <div class="program-content">
              <h3 class="program-title">{{ program.title }}</h3>
              <p class="program-description">{{ program.description }}</p>
              <div class="program-impact">
                <div class="impact-item" v-for="impact in program.impacts" :key="impact.label">
                  <span class="impact-value">{{ impact.value }}</span>
                  <span class="impact-label">{{ impact.label }}</span>
                </div>
              </div>
<!--              <button class="program-btn">Learn More</button>-->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sustainability Timeline -->
    <div class="timeline-section">
      <h2 class="section-title">Sustainability Journey</h2>
      <div class="timeline">
        <div class="timeline-item"
             v-for="milestone in sustainabilityMilestones"
             :key="milestone.year"
             :class="{ active: activeMilestone === milestone.year }"
             @click="activeMilestone = milestone.year">
          <div class="timeline-year">{{ milestone.year }}</div>
          <div class="timeline-content">
            <h3>{{ milestone.title }}</h3>
            <p>{{ milestone.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Partner Organizations -->
    <div class="partners-section">
      <h2 class="section-title">Partner Organizations</h2>
      <div class="partners-grid">
        <div class="partner-logo" v-for="partner in partnerOrganizations" :key="partner.name">
          <i :class="partner.icon"></i>
          <span class="partner-name">{{ partner.name }}</span>
        </div>
      </div>
    </div>

    <!-- Get Involved -->
    <div class="involvement-section">
      <div class="involvement-content">
        <h2 class="section-title">Get Involved</h2>
        <p class="involvement-description">Join us in making a difference</p>
        <div class="involvement-options">
          <div class="option-card" v-for="option in involvementOptions" :key="option.title">
            <div class="option-icon">
              <i :class="option.icon"></i>
            </div>
            <h3 class="option-title">{{ option.title }}</h3>
            <p class="option-description">{{ option.description }}</p>
<!--            <button class="option-btn">{{ option.buttonText }}</button>-->
          </div>
        </div>
      </div>
    </div>

    <!-- Report Download -->
    <div class="report-section">
      <div class="report-card">
        <h2>Social Responsibility Report 2023</h2>
        <p>Download our comprehensive report on sustainability and social impact</p>
        <div class="report-stats">
          <div class="report-stat" v-for="stat in reportStats" :key="stat.label">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
<!--        <button class="download-btn">
          <i class="fas fa-download"></i>
          Download Report
        </button>-->
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'SocialResponsibility',
  data() {
    return {
      activeCommitment: null,
      activeInitiative: 1,
      activeMilestone: 2023,
      impactStats: [
        { value: '50,000+', label: 'Community Members Impacted' },
        { value: '85%', label: 'Reduced Carbon Footprint' },
        { value: '25+', label: 'Partner Organizations' },
        { value: '$2.5M', label: 'Social Investment' }
      ],
      commitments: [
        {
          id: 1,
          title: 'Environmental Sustainability',
          icon: 'fas fa-leaf',
          description: 'Implementing green technologies and reducing environmental impact',
          progress: 85
        },
        {
          id: 2,
          title: 'Community Development',
          icon: 'fas fa-hands-helping',
          description: 'Supporting local communities through education and development programs',
          progress: 72
        },
        {
          id: 3,
          title: 'Ethical Business Practices',
          icon: 'fas fa-balance-scale',
          description: 'Maintaining transparency and ethical standards in all operations',
          progress: 95
        },
        {
          id: 4,
          title: 'Employee Well-being',
          icon: 'fas fa-heart',
          description: 'Creating a supportive and inclusive workplace environment',
          progress: 88
        }
      ],
      environmentalInitiatives: [
        {
          id: 1,
          title: 'Carbon Neutrality',
          description: 'Achieving net-zero carbon emissions through renewable energy and carbon offset programs',
          stats: [
            { value: '65%', label: 'Renewable Energy' },
            { value: '100+', label: 'Carbon Offset Projects' },
            { value: '2030', label: 'Target Year' }
          ]
        },
        {
          id: 2,
          title: 'Waste Reduction',
          description: 'Implementing zero-waste initiatives and circular economy practices',
          stats: [
            { value: '90%', label: 'Waste Diverted' },
            { value: '50+', label: 'Recycling Programs' },
            { value: '2025', label: 'Zero Waste Goal' }
          ]
        },
        {
          id: 3,
          title: 'Water Conservation',
          description: 'Reducing water consumption and protecting water resources',
          stats: [
            { value: '40%', label: 'Water Reduction' },
            { value: '10,000+', label: 'Liters Saved Daily' },
            { value: '15+', label: 'Water Projects' }
          ]
        }
      ],
      communityPrograms: [
        {
          id: 1,
          title: 'Education Access',
          icon: 'fas fa-graduation-cap',
          description: 'Providing educational resources and scholarships to underprivileged communities',
          impacts: [
            { value: '5,000+', label: 'Students Supported' },
            { value: '50+', label: 'Schools Built' },
            { value: '$1M+', label: 'Scholarships' }
          ]
        },
        {
          id: 2,
          title: 'Healthcare Initiatives',
          icon: 'fas fa-heartbeat',
          description: 'Supporting healthcare access and medical research programs',
          impacts: [
            { value: '10,000+', label: 'Patients Served' },
            { value: '20+', label: 'Medical Camps' },
            { value: '$500K', label: 'Medical Aid' }
          ]
        },
        {
          id: 3,
          title: 'Digital Inclusion',
          icon: 'fas fa-laptop-code',
          description: 'Bridging the digital divide through technology access and training',
          impacts: [
            { value: '2,500+', label: 'Devices Donated' },
            { value: '100+', label: 'Digital Labs' },
            { value: '5,000+', label: 'People Trained' }
          ]
        }
      ],
      sustainabilityMilestones: [
        { year: 2024.12, title: 'Carbon Neutral Pledge', description: 'Committed to achieving net-zero carbon emissions' },
        { year: 2025.2, title: 'Renewable Energy Transition', description: 'Switched 50% operations to renewable energy' },
        { year: 2025.5, title: 'Zero Waste Certification', description: 'Achieved zero-waste certification for all facilities' },
        { year: 2025.8, title: 'B Corp Certification', description: 'Received B Corp certification for social and environmental performance' },
        { year: 2025.10, title: 'Sustainable Supply Chain', description: '100% sustainable and ethical supply chain implemented' }
      ],
      partnerOrganizations: [
        { name: 'WWF', icon: 'fas fa-paw' },
        { name: 'UN Global Compact', icon: 'fas fa-globe' },
        { name: 'Red Cross', icon: 'fas fa-cross' },
        { name: 'UNICEF', icon: 'fas fa-child' },
        { name: 'Greenpeace', icon: 'fas fa-tree' },
        { name: 'World Food Programme', icon: 'fas fa-utensils' }
      ],
      involvementOptions: [
        {
          title: 'Volunteer Programs',
          icon: 'fas fa-hands-helping',
          description: 'Join our employee volunteer program and contribute to community projects',
          buttonText: 'Sign Up'
        },
        {
          title: 'Donation Matching',
          icon: 'fas fa-hand-holding-usd',
          description: 'Double your impact with our 1:1 donation matching program',
          buttonText: 'Donate'
        },
        {
          title: 'Green Ambassador',
          icon: 'fas fa-seedling',
          description: 'Become a sustainability champion in your workplace',
          buttonText: 'Apply'
        }
      ],
      reportStats: [
        { value: '150+', label: 'Pages' },
        { value: '25+', label: 'Case Studies' },
        { value: '50+', label: 'Metrics' },
        { value: '100%', label: 'Transparent' }
      ]
    }
  },
  computed: {
    currentInitiative() {
      return this.environmentalInitiatives.find(i => i.id === this.activeInitiative) || this.environmentalInitiatives[0]
    }
  },
  methods: {
    // Methods for interactivity
  }
}
</script>
<style scoped>
.social-responsibility {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a1128 0%, #1a237e 50%, #2d3b8c 100%);
  color: #ffffff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Hero Section */
.sr-hero {
  padding: 6rem 2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #d4af37, #ffd700, #d4af37);
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
  margin-bottom: 3rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.impact-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.impact-stat {
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
  opacity: 0.9;
  font-weight: 300;
}

/* Commitments Section */
.commitments-section {
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #d4af37;
  font-weight: 600;
}

.commitments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.commitment-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.commitment-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
  transition: left 0.5s ease;
}

.commitment-card:hover::before {
  left: 100%;
}

.commitment-card:hover {
  transform: translateY(-5px);
  border-color: rgba(212, 175, 55, 0.5);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.commitment-icon {
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
  transition: transform 0.3s ease;
}

.commitment-card:hover .commitment-icon {
  transform: scale(1.1);
}

.commitment-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #d4af37;
  font-weight: 600;
}

.commitment-description {
  opacity: 0.9;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  font-weight: 300;
}

.commitment-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4af37, #ffd700);
  border-radius: 4px;
  transition: width 1s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #d4af37;
  font-weight: 600;
  min-width: 40px;
}

/* Environmental Initiatives */
.environment-section {
  padding: 6rem 2rem;
  background: rgba(255, 255, 255, 0.02);
}

.initiatives-container {
  max-width: 1000px;
  margin: 0 auto;
}

.initiative-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.tab-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 1rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.tab-btn.active,
.tab-btn:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
  color: #d4af37;
  transform: translateY(-2px);
}

.initiative-content {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.initiative-details h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #d4af37;
  font-weight: 600;
}

.initiative-details p {
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-weight: 300;
}

.initiative-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.initiative-stat {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #d4af37;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  font-weight: 300;
}

/* Community Programs */
.community-section {
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.programs-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.program-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.program-card:hover {
  transform: translateY(-5px);
  border-color: rgba(212, 175, 55, 0.5);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.program-image {
  height: 200px;
  background: rgba(212, 175, 55, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #d4af37;
}

.program-content {
  padding: 2rem;
}

.program-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #d4af37;
  font-weight: 600;
}

.program-description {
  opacity: 0.9;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  font-weight: 300;
}

.program-impact {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.impact-item {
  text-align: center;
  padding: 0.5rem;
}

.impact-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: #d4af37;
  margin-bottom: 0.3rem;
}

.impact-label {
  font-size: 0.8rem;
  opacity: 0.8;
  font-weight: 300;
}

.program-btn {
  width: 100%;
  background: rgba(212, 175, 55, 0.2);
  border: 1px solid #d4af37;
  color: #d4af37;
  padding: 1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.program-btn:hover {
  background: #d4af37;
  color: #0a1128;
  transform: translateY(-2px);
}

/* Timeline Section */
.timeline-section {
  padding: 6rem 2rem;
  background: rgba(255, 255, 255, 0.02);
}

.timeline {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(212, 175, 55, 0.3);
  transform: translateX(-50%);
}

.timeline-item {
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.timeline-item:nth-child(odd) {
  flex-direction: row-reverse;
  text-align: right;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 15px;
  height: 15px;
  background: rgba(212, 175, 55, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
}

.timeline-item.active::before {
  background: #d4af37;
  width: 20px;
  height: 20px;
}

.timeline-year {
  flex: 1;
  font-size: 2rem;
  font-weight: 700;
  color: #d4af37;
  padding: 0 2rem;
}

.timeline-content {
  flex: 2;
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.timeline-item.active .timeline-content {
  border-color: rgba(212, 175, 55, 0.5);
  transform: scale(1.05);
}

.timeline-content h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #d4af37;
  font-weight: 600;
}

.timeline-content p {
  opacity: 0.9;
  line-height: 1.5;
  font-weight: 300;
}

/* Partners Section */
.partners-section {
  padding: 6rem 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
}

.partner-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.partner-logo:hover {
  border-color: rgba(212, 175, 55, 0.5);
  transform: translateY(-5px);
}

.partner-logo i {
  font-size: 3rem;
  color: #d4af37;
  margin-bottom: 1rem;
}

.partner-name {
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.9;
}

/* Involvement Section */
.involvement-section {
  padding: 6rem 2rem;
  background: rgba(255, 255, 255, 0.02);
}

.involvement-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.involvement-description {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 3rem;
  font-weight: 300;
}

.involvement-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.option-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.option-card:hover {
  border-color: rgba(212, 175, 55, 0.5);
  transform: translateY(-5px);
}

.option-icon {
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

.option-title {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #d4af37;
  font-weight: 600;
}

.option-description {
  opacity: 0.9;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  font-weight: 300;
}

.option-btn {
  background: rgba(212, 175, 55, 0.2);
  border: 1px solid #d4af37;
  color: #d4af37;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.option-btn:hover {
  background: #d4af37;
  color: #0a1128;
  transform: translateY(-2px);
}

/* Report Section */
.report-section {
  padding: 6rem 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.report-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 3rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.report-card h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #d4af37;
  font-weight: 600;
}

.report-card p {
  opacity: 0.9;
  margin-bottom: 2rem;
  font-weight: 300;
}

.report-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.report-stat {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.download-btn {
  background: linear-gradient(135deg, #d4af37, #ffd700);
  border: none;
  color: #0a1128;
  padding: 1rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 1.1rem;
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.4);
}

/* Animations */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .timeline::before {
    left: 30px;
  }

  .timeline-item {
    flex-direction: row !important;
    text-align: left !important;
  }

  .timeline-item::before {
    left: 30px;
  }

  .timeline-year {
    flex: 0 0 80px;
    padding: 0;
    text-align: center;
  }

  .timeline-content {
    margin-left: 2rem;
  }

  .impact-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .impact-stats {
    grid-template-columns: 1fr;
  }

  .initiative-tabs {
    flex-direction: column;
    align-items: center;
  }

  .tab-btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>