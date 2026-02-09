// Example usage of the handleCitySelection function
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { handleCitySelection } = require('./quikr.city.helper');

async function exampleUsage() {
  let driver;
  
  try {
    // Setup Chrome driver (you may need to install chromedriver)
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().headless()) // Remove .headless() to see browser
      .build();

    // Navigate to Quikr Homes section
    await driver.get('https://www.quikr.com/homes');

    // Example property object with city
    const property = {
      city: 'Mumbai',  // This would come from your listing data
      // other property fields...
    };

    // Call the city selection function immediately after page loads
    // and before filling the property form
    await handleCitySelection(driver, property.city);

    console.log('City selected successfully! Continuing with form...');
    
    // Continue with the rest of your form filling...
    
  } catch (error) {
    console.error('Error in example:', error);
  } finally {
    // Don't forget to close the driver
    if (driver) {
      await driver.quit();
    }
  }
}

// Uncomment to run the example
// exampleUsage();

module.exports = { exampleUsage };