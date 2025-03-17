import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// Get the persisted language from localStorage, default to 'en' if not set
const savedLanguage = localStorage.getItem('i18nextLng') || 'en';

i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        // General navigation and footer
        home: 'Home',
        about: 'About',
        services: 'Services',
        projects: 'Projects',
        news: 'News',
        contact: 'Contact',
        admin: 'Admin',
        footer: '© {{year}} Botserf PTY LTD. All rights reserved.',

        // Admin login and contact form
        adminLogin: 'Admin Login',
        email: 'Email',
        password: 'Password',
        login: 'Login',
        loginFailed: 'Login failed',
        messageSent: 'Message sent successfully!',
        messageFailed: 'Failed to send message.',
        name: 'Name',
        message: 'Message',
        send: 'Send',
        subscriptionSuccess: 'Subscribed successfully!',
        subscriptionFailed: 'Subscription failed.',

        // Home component content
        homeTitle: 'Botserf PTY LTD - Home',
        homeDescription: 'Welcome to Botserf PTY LTD, your partner in sustainable solutions.',
        welcome: 'Welcome to {{company}}',
        heroSubtitle: 'Harnessing Earth Systems Science for a sustainable future.',
        exploreSolutions: 'Explore Our Solutions',
        projectsCompleted: 'Projects Completed',
        clientsServed: 'Clients Served',
        yearsImpacting: 'Years Impacting',
        communitiesHelped: 'Communities Helped',
        treesPlanted: 'Trees Planted',
        impactOverTime: 'Our Impact Over Time',
        impactByCategory: 'Impact by Category',
        climate: 'Climate',
        water: 'Water',
        health: 'Health',
        ecology: 'Ecology',
        ourImpactAreas: 'Our Impact Areas',
        climateResilienceTitle: 'Climate Resilience',
        climateResilienceDesc: 'Developing strategies to adapt to changing climates, protecting vulnerable ecosystems.',
        waterSustainabilityTitle: 'Water Sustainability',
        waterSustainabilityDesc: 'Optimizing water resources for agriculture and communities in arid regions.',
        healthSolutionsTitle: 'Health Solutions',
        healthSolutionsDesc: 'Revolutionizing supply chains to deliver critical health resources efficiently.',
        ecoConservationTitle: 'Eco Conservation',
        ecoConservationDesc: 'Preserving biodiversity through innovative ecological assessments.',
        kenyaIrrigationTitle: 'Kenya Irrigation',
        kenyaIrrigationText: 'Implemented precision irrigation in arid regions, increasing crop yields by 30% in 2023.',
        sahelResilienceTitle: 'Sahel Resilience',
        sahelResilienceText: 'Built water retention systems, supporting 50+ communities in 2024.',
        healthDeliveryTitle: 'Health Delivery',
        healthDeliveryText: 'Optimized supply chains, delivering aid to 10,000+ people during crises.',
        featuredInitiatives: 'Featured Initiatives',
        climateAdaptation: 'Climate Adaptation',
        waterManagement: 'Water Management',
        healthSupply: 'Health Supply',
        ecoConservation: 'Eco Conservation',
        ourJourney: 'Our Journey',
        timelineEvent1: 'Botserf founded with a focus on Earth Systems Sciences.',
        timelineEvent2: 'Expanded into health supply solutions.',
        timelineEvent3: 'Launched first climate adaptation project in Kenya.',
        timelineEvent4: 'Achieved 150+ sustainable projects globally.',

        // About component content
        aboutTitle: 'About Botserf PTY LTD',
        aboutDescription: 'Learn about Botserf PTY LTD’s vision, mission, and values.',
        vision: 'Vision',
        visionText: 'Botserf LTD is dedicated to a sustainable future by using Earth System Science to understand planetary dynamics, providing data-driven insights for strategic decisions, fostering partnerships, developing innovative technologies, and building resilience against environmental challenges, while also extending their expertise to revolutionizing health supply solutions.',
        mission: 'Mission',
        missionText: 'Botserf PTY LTD is dedicated to leveraging Earth Systems Sciences and cutting-edge technologies to develop impactful solutions for critical global challenges, while simultaneously revolutionizing health supply solutions through innovative, client-focused approaches, ultimately aiming to provide tangible benefits to all stakeholders.',
        excellence: 'Excellence',
        excellenceText: 'Pursuit of excellence through rigorous research and superior solutions.',
        inclusivity: 'Inclusivity',
        inclusivityText: 'Valuing diverse perspectives for innovation and collaboration.',
        integrity: 'Integrity',
        integrityText: 'Adhering to the highest ethical and professional standards.',
        innovation: 'Innovation',
        innovationText: 'Driving positive change through continuous technological advancement.',
        sustainability: 'Sustainability',
        sustainabilityText: 'Prioritizing eco-friendly practices for future generations.',
        ourStructure: 'Our Structure',
        ourStructureText: 'Botserf PTY LTD operates with a leadership structure consisting of three directors, supported by a diverse team of associates who bring expert knowledge across our consulting specializations, including climate science, water management, health logistics, and ecological conservation.'
      }
    },
    sw: {
      translation: {
        // General navigation and footer
        home: 'Nyumbani',
        about: 'Kuhusu',
        services: 'Huduma',
        projects: 'Miradi',
        news: 'Habari',
        contact: 'Wasiliana',
        admin: 'Admin',
        footer: '© {{year}} Botserf PTY LTD. Haki Zote Zimehifadhiwa.',

        // Admin login and contact form
        adminLogin: 'Ingia kwa Admin',
        email: 'Barua Pepe',
        password: 'Nenosiri',
        login: 'Ingia',
        loginFailed: 'Kuingia kumeshindwa',
        messageSent: 'Ujumbe umetumwa kwa mafanikio!',
        messageFailed: 'Imeshindwa kutuma ujumbe.',
        name: 'Jina',
        message: 'Ujumbe',
        send: 'Tuma',
        subscriptionSuccess: 'Umejiunga kwa mafanikio!',
        subscriptionFailed: 'Kujiunga kumeshindwa.',

        // Home component content
        homeTitle: 'Botserf PTY LTD - Nyumbani',
        homeDescription: 'Karibu kwa Botserf PTY LTD, mshirika wako katika suluhisho endelevu.',
        welcome: 'Karibu kwa {{company}}',
        heroSubtitle: 'Kutumia Sayansi ya Mifumo ya Dunia kwa mustakabali endelevu.',
        exploreSolutions: 'Chunguza Suluhisho Zetu',
        projectsCompleted: 'Miradi Iliyokamilika',
        clientsServed: 'Wateja Waliotolewa Huduma',
        yearsImpacting: 'Miaka ya Athari',
        communitiesHelped: 'Jumuiya Zilizosaidiwa',
        treesPlanted: 'Miti Iliyopandwa',
        impactOverTime: 'Athari Zetu Baada ya Muda',
        impactByCategory: 'Athari kwa Kategoria',
        climate: 'Hali ya Hewa',
        water: 'Maji',
        health: 'Afya',
        ecology: 'Ikolojia',
        ourImpactAreas: 'Maeneo Yetu ya Athari',
        climateResilienceTitle: 'Ustahimilivu wa Hali ya Hewa',
        climateResilienceDesc: 'Kukuza mikakati ya kukabiliana na mabadiliko ya hali ya hewa, kulinda mifumo ya ikolojia hatarini.',
        waterSustainabilityTitle: 'Uendelevu wa Maji',
        waterSustainabilityDesc: 'Kuboresha rasilimali za maji kwa kilimo na jamii katika maeneo kame.',
        healthSolutionsTitle: 'Suluhisho za Afya',
        healthSolutionsDesc: 'Kubadilisha minyororo ya ugavi ili kutoa rasilimali muhimu za afya kwa ufanisi.',
        ecoConservationTitle: 'Uhifadhi wa Ikolojia',
        ecoConservationDesc: 'Kuhifadhi bioanuwai kupitia tathmini bunifu za ikolojia.',
        kenyaIrrigationTitle: 'Umwagiliaji Kenya',
        kenyaIrrigationText: 'Ilitekelezwa umwagiliaji sahihi katika maeneo kame, kuongeza mavuno ya mazao kwa 30% mwaka 2023.',
        sahelResilienceTitle: 'Ustahimilivu wa Sahel',
        sahelResilienceText: 'Ilijenga mifumo ya kuhifadhi maji, kusaidia jumuiya 50+ mwaka 2024.',
        healthDeliveryTitle: 'Utoaji wa Afya',
        healthDeliveryText: 'Iliboresha minyororo ya ugavi, kutoa misaada kwa watu 10,000+ wakati wa migogoro.',
        featuredInitiatives: 'Mipango Iliyoangaziwa',
        climateAdaptation: 'Kukabiliana na Hali ya Hewa',
        waterManagement: 'Usimamizi wa Maji',
        healthSupply: 'Ugavi wa Afya',
        ecoConservation: 'Uhifadhi wa Ikolojia',
        ourJourney: 'Safari Yetu',
        timelineEvent1: 'Botserf ilianzishwa kwa lengo la Sayansi ya Mifumo ya Dunia.',
        timelineEvent2: 'Ilipanua katika suluhisho za ugavi wa afya.',
        timelineEvent3: 'Ilizindua mradi wa kwanza wa kukabiliana na hali ya hewa nchini Kenya.',
        timelineEvent4: 'Ilifikia miradi endelevu 150+ duniani kote.',

        // About component content
        aboutTitle: 'Kuhusu Botserf PTY LTD',
        aboutDescription: 'Jifunze kuhusu maono, dhamira, na maadili ya Botserf PTY LTD.',
        vision: 'Maono',
        visionText: 'Botserf LTD imejitolea kwa mustakabali endelevu kwa kutumia Sayansi ya Mifumo ya Dunia kuelewa mienendo ya sayari, kutoa maarifa yanayotokana na data kwa maamuzi ya kimkakati, kukuza ushirikiano, kuendeleza teknolojia za ubunifu, na kujenga ustahimilivu dhidi ya changamoto za mazingira, huku pia ikipanua utaalamu wao katika kubadilisha suluhisho za ugavi wa afya.',
        mission: 'Dhamira',
        missionText: 'Botserf PTY LTD imejitolea kutumia Sayansi ya Mifumo ya Dunia na teknolojia za hali ya juu kuendeleza suluhisho zenye athari kwa changamoto za kimataifa, huku ikibadilisha suluhisho za ugavi wa afya kupitia mbinu za ubunifu zinazolenga wateja, hatimaye ikilenga kutoa faida za kweli kwa wadau wote.',
        excellence: 'Ubora',
        excellenceText: 'Kufuatia ubora kupitia utafiti wa kina na suluhisho bora.',
        inclusivity: 'Ujumuishi',
        inclusivityText: 'Kuthamini mitazamo tofauti kwa ajili ya ubunifu na ushirikiano.',
        integrity: 'Uadilifu',
        integrityText: 'Kushikilia viwango vya juu vya maadili na taaluma.',
        innovation: 'Ubunifu',
        innovationText: 'Kuendesha mabadiliko chanya kupitia maendeleo ya teknolojia ya mara kwa mara.',
        sustainability: 'Uendelevu',
        sustainabilityText: 'Kutanguliza mbinu rafiki za mazingira kwa ajili ya vizazi vijavyo.',
        ourStructure: 'Muundo Wetu',
        ourStructureText: 'Botserf PTY LTD inafanya kazi na muundo wa uongozi unaojumuisha wakurugenzi watatu, wakisadiwa na timu tofauti ya washirika ambao huleta ujuzi wa kitaalamu katika taaluma zetu za ushauri, ikijumuisha sayansi ya hali ya hewa, usimamizi wa maji, vifaa vya afya, na uhifadhi wa ikolojia.'
      }
    }
  },
  lng: savedLanguage,        // Use the saved language instead of hardcoding 'en'
  fallbackLng: 'en',        // Fallback language if a translation is missing
  interpolation: {
    escapeValue: false      // React already handles escaping
  }
});

export default i18next;