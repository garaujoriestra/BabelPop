describe('Protractor WallapopTFG App', function() {

    var emailLogin = element(by.model('model.email'));
    var passwordLogin = element(by.model('model.password'));
    var path = require('path');


    beforeEach(function() {
        browser.get('http://localhost:3000/#/login');
        element(by.model('model.email')).sendKeys("test@email.com");
        element(by.model('model.password')).sendKeys("12345678");
        element(by.id('entrarBtn')).click();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');
        browser.sleep(1000);
        element(by.id('editProfileBtn')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');
        expect(browser.getCurrentUrl()).toContain('/edit');
    });



    //TESTID:manPutUser1
    it('modifica datos basicos usuario', function() {
        element(by.model('userData.name')).clear().sendKeys("TestsEditado");
        element(by.model('userData.surname')).clear().sendKeys("ApellidosEditados");
        element(by.model('userData.phone')).clear().sendKeys("666555444");
        element(by.id('acceptBtn')).click();

        //Ruta final esperada
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');
    });

    //TESTID:manPutUser4
    it('modifica la contraseña del usuario', function() {


        element(by.id('togglePass')).click();
        element(by.model('oldPass')).clear().sendKeys("12345678");
        element(by.model('newPass')).clear().sendKeys("123456789");
        element(by.model('confirmPass')).clear().sendKeys("123456789");
        element(by.id('passChangeAcceptBtn')).click();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');

        //Realizamos logout y probamos con la nueva contraseña
        element(by.id('logoutID')).click();
        element(by.id('exit')).click();
        browser.sleep(1000);
        browser.get('http://localhost:3000/#/login');

        //Logeamos mediante navegación ya que la ruta es dinámica
        element(by.model('model.email')).sendKeys("test@email.com");
        element(by.model('model.password')).sendKeys("123456789");
        element(by.id('entrarBtn')).click();

        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');

        element(by.id('editProfileBtn')).click();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');
        expect(browser.getCurrentUrl()).toContain('/edit');


        //Volvemos a dejar la contraseña como al principio
        element(by.id('togglePass')).click();

        element(by.model('oldPass')).clear().sendKeys("123456789");
        element(by.model('newPass')).clear().sendKeys("12345678");
        element(by.model('confirmPass')).clear().sendKeys("12345678");

        element(by.id('passChangeAcceptBtn')).click();

        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');
    });


    //TESTID:manPutUser8
    it('no modifica la password del usuario', function() {

        element(by.id('togglePass')).click();
        element(by.model('oldPass')).clear().sendKeys("testpass");
        element(by.model('newPass')).clear().sendKeys("testspass2");
        element(by.model('confirmPass')).clear().sendKeys("WRONG");
        element(by.id('passChangeAcceptBtn')).click();

        //Ruta final esperada
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/profile/');
        expect(browser.getCurrentUrl()).toContain('/edit');
    });



    afterEach(function() {
        //Logout
        element(by.id('logoutID')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/logout');
        element(by.id('exit')).click();
        expect(browser.getCurrentUrl()).toContain('http://localhost:3000/#/');
    });
});
