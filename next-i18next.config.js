/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'cn'], // 确保包含所有使用的语言
  },
  react: { useSuspense: false },//this line
};

