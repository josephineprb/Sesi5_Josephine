const { Builder, By, until} = require('selenium-webdriver');
const assert = require('assert');

describe('Case Testing 2', function () {
    let driver;
    it('Visit SauceDemo dan Mengurutkan Produk A-Z', async function () {
        driver = await new Builder().forBrowser('firefox').build();

        await driver.get('https://www.saucedemo.com');

        // Melakukan inputan Username dan Password
        let inputUsername = await driver.findElement(By.css('[data-test="username"]'))
        let inputPassword = await driver.findElement(By.xpath('//*[@data-test="password"]'))
        let buttonLogin = await driver.findElement(By.className('submit-button btn_action'))
        await inputUsername.sendKeys('standard_user')
        await inputPassword.sendKeys('secret_sauce')
        await buttonLogin.click()

        // Pilih dropdown sorting A to Z
        const sortSelect = await driver.findElement(By.xpath('//*[@id="header_container"]/div[2]/div/span/select'));
        await sortSelect.sendKeys('Name (A to Z)'); // Selenium akan pilih opsi berdasarkan label

        // Validasi kontainer produk muncul
        const inventoryContainer = await driver.findElement(By.id('inventory_container'));
        assert.strictEqual(await inventoryContainer.isDisplayed(), true);   

        await driver.quit();
    });
});