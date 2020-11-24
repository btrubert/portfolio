const path = require('path')

module.exports = {
    images: {
        domains: ["127.0.0.1", "192.168.50.122"],
      },
      i18n: {
        locales: ['en', 'fr'],
        defaultLocale: 'en',
        localeDetection: true,
      },
      sassOptions: {
        includePaths: [path.join(__dirname, 'src/styles')],
      },
  }