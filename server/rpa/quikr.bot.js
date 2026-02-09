// rpa/quikr.bot.js
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const os = require('os');
const selectors = require('./quikr.selectors');
const { handleCitySelection } = require('./quikr.city.helper');

/**
 * Complete Quikr property listing automation
 * @param {Object} property - Property listing object with all required fields
 */
async function runQuikrBot(property) {
  let driver;
  let tempDir;
  
  try {
    // Validate required property fields
    validateProperty(property);
    
    // Create temporary directory for Chrome profile to avoid prefs file issues
    tempDir = path.join(os.tmpdir(), 'quikr-chrome-' + Date.now());
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Configure Chrome options to prevent prefs file errors
    const options = new chrome.Options();
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--disable-web-security');
    options.addArguments('--disable-features=VizDisplayCompositor');
    options.addArguments('--user-data-dir=' + tempDir);
    options.addArguments('--disable-extensions');
    options.addArguments('--disable-plugins');
    options.addArguments('--disable-images'); // Optional: faster loading
    
    // Uncomment for headless mode (recommended for servers)
    // options.addArguments('--headless=new');
    
    console.log('Initializing Chrome driver with temporary profile...');
    
    // Initialize the driver with proper configuration
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    
    console.log('Chrome driver initialized successfully');
    console.log('Starting Quikr property listing automation...');
    
    // 1. Navigate to Quikr Real Estate posting page
    await driver.get('https://www.quikr.com/post-ad/realestate');
    console.log('Navigated to Quikr Real Estate posting page');
    
    // Wait for page to load
    await driver.wait(until.elementLocated(By.xpath("//body")), 10000);
    
    // 2. Skip city selection modal handling as we're using direct real estate posting URL
    // The city will be handled in the form fields instead
    console.log('Skipping city modal handling for direct real estate posting URL');
    
    // 3. Fill the property form directly (no need to click Post Free Ad button)
    await fillPropertyForm(driver, property);
    
    // 6. Pause for manual OTP verification
    await waitForOTPVerification(driver);
    
    // 7. Click "Post Ad Now" and verify success
    await submitAdAndVerify(driver);
    
    console.log('Quikr property listing completed successfully!');
    
  } catch (error) {
    console.error('Error in runQuikrBot:', error.message);
    
    // Cleanup temp directory on error
    try {
      if (tempDir && fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
        console.log('Temporary Chrome profile cleaned up');
      }
    } catch (cleanupError) {
      console.warn('Failed to cleanup temporary directory:', cleanupError.message);
    }
    
    throw error;
  } finally {
    // Cleanup resources
    if (driver) {
      try {
        console.log('Closing browser session...');
        await driver.quit();
        console.log('Browser closed successfully');
      } catch (quitError) {
        console.warn('Error closing browser:', quitError.message);
      }
    }
    
    // Cleanup temporary directory
    try {
      if (tempDir && fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
        console.log('Temporary Chrome profile cleaned up');
      }
    } catch (cleanupError) {
      console.warn('Failed to cleanup temporary directory:', cleanupError.message);
    }
    
    console.log('All resources cleaned up');
  }
}

/**
 * Validate that all required property fields are present
 */
function validateProperty(property) {
  if (!property) {
    throw new Error('Property object is required');
  }
  
  const requiredFields = ['category', 'listingFor', 'propertyType', 'availableFrom', 'city', 'price', 'description', 'furnishing', 'bathrooms', 'ownerType', 'name', 'email', 'mobile'];
  
  console.log('Validating property fields:', requiredFields);
  console.log('Property object received:', JSON.stringify(property, null, 2));
  
  const missingFields = requiredFields.filter(field => {
    const value = property[field];
    console.log(`Field '${field}' value:`, value, 'Type:', typeof value);
    // Check if field exists and has a truthy value (excluding empty strings)
    return value === undefined || value === null || value === '';
  });
  
  if (missingFields.length > 0) {
    console.log('Missing fields detected:', missingFields);
    throw new Error(`Missing required property fields: ${missingFields.join(', ')}`);
  }
  
  // Check for valid images array
  if (!property.images || (!Array.isArray(property.images) || property.images.length === 0)) {
    console.log('No images found in property, adding placeholder:', property.images);
    // Add a placeholder image if none found
    property.images = ['placeholder-image.jpg'];
  }
  
  // Validate price is a number
  if (isNaN(property.price) || property.price <= 0) {
    throw new Error('Property price must be a positive number');
  }
  
  // Validate description length
  if (typeof property.description === 'string' && property.description.length < 30) {
    throw new Error('Property description must be at least 30 characters long');
  }
  
  // Validate email format
  const emailRegex = /^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(property.email)) {
    throw new Error('Invalid email format');
  }
  
  // Validate mobile format (basic check for 10 digits)
  const mobileRegex = /^\d{10,15}$/;
  if (!mobileRegex.test(property.mobile)) {
    throw new Error('Mobile number must be 10-15 digits');
  }
  
  console.log('Property validation passed');
}

/**
 * Handle city selection modal
 */
async function handleCityModal(driver, city) {
  try {
    console.log('Checking for city selection modal...');
    await driver.sleep(2000); // Wait for modal to potentially appear
    await handleCitySelection(driver, city);
  } catch (error) {
    console.log('City selection modal not found or already handled');
  }
}

/**
 * Click the "Post Free Ad" button
 */
async function clickPostFreeAd(driver) {
  console.log('Clicking "Post Free Ad" button...');
  
  const postAdButton = await driver.wait(
    until.elementLocated(By.xpath(selectors.postFreeAdButton)),
    10000
  );
  
  await driver.wait(until.elementIsVisible(postAdButton), 5000);
  await driver.wait(until.elementIsClickable(postAdButton), 5000);
  
  await postAdButton.click();
  console.log('"Post Free Ad" button clicked');
  
  // Wait for navigation
  await driver.sleep(2000);
}

/**
 * Select "Homes / Property" category
 */
async function selectHomesCategory(driver) {
  console.log('Selecting "Homes / Property" category...');
  
  const homesCategory = await driver.wait(
    until.elementLocated(By.xpath(selectors.homesPropertyCategory)),
    10000
  );
  
  await driver.wait(until.elementIsVisible(homesCategory), 5000);
  await driver.wait(until.elementIsClickable(homesCategory), 5000);
  
  await homesCategory.click();
  console.log('"Homes / Property" category selected');
  
  // Wait for category selection to process
  await driver.sleep(2000);
}

/**
 * Fill the complete property form
 */
async function fillPropertyForm(driver, property) {
  console.log('Filling property form...');
  
  // 1. Select Category (Residential / Commercial / Agricultural)
  await selectPillButton(driver, selectors.categoryPill(property.category), property.category);
  
  // 2. Select List Property For (Sell / Rent / PG / Flatmate)
  await selectPillButton(driver, selectors.listingForPill(property.listingFor), property.listingFor);
  
  // 3. Select Property Type (Apartment / Villa / etc.)
  await selectPillButton(driver, selectors.propertyTypePill(property.propertyType), property.propertyType);
  
  // 4. Open and fill "Property Details" section
  await fillInputField(driver, selectors.availableFromInput, property.availableFrom, 'Available From');
  
  // 5. Upload property photos (using absolute file paths)
  await uploadImages(driver, property.images);
  
  // 6. Enter Property Price
  await fillInputField(driver, selectors.priceInput, property.price.toString(), 'Price');
  
  // 7. Enter About Property description (minimum 30 characters)
  await fillTextarea(driver, selectors.descriptionTextarea, property.description, 'Description');
  
  // 8. Select Furnishing
  await selectPillButton(driver, selectors.furnishingPill(property.furnishing), property.furnishing);
  
  // 9. Select Number of Bathrooms
  await selectPillButton(driver, selectors.bathroomsPill(property.bathrooms), property.bathrooms);
  
  // 10. Fill Owner/Agent details:
  // 10a. You Are (Owner / Agent / Builder)
  await selectPillButton(driver, selectors.ownerTypePill(property.ownerType), property.ownerType);
  
  // 10b. Full Name
  await fillInputField(driver, selectors.nameInput, property.name, 'Name');
  
  // 10c. Email
  await fillInputField(driver, selectors.emailInput, property.email, 'Email');
  
  // 10d. Mobile Number
  await fillInputField(driver, selectors.mobileInput, property.mobile, 'Mobile');
  
  console.log('Property form filled successfully');
}

/**
 * Select a pill button by clicking it
 */
async function selectPillButton(driver, selector, value) {
  try {
    const button = await driver.wait(
      until.elementLocated(By.xpath(selector)),
      5000
    );
    
    await driver.wait(until.elementIsVisible(button), 3000);
    await driver.wait(until.elementIsClickable(button), 3000);
    
    await button.click();
    console.log(`Selected: ${value}`);
  } catch (error) {
    console.warn(`Could not select pill button for: ${value}. May already be selected or element not found.`);
  }
}

/**
 * Fill a standard input field
 */
async function fillInputField(driver, selector, value, fieldName) {
  try {
    const input = await driver.wait(
      until.elementLocated(By.xpath(selector)),
      5000
    );
    
    await driver.wait(until.elementIsVisible(input), 3000);
    await driver.wait(until.elementIsEnabled(input), 3000);
    
    await input.clear();
    await input.sendKeys(value);
    console.log(`Filled ${fieldName}: ${value}`);
  } catch (error) {
    console.warn(`Could not fill ${fieldName}: ${error.message}`);
  }
}

/**
 * Fill a textarea field
 */
async function fillTextarea(driver, selector, value, fieldName) {
  try {
    const textarea = await driver.wait(
      until.elementLocated(By.xpath(selector)),
      5000
    );
    
    await driver.wait(until.elementIsVisible(textarea), 3000);
    await driver.wait(until.elementIsEnabled(textarea), 3000);
    
    await textarea.clear();
    await textarea.sendKeys(value);
    console.log(`Filled ${fieldName}: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
  } catch (error) {
    console.warn(`Could not fill ${fieldName}: ${error.message}`);
  }
}

/**
 * Upload images
 */
async function uploadImages(driver, images) {
  try {
    const fileInput = await driver.wait(
      until.elementLocated(By.xpath(selectors.imageUpload)),
      5000
    );
    
    // Join image paths with newlines for multiple file upload
    const imagePathString = images.join('\n');
    await fileInput.sendKeys(imagePathString);
    
    console.log(`Uploaded ${images.length} images`);
    await driver.sleep(3000); // Wait for images to upload
  } catch (error) {
    console.warn(`Could not upload images: ${error.message}`);
  }
}

/**
 * Check the negotiable checkbox
 */
async function checkNegotiableCheckbox(driver) {
  try {
    const checkbox = await driver.wait(
      until.elementLocated(By.xpath(selectors.negotiableCheckbox)),
      5000
    );
    
    const isSelected = await checkbox.isSelected();
    if (!isSelected) {
      await checkbox.click();
      console.log('Checked negotiable checkbox');
    } else {
      console.log('Negotiable checkbox already checked');
    }
  } catch (error) {
    console.warn(`Could not check negotiable checkbox: ${error.message}`);
  }
}

/**
 * Wait for manual OTP verification
 */
async function waitForOTPVerification(driver) {
  console.log('\n=== MANUAL VERIFICATION REQUIRED ===');
  console.log('Please enter the OTP sent to the mobile number and complete any verification steps.');
  console.log('The bot will wait for 5 minutes for manual verification...');
  console.log('====================================\n');
  
  // Wait for 5 minutes to allow manual OTP entry
  await driver.sleep(300000); // 5 minutes
  
  console.log('Continuing with ad submission...');
}

/**
 * Submit the ad and verify success
 */
async function submitAdAndVerify(driver) {
  console.log('Clicking "Post Ad Now" button...');
  
  const postAdButton = await driver.wait(
    until.elementLocated(By.xpath(selectors.postAdButton)),
    10000
  );
  
  await driver.wait(until.elementIsVisible(postAdButton), 5000);
  await driver.wait(until.elementIsClickable(postAdButton), 5000);
  
  await postAdButton.click();
  console.log('"Post Ad Now" button clicked');
  
  // Wait for success message
  try {
    const successMessage = await driver.wait(
      until.elementLocated(By.xpath(selectors.successMessage)),
      15000
    );
    
    console.log('SUCCESS: Property listing posted successfully!');
    console.log('Success message found:', await successMessage.getText());
  } catch (error) {
    console.warn('Could not verify success message. Please check the page manually.');
  }
}

module.exports = runQuikrBot;