<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12" md="10" lg="8" class="mx-auto">

        <!-- Header -->
        <header class="mb-12 text-center text-md-left">
          <h1 class="text-h2 font-weight-bold text-primary mb-2">
            IVÁN ALEJANDRO COTTI
          </h1>
          <h2 class="text-h5 text-medium-emphasis">
            {{ t.title }}
          </h2>
        </header>

        <v-divider class="mb-12"></v-divider>

        <!-- Information -->
        <section class="mb-16">
          <h3 class="text-h4 font-weight-bold mb-6 text-primary">{{ t.sections.info }}</h3>
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

        <!-- Experience -->
        <section class="mb-16">
          <h3 class="text-h4 font-weight-bold mb-8 text-primary">{{ t.sections.experience }}</h3>

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
                  <ul class="pl-4 text-body-1 text-medium-emphasis custom-list">
                    <li v-for="(task, i) in job.tasks" :key="i" class="mb-2">{{ task }}</li>
                  </ul>
                </v-card-text>
              </v-card>
            </v-timeline-item>

          </v-timeline>
        </section>

        <!-- Skills -->
        <section class="mb-16">
          <h3 class="text-h4 font-weight-bold mb-8 text-primary">{{ t.sections.skills }}</h3>

          <v-row>
            <v-col cols="12" md="6" class="mb-6">
              <h4 class="text-subtitle-1 font-weight-bold text-high-emphasis mb-3">{{ t.skillCategories.languages }}
              </h4>
              <div class="d-flex flex-wrap gap-2">
                <v-chip v-for="skill in skills.languages" :key="skill" color="primary" variant="tonal"
                  class="mr-2 mb-2 font-weight-medium" label>{{ skill }}</v-chip>
              </div>
            </v-col>
            <v-col cols="12" md="6" class="mb-6">
              <h4 class="text-subtitle-1 font-weight-bold text-high-emphasis mb-3">{{ t.skillCategories.frameworks }}
              </h4>
              <div class="d-flex flex-wrap gap-2">
                <v-chip v-for="skill in skills.frameworks" :key="skill" color="secondary" variant="tonal"
                  class="mr-2 mb-2 font-weight-medium" label>{{ skill }}</v-chip>
              </div>
            </v-col>
            <v-col cols="12" md="6" class="mb-6">
              <h4 class="text-subtitle-1 font-weight-bold text-high-emphasis mb-3">{{ t.skillCategories.infra }}</h4>
              <div class="d-flex flex-wrap gap-2">
                <v-chip v-for="skill in skills.infra" :key="skill" color="info" variant="tonal"
                  class="mr-2 mb-2 font-weight-medium" label>{{ skill }}</v-chip>
              </div>
            </v-col>
            <v-col cols="12" md="6" class="mb-6">
              <h4 class="text-subtitle-1 font-weight-bold text-high-emphasis mb-3">{{ t.skillCategories.tools }}</h4>
              <div class="d-flex flex-wrap gap-2">
                <v-chip v-for="skill in skills.tools" :key="skill" color="success" variant="tonal"
                  class="mr-2 mb-2 font-weight-medium" label>{{ skill }}</v-chip>
              </div>
            </v-col>
          </v-row>
        </section>

        <!-- Education -->
        <section class="mb-10">
          <h3 class="text-h4 font-weight-bold mb-6 text-primary">{{ t.sections.education }}</h3>
          <v-card variant="outlined" class="pa-6 border-opacity-25"
            :class="store.theme === 'dark' ? 'bg-grey-darken-4' : 'bg-grey-lighten-5'">
            <div class="d-flex flex-column flex-md-row justify-space-between align-start align-md-center mb-4">
              <div>
                <div class="text-h6 font-weight-bold text-high-emphasis">{{ t.education.institution }}</div>
                <div class="text-subtitle-1 text-primary font-weight-medium">{{ t.education.degree }}</div>
              </div>
              <div class="text-caption text-medium-emphasis font-weight-medium text-uppercase mt-2 mt-md-0">{{
                t.education.period }}</div>
            </div>
            <div class="text-body-2 text-medium-emphasis">{{ t.education.status }}</div>
          </v-card>
        </section>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useAppStore } from '../stores/appStore';

export default {
  name: "HomeView",
  props: {},

  data() {
    return {
      skills: {
        languages: ['JavaScript', 'TypeScript', 'Python', 'Kotlin', 'PHP', 'C++', 'Haskell', 'Assembler'],
        frameworks: ['Vue.js', 'React', 'Svelte', 'Astro', 'MUI', 'Vuetify', 'TailwindCSS', 'Bootstrap', 'NodeJS', 'Django', 'CodeIgniter'],
        infra: ['Netlify', 'Vercel', 'MySQL', 'MariaDB'],
        tools: ['Jira', 'Trello', 'GitLab', 'GitHub', 'Vite', 'Babel']
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
            languages: 'Lenguajes de Programación',
            frameworks: 'Frameworks y Librerías',
            infra: 'Infraestructura y Bases de Datos',
            tools: 'Herramientas y Gestión'
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
            languages: 'Programming Languages',
            frameworks: 'Frameworks & Libraries',
            infra: 'Infrastructure & Databases',
            tools: 'Tools & Management'
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

  methods: {}
}
</script>

<style scoped>
.custom-list {
  list-style-type: square;
}

.custom-list li::marker {
  color: rgb(var(--v-theme-primary));
}

.tracking-wider {
  letter-spacing: 0.1em;
}
</style>
