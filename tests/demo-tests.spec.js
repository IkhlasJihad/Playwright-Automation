import { test, expect } from '@playwright/test';

test('has a correct title', async ({page}) => {
    await page.goto("https://www.google.com/")
    await expect(page).toHaveTitle('Google')

})

test('fails on timeout', async ({page}) => {
    try{
        await page.goto("https://www.google.com/", { timeout: 1 }) // 1 ms timeout
    }
    catch(error){
        expect(error.message).toContain('Timeout')
    }
})