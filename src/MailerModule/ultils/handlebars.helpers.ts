import { registerHelper } from 'handlebars';

registerHelper(
  'formatCurrency',
  (value: number, locale = 'vi-VN', currency = 'VND') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  },
);
