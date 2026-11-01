
const { test, expect } = require('@playwright/test');

test('Client App Login and Order Verification', async ({ page }) => {

    const email = 'anshika@gmail.com';
    const password = 'Iamking@000';
    const productName = 'ZARA COAT 3';

    expect(password, 'Iamking@000').toBeTruthy();

    // 1. Open application
    await page.goto('https://rahulshettyacademy.com/client');

    // 2. Login
    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill(password);
    await page.locator("[value='Login']").click();

    // 3. Verify products
    const products = page.locator('.card-body');

    await expect(products.first()).toBeVisible();

    console.log('Login successful');

    // 4. Find product and add to cart
    const productCount = await products.count();
    let productFound = false;

    for (let i = 0; i < productCount; i++) {

        const product = products.nth(i);
        const title = (await product.locator('b').innerText()).trim();

        if (title === productName) {

            await product.getByRole('button', {
                name: /Add To Cart/i
            }).click();

            productFound = true;
            console.log('Product added:', productName);
            break;
        }
    }

    expect(productFound, 'Product not found').toBeTruthy();

    // 5. Navigate to cart
    await page.locator("[routerlink*='cart']").click();

    await expect(
        page.locator('h3').filter({ hasText: productName })
    ).toBeVisible();

    // 6. Checkout
    await page.getByText('Checkout', { exact: true }).click();

    // 7. Select country
    const countryInput = page.getByPlaceholder('Select Country');

    await expect(countryInput).toBeVisible();

    await countryInput.fill('ind');

    // Wait for Angular autocomplete suggestions
    const dropdown = page.locator('.ta-results');

    await expect(dropdown).toBeVisible({
        timeout: 20000
    });

    // Read available country options
    const options = dropdown.locator('button');

    await expect(options.first()).toBeVisible();

    const countryOptions = await options.allTextContents();

    console.log('Available countries:', countryOptions);

    // Find India
    const indiaOption = options.filter({
        hasText: /^India$/
    });

    await expect(indiaOption).toBeVisible();

    // Click India
    await indiaOption.click();

    // Verify selection
    await expect(countryInput).toHaveValue('India');

    console.log('Country selected successfully');

    // 8. Verify email
    await expect(
        page.locator('.user__name')
    ).toContainText(email);

    console.log('Email verified');

    // 9. Place order
    await page.locator('.action__submit').click();

    await expect(page.locator('.hero-primary'))
        .toContainText('Thankyou for the order');

    console.log('Order placed successfully');

    // 10. Capture order ID
    const orderId = (
        await page.locator('.em-spacer-1 .ng-star-inserted')
            .first().innerText()
    ).trim();

    console.log('Order ID:', orderId);

    // 11. Navigate to My Orders
    await page.locator("button[routerlink*='myorders']").click();

    const rows = page.locator('tbody tr');

    await expect(rows.first()).toBeVisible();

    // 12. Find matching order
    const rowCount = await rows.count();
    let orderFound = false;

    for (let i = 0; i < rowCount; i++) {

        const row = rows.nth(i);

        const rowOrderId = (
            await row.locator('th').innerText()
        ).trim();

        if (rowOrderId === orderId) {

            await row.locator('button').first().click();

            orderFound = true;

            console.log('Order found successfully');

            break;
        }
    }

    expect(orderFound, 'Order not found in My Orders').toBeTruthy();

    // 13. Verify order details
    const orderIdDetails = (
        await page.locator('.col-text').innerText()
    ).trim();

    expect(orderIdDetails).toContain(orderId);

    console.log('Order verification successful!');

});
