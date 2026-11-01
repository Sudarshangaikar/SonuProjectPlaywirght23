const { test, expect } = require('@playwright/test');

test('Context Browser PlayWright test', async ({ browser }) => {
    // Create a new browser context
    
    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator("#username");
    const passWord = page.locator("#password");
    const signIn = page.locator("#signInBtn");
    const Card = page.locator(".card-body a");
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title())
    await userName.fill("rahulshetty");
    await passWord.fill("Learning@830$3mK2");
    await signIn.click();

console.log(await page.locator("[style*='block']").textContent());
    //await expect(page.locator("[style*='block']")).toContainText('Incorrect');
    
    await userName.fill("rahulshettyacademy");
    await signIn.click();
    console.log(await Card.first().textContent());
    console.log(await Card.nth(1).textContent());
    const allTitles = await Card.allTextContents();
    console.log(allTitles);
});
