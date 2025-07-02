import { By } from "selenium-webdriver";

class PageInventory {
    static sortSelect = By.xpath('//*[@id="header_container"]/div[2]/div/span/select');
    static inventoryContainer1 = By.xpath('//*[@id="root"]');
    static inventoryContainer2 = By.id('inventory_container');
}

export default PageInventory;