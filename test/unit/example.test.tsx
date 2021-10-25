/**
 * @jest-environment jsdom
 */

import {render, within, screen} from '@testing-library/react'
import {ExampleApi, CartApi} from '../../src/client/api'
import {initStore,productsLoaded, productDetailsLoaded} from '../../src/client/store'
import { BrowserRouter } from 'react-router-dom';
import { Application } from '../../src/client/Application';
import { Provider } from 'react-redux';
import {it, expect} from "@jest/globals"
import events from '@testing-library/user-event'
import React from 'react';
import {Catalog} from '../../src/client/pages/Catalog';
import {CartBadge} from '../../src/client/components/CartBadge';
import {ExampleStore} from '../../src/server/data';
import {ProductItem} from '../../src/client/components/ProductItem'
import {ProductDetails} from '../../src/client/components/ProductDetails'
import {Product} from '../../src/common/types'
import { assert } from 'console';

const basename = '/hw/store';
const api = new ExampleApi(basename);
const cart = new CartApi();
const store = initStore(api, cart);

describe("Router", () => {
    const application = (
        <BrowserRouter basename={basename}>
            <Provider store={store}>
                <Application />
            </Provider>
        </BrowserRouter>
    );
    it("to Catalog", () => {
        const {container} = render(application);
        const linkToCatalog = container.querySelector(".navbar-nav a");
        events.click(linkToCatalog);

        expect(container.querySelector('h1').textContent).toBe('Catalog');
    });
    it("to Delivery", () => {
        const {container} = render(application);
        const linkToCatalog = container.querySelector(".navbar-nav a:nth-child(2)");
        events.click(linkToCatalog);

        expect(container.querySelector('h1').textContent).toBe('Delivery');
    });
    it("to Contacts", () => {
        const {container} = render(application);
        const linkToCatalog = container.querySelector(".navbar-nav a:nth-child(3)");
        events.click(linkToCatalog);

        expect(container.querySelector('h1').textContent).toBe('Contacts');
    });
    it("to Cart", () => {
        const {container} = render(application);
        const linkToCatalog = container.querySelector(".navbar-nav a:nth-child(4)");
        events.click(linkToCatalog);

        expect(container.querySelector('h1').textContent).toBe('Shopping cart');
    });
});

describe('Общие требования', () => {
    const application = (
        <BrowserRouter basename={basename}>
            <Provider store={store}>
                <Application />
            </Provider>
        </BrowserRouter>
    );
    it('название магазина в шапке должно быть ссылкой на главную страницу', () => {
       const {container} = render(application);

        const link = container.querySelector('.Application-Brand').getAttribute("href");

        expect(link).toBe("/hw/store/");
    });
});

describe('Каталог', () => {
    it('в каталоге должны отображаться товары, список которых приходит с сервера', async ()  => {
        const exampleStore = new ExampleStore();
        const itemList = exampleStore.getAllProducts();

        const catalog = (
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Catalog />
                </Provider>
            </BrowserRouter>
        );
      
        const {container, getAllByTestId, getByText} = render(catalog);
        store.dispatch(productsLoaded(itemList));

        for(var product of itemList) {
            getAllByTestId(product.id);
        }

        expect(container.querySelectorAll(".Image").length).toBe(itemList.length);
    })
    it('карточка', async ()  => {
        const exampleStore = new ExampleStore();
        const itemList = exampleStore.getAllProducts();

        const productElem = (
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <ProductItem product={itemList[0]}/>
                </Provider>
            </BrowserRouter>
        );
      
        const {container, getAllByTestId, getByAltText} = render(productElem);
        const name = container.querySelector('.ProductItem-Name').textContent;
        expect(name).toBe(itemList[0].name);
        const price = container.querySelector('.ProductItem-Price').textContent;
        expect(price).toBe('$' + itemList[0].price);

        const link = container.querySelector('.ProductItem-DetailsLink').getAttribute("href");
        expect(link).toBe(`/hw/store/catalog/${itemList[0].id}`);
    })
    it('детализация', async ()  => {
        const exampleStore = new ExampleStore();
        const itemList = exampleStore.getAllProducts();

        const first:Product = {
            id: itemList[0].id,
            name: itemList[0].name,
            price: itemList[0].price,
            description: "description",
            material: "material", 
            color: 'red'
        }

        const productElem = (
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <ProductDetails product={first}/>
                </Provider>
            </BrowserRouter>
        );
      
        const {container, getAllByTestId, getByAltText} = render(productElem);
        const name = container.querySelector('.ProductDetails-Name').textContent;
        expect(name).toBe(itemList[0].name);
        const description = container.querySelector('.ProductDetails-Description').textContent;
        expect(description).toBe(description);
        const price = container.querySelector('.ProductDetails-Price').textContent;
        expect(price).toBe('$' + itemList[0].price);
        const color = container.querySelector('.ProductDetails-Color ').textContent;
        expect(color).toBe('red');
        const material = container.querySelector('.ProductDetails-Material').textContent;
        expect(material).toBe('material');

        const button = container.querySelector('.ProductDetails-AddToCart').textContent;
        expect(button).toBe('Add to Cart');
    })

});