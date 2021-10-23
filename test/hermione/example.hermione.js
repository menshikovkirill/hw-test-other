const { assert } = require('chai');

describe.skip("static-screens", async () => {
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
});