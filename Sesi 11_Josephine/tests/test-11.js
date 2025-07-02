import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';
import firefox from 'selenium-webdriver/firefox.js';

import fs from 'fs';
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import page_cart from '.././pages/page-cart.js'
import page_inventory from '.././pages/page-inventory.js'
import page_login from'.././pages/page-login.js'


describe('Testing Login dan Mengurutkan Produk A-Z', function () {
    let driver;
    let options;

    beforeEach(async function () {
        //Driver Firefox
        console.log('1. Open Firefox setiap new test case')
        
        options = new firefox.Options();
        options.addArguments("--headless");

        driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();

        await driver.get('https://www.saucedemo.com');
        const title = await driver.getTitle();
        assert.strictEqual(title, 'Swag Labs');

        // full screenshot
        let ss_full = await driver.takeScreenshot();
        fs.writeFileSync("full_screenshot.png", Buffer.from(ss_full, "base64"));

        //Login
        console.log('2. Input Username dan Password untuk Login')

        let inputUsernamePOM = await driver.findElement(page_login.inputUsername)
        let inputPasswordPOM = await driver.findElement(page_login.inputPassword)
        let buttonLoginPOM = await driver.findElement(page_login.buttonLogin)
        await inputUsernamePOM.sendKeys('standard_user')
        await inputPasswordPOM.sendKeys('secret_sauce')
        await buttonLoginPOM.click()
    });

    afterEach(async function () {
        driver.quit();
    });

    it('Test Case 1 : Sukses Login', async function () {
        //Menampilkan URL berubah menuju dashboard
        await driver.wait(until.urlContains('inventory.html'),5000);

        //Menampilkan elemen jika berhasil 
        const inventoryContainer1POM = await driver.findElement(page_inventory.inventoryContainer1);
        const isDisplayed = await inventoryContainer1POM.isDisplayed();

        assert.strictEqual(isDisplayed, true);
    });

    it('Test Case 2 : Mengurutkan Produk A-Z', async function () {
        // Pilih dropdown sorting A to Z
        let sortSelectPOM = await driver.findElement(page_inventory.sortSelect)
        await sortSelectPOM.sendKeys('Name (A to Z)'); // Selenium akan pilih opsi berdasarkan label

        // Validasi kontainer produk muncul
        const inventoryContainer2POM = await driver.findElement(page_inventory.inventoryContainer2);
        assert.strictEqual(await inventoryContainer2POM.isDisplayed(), true);   
        
        // partial screenshot
        let sortSelectPOM1 = await driver.findElement(page_inventory.sortSelect)
        let ss_sortselect = await sortSelectPOM1.takeScreenshot();
        fs.writeFileSync("sortselect.png", Buffer.from(ss_sortselect, "base64"));
    });

    it('Test Case 3 : Validasi Produk di Halaman Cart', async function () {
        // Pastikan sudah di halaman inventory
        await driver.wait(until.urlContains('inventory.html'), 5000);

        // Klik tombol 'Add to cart' pada produk pertama
        const firstAddToCartButtonPOM = await driver.findElement(page_cart.firstAddToCartButton);
        await firstAddToCartButtonPOM.click();

        // Klik ikon keranjang untuk menuju halaman cart
        const cartIconPOM = await driver.findElement(page_cart.cartIcon);
        await cartIconPOM.click();

        // Tunggu hingga halaman cart muncul
        await driver.wait(until.urlContains('cart.html'), 5000);

        // Verifikasi produk muncul di cart
        const cartItemPOM = await driver.findElement(page_cart.cartItem);
        const isCartItemDisplayed = await cartItemPOM.isDisplayed();
        assert.strictEqual(isCartItemDisplayed, true);

        // Tambahan: Ambil nama produk (opsional)
        const productNamePOM = await driver.findElement(page_cart.productName).getText();
        console.log("Produk yang masuk ke cart:", productNamePOM);
    });

    it('Cek Visual halaman Inventory', async function () {
        // screenshot keadaan inventory page sekarang, current.png
        let screenshot = await driver.takeScreenshot();
        let imgBuffer = Buffer.from(screenshot, "base64");
        fs.writeFileSync("current.png", imgBuffer);

        // ambil baseline untuk komparasi
        // jika belum ada baseline, jadikan current.png sebagai baseline
        if (!fs.existsSync("baseline.png")) {
            fs.copyFileSync("current.png", "baseline.png");
            console.log("Baseline image saved.");
        }

        // Compare baseline.png dan current.png apakah sama
        let img1 = PNG.sync.read(fs.readFileSync("baseline.png"));
        let img2 = PNG.sync.read(fs.readFileSync("current.png"));
        let { width, height } = img1;
        let diff = new PNG({ width, height });

        let numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });

        fs.writeFileSync("diff.png", PNG.sync.write(diff));

        if (numDiffPixels > 0) {
            console.log(`Visual differences found! Pixels different: ${numDiffPixels}`);
        } else {
            console.log("No visual differences found.");
        }
    });

    it('Cek Visual Halaman Cart', async function () {
        // Tambah 1 produk ke cart dari halaman inventory
        await driver.wait(until.urlContains('inventory.html'), 5000);
        const firstAddToCartButton = await driver.findElement(By.css('.inventory_item button'));
        await firstAddToCartButton.click();

        // Navigasi ke halaman cart
        const cartIcon = await driver.findElement(By.className('shopping_cart_link'));
        await cartIcon.click();

        // Tunggu hingga cart.html dimuat
        await driver.wait(until.urlContains('cart.html'), 5000);

        // Ambil screenshot halaman cart
        let cartScreenshot = await driver.takeScreenshot();
        let cartBuffer = Buffer.from(cartScreenshot, "base64");
        fs.writeFileSync("current_cart.png", cartBuffer);

        // Jika belum ada baseline, buat dulu dari current
        if (!fs.existsSync("baseline_cart.png")) {
            fs.copyFileSync("current_cart.png", "baseline_cart.png");
            console.log("Baseline cart image saved.");
        }

        // Bandingkan current vs baseline
        let baselineImg = PNG.sync.read(fs.readFileSync("baseline_cart.png"));
        let currentImg = PNG.sync.read(fs.readFileSync("current_cart.png"));
        let { width, height } = baselineImg;
        let diff = new PNG({ width, height });

        let diffPixels = pixelmatch(
            baselineImg.data,
            currentImg.data,
            diff.data,
            width,
            height,
            { threshold: 0.1 }
        );

        fs.writeFileSync("diff_cart.png", PNG.sync.write(diff));

        // Log hasil dan assert
        console.log(`Perbedaan visual cart: ${diffPixels} pixels`);
        assert.strictEqual(diffPixels, 0, 'Visual cart tidak sama dengan baseline!');
    });
});