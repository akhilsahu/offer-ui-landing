import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
const resources = {
  en: {
    translation: {
      signup: {
        brand: {
          title: 'Brand Registration',
          description: 'Create your brand account to start advertising',
        },
        presenter: {
          title: 'Presenter Registration',
          description: 'Join our network of content creators',
        },
      },
      landing: {
        hero: {
          title: 'Earn by Sharing. Save by Clicking.',
          subtitle: 'Create and share exclusive offers with our innovative platform',
        },
        cta: {
          brand: "I'm a Brand",
          presenter: "I'm a Presenter",
        },
      },
      form: {
        labels: {
          name: 'Name',
          website: 'Website',
          email: 'Email Address',
          password: 'Password',
          platformType: 'Platform Type',
          sourceUrl: 'Website URL',
          appName: 'App Name',
        },
        placeholders: {
          brandName: 'Your Brand Name',
          fullName: 'Your Full Name',
          website: 'https://yourbrand.com',
          email: 'you@example.com',
          sourceUrl: 'https://yoursite.com',
          appName: 'Your App Name',
        },
        buttons: {
          submit: 'Create Account',
          submitting: 'Creating Account...',
          back: 'Back to Home',
        },
      },
      // Add more translations
    },
  },
      // Add more translations
};

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;