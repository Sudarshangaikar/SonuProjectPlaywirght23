
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({

    testDir: './tests',

    timeout: 60000,

    expect: {
        timeout: 10000
    },

    reporter: 'html',

    use: {
        browserName: 'chromium',
        headless: false,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure'
    }

});
