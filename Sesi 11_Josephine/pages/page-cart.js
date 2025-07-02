import { By } from "selenium-webdriver";

class PageCart {
    static firstAddToCartButton = By.css('.inventory_item button');
    static cartIcon = By.className('shopping_cart_link');
    static cartItem = By.className('cart_item');
    static productName = By.className('inventory_item_name')
}

export default PageCart;