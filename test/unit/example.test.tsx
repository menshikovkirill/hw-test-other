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
    it('в каталоге должны отображаться товары, список которых приходит с сервера', () => {
        const exampleStore = new ExampleStore();
        const itemList = exampleStore.getAllProducts();

        const exApi = new ExampleApi('/hw/store');
        const carApi = new CartApi();
        const loadedStore = initStore(exApi, carApi);
        loadedStore.dispatch(productsLoaded(itemList));
        const catalog1 = (
            <BrowserRouter basename={basename}>
                <Provider store={loadedStore}>
                    <Catalog />
                </Provider>
            </BrowserRouter>
        );

        const {container, getByTestId} = render(catalog1);
        console.log(container.outerHTML)
    })
});