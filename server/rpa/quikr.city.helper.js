// rpa/quikr.city.helper.js
const { Builder, By, until } = require('selenium-webdriver');
const selectors = require('./quikr.selectors');

/**
 * Handle Quikr city selection modal
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {string} cityName - City name from property object
 */
async function handleCitySelection(driver, cityName) {
  if (!cityName) {
    throw new Error('City name is required for city selection');
  }

  try {
    // Wait for the city selection modal to appear
    const modalContainer = await driver.wait(
      until.elementLocated(By.xpath(selectors.cityModal.container)),
      10000
    );
    
    console.log(`City selection modal detected, selecting city: ${cityName}`);
    
    // Wait for the city search input to be located and visible
    const citySearchInput = await driver.wait(
      until.elementLocated(By.xpath(selectors.cityModal.searchInput)),
      5000
    );
    
    // Wait for the input to be visible and enabled
    await driver.wait(until.elementIsVisible(citySearchInput), 2000);
    
    // Clear the input and type the city name
    await citySearchInput.clear();
    await citySearchInput.sendKeys(cityName);
    
    // Wait a bit for the dropdown to appear
    await driver.sleep(1000); // Brief pause to allow dropdown to populate
    
    // Try to select the city from dropdown results first
    try {
      const cityOptionXPath = selectors.cityDropdownOption(cityName);
      const cityOption = await driver.wait(
        until.elementLocated(By.xpath(cityOptionXPath)),
        5000
      );
      
      // Wait for the option to be clickable
      await driver.wait(until.elementIsClickable(cityOption), 2000);
      
      // Click the matching city option
      await cityOption.click();
      
      console.log(`Selected city from dropdown: ${cityName}`);
    } catch (dropdownError) {
      console.log(`City not found in dropdown, trying popular cities: ${cityName}`);
      
      // If dropdown selection fails, try to select from popular cities grid
      try {
        const popularCityXPath = selectors.popularCityOption(cityName);
        const popularCityOption = await driver.wait(
          until.elementLocated(By.xpath(popularCityXPath)),
          5000
        );
        
        // Wait for the option to be clickable
        await driver.wait(until.elementIsClickable(popularCityOption), 2000);
        
        // Click the matching popular city option
        await popularCityOption.click();
        
        console.log(`Selected city from popular cities: ${cityName}`);
      } catch (popularCitiesError) {
        throw new Error(`Could not find city '${cityName}' in dropdown or popular cities: ${popularCitiesError.message}`);
      }
    }
    
    // Wait for the modal to disappear completely
    await driver.wait(
      until.stalenessOf(modalContainer),
      10000
    );
    
    console.log(`City selection modal closed, city '${cityName}' selected successfully`);
  } catch (error) {
    console.error('Error in handleCitySelection:', error.message);
    throw error;
  }
}

module.exports = {
  handleCitySelection
};