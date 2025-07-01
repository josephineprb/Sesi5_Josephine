const { Builder, By, until} = require('selenium-webdriver');
const assert = require('assert');
const firefox = require('selenium-webdriver/firefox')

describe('Testing Login dan Mengurutkan Produk A-Z', function () {
    let driver;

    beforeEach(async function () {
        //Driver Firefox
        console.log('1. Open Firefox setiap new test case')
        
        options = new firefox.Options();
        options.addArguments("--headless");

        driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();

        await driver.get('https://www.saucedemo.com');
        const title = await driver.getTitle();

        //Login
        console.log('2. Input Username dan Password untuk Login')

        let inputUsername = await driver.findElement(By.css('[data-test="username"]'))
        let inputPassword = await driver.findElement(By.xpath('//*[@data-test="password"]'))
        let buttonLogin = await driver.findElement(By.className('submit-button btn_action'))
        await inputUsername.sendKeys('standard_user')
        await inputPassword.sendKeys('secret_sauce')
        await buttonLogin.click()
    });

    this.afterEach(async function () {
        await driver.quit();
    });

    it('Test Case 1 : Sukses Login', async function () {
        //Menampilkan URL berubah menuju dashboard
        await driver.wait(until.urlContains('inventory.html'),5000);

        //Menampilkan elemen jika berhasil 
        const inventoryContainer = await driver.findElement(By.xpath('//*[@id="root"]'));
        const isDisplayed = await inventoryContainer.isDisplayed();

        assert.strictEqual(isDisplayed, true);
    });

    it('Test Case 2 : Mengurutkan Produk A-Z', async function () {
        // Pilih dropdown sorting A to Z
        const sortSelect = await driver.findElement(By.xpath('//*[@id="header_container"]/div[2]/div/span/select'));
        await sortSelect.sendKeys('Name (A to Z)'); // Selenium akan pilih opsi berdasarkan label

        // Validasi kontainer produk muncul
        const inventoryContainer = await driver.findElement(By.id('inventory_container'));
        assert.strictEqual(await inventoryContainer.isDisplayed(), true);   

    });
});