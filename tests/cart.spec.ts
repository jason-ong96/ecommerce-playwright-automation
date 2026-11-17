import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

test.describe('Shopping Cart & Catalog Flow', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('TC04: Adding 2 items updates cart badge count to 2', async () => {
    await inventoryPage.addItemByName('sauce-labs-backpack');
    await inventoryPage.addItemByName('sauce-labs-bike-light');

    await expect(inventoryPage.cartBadge).toHaveText('2');
  });

  test('TC05: Removing an item decrements badge and updates cart list', async () => {
    await inventoryPage.addItemByName('sauce-labs-backpack');
    await inventoryPage.addItemByName('sauce-labs-bike-light');
    await inventoryPage.openCart();

    await expect(cartPage.cartItems).toHaveCount(2);

    await cartPage.removeItemByName('sauce-labs-bike-light');

    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(cartPage.cartItems).toHaveCount(1);
  });

  test('TC06: Product sorting (Price: low to high) orders items accurately', async () => {
    await inventoryPage.sortBy('lohi');

    // Grab all displayed price strings (e.g., ['$7.99', '$9.99', ...]) and convert to numbers
    const priceTexts = await inventoryPage.itemPrices.allTextContents();
    const numericPrices = priceTexts.map((price) => parseFloat(price.replace('$', '')));

    const sortedPrices = [...numericPrices].sort((a, b) => a - b);
    expect(numericPrices).toEqual(sortedPrices);
  });
});