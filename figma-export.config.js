/**
 * Figma Export CLI Configuration
 *
 * Configures @figma-export/cli for exporting components, styles, and assets
 * from Figma files to the codebase.
 *
 * @see https://github.com/marcomontalbano/figma-export
 */

module.exports = {
  commands: [
    {
      // Export components
      command: 'components',
      options: {
        fileId: process.env.FIGMA_FILE_KEY || '',
        output: 'packages/design-system/src/figma/components',
        outputters: [
          require('@figma-export/output-components-as-svg')({
            output: 'packages/design-system/src/figma/components/svg',
          }),
          require('@figma-export/output-components-as-png')({
            output: 'packages/design-system/src/figma/components/png',
            getDirname: () => '',
            getBasename: ({ componentName }) => componentName,
          }),
        ],
      },
    },
    {
      // Export styles (colors, typography, effects)
      command: 'styles',
      options: {
        fileId: process.env.FIGMA_FILE_KEY || '',
        output: 'packages/design-system/src/figma/styles',
        outputters: [
          require('@figma-export/output-styles-as-css')({
            output: 'packages/design-system/src/figma/styles/css',
          }),
          require('@figma-export/output-styles-as-sass')({
            output: 'packages/design-system/src/figma/styles/sass',
          }),
        ],
      },
    },
    {
      // Export icons
      command: 'icons',
      options: {
        fileId: process.env.FIGMA_FILE_KEY || '',
        output: 'packages/design-system/src/figma/icons',
        outputters: [
          require('@figma-export/output-components-as-svg')({
            output: 'packages/design-system/src/figma/icons',
          }),
        ],
      },
    },
  ],
}
