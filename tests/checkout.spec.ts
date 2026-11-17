import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Checkout Flow', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Pre-condition: Logged in with 1 item ready in the cart
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addItemByName('sauce-labs-backpack');
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
  });

  test('TC07: Complete end-to-end checkout flow displays order confirmation', async ({ page }) => {
    await checkoutPage.fillCustomerInfo('Jason', 'Ong', '47800');
    await expect(page).toHaveURL(/.*checkout-step-two.html/);

    await checkoutPage.finishOrder();

    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('TC08: Submitting checkout with missing postal code blocks progression', async ({ page }) => {
    await checkoutPage.fillCustomerInfo('Jason', 'Ong', '');

    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
  });
});