<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12" md="10" lg="8" class="mx-auto">

        <!-- Header -->
        <header class="mb-12 d-flex flex-column align-center fade-section">
          <v-avatar size="128" class="mb-4">
            <v-icon icon="mdi-account-circle" size="128" color="primary"></v-icon>
          </v-avatar>
          <h1 class="text-h3 font-weight-bold text-primary mb-2">
            IVÁN ALEJANDRO COTTI
          </h1>
          <h2 class="text-h5 text-medium-emphasis">
            {{ t.title }}
          </h2>
        </header>

        <section class="mb-4 fade-section">
          <GitContributions class="ma-auto" />
        </section>

        <v-divider class="mb-12"></v-divider>

        <section class="mb-16 fade-section">
          <h3 class="text-h5 font-weight-bold mb-6 text-primary">{{ t.sections.info }}</h3>
          <v-row>
            <v-col cols="12" sm="6">
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-3">mdi-email-outline</v-icon>
                <span class="text-body-1">ivancotti2001@gmail.com</span>
              </div>
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-3">mdi-map-marker-outline</v-icon>
                <span class="text-body-1">Devoto, CABA, Argentina</span>
              </div>
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-3">mdi-phone-outline</v-icon>
                <span class="text-body-1">+54 011 6560-2792</span>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-3">mdi-linkedin</v-icon>
                <a href="https://linkedin.com/in/ivan-alejandro-cotti" target="_blank"
                  class="text-decoration-none text-primary font-weight-medium">ivan-alejandro-cotti</a>
              </div>
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-3">mdi-github</v-icon>
                <a href="https://github.com/IvanCotti" target="_blank"
                  class="text-decoration-none text-primary font-weight-medium">IvanCotti</a>
              </div>
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-3">mdi-translate</v-icon>
                <span class="text-body-1">{{ t.english }}</span>
              </div>
            </v-col>
          </v-row>
        </section>

        <section class="mb-10 fade-section">
          <h3 class="text-h5 font-weight-bold mb-6 text-primary">{{ t.sections.education }}</h3>
          <v-card class="d-flex ga-3 pa-6 border-opacity-25"
            :class="store.theme === 'dark' ? 'bg-grey-darken-4' : 'bg-grey-lighten-5'">
            <img src="@/assets/images/unsam-logo.png" alt="Education" style="height: 100px;">
            <div class="d-flex flex-column flex-md-row justify-center align-md-center">
              <div>
                <h2 class="font-weight-bold text-high-emphasis">{{ t.education.institution }}</h2>
                <h3 class="text-primary font-weight-medium">{{ t.education.degree }}</h3>
                <div class="text-medium-emphasis">{{ t.education.period }} | {{ t.education.status }}</div>
              </div>
            </div>
          </v-card>
        </section>

        <section class="mb-16 fade-section">
          <h3 class="text-h5 font-weight-bold mb-8 text-primary">{{ t.sections.experience }}</h3>

          <v-timeline side="end" align="start" density="comfortable"
            :line-color="store.theme === 'dark' ? 'grey-darken-2' : 'grey-lighten-2'">

            <v-timeline-item dot-color="primary" size="small" v-for="(job, index) in t.experience" :key="index">
              <v-card variant="flat" class="bg-transparent">
                <v-card-title class="text-h6 font-weight-bold px-0 pt-0 text-wrap">{{ job.role }}</v-card-title>
                <v-card-subtitle class="px-0 text-subtitle-1 text-high-emphasis opacity-100 mb-1">
                  {{ job.company }}
                </v-card-subtitle>
                <v-card-text class="px-0 pb-0">
                  <div class="text-caption text-medium-emphasis mb-3 font-weight-medium text-uppercase tracking-wider">
                    {{ job.period }}
                  </div>
                  <ul class="ml-5 pl-4 text-body-1 text-medium-emphasis custom-list">
                    <li v-for="(task, i) in job.tasks" :key="i" class="mb-2">{{ task }}</li>
                  </ul>
                </v-card-text>
              </v-card>
            </v-timeline-item>

          </v-timeline>
        </section>

        <section class="skills mb-16 fade-section">
          <h3 class="text-h5 font-weight-bold mb-8 text-primary">{{ t.sections.skills }}</h3>

          <div v-for="(category, key) in skills" :key="key" class="mb-8">
            <h4 class="text-h5 font-weight-bold text-high-emphasis mb-4">
              {{ t.skillCategories[key] }}
            </h4>
            <v-row class="ma-n2">
              <v-col v-for="skill in category" :key="skill.name" cols="6" sm="4" md="3" lg="2" class="pa-2">
                <v-card :href="skill.url" target="_blank" rel="noopener noreferrer"
                  class="d-flex flex-column align-center justify-center py-4 h-100 transition-swing cursor-pointer">
                  <v-img :src="skill.logo" :alt="skill.name" width="48" height="48" class="mb-3" contain></v-img>
                  <div class="text-subtitle-2 font-weight-bold text-center">{{ skill.name }}</div>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </section>

      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import { useAppStore } from '../stores/appStore';
import GitContributions from '../components/GitContributions.vue';

export default {
  name: "HomeView",
  props: {},
  components: {
    GitContributions
  },
  data() {
    return {
      skills: {
        languages: [
          { name: 'JavaScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
          { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg', url: 'https://www.typescriptlang.org/' },
          { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg', url: 'https://www.python.org/' },
          { name: 'Kotlin', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg', url: 'https://kotlinlang.org/' },
          { name: 'PHP', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg', url: 'https://www.php.net/' },
          { name: 'C++', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg', url: 'https://isocpp.org/' },
          { name: 'Haskell', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/haskell/haskell-original.svg', url: 'https://www.haskell.org/' },
        ],
        frameworks: [
          { name: 'Vue.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg', url: 'https://vuejs.org/' },
          { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', url: 'https://react.dev/' },
          { name: 'Svelte', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg', url: 'https://svelte.dev/' },
          { name: 'Astro', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original.svg', url: 'https://astro.build/' },
        ],
        frontend_libs: [
          { name: 'MUI', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/materialui/materialui-original.svg', url: 'https://mui.com/' },
          { name: 'Vuetify', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuetify/vuetify-original.svg', url: 'https://vuetifyjs.com/' },
          { name: 'TailwindCSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', url: 'https://tailwindcss.com/' },
          { name: 'Semantic UI', logo: 'https://raw.githubusercontent.com/Semantic-Org/Semantic-UI-React/master/docs/public/logo.png', url: 'https://semantic-ui.com/' },
          { name: 'Bootstrap', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg', url: 'https://getbootstrap.com/' },
        ],
        hosting: [
          { name: 'Netlify', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/netlify/netlify-original.svg', url: 'https://www.netlify.com/' },
          { name: 'Vercel', logo: 'https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png', url: 'https://vercel.com/' },
        ],
        backend: [
          { name: 'NodeJS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', url: 'https://nodejs.org/' },
          { name: 'Django', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg', url: 'https://www.djangoproject.com/' },
          { name: 'CodeIgniter', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/codeigniter/codeigniter-plain.svg', url: 'https://codeigniter.com/' },
        ],
        databases: [
          { name: 'MySQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg', url: 'https://www.mysql.com/' },
          { name: 'MariaDB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mariadb/mariadb-original.svg', url: 'https://mariadb.org/' },
          { name: 'AWS RDS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', url: 'https://aws.amazon.com/rds/' },
        ],
        management: [
          { name: 'Jira', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jira/jira-original.svg', url: 'https://www.atlassian.com/software/jira' },
          { name: 'Trello', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/trello/trello-plain.svg', url: 'https://trello.com/' },
          { name: 'GitLab', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gitlab/gitlab-original.svg', url: 'https://about.gitlab.com/' },
          { name: 'GitHub', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', url: 'https://github.com/' },
        ],
        tools: [
          { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg', url: 'https://www.docker.com/' },
          { name: 'Docker Compose', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg', url: 'https://docs.docker.com/compose/' },
          { name: 'Sonarqube', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sonarqube/sonarqube-original.svg', url: 'https://www.sonarqube.org/' },
          { name: 'Postman', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg', url: 'https://www.postman.com/' },
        ]
      },
      translations: {
        es: {
          title: 'Desarrollador Fullstack y Analista de Ciberseguridad',
          english: 'Inglés: B1 (Intermedio)',
          sections: {
            info: 'Información Personal',
            experience: 'Experiencia Profesional',
            skills: 'Habilidades Técnicas',
            education: 'Formación Académica'
          },
          skillCategories: {
            languages: 'Lenguajes',
            frameworks: 'Frameworks Frontend',
            frontend_libs: 'Librerías Frontend',
            hosting: 'Hosting',
            backend: 'Frameworks Backend',
            databases: 'Bases de Datos',
            management: 'Gestión de Proyectos',
            tools: 'DevOps & Herramientas'
          },
          experience: [
            {
              role: 'Desarrollador de Software Freelance',
              company: 'Autónomo',
              period: '2024 - Presente',
              tasks: [
                'Diseño y desarrollo de sitios web responsivos y landing pages de alto impacto.',
                'Implementación, integración y despliegue de APIs RESTful.',
                'Optimización de rendimiento y SEO para aplicaciones web.'
              ]
            },
            {
              role: 'Desarrollador de Software',
              company: 'Centro de Ingeniería de Ciberdefensa (CIC) - Ministerio de Defensa',
              period: '2020 - Presente',
              tasks: [
                'Desarrollo y mantenimiento evolutivo de sistemas internos críticos.',
                'Diseño de interfaces de usuario (UI) y experiencia de usuario (UX).',
                'Administración de servidores Linux (Debian, Ubuntu, Kali) y orquestación de contenedores Docker.',
                'Gestión de bases de datos MySQL y ciclo de vida de desarrollo en GitLab (CI/CD).',
                'Liderazgo técnico y gestión de proyectos bajo metodologías ágiles.'
              ]
            },
            {
              role: 'Analista de Ciberseguridad Nivel 2',
              company: 'Centro de Operaciones de Ciberdefensa (COC) - Ministerio de Defensa',
              period: '2020 - 2022',
              tasks: [
                'Monitoreo activo de tráfico de red y respuesta a incidentes.',
                'Análisis forense y correlación de eventos de seguridad (SIEM/EDR).',
                'Investigación de amenazas y soporte técnico especializado a usuarios.',
                'Ejecución de auditorías de seguridad y pentesting ético.'
              ]
            }
          ],
          education: {
            institution: 'Universidad Nacional de San Martín (UNSAM)',
            period: '2023 - Presente',
            degree: 'Tecnicatura Universitaria en Programación Informática',
            status: 'Estudiante Avanzado (Último Año)'
          }
        },
        en: {
          title: 'Fullstack Developer & Cybersecurity Analyst',
          english: 'English: B1 (Intermediate)',
          sections: {
            info: 'Personal Information',
            experience: 'Professional Experience',
            skills: 'Technical Skills',
            education: 'Academic Background'
          },
          skillCategories: {
            languages: 'Languages',
            frameworks: 'Frontend Frameworks',
            frontend_libs: 'Frontend Libraries',
            hosting: 'Hosting',
            backend: 'Backend Frameworks',
            databases: 'Databases',
            management: 'Project Management',
            tools: 'DevOps & Tools'
          },
          experience: [
            {
              role: 'Freelance Software Developer',
              company: 'Self-employed',
              period: '2024 - Present',
              tasks: [
                'Design and development of responsive websites and high-impact landing pages.',
                'Implementation, integration, and deployment of RESTful APIs.',
                'Performance optimization and SEO for web applications.'
              ]
            },
            {
              role: 'Software Developer',
              company: 'Cyberdefense Engineering Center (CIC) - Ministry of Defense',
              period: '2020 - Present',
              tasks: [
                'Development and evolutionary maintenance of critical internal systems.',
                'User Interface (UI) and User Experience (UX) design.',
                'Linux server administration (Debian, Ubuntu, Kali) and Docker container orchestration.',
                'MySQL database management and development lifecycle in GitLab (CI/CD).',
                'Technical leadership and project management under agile methodologies.'
              ]
            },
            {
              role: 'Level 2 Cybersecurity Analyst',
              company: 'Cyberdefense Operations Center (COC) - Ministry of Defense',
              period: '2020 - 2022',
              tasks: [
                'Active network traffic monitoring and incident response.',
                'Forensic analysis and security event correlation (SIEM/EDR).',
                'Threat investigation and specialized technical support for users.',
                'Execution of security audits and ethical pentesting.'
              ]
            }
          ],
          education: {
            institution: 'National University of San Martín (UNSAM)',
            period: '2023 - Present',
            degree: 'University Technician in Computer Programming',
            status: 'Advanced Student (Final Year)'
          }
        }
      }
    }
  },

  computed: {
    store() {
      return useAppStore();
    },
    t() {
      return this.translations[this.store.language];
    }
  },

  mounted() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    const sections = document.querySelectorAll('.fade-section');
    sections.forEach(section => {
      observer.observe(section);
    });
  },
  methods: {}
}
</script>

<style>
.v-timeline-item:hover .v-timeline-divider__dot {
  animation: ripple 1.6s 0.4s ease-out infinite;
}

.v-timeline-item:hover .v-card-title {
  color: var(--color-primary);
}

@keyframes ripple {
  from {
    box-shadow: 0 0 0 0 var(--color-primary);
  }

  to {
    box-shadow: 0 0 0 22px #63d2ff00;
  }
}

.custom-list {
  list-style-type: square;
}

.custom-list li::marker {
  color: rgb(var(--v-theme-primary));
}

.tracking-wider {
  letter-spacing: 0.1em;
}

.skills .v-card {
  transition: all 0.3s ease;
  border: 5px solid transparent;
}

.skills .v-card .v-img {
  transition: all 0.3s ease;
}

.skills .v-card:hover .v-img {
  transform: scale(1.4);
}

.skills .v-card:not(.v-theme--light):hover {
  border-image: radial-gradient(transparent 90%, #d1b529 10%) 1;
  background: radial-gradient(#7f53016e, #291b0250);
  color: #d1b529;
}

.skills .v-card.v-theme--light:hover {
  border-image: radial-gradient(transparent 90%, #2956d1 10%) 1;
  background: radial-gradient(#ffffff50, #01467f6e);
  color: #2956d1;
}

.fade-section {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  will-change: opacity, transform;
}

.fade-section.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
