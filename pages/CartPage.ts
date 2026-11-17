import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async removeItemByName(itemSlug: string) {
    await this.page.locator(`[data-test="remove-${itemSlug}"]`).click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}