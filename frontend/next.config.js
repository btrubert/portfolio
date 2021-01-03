const path = require('path')

module.exports = {
    images: {
        domains: ["benjamintrubert.fr"],
      },
      i18n: {
        locales: ['en', 'fr'],
        defaultLocale: 'fr',
        localeDetection: true,
      },
      sassOptions: {
        includePaths: [path.join(__dirname, 'src/styles')],
      },
  }
