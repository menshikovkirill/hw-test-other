module.exports = {
    baseUrl: 'https://shri.yandex/hw/store',
    gridUrl: 'http://127.0.0.1:4444/wd/hub',
    
    sets: {
        common: {                 // run tests associated with this path in all browsers
            files: 'test/hermione/*.js' // which are configured in the `browsers` option
        },
    },
    
    browsers: {
        chrome: {
            desiredCapabilities: {
                browserName: "chrome"
            }
        }
    }, 
    plugins: {
        'html-reporter/hermione': {
            path: 'hermione-html-report'
        }
    }
}