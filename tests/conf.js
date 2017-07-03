exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    allScriptsTimeout: 50000,
    capabilities: {
        'browserName': 'chrome'
    },
    suites: {
        signup: 'signup.js',
        login: 'login.js',
        createAd: 'createAd.js',
        adList: 'adList.js',
        editUser: 'editUser.js',
        adDetail: 'adDetail.js',
        adList: 'adList.js',
        deleteAd: 'deleteAd.js',
        editAd: 'editAd.js',
        filter: 'filter.js',
        init_createAd: 'init_createAd.js'
        init_createAdFilt: 'init_createAdFilt.js'
        init_createAdUser: 'init_createAdUser.js',
        log: 'log.js'
    }
}
