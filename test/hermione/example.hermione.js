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

        this.browser.windowSize="500x1000";
        
        await this.browser.assertView('Contacts', '#root');
    })
});

describe('Корзина', async () => {
    it('в шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', async function() {
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


        await this.browser.url('/hw/store/Cart');

        const nameInTableElem = await this.browser.$('.Cart-Name');
        const nameInTable = await nameInTableElem.getText();

        assert.equal(nameInTable, name);

        const countElem = await this.browser.$('.Cart-Count');
        const count = await countElem.getText();

        assert.equal(count, "3");


    })
    it('удаление корзины', async function() {
        await this.browser.url('/hw/store/cart');

        const buttonElem = await this.browser.$('.Cart-Clear');
        await buttonElem.waitForExist();
        buttonElem.click();

        const emptyTextElem = await this.browser.$('.col a');
        await emptyTextElem.waitForExist();
        let emptyText = await emptyTextElem.getText();

        assert.equal(emptyText, 'catalog');

        let href = await emptyTextElem.getAttribute("href");
        assert.equal(href, '/hw/store/catalog');
    })
    it('общая стоимость', async function()  {
        // await this.browser.url('/hw/store/cart');
        // let totalPriceElem = await this.browser.$('.Cart-OrderPrice');
        // await totalPriceElem.waitForExist();
        // let totalPrice = await totalPriceElem.getText();
        // assert.ok(totalPrice, "$906")
        await this.browser.url('/hw/store/catalog');
        let details = await this.browser.$('.card-link');
        await details.waitForExist();
        details.click();
        let addCard = await this.browser.$('.ProductDetails-AddToCart');
        addCard.waitForExist();

        addCard.click();
        const nameElem1 = await this.browser.$('h1');
        const name1 = await nameElem1.getText();

        const priceElem1 = await this.browser.$('.ProductDetails-Price');
        let price1 = await priceElem1.getText();
        price1 = price1.slice(1)
        console.log(price1);

        await this.browser.url('/hw/store/catalog');
        details = await this.browser.$('.row:nth-child(2) div~div .card-link');
        await details.waitForExist();

        details.click();

        addCard = await this.browser.$('.ProductDetails-AddToCart');
        addCard.waitForExist();

        addCard.click();
        const nameElem2 = await this.browser.$('h1');
        const name2 = await nameElem2.getText();

        const priceElem2 = await this.browser.$('.ProductDetails-Price');
        let price2 = await priceElem2.getText();
        price2 = price2.slice(1)

        await this.browser.url('/hw/store/cart');
        const totalPriceElem =  await this.browser.$('.Cart-OrderPrice');
        let totalPrice = await totalPriceElem.getText();

        totalPrice = totalPrice.slice(1);

        assert.equal((+price1 + +price2), +totalPrice);

    });
});