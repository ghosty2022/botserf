import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        projects: 'Projects',
        news: 'News',
        contact: 'Contact',
        admin: 'Admin',
        footer: '© {{year}} Botserf PTY LTD. All rights reserved.',
        welcome: 'Welcome to {{company}}',
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
        subscriptionFailed: 'Subscription failed.'
      }
    },
    sw: {
      translation: {
        home: 'Nyumbani',
        about: 'Kuhusu',
        services: 'Huduma',
        projects: 'Miradi',
        news: 'Habari',
        contact: 'Wasiliana',
        admin: 'Admin',
        footer: '© {{year}} Botserf PTY LTD. Haki Zote Zimehifadhiwa.',
        welcome: 'Karibu kwa {{company}}',
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
        subscriptionFailed: 'Kujiunga kumeshindwa.'
      }
    }
  },
  lng: 'en', // Default language
  fallbackLng: 'en', // Fallback language
  interpolation: { escapeValue: false } // Allows HTML in translations if needed
});

export default i18next;