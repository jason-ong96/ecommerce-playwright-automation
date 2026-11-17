import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly itemPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
  }

  async addItemByName(itemSlug: string) {
    // Example slug: 'sauce-labs-backpack' or 'sauce-labs-bike-light'
    await this.page.locator(`[data-test="add-to-cart-${itemSlug}"]`).click();
  }

  async removeItemByName(itemSlug: string) {
    await this.page.locator(`[data-test="remove-${itemSlug}"]`).click();
  }

  async sortBy(optionValue: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(optionValue);
  }

  async openCart() {
    await this.cartLink.click();
  }
}