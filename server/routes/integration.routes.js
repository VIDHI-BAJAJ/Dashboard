const express = require("express");
const Listing = require("../models/Listing");

const router = express.Router();

/**
 * PUBLISH TO QUIKR BY LISTING ID
 * MongoDB → Selenium
 */
router.post("/integrations/quikr/publish/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    
    // Fetch listing from MongoDB using listingId
    const listing = await Listing.findById(listingId);
    
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }
    
    // Update listing status to syncing
    listing.quikr.status = 'syncing';
    await listing.save();
    
    // Import and run Quikr RPA service
    const runQuikrRPA = require('../services/rpa.service');
    
    try {
      await runQuikrRPA(listing);
      
      // Update listing status to published
      listing.quikr.status = 'published';
      listing.quikr.publishedAt = new Date();
      await listing.save();
      
      res.json({
        success: true,
        message: 'Listing published to Quikr successfully'
      });
    } catch (seleniumError) {
      // Update listing status to failed
      listing.quikr.status = 'failed';
      listing.quikr.lastError = seleniumError.message;
      await listing.save();
      
      throw seleniumError; // Re-throw to be caught by outer catch
    }
  } catch (err) {
    console.error('❌ Quikr publish failed:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to publish listing to Quikr'
    });
  }
});

/**
 * PUBLISH TO QUIKR BY FULL PAYLOAD (BACKWARD COMPATIBILITY)
 * React Payload → MongoDB → Selenium
 */
router.post("/integrations/quikr/publish", async (req, res) => {
  try {
    const listingData = req.body;
    
    // If listing has an _id, use the existing listing from DB
    if (listingData._id) {
      const listing = await Listing.findById(listingData._id);
      if (!listing) {
        return res.status(404).json({
          success: false,
          message: 'Listing not found'
        });
      }
      
      // Update listing status to syncing
      listing.quikr.status = 'syncing';
      await listing.save();
      
      // Import and run Quikr RPA service
      const runQuikrRPA = require('../services/rpa.service');
      
      try {
        await runQuikrRPA(listing);
        
        // Update listing status to published
        listing.quikr.status = 'published';
        listing.quikr.publishedAt = new Date();
        await listing.save();
        
        res.json({
          success: true,
          message: 'Listing published to Quikr successfully'
        });
      } catch (seleniumError) {
        // Update listing status to failed
        listing.quikr.status = 'failed';
        listing.quikr.lastError = seleniumError.message;
        await listing.save();
        
        throw seleniumError; // Re-throw to be caught by outer catch
      }
    } else {
      // If no _id, create a new listing first, then publish
      const listing = new Listing(listingData);
      await listing.save();
      
      // Update listing status to syncing
      listing.quikr.status = 'syncing';
      await listing.save();
      
      // Import and run Quikr RPA service
      const runQuikrRPA = require('../services/rpa.service');
      
      try {
        await runQuikrRPA(listing);
        
        // Update listing status to published
        listing.quikr.status = 'published';
        listing.quikr.publishedAt = new Date();
        await listing.save();
        
        res.json({
          success: true,
          message: 'Listing published to Quikr successfully'
        });
      } catch (seleniumError) {
        // Update listing status to failed
        listing.quikr.status = 'failed';
        listing.quikr.lastError = seleniumError.message;
        await listing.save();
        
        throw seleniumError; // Re-throw to be caught by outer catch
      }
    }
  } catch (err) {
    console.error('❌ Quikr publish failed:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to publish listing to Quikr'
    });
  }
});

/**
 * AUTOMATIC SYNC - Publish all pending listings
 */
router.post('/integrations/quikr/sync-pending', async (req, res) => {
  try {
    // Find all listings with pending Quikr status
    const pendingListings = await Listing.find({ 'quikr.status': 'pending' });
    
    const results = [];
    
    for (const listing of pendingListings) {
      try {
        // Update status to syncing
        listing.quikr.status = 'syncing';
        await listing.save();
        
        // Import and run Quikr RPA service
        const runQuikrRPA = require('../services/rpa.service');
        
        await runQuikrRPA(listing);
        
        // Update status to published
        listing.quikr.status = 'published';
        listing.quikr.publishedAt = new Date();
        await listing.save();
        
        results.push({
          listingId: listing._id,
          status: 'published',
          message: 'Successfully published to Quikr'
        });
      } catch (error) {
        // Update status to failed
        listing.quikr.status = 'failed';
        listing.quikr.lastError = error.message;
        await listing.save();
        
        results.push({
          listingId: listing._id,
          status: 'failed',
          message: error.message
        });
      }
    }
    
    res.json({
      success: true,
      totalProcessed: pendingListings.length,
      results
    });
  } catch (err) {
    console.error('❌ Auto-sync failed:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to sync pending listings'
    });
  }
});

module.exports = router;
