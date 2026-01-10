// Nextra _meta.js file convention
// This file provides metadata for the pages directory
// Can be used alongside or instead of _meta.json

module.exports = {
  index: 'Introduction',
  features: 'Features Showcase',
  'api-example': 'API Reference Example',
  another: 'Another Page',
  advanced: {
    title: 'Advanced (A Folder)',
    type: 'page',
  },
  about: {
    title: 'About',
    type: 'page',
  },
  contact: {
    title: 'Contact ↗',
    type: 'page',
    href: 'https://twitter.com/shuding_',
    // ✅ newWindow removed - external links automatically open in new tab with rel="noreferrer"
  },
}
