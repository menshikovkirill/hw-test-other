const { assert } = require('chai');

describe("static-screens", async () => {
    it('main', async function() {
        await this.browser.url('/hw/store/');
        await this.browser.assertView('main', '#root');
    })
    it('delivery', async function() {
        await this.browser.url('/hw/store/delivery');
        await this.browser.assertView('delivery', '#root');
    })
    it('Contacts', async function() {
        await this.browser.url('/hw/store/Contacts');
        await this.browser.assertView('Contacts', '#root');
    })

    it("mini-delivery", async function() {
        await this.browser.setWindowSize(500, 1024);
        await this.browser.url('/hw/store/delivery');
        await this.browser.assertView('delivery-mini', '#root');
    });
    it("mini-Contacts", async function() {
        await this.browser.setWindowSize(500, 1024);
        await this.browser.url('/hw/store/Contacts');
        await this.browser.assertView('contacts-mini', '#root');
    });

    it("mini-Contacts-click", async function() {
        await this.browser.setWindowSize(500, 1024);
        await this.browser.url('/hw/store/Contacts');
        const button = await this.browser.$('button.Application-Toggler');
        await button.waitForClickable();
        await button.click();
        await this.browser.$('.container').scrollIntoView();
        await this.browser.assertView('contacts-mini-click', '.container');
    });
  
});

const wait = (time) => new Promise(res => setTimeout(res, time));
describe('Корзина', async () => {
    it('в шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', async function() {
        await this.browser.setWindowSize(1300, 1024);
        await this.browser.url('/hw/store/Catalog');
        const details = await this.browser.$('.ProductItem-DetailsLink');
        await details.waitForExist();

        details.click();

        let textAddItem = await this.browser.$('.text-success');
        const isEx = await textAddItem.isExisting()
        assert.ok(!isEx, "Нет слов Item in cart befor adding")

        const addCard = await this.browser.$('.ProductDetails-AddToCart');
        addCard.waitForExist();

        addCard.click();
        addCard.click();
        addCard.click();

        let addItem = await this.browser.$('.text-success');
        text = await addItem.getText();
        assert.equal(text, "Item in cart");

        let cartLink = await this.browser.$('.nav-link:last-child');
        text = await cartLink.getText();
        assert.equal(text, "Cart (1)");

        const nameElem = await this.browser.$('h1');
        const name = await nameElem.getText();

        await this.browser.url('/hw/store/Catalog');
        text = await this.browser.$('.ProductItem').$('.text-success');
        await text.waitForExist();
        assert.equal(await text.getText(), "Item in cart")

        await this.browser.url('/hw/store/Cart');

        const nameInTableElem = await this.browser.$('.Cart-Name');
        const nameInTable = await nameInTableElem.getText();

        assert.equal(nameInTable, name);

        const countElem = await this.browser.$('.Cart-Count');
        const count = await countElem.getText();

        assert.equal(count, "3");

        await this.browser.refresh();
        await wait(500);
        const countElem1 = await this.browser.$('.Cart-Count');
        const count1 = await countElem.getText();
        assert.equal(count1, "3");

    })
    it('удаление корзины', async function() {
        const buttonElem = await this.browser.$('.Cart-Clear');
        await buttonElem.waitForClickable();
        buttonElem.click();

        const emptyTextElem = await this.browser.$('.col a');
        await emptyTextElem.waitForExist();
        let emptyText = await emptyTextElem.getText();

        assert.equal(emptyText, 'catalog');

        let href = await emptyTextElem.getAttribute("href");
        assert.equal(href, '/hw/store/catalog');
    })
    it('общая стоимость', async function()  {
        await this.browser.url('/hw/store/catalog');
        let details = await this.browser.$('.card-link');
        await details.waitForClickable({timeout: 2000});
        details.click();
        let addCard = await this.browser.$('.ProductDetails-AddToCart');
        await addCard.waitForClickable({timeout: 2000});

        addCard.click();
        const nameElem1 = await this.browser.$('h1');
        await nameElem1.waitForExist();
        const name1 = await nameElem1.getText();

        const priceElem1 = await this.browser.$('.ProductDetails-Price');
        await priceElem1.waitForExist({timeout: 2000});
        let price1 = await priceElem1.getText();
        price1 = +price1.slice(1)
        console.log(price1);

        await this.browser.url('/hw/store/catalog');
        details = await this.browser.$('.row:nth-child(2) div~div .card-link');
        await details.waitForClickable({timeout: 2000});

        details.click();
        addCard = await this.browser.$('.ProductDetails-AddToCart');
        await addCard.waitForClickable({timeout: 2000});

        addCard.click();
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

    });
    it("оформление заказа", async function() {
        await this.browser.url('/hw/store/catalog');
        let details = await this.browser.$('.card-link');
        await details.waitForClickable({timeout: 2000});
        details.click();
        let addCard = await this.browser.$('.ProductDetails-AddToCart');
        await addCard.waitForClickable({timeout: 2000});

        addCard.click();
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
        inputNameElem2.click();
     //   await wait500);
        await inputNameElem2.keys(["fefefefef"]);
        await inputNameElem2.keys(["fefefefef"]);
        await inputNameElem2.keys(["fefefefef"]);

        const element = await this.browser.$('.Form-Submit');
        await element.scrollIntoView();
        await this.browser.waitUntil(() => element.isClickable(), 1000);
        element.click();

        const welcom = await this.browser.$('.alert-heading');
        await welcom.waitForExist({timeout:2000});
        assert.equal(await welcom.getText(), 'Well done!');

    });
    it('перезагрузка', async function() {

    })
});