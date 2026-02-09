// controllers/quikr.controller.js
const runQuikrRPA = require("../services/rpa.service");
const { validateQuikrListing } = require('../utils/quikr.validation');
const Listing = require('../models/Listing');

exports.publishToQuikr = async (req, res) => {
  try {
    console.log('=== Quikr Publish Request Received ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Request headers:', req.headers);
    console.log('Request body keys:', Object.keys(req.body || {}));
    
    // Get the listing from request body
    const listing = req.body;
    
    // Validate required fields before starting Selenium
    const validation = validateQuikrListing(listing);
    if (!validation.isValid) {
      console.log('Validation failed:', validation.errors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }
    
    console.log('Validation passed. Starting Selenium automation...');
    
    // Ensure images is an array for the bot
    const processedListing = {
      ...listing,
      images: Array.isArray(listing.images) ? listing.images : 
              (listing.images ? [listing.images] : ['placeholder-image.jpg'])
    };
    
    console.log('About to run Quikr RPA with listing ID:', processedListing.id || 'unknown');
    
    // Update the listing's Quikr status to syncing
    if (listing._id) {
      await Listing.findByIdAndUpdate(
        listing._id,
        { 
          $set: { 
            'quikr.status': 'syncing',
            'quikr.lastError': null
          }
        }
      );
    }
    
    // Start Selenium automation
    await runQuikrRPA(processedListing);
    
    // Update the listing's Quikr status to published
    if (listing._id) {
      await Listing.findByIdAndUpdate(
        listing._id,
        { 
          $set: { 
            'quikr.status': 'published',
            'quikr.publishedAt': new Date()
          }
        }
      );
    }

    res.status(200).json({
      success: true,
      message: "Listing published to Quikr"
    });
  } catch (err) {
    console.error("❌ Quikr publish failed:", err);
    
    // Update the listing's Quikr status to failed
    if (req.body._id) {
      try {
        await Listing.findByIdAndUpdate(
          req.body._id,
          { 
            $set: { 
              'quikr.status': 'failed',
              'quikr.lastError': err.message
            }
          }
        );
      } catch (updateErr) {
        console.error('Failed to update listing status:', updateErr);
      }
    }
    
    res.status(500).json({
      success: false,
      message: err.message || "Failed to publish listing to Quikr"
    });
  }
};