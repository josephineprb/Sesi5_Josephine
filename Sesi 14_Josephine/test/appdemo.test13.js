import { expect } from "chai";

describe('API Demo Testing Sesi 14', () => {

  afterEach(async () => {
    // Terminate the app (if running)
    await browser.execute('mobile: terminateApp', { appId: 'io.appium.android.apis' });

    // Short delay to ensure app is closed
    await browser.pause(1000);

    // Start the app again
    await browser.execute('mobile: activateApp', { appId: 'io.appium.android.apis' });
  });

  it('Klik elemen', async () => {
    // menu: home page
    const elemenKlik = await $(`//android.widget.TextView[@content-desc="Accessibility"]`);
    await elemenKlik.click();
  });
  
  it('Input ke elemen', async () => {
    // menu: App > Alert Dialogs > Text Entry dialog
    const appMenu = await $(`//android.widget.TextView[@content-desc="App"]`)
    const alertdialogMenu = await $(`//android.widget.TextView[@content-desc="Alert Dialogs"]`)
    const textentryMenu = await $(`//android.widget.Button[@content-desc="Text Entry dialog"]`)
    await appMenu.click();
    await alertdialogMenu.click();
    await textentryMenu.click();
    

    // start input elemen
    const nameField = await $(`//android.widget.EditText[@resource-id="io.appium.android.apis:id/username_edit"]`)
    const passField = await $(`//android.widget.EditText[@resource-id="io.appium.android.apis:id/password_edit"]`)
    await nameField.setValue('hani');
    await passField.setValue('hello25');
  });

  it('Memastikan App bisa terbuka dan elemen tersedia', async () => {
    const accessibilityMenu = await $(`//android.widget.TextView[@content-desc="Accessibility"]`);

    // Wait, then click
    await accessibilityMenu.waitForDisplayed({ timeout: 10000 });
    const isVisible = await accessibilityMenu.isDisplayed();
    expect(isVisible).to.be.true;
  });
});