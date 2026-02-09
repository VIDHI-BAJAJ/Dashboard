// rpa/quikr.selectors.js
module.exports = {
  // City selection modal selectors
  cityModal: {
    container: "//div[contains(@class, 'city-selector-modal') or contains(@class, 'select-city') or contains(@class, 'city-modal')]",
    searchInput: "//input[@placeholder='Type your city here' or @placeholder='Search for your city' or contains(@placeholder, 'city')]",
  },
  
  // Main page selectors
  postFreeAdButton: "//button[contains(text(), 'Post Free Ad') or contains(text(), 'POST FREE AD') or @data-testid='post-ad-button']",
  
  // Category selection
  homesPropertyCategory: "//div[contains(@class, 'category')]//button[contains(text(), 'Homes') or contains(text(), 'Property') or contains(text(), 'Real Estate')] | //a[contains(text(), 'Homes') or contains(text(), 'Property') or contains(text(), 'Real Estate')]",
  
  // Form field selectors
  categoryPill: (category) => `//button[contains(@class, 'pill') and contains(text(), '${category}')] | //div[contains(@class, 'category')]//button[contains(text(), '${category}')]`,
  listingForPill: (listingType) => `//button[contains(@class, 'pill') and (contains(text(), '${listingType}') or contains(text(), '${listingType.toUpperCase()}'))] | //div[contains(@class, 'listing-type')]//button[contains(text(), '${listingType}') or contains(text(), '${listingType.toUpperCase()}')]`,
  propertyTypePill: (propertyType) => `//button[contains(@class, 'pill') and contains(text(), '${propertyType}')] | //div[contains(@class, 'property-type')]//button[contains(text(), '${propertyType}')]`,
  
  // Input fields
  cityInput: "//input[contains(@placeholder, 'City') or contains(@name, 'city') or contains(@id, 'city') or @placeholder='Enter City']",
  availableFromInput: "//input[@type='date' or @placeholder='Available From' or contains(@placeholder, 'date') or contains(@name, 'available') or contains(@id, 'available')]",
  priceInput: "//input[@type='number' or contains(@placeholder, 'Price') or contains(@name, 'price') or contains(@id, 'price')]",
  descriptionTextarea: "//textarea[contains(@placeholder, 'Description') or contains(@name, 'description') or contains(@id, 'description')]",
  nameInput: "//input[contains(@placeholder, 'Name') or contains(@name, 'name') or contains(@id, 'name')]",
  emailInput: "//input[@type='email' or contains(@placeholder, 'Email') or contains(@name, 'email') or contains(@id, 'email')]",
  mobileInput: "//input[@type='tel' or contains(@placeholder, 'Mobile') or contains(@placeholder, 'Phone') or contains(@name, 'mobile') or contains(@name, 'phone') or contains(@id, 'mobile') or contains(@id, 'phone')]",
  
  // Checkbox and file upload
  negotiableCheckbox: "//input[@type='checkbox' and (contains(@name, 'negotiable') or contains(@id, 'negotiable') or following-sibling::label[contains(text(), 'Negotiable')])] | //label[contains(text(), 'Negotiable')]/preceding-sibling::input[@type='checkbox']",
  imageUpload: "//input[@type='file' and (contains(@accept, 'image') or contains(@name, 'image') or contains(@id, 'image'))] | //div[contains(@class, 'upload') or contains(@class, 'image')]//input[@type='file']",
  
  // Pill buttons for specific values
  furnishingPill: (furnishing) => `//button[contains(@class, 'pill') and contains(text(), '${furnishing}')] | //div[contains(@class, 'furnishing')]//button[contains(text(), '${furnishing}')]`,
  bathroomsPill: (bathrooms) => `//button[contains(@class, 'pill') and contains(text(), '${bathrooms}') and contains(text(), 'Bath')] | //div[contains(@class, 'bathroom')]//button[contains(text(), '${bathrooms}')]`,
  ownerTypePill: (ownerType) => `//button[contains(@class, 'pill') and contains(text(), '${ownerType}')] | //div[contains(@class, 'owner-type')]//button[contains(text(), '${ownerType}')]`,
  
  // Submit button
  postAdButton: "//button[contains(text(), 'Post Ad') or contains(text(), 'Post Ad Now') or contains(text(), 'Submit') or @type='submit']",
  
  // Success verification
  successMessage: "//div[contains(text(), 'Success') or contains(text(), 'Posted') or contains(text(), 'Thank you')] | //h1[contains(text(), 'Success') or contains(text(), 'Posted')] | //p[contains(text(), 'Success') or contains(text(), 'Posted')]",
  
  // General selectors
  cityDropdownOption: (cityName) => `//li[contains(text(), '${cityName}') or contains(span, '${cityName}') or contains(div, '${cityName}') or .//span[contains(text(), '${cityName}')]]`,
  popularCityOption: (cityName) => `//div[contains(@class, 'popular-cities')]//button[contains(text(), '${cityName}')] | //div[contains(@class, 'popular-cities')]//a[contains(text(), '${cityName}')] | //div[contains(@class, 'popular-cities')]//span[contains(text(), '${cityName}')]`
};
