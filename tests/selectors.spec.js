import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/')
});
// access object by any property
test.describe('By Object Property', () => {
    test('Fill username input using its id', async ({ page }) => {
        let userName = page.locator('id=user-name')
        await userName.fill('user 1')
        await expect(userName).toHaveValue('user 1')
        // another way using []
        userName = page.locator('[id="user-name"]')
        await userName.fill('user 2')
        await expect(userName).toHaveValue('user 2')
    })

    test('Check visibility of login button using its id', async ({ page }) => {
        await expect(page.locator('id=login-button')).toBeVisible();
    })

    test('Check visibility of Accepted usernames division by its class name', async({page}) => {
      //  await expect(page.locator('class=login_password')).toBeVisible() // not supported
        await expect(page.locator('[class="login_credentials"]')).toBeVisible()
    })
});

// access object by CSS selectors
test.describe('CSS Selectors', () => {
    test('locate username and password fields using CSS Selectors', async ({ page }) => {
        await expect(page.locator('#user-name')).toBeVisible()
        await expect(page.locator('#password')).toBeVisible()
    })
    
    test('Check visibility of login button using CSS selector', async ({ page }) => {
        await expect(page.locator('#login-button')).toBeVisible()
    })
});

test.describe('Text Selectors', () => {
    test('Locate login button using text selector', async ({ page }) => {
        await expect(page.locator('text=Login')).toBeVisible();
    })

    test('Locate error message using text selector', async ({ page }) => {
        await page.locator('[data-test="username"]').fill('invalid_user');
        await page.locator('[data-test="password"]').fill('invalid_password');
        await page.locator('[data-test="login-button"]').click();
        const errorMessage = page.locator('text=Epic sadface');
        await expect(errorMessage).toBeVisible();
    })
});

test.describe('XPath Selectors', () => {
    test('Fill username and click login will show error message - all accessed by XPath Selectors', async ({ page }) => {
        // fill username
        const usernameField = page.locator('//*[@id="user-name"]');
        await usernameField.fill('standard_user');
        await expect(usernameField).toHaveValue('standard_user');

        // click login 
        const loginButton = page.locator('//*[@name="login-button"]')
        await expect(loginButton).toBeVisible()
        await loginButton.click()

        // validate the error message
        const errorContainer = page.locator('//*[@data-test="error"]')
        expect(errorContainer).toBeVisible()
        expect(page.locator('//*[@id="login_button_container"]/div/form/div[3]/h3')).toHaveText(
            'Epic sadface: Password is required'
        )

    })
});

test.describe('Role Selectors', () => {
    test('Locate login button using role selector', async ({ page }) => {
        await expect(page.locator('role=button[name="Login"]')).toBeVisible();
    })
});

test.describe('Chained Selectors', () => {
    test('Locate Add to Cart button in a product card', async ({ page }) => {
        // Log in to the application
        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();

        // get 'Sauce Labs Bike Light' product card
        const productCard = page.locator('.inventory_item').filter({
           has: page.locator('div.inventory_item_name'),
           hasText: 'Sauce Labs Bike Light'
        })

        // assert the 'Add to Cart' button is visible for the located product
        const addToCartButton = productCard.locator('#add-to-cart-sauce-labs-bike-light')

        await expect(addToCartButton).toBeVisible()

        // add to the cart
        await addToCartButton.click()

        // assert the cart icon shows 1
        const cartBadge = page.locator('.shopping_cart_badge')
        await expect(cartBadge).toHaveText('1')
    })
});

test.describe('Nth Selectors', () => {
    test('Locate the first SVG element using nth selector', async ({ page }) => {
        await page.locator('#user-name').fill('standard_user');
        await page.locator('[data-test="login-button"]').click();
        const firstSvg = page.locator('svg').nth(0);
        await expect(page.locator('svg').nth(0)).toBeVisible();
        await expect(page.locator('svg').nth(1)).toBeVisible();
        await expect(page.locator('svg').nth(2)).toBeVisible();

    })
});