const { Builder, By, until} = require('selenium-webdriver');
const assert = require('assert');

describe('Case Testing 1', function () {
    let driver;
    it('Visit SauceDemo dan Sukses Login', async function () {
        driver = await new Builder().forBrowser('firefox').build();

        await driver.get('https://www.saucedemo.com');

        // Melakukan inputan Username dan Password
        let inputUsername = await driver.findElement(By.css('[data-test="username"]'))
        let inputPassword = await driver.findElement(By.xpath('//*[@data-test="password"]'))
        let buttonLogin = await driver.findElement(By.className('submit-button btn_action'))
        await inputUsername.sendKeys('standard_user')
        await inputPassword.sendKeys('secret_sauce')
        await buttonLogin.click()

        //Menampilkan URL berubah menuju dashboard
        await driver.wait(until.urlContains('inventory.html'),5000);

        //Menampilkan elemen jika berhasil 
        const inventoryContainer = await driver.findElement(By.xpath('//*[@id="root"]'));
        const isDisplayed = await inventoryContainer.isDisplayed();

        assert.strictEqual(isDisplayed, true);
        await driver.quit();
    });
});