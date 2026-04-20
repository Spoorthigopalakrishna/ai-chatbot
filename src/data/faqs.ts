import { FAQ } from '../types';

export const faqs: FAQ[] = [
  {
    question: 'How do I reset my password?',
    answer: 'To reset your password, click the "Forgot Password" link on the login page. You\'ll receive an email with instructions to create a new password.',
    category: 'Account Management'
  },
  {
    question: 'Where can I find my billing history?',
    answer: 'Your billing history can be found in the Account Settings under the "Billing" tab. There you can view past invoices and payment information.',
    category: 'Billing'
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'To cancel your subscription, go to Account Settings > Billing > Subscription and click the "Cancel Subscription" button. Your service will continue until the end of the current billing period.',
    category: 'Billing'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for business accounts.',
    category: 'Billing'
  },
  {
    question: 'How can I contact technical support?',
    answer: 'You can reach our technical support team through: 1) This chat interface 2) Email at support@example.com 3) Phone at 1-800-SUPPORT during business hours.',
    category: 'Technical Support'
  },
  {
    question: 'What are the system requirements?',
    answer: 'Our platform works on any modern web browser (Chrome, Firefox, Safari, Edge). For optimal performance, we recommend using the latest version of your preferred browser.',
    category: 'Technical Support'
  },
  {
    question: 'How do I export my data?',
    answer: 'To export your data, go to Account Settings > Data Management > Export. You can choose between CSV, JSON, or PDF formats for your export.',
    category: 'Product Features'
  },
  {
    question: 'Is there a mobile app available?',
    answer: 'Yes! Our mobile app is available for both iOS and Android devices. You can download it from the App Store or Google Play Store.',
    category: 'Product Features'
  },
  {
    question: 'How secure is my data?',
    answer: 'We take security seriously. All data is encrypted at rest and in transit using industry-standard encryption. We also offer two-factor authentication and regular security audits.',
    category: 'Technical Support'
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'Yes, we offer a 14-day free trial with full access to all features. No credit card is required to start your trial.',
    category: 'Billing'
  }
];