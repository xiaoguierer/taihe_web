<template>
  <div class="master-team">
    <!-- Hero Section -->
    <div class="team-hero">
      <div class="hero-content">
        <h1 class="team-title">Master Team</h1>
        <p class="team-subtitle">Excellence in Collaboration · Innovation in Action</p>
        <p class="team-description">Bringing together industry elites to create exceptional value through teamwork</p>
        <div class="team-stats">
          <div class="stat-item">
            <div class="stat-number">15+</div>
            <div class="stat-label">Professional Teams</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">8</div>
            <div class="stat-label">Branch Offices</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">100+</div>
            <div class="stat-label">Successful Projects</div>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="floating-elements">
          <div class="element" v-for="n in 5" :key="n" :style="elementStyle(n)"></div>
        </div>
      </div>
    </div>

    <!-- Team Structure -->
    <div class="team-structure">
      <h2 class="section-title">Team Structure</h2>
      <p class="section-subtitle">Professional division of labor, efficient collaborative system</p>

      <div class="structure-grid">
        <div class="department-card" v-for="dept in departments" :key="dept.id"
             @mouseenter="activeDept = dept.id"
             @mouseleave="activeDept = null">
          <div class="dept-icon">
            <i :class="dept.icon"></i>
          </div>
          <h3 class="dept-name">{{ dept.name }}</h3>
          <p class="dept-description">{{ dept.description }}</p>
          <div class="dept-stats">
            <div class="dept-stat">
              <span class="stat-value">{{ dept.teamCount }}</span>
              <span class="stat-label">Teams</span>
            </div>
            <div class="dept-stat">
              <span class="stat-value">{{ dept.memberCount }}+</span>
              <span class="stat-label">Members</span>
            </div>
          </div>
          <div class="dept-projects">
            <div class="project-tag" v-for="project in dept.projects" :key="project">
              {{ project }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Branch Offices -->
    <div class="branches-section">
      <h2 class="section-title">Branch Offices</h2>
      <p class="section-subtitle">Global presence, localized service</p>

      <div class="branches-map">
        <div class="branch-location"
             v-for="branch in branches"
             :key="branch.id"
             :style="{ left: branch.positionX + '%', top: branch.positionY + '%' }"
             @mouseenter="activeBranch = branch.id"
             @mouseleave="activeBranch = null">
          <div class="location-marker" :class="{ active: activeBranch === branch.id }">
            <i class="fas fa-map-marker-alt"></i>
          </div>
          <div class="branch-info" v-show="activeBranch === branch.id">
            <h4>{{ branch.city }}</h4>
            <p>{{ branch.country }}</p>
            <p class="branch-establish">Established {{ branch.established }}</p>
          </div>
        </div>
      </div>

      <div class="branches-list">
        <div class="branch-card" v-for="branch in branches" :key="branch.id">
          <div class="branch-header">
            <h3 class="branch-city">{{ branch.city }}</h3>
            <span class="branch-country">{{ branch.country }}</span>
          </div>
          <div class="branch-details">
            <p class="branch-focus">Focus: {{ branch.focus }}</p>
            <p class="branch-size">Team Size: {{ branch.teamSize }}+ people</p>
            <div class="branch-projects">
              <span class="projects-count">{{ branch.projectsCompleted }}+ projects</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Team Values -->
    <div class="team-values">
      <h2 class="section-title">Team Values</h2>
      <div class="values-container">
        <div class="value-item" v-for="value in teamValues" :key="value.title">
          <div class="value-icon">
            <i :class="value.icon"></i>
          </div>
          <h3 class="value-title">{{ value.title }}</h3>
          <p class="value-description">{{ value.description }}</p>
        </div>
      </div>
    </div>

    <!-- Core Competencies -->
    <div class="skills-matrix">
      <h2 class="section-title">Core Competencies</h2>
      <div class="matrix-container">
        <div class="skill-category" v-for="category in skillCategories" :key="category.name">
          <h3 class="category-title">{{ category.name }}</h3>
          <div class="skill-bar">
            <div class="skill-progress" :style="{ width: category.level + '%' }"></div>
          </div>
          <div class="skill-percentage">{{ category.level }}%</div>
        </div>
      </div>
    </div>

    <!-- Project Showcase -->
    <div class="team-projects">
      <h2 class="section-title">Success Stories</h2>
      <p class="section-subtitle">Representative projects completed through team collaboration</p>

      <div class="projects-grid">
        <div class="project-card" v-for="project in teamProjects" :key="project.id">
          <div class="project-header">
            <h3 class="project-title">{{ project.title }}</h3>
            <span class="project-category">{{ project.category }}</span>
          </div>
          <p class="project-description">{{ project.description }}</p>
          <div class="project-teams">
            <span class="team-badge" v-for="team in project.teams" :key="team">{{ team }}</span>
          </div>
          <div class="project-stats">
            <div class="project-stat">
              <span class="stat-value">{{ project.duration }}</span>
              <span class="stat-label">Project Duration</span>
            </div>
            <div class="project-stat">
              <span class="stat-value">{{ project.teamSize }}+</span>
              <span class="stat-label">Team Members</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Join Our Team -->
    <div class="join-us">
      <div class="join-content">
        <h2 class="join-title">Join Our Team</h2>
        <p class="join-description">We're looking for talented, passionate teams to join our family</p>
        <div class="team-openings">
          <div class="opening-card" v-for="opening in teamOpenings" :key="opening.id">
            <h3 class="opening-title">{{ opening.team }}</h3>
            <p class="opening-location">{{ opening.locations.join(' · ') }}</p>
            <p class="opening-description">{{ opening.description }}</p>
            <button class="apply-btn">Learn More About This Team</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MasterTeam',
  data() {
    return {
      activeDept: null,
      activeBranch: null,
      departments: [
        {
          id: 1,
          name: 'Technology R&D Center',
          icon: 'fas fa-code',
          description: 'Responsible for core technology research and innovation',
          teamCount: 6,
          memberCount: 85,
          projects: ['AI Platform', 'Big Data', 'Cloud Computing']
        },
        {
          id: 2,
          name: 'Product Design Team',
          icon: 'fas fa-palette',
          description: 'Specializing in user experience and product innovation design',
          teamCount: 4,
          memberCount: 42,
          projects: ['UI/UX Design', 'Interaction Design', 'Brand Design']
        },
        {
          id: 3,
          name: 'Project Management Center',
          icon: 'fas fa-tasks',
          description: 'Ensuring efficient project delivery and quality control',
          teamCount: 3,
          memberCount: 28,
          projects: ['Agile Development', 'Quality Assurance', 'Risk Control']
        },
        {
          id: 4,
          name: 'Business Development Team',
          icon: 'fas fa-chart-line',
          description: 'Exploring market opportunities and maintaining client relationships',
          teamCount: 5,
          memberCount: 37,
          projects: ['Market Analysis', 'Client Success', 'Strategic Partnerships']
        }
      ],
      branches: [
        {
          id: 1,
          city: 'Shanghai',
          country: 'China',
          established: '2015',
          focus: 'FinTech and AI Research',
          teamSize: 65,
          projectsCompleted: 45,
          positionX: 78,
          positionY: 35
        },
        {
          id: 2,
          city: 'Shenzhen',
          country: 'China',
          established: '2018',
          focus: 'Smart Hardware and IoT',
          teamSize: 42,
          projectsCompleted: 28,
          positionX: 75,
          positionY: 40
        },
        {
          id: 3,
          city: 'Singapore',
          country: 'Singapore',
          established: '2019',
          focus: 'Southeast Asia Market and Cross-border Business',
          teamSize: 28,
          projectsCompleted: 22,
          positionX: 72,
          positionY: 45
        },
        {
          id: 4,
          city: 'Silicon Valley',
          country: 'USA',
          established: '2020',
          focus: 'Cutting-edge Technology Research and Innovation',
          teamSize: 35,
          projectsCompleted: 18,
          positionX: 18,
          positionY: 35
        },
        {
          id: 5,
          city: 'Berlin',
          country: 'Germany',
          established: '2021',
          focus: 'European Market and Industry 4.0',
          teamSize: 24,
          projectsCompleted: 15,
          positionX: 50,
          positionY: 30
        }
      ],
      teamValues: [
        {
          icon: 'fas fa-users',
          title: 'Team Collaboration',
          description: 'Cross-team collaboration to maximize collective intelligence'
        },
        {
          icon: 'fas fa-lightbulb',
          title: 'Continuous Innovation',
          description: 'Encouraging innovative thinking and exploring new technological boundaries'
        },
        {
          icon: 'fas fa-trophy',
          title: 'Pursuit of Excellence',
          description: 'Striving for the highest quality standards in every project'
        },
        {
          icon: 'fas fa-shield-alt',
          title: 'Integrity and Professionalism',
          description: 'Maintaining professional ethics and building long-term client trust'
        }
      ],
      skillCategories: [
        { name: 'Technical Architecture Design', level: 92 },
        { name: 'Product Planning Capability', level: 88 },
        { name: 'Project Management Skills', level: 85 },
        { name: 'Team Collaboration Efficiency', level: 90 },
        { name: 'Innovation Capability', level: 87 }
      ],
      teamProjects: [
        {
          id: 1,
          title: 'Smart City Management Platform',
          category: 'Government Digitalization',
          description: 'Comprehensive smart city solutions integrating IoT, big data, and AI technologies',
          teams: ['Technology R&D', 'Product Design', 'Project Management'],
          duration: '18 months',
          teamSize: 45
        },
        {
          id: 2,
          title: 'Financial Risk Control AI System',
          category: 'FinTech',
          description: 'Intelligent risk control platform for banking institutions',
          teams: ['AI Team', 'Data Team', 'Business Development'],
          duration: '12 months',
          teamSize: 32
        },
        {
          id: 3,
          title: 'Cross-border E-commerce Platform',
          category: 'E-commerce',
          description: 'Multi-language, multi-currency cross-border e-commerce ecosystem',
          teams: ['Frontend Team', 'Backend Team', 'UI/UX Design'],
          duration: '24 months',
          teamSize: 58
        }
      ],
      teamOpenings: [
        {
          id: 1,
          team: 'AI Research Team',
          locations: ['Shanghai', 'Silicon Valley', 'Remote'],
          description: 'Seeking teams with extensive experience in machine learning and deep learning'
        },
        {
          id: 2,
          team: 'Frontend Development Team',
          locations: ['Shenzhen', 'Singapore'],
          description: 'Inviting teams skilled in modern frontend frameworks and technology stacks'
        },
        {
          id: 3,
          team: 'Data Science Team',
          locations: ['Shanghai', 'Berlin', 'Remote'],
          description: 'Professional teams with big data analysis and modeling capabilities'
        }
      ]
    }
  },
  methods: {
    elementStyle(index) {
      const sizes = [60, 80, 100, 120, 140]
      const delays = [0, 0.5, 1, 1.5, 2]
      return {
        width: `${sizes[index - 1]}px`,
        height: `${sizes[index - 1]}px`,
        animationDelay: `${delays[index - 1]}s`
      }
    }
  }
}
</script>
<style scoped>
.master-team {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a1128 0%, #1a237e 50%, #2d3b8c 100%);
  color: #ffffff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Hero Section Styles */
.team-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  min-height: 80vh;
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-content {
  padding-right: 3rem;
}

.team-title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #d4af37, #ffd700, #d4af37);
  background-size: 300% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 3s infinite linear;
}

.team-subtitle {
  font-size: 1.5rem;
  color: #f0f0f0;
  margin-bottom: 1rem;
  font-weight: 300;
}

.team-description {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-weight: 300;
}

.team-stats {
  display: flex;
  gap: 3rem;
  margin-top: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #f0f0f0;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.8;
  font-weight: 300;
}

.hero-visual {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-elements {
  position: relative;
  width: 100%;
  height: 100%;
}

.element {
  position: absolute;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.1);
  border: 2px solid rgba(212, 175, 55, 0.3);
  animation: float 6s ease-in-out infinite;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Team Structure Styles */
.team-structure {
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #f0f0f0;
  font-weight: 700;
}

.section-subtitle {
  text-align: center;
  font-size: 1.2rem;
  opacity: 0.8;
  margin-bottom: 4rem;
  font-weight: 300;
}

.structure-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.department-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 2rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.department-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
  transition: left 0.5s ease;
}

.department-card:hover::before {
  left: 100%;
}

.department-card:hover {
  transform: translateY(-5px);
  border-color: rgba(212, 175, 55, 0.5);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.dept-icon {
  width: 80px;
  height: 80px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
  color: #f0f0f0;
  transition: transform 0.3s ease;
}

.department-card:hover .dept-icon {
  transform: scale(1.1);
}

.dept-name {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #f0f0f0;
  font-weight: 600;
}

.dept-description {
  opacity: 0.8;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  font-weight: 300;
}

.dept-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.dept-stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f0f0f0;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.7;
  font-weight: 300;
}

.dept-projects {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.project-tag {
  background: rgba(212, 175, 55, 0.2);
  color: #f0f0f0;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Branch Offices Styles */
.branches-section {
  padding: 6rem 2rem;
  background: rgba(255, 255, 255, 0.02);
}

.branches-map {
  position: relative;
  height: 400px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  margin: 3rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-image: url('data:image/svg+xml,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/></svg>');
  background-size: 100px 100px;
}

.branch-location {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 2;
}

.location-marker {
  width: 40px;
  height: 40px;
  background: rgba(212, 175, 55, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.location-marker.active {
  background: #f0f0f0;
  transform: scale(1.2);
  box-shadow: 0 4px 20px rgba(212, 175, 55, 0.5);
}

.branch-info {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 17, 40, 0.95);
  padding: 1rem;
  border-radius: 8px;
  min-width: 150px;
  text-align: center;
  margin-bottom: 10px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  backdrop-filter: blur(10px);
}

.branch-info h4 {
  color: #f0f0f0;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.branch-establish {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 0.5rem;
}

.branches-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.branch-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.branch-card:hover {
  border-color: rgba(212, 175, 55, 0.3);
  transform: translateY(-2px);
}

.branch-header {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.branch-city {
  font-size: 1.3rem;
  color: #f0f0f0;
  margin-bottom: 0.3rem;
  font-weight: 600;
}

.branch-country {
  opacity: 0.7;
  font-size: 0.9rem;
  font-weight: 300;
}

.branch-focus, .branch-size {
  opacity: 0.8;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 300;
}

.branch-projects {
  margin-top: 1rem;
}

.projects-count {
  background: rgba(212, 175, 55, 0.2);
  color: #f0f0f0;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Team Values Styles */
.team-values {
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.values-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.value-item {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 15px;
  transition: all 0.3s ease;
}

.value-item:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-5px);
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
  color: #f0f0f0;
  transition: transform 0.3s ease;
}

.value-item:hover .value-icon {
  transform: scale(1.1) rotate(5deg);
}

.value-title {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #f0f0f0;
  font-weight: 600;
}

.value-description {
  opacity: 0.8;
  line-height: 1.5;
  font-weight: 300;
}

/* Core Competencies Styles */
.skills-matrix {
  padding: 6rem 2rem;
  background: rgba(255, 255, 255, 0.02);
  max-width: 1200px;
  margin: 0 auto;
}

.matrix-container {
  display: grid;
  gap: 1.5rem;
  margin-top: 3rem;
}

.skill-category {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  gap: 2rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.category-title {
  font-size: 1.1rem;
  color: #f0f0f0;
  font-weight: 600;
}

.skill-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, #d4af37, #ffd700);
  border-radius: 4px;
  transition: width 1s ease;
  position: relative;
}

.skill-progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

.skill-percentage {
  text-align: right;
  color: #f0f0f0;
  font-weight: 600;
  font-size: 1.1rem;
}

/* Project Showcase Styles */
.team-projects {
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.projects-grid {
  display: grid;
  gap: 2rem;
  margin-top: 3rem;
}

.project-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.05), transparent);
  transition: left 0.5s ease;
}

.project-card:hover::before {
  left: 100%;
}

.project-card:hover {
  transform: translateY(-5px);
  border-color: rgba(212, 175, 55, 0.5);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.project-title {
  font-size: 1.3rem;
  color: #f0f0f0;
  font-weight: 600;
}

.project-category {
  background: rgba(212, 175, 55, 0.2);
  color: #f0f0f0;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.project-description {
  opacity: 0.8;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  font-weight: 300;
}

.project-teams {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.team-badge {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.team-badge:hover {
  background: rgba(212, 175, 55, 0.2);
  color: #f0f0f0;
  transform: scale(1.05);
}

.project-stats {
  display: flex;
  gap: 2rem;
}

.project-stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: #f0f0f0;
  margin-bottom: 0.3rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.7;
  font-weight: 300;
}

/* Join Our Team Styles */
.join-us {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #1a237e 0%, #2d3b8c 100%);
}

.join-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.join-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #f0f0f0;
  font-weight: 700;
}

.join-description {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 3rem;
  font-weight: 300;
}

.team-openings {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.opening-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.opening-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
  transition: left 0.5s ease;
}

.opening-card:hover::before {
  left: 100%;
}

.opening-card:hover {
  transform: translateY(-5px);
  border-color: rgba(212, 175, 55, 0.5);
}

.opening-title {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #f0f0f0;
  font-weight: 600;
}

.opening-location {
  opacity: 0.8;
  margin-bottom: 1rem;
  font-weight: 300;
}

.opening-description {
  opacity: 0.8;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  font-weight: 300;
}

.apply-btn {
  background: linear-gradient(135deg, #d4af37, #ffd700);
  color: #0a1128;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.apply-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.4);
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

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .team-hero {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 2rem 1rem;
    gap: 2rem;
  }

  .hero-content {
    padding-right: 0;
  }

  .team-title {
    font-size: 2.5rem;
  }

  .team-stats {
    justify-content: center;
    flex-wrap: wrap;
  }

  .structure-grid {
    grid-template-columns: 1fr;
  }

  .skill-category {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1rem;
  }

  .project-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .branches-map {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .team-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .team-stats {
    flex-direction: column;
    gap: 1.5rem;
  }

  .department-card,
  .project-card,
  .opening-card {
    padding: 1.5rem;
  }

  .join-title {
    font-size: 2rem;
  }
}

/* Scroll Animations */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Loading States */
.loading {
  position: relative;
  overflow: hidden;
}

.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { left: -100%; }
  100% { left: 100%; }
}
</style>