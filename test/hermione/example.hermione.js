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
});