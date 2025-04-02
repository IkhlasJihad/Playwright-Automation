// Assertions demo tests using website: https://kitchen.applitools.com/
import { test, expect } from '@playwright/test';

test('Assertions demo', async ({ page }) => {
    await page.goto('https://kitchen.applitools.com/')
    //1. Element existence assertions
    if(page.$('text=The Kitchen')) {  // ElementHandler if decision is needed
        expect(page.locator('text=The Kitchen')).toHaveCount(1)
    }

    //2. Element visibility assertions
    await expect(page.locator('text=The Kitchen')).toBeVisible()
    await expect.soft(page.locator('text=The Kitchen')).not.toBeHidden()// soft will not cause run stop upon assertion failure

    //3. Element enabled assertions
    await expect(page.locator('text=The Kitchen')).toBeEnabled()
    await expect.soft(page.locator('text=The Kitchen')).not.toBeDisabled() 

    //4. Element text
    await expect(page.locator('text=The Kitchen')).toHaveText('The Kitchen')
    await expect(page.locator('text=The Kitchen')).not.toHaveText('tada')

    //5. Element Attribute
    await expect(page.locator('text=The Kitchen')).toHaveAttribute('class', 'chakra-heading css-dpmy2a')
    await expect(page.locator('text=The Kitchen')).toHaveAttribute('class', /.*css-dpmy2a/)

    //await page.pause()  
    //6. visual validation against a screenshot
   // await expect(page).toHaveScreenshot()
})