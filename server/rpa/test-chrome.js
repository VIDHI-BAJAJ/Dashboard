// test-chrome.js - Simple Chrome driver test
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function testChromeDriver() {
  let driver;
  let tempDir;
  
  try {
    console.log('Testing Chrome driver initialization...');
    
    // Create temporary directory
    tempDir = path.join(os.tmpdir(), 'test-chrome-' + Date.now());
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Configure Chrome options
    const options = new chrome.Options();
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--user-data-dir=' + tempDir);
    options.addArguments('--headless=new'); // Headless for testing
    
    console.log('Creating Chrome driver...');
    
    // Initialize driver
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    
    console.log('Chrome driver created successfully!');
    
    // Test navigation
    console.log('Testing navigation to Google...');
    await driver.get('https://www.google.com');
    
    const title = await driver.getTitle();
    console.log('Page title:', title);
    console.log('✅ Chrome driver test PASSED!');
    
  } catch (error) {
    console.error('❌ Chrome driver test FAILED:', error.message);
    console.error('Common solutions:');
    console.error('1. Ensure ChromeDriver is installed and in PATH');
    console.error('2. Check Chrome and ChromeDriver version compatibility');
    console.error('3. Try running without headless mode');
    throw error;
  } finally {
    // Cleanup
    if (driver) {
      try {
        await driver.quit();
        console.log('Browser closed');
      } catch (error) {
        console.warn('Error closing browser:', error.message);
      }
    }
    
    if (tempDir && fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
        console.log('Temporary directory cleaned up');
      } catch (error) {
        console.warn('Error cleaning up temp directory:', error.message);
      }
    }
  }
}

// Run test if executed directly
if (require.main === module) {
  testChromeDriver()
    .then(() => console.log('\n🎉 All tests completed!'))
    .catch(error => {
      console.error('\n💥 Test failed:', error.message);
      process.exit(1);
    });
}

module.exports = { testChromeDriver };