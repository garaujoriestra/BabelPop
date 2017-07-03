describe('Protractor WallapopTFG App', function() {

    var emailLogin = element(by.model('model.email'));
    var passwordLogin = element(by.model('model.password'));
    var path = require('path');


    beforeEach(function() {
        browser.get('http://localhost:3000/#/login');
        element(by.model('model.email')).sendKeys("test@email.com");
        element(by.model('model.password')).sendKeys("12345678");
        element(by.id('entrarBtn')).click();
        browser.sleep(2000);
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');
        browser.get('http://localhost:3000/#/ads');
    });

    //TESTID:adList3
    it('aumenta los likes de un anuncio', function() {
        element(by.id('heartOff_0')).click();
        expect(element(by.binding('item.likes')).getText()).toEqual('1');
    });


    //TESTID:adList4
    it('disminuye los likes de un anuncio', function() {
        element(by.id('heartOn_0')).click();
        expect(element(by.binding('item.likes')).getText()).toEqual('0');
    });

    //TESTID:adList6
    it('aumenta las visitas de un anuncio', function() {

        //Resolvemos promesa de getText
        element(by.id('visits_0')).getText().then(function(visits) {
            element(by.id('eye_0')).click();
            browser.get('http://localhost:3000/#/ads');
            expect(element(by.id('visits_0')).getText()).toEqual((Number(visits)+1).toString());
        });

    });


    afterEach(function() {
        //Logout
        element(by.id('logoutID')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/logout');

        element(by.id('exit')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/');
    });
});
