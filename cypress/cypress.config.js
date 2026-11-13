const { defineConfig } = require('cypress')

module.exports = defineConfig({
  // the same page size as in Parts 2 and 3
  viewportWidth: 1280,
  viewportHeight: 1600,
  // retry each query and check for up to 10 seconds
  defaultCommandTimeout: 10000,
  // record a video of each spec during npx cypress run
  video: true,
  e2e: {
    setupNodeEvents(on, config) {
      // cy.task('log', text) prints text in the terminal, so that the
      // pizza name, tool and calories of a run can go into RESULTS.md
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
      })
    },
  },
})
