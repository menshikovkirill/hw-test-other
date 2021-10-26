const { assert } = require('chai');

describe('github', function() {
    it('Тест, который пройдет', async function() {
        assert.equal(2+2, 4);
    });
});

describe("static-screens-test", () => {
    it('main-test', async function() {
        await this.browser.url('/hw/store/');
        await this.browser.assertView('main', '#root');
        await this.browser.refresh();
        await this.browser.assertView('main-ref', '#root');
    })
    it('delivery-test', async function() {
        await this.browser.url('/hw/store/delivery');
        await this.browser.assertView('delivery', '#root');
        await this.browser.refresh();
        await this.browser.assertView('delivery-ref', '#root');
    })
    it('Contacts-test', async function() {
        await this.browser.url('/hw/store/Contacts');
        await this.browser.assertView('Contacts', '#root');
        await this.browser.refresh();
        await this.browser.assertView('Contacts-ref', '#root');
    })

    it("mini-delivery-test", async function() {
        await this.browser.setWindowSize(500, 1024);
        await this.browser.url('/hw/store/delivery');
        await this.browser.assertView('delivery-mini', '#root');
    });
    it("mini-Contacts-test", async function() {
        await this.browser.setWindowSize(500, 1024);
        await this.browser.url('/hw/store/Contacts');
        await this.browser.assertView('contacts-mini', '#root');
    });

    it("mini-Contacts-click-test", async function() {
        await this.browser.setWindowSize(500, 1024);
        await this.browser.url('/hw/store/Contacts');
        await this.browser.$('.container').scrollIntoView();
        const button = await this.browser.$('button.Application-Toggler');
        await button.waitForClickable({timeout:2000});
        await button.click();
        await(500);
        await this.browser.$('.container').scrollIntoView();
        await(500);
        await this.browser.assertView('contacts-mini-click', '#root', {
            ignoreElements: ['.nav-link:last-child']
        });

        const link = await this.browser.$('.nav-link:last-child');
        await link.waitForClickable({timeout:2000});
        await link.click();
        const closeMenu = await this.browser.$('.collapse.navbar-collapse');
        const isEx = closeMenu.isExisting();
        assert.ok(isEx, "Гамбургер закрыт")

        await this.browser.url('/hw/store/Cart');
        await this.browser.$('.col').scrollIntoView();
        await this.browser.assertView('cart-default', '.col');

        await this.browser.setWindowSize(500, 1024);
        await this.browser.url('/hw/store/Cart');
        await this.browser.$('.col').scrollIntoView();
        await this.browser.assertView('cart-default-1', '.col');
    });

    it("details", async function() {
        await this.browser.setWindowSize(1300, 1024);
        await this.browser.url('/hw/store/Catalog');
        const link =  this.browser.$(".ProductItem-DetailsLink");
        await link.waitForClickable({timeout: 2000});
        await link.click();
        await wait(2000);
        await this.browser.$('.ProductDetails').scrollIntoView();
        await this.browser.assertView('detalis', '.ProductDetails', {
            ignoreElements: ['.ProductDetails-Name', 
            '.ProductDetails-Description', 
            '.ProductDetails-Price fs-3',
            '.ProductDetails-Color',
            '.ProductDetails-Material'
            ],
            compositeImage: true
        });
    })
    
    it('cart-default', async function() {
        await this.browser.url('/hw/store/Cart');
        await this.browser.$('.col').scrollIntoView();
        await this.browser.assertView('cart-default', '.col');

        await this.browser.setWindowSize(500, 1024);
        await this.browser.url('/hw/store/Cart');
        await this.browser.$('.col').scrollIntoView();
        await this.browser.assertView('cart-default-1', '.col');
    })
});

const wait = (time) => new Promise(res => setTimeout(res, time));
describe('Общие тесты', () => {
    it('Корзина-test', async function() {
        await this.browser.setWindowSize(1300, 1024);
        await this.browser.url('/hw/store/Catalog');
        let details = await this.browser.$('.ProductItem-DetailsLink');
        await details.waitForClickable();
        await details.click();

        let addCard = await this.browser.$('.ProductDetails-AddToCart');
        await addCard.waitForExist();
        await addCard.waitForClickable();

        await addCard.click();
        await addCard.click();
        await addCard.click();

        let textAddItem = await this.browser.$('.text-success');
        let isEx = await textAddItem.isExisting();
        assert.ok(isEx, "Нет слов Item in cart befor adding");

        let cartLink = await this.browser.$('.nav-link:last-child');
        let text = await cartLink.getText();
        assert.equal(text, "Cart (1)");

        await this.browser.url('/hw/store/Catalog');
        text = await this.browser.$('.ProductItem .text-success');
        await text.waitForExist();
        assert.equal(await text.getText(), "Item in cart")

        const nameElem = await this.browser.$('.ProductItem-Name');
        await nameElem.waitForExist();
        const name = await nameElem.getText();

        await this.browser.url('/hw/store/Cart');

        const nameInTableElem = await this.browser.$('.Cart-Name');
        await nameInTableElem.waitForExist();
        const nameInTable = await nameInTableElem.getText();

        assert.equal(nameInTable, name);

        const countElem = await this.browser.$('.Cart-Count');
        const count = await countElem.getText();

        assert.equal(count, "3");

        await this.browser.refresh();
        await wait(500);
        const countElem1 = await this.browser.$('.Cart-Count');
        const count1 = await countElem1.getText();
        assert.equal(count1, "3");

        const buttonElem = await this.browser.$('.Cart-Clear');
        await buttonElem.waitForClickable();
        assert.equal(await buttonElem.getText(), 'Clear shopping cart');
        await buttonElem.click();

        const emptyTextElem = await this.browser.$('.col a');
        await emptyTextElem.waitForExist({timeout:2000});
        let emptyText = await emptyTextElem.getText({timeout:2000});

        assert.equal(emptyText, 'catalog');

        let href = await emptyTextElem.getAttribute("href");
        assert.equal(href, '/hw/store/catalog');

        await this.browser.url('/hw/store/catalog');
        details = await this.browser.$('.card-link');
        await details.waitForClickable({timeout: 2000});
        await details.click();
        addCard = await this.browser.$('.ProductDetails-AddToCart');
        await addCard.waitForClickable({timeout: 2000});

        await addCard.click();
        const nameElem1 = await this.browser.$('h1');
        await nameElem1.waitForExist({timeout:2000});
        const name1 = await nameElem1.getText({timeout:2000});

        const priceElem1 = await this.browser.$('.ProductDetails-Price');
        await priceElem1.waitForExist({timeout: 2000});
        let price1 = await priceElem1.getText({timeout:2000});
        price1 = +price1.slice(1)
        console.log(price1);

        await this.browser.url('/hw/store/catalog');
        details = await this.browser.$('.row:nth-child(2) div~div .card-link');
        await details.waitForClickable({timeout: 2000});

        await details.click();
        addCard = await this.browser.$('.ProductDetails-AddToCart');
        await addCard.waitForClickable({timeout: 2000});

        await addCard.click();
        const nameElem2 = await this.browser.$('h1');
        await nameElem2.waitForExist({timeout:2000});
        const name2 = await nameElem2.getText();

        const priceElem2 = await this.browser.$('.ProductDetails-Price');
        await priceElem2.waitForExist({timeout:2000});
        let price2 = await priceElem2.getText();
        price2 = +price2.slice(1)
        console.log(price2);

        await this.browser.url('/hw/store/cart');
        const totalPriceElem =  await this.browser.$('.Cart-OrderPrice');
        await totalPriceElem.waitForExist({timeout:2000});
        let totalPrice = await totalPriceElem.getText();

        totalPrice = +totalPrice.slice(1);

        assert.equal((price1 + price2), totalPrice);

        await this.browser.url('/hw/store/catalog');
        details = await this.browser.$('.card-link');
        await details.waitForClickable({timeout: 2000});
        await details.click();
        addCard = await this.browser.$('.ProductDetails-AddToCart');
        await addCard.waitForClickable({timeout: 2000});

        await addCard.click();
        await this.browser.url('/hw/store/cart');

        let inputNameElem = await this.browser.$('input');
        await inputNameElem.waitForExist({timeout:2000});
        await inputNameElem.click();
        await inputNameElem.keys(["rk"]);

     

        let inputNameElem1 = await this.browser.$('.mb-3:nth-child(2) input');
        await inputNameElem1.waitForExist({timeout:2000});
        await inputNameElem1.click();
        await inputNameElem1.keys(["89777465861"]);

     //   await wait500);

        let inputNameElem2 = await this.browser.$('.mb-3:nth-child(3) textarea');
        await inputNameElem2.waitForExist({timeout:2000});
        await inputNameElem2.click();
     //   await wait500);
        await inputNameElem2.keys(["fefefefef"]);
        await inputNameElem2.keys(["fefefefef"]);
        await inputNameElem2.keys(["fefefefef"]);

        const element = await this.browser.$('.Form-Submit');
        await element.scrollIntoView();
        await this.browser.waitUntil(() => element.isClickable(), 1000);
        await element.click();

        const welcom = await this.browser.$('.alert-heading');
        await welcom.waitForExist({timeout:2000});
        assert.equal(await welcom.getText(), 'Well done!');
    })
})