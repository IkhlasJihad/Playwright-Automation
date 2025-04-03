import { test, expect } from '@playwright/test';

test.use({
  serviceWorkers: 'block'
})

test.beforeEach( async({page}) => {
    await page.goto(
        'https://www.saucedemo.com/',
        { waitUntil: 'domcontentloaded' }
    )
})

test.afterEach( async({ page }) => {
    await page.close() // Close the page after each test
})

test('Has correct title', async ({ page }) => {
  await expect(page).toHaveTitle("Swag Labs")
})

test('Has correct divisions: login wrapper and credentials wrapper', async ({ page }) => {
    await expect(page.locator('#login_button_container')).toMatchAriaSnapshot(`
        - textbox "Username"
        - textbox "Password"
        - button "Login"
    `);
    await expect(page.locator('[data-test="username"]')).toHaveAttribute('placeholder', 'Username')
    await expect(page.locator('[data-test="password"]')).toHaveAttribute('placeholder', 'Password')
    await expect(page.locator('[data-test="login-button"]')).toContainText('Login');
    
    await expect(page.locator('[data-test="login-credentials-container"]')).toMatchAriaSnapshot(`
        - heading "Accepted usernames are:" [level=4]
        - text: standard_user locked_out_user problem_user performance_glitch_user error_user visual_user
        - heading "Password for all users:" [level=4]
        - text: secret_sauce
    `); 
});

test('Login-Logout', async ({ page }) => {
  await page.locator('[data-test="username"]').click()
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
  await expect(page.locator('#root')).toMatchAriaSnapshot(`- text: Swag Labs`);
  await expect(page.locator('#login_button_container')).toMatchAriaSnapshot(`
    - textbox "Username"
    - textbox "Password"
    - button "Login"
`);
});

test('error on login', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('error_user');
    await page.locator('[data-test="password"]').fill('secret_');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(
        'Epic sadface: Username and password do not match any user in this service'
    );
    await expect(page.locator('svg').first()).toBeVisible();
    await assert_error_borderBottomColor(page.locator('[data-test="password"]'))
    await assert_error_borderBottomColor(page.locator('[data-test="username"]'))
})

async function assert_error_borderBottomColor(locator){
    const color = await locator.evaluate((e) => {
       return window.getComputedStyle(e).borderBottomColor          
    }) 
    const expected_rgb = hex2rgb("#e2231a")
    expect(color).toBe(`rgb(${expected_rgb.r}, ${expected_rgb.g}, ${expected_rgb.b})`)  
}

const hex2rgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // return {r, g, b} 
    return { r, g, b };
}
