/**
 * Auto-sync service for publishing pending listings to Quikr
 */

const Listing = require('../models/Listing');
const runQuikrRPA = require('./rpa.service');

/**
 * Process all pending listings
 */
async function processPendingListings() {
  try {
    console.log('🔍 Starting auto-sync process for pending listings...');
    
    // Find all listings with pending Quikr status
    const pendingListings = await Listing.find({ 'quikr.status': 'pending' });
    
    if (pendingListings.length === 0) {
      console.log('✅ No pending listings found, auto-sync complete.');
      return { success: true, message: 'No pending listings to process', totalProcessed: 0, results: [] };
    }
    
    console.log(`📋 Found ${pendingListings.length} pending listings to process`);
    
    const results = [];
    
    for (const listing of pendingListings) {
      try {
        console.log(`🔄 Processing listing ${listing._id}...`);
        
        // Update status to syncing
        listing.quikr.status = 'syncing';
        await listing.save();
        console.log(`⏳ Updated listing ${listing._id} status to syncing`);
        
        // Run the Quikr RPA service
        await runQuikrRPA(listing);
        
        // Update status to published
        listing.quikr.status = 'published';
        listing.quikr.publishedAt = new Date();
        await listing.save();
        console.log(`✅ Successfully published listing ${listing._id} to Quikr`);
        
        results.push({
          listingId: listing._id,
          status: 'published',
          message: 'Successfully published to Quikr'
        });
      } catch (error) {
        console.error(`❌ Failed to publish listing ${listing._id}:`, error.message);
        
        // Update status to failed
        listing.quikr.status = 'failed';
        listing.quikr.lastError = error.message;
        await listing.save();
        console.log(`⚠️ Updated listing ${listing._id} status to failed`);
        
        results.push({
          listingId: listing._id,
          status: 'failed',
          message: error.message
        });
      }
    }
    
    console.log(`✅ Auto-sync process completed. Processed ${pendingListings.length} listings.`);
    
    return {
      success: true,
      totalProcessed: pendingListings.length,
      results
    };
  } catch (error) {
    console.error('❌ Auto-sync process failed:', error);
    return {
      success: false,
      message: error.message,
      totalProcessed: 0,
      results: []
    };
  }
}

/**
 * Schedule periodic auto-sync
 */
function scheduleAutoSync(intervalMinutes = 30) {
  const intervalMs = intervalMinutes * 60 * 1000;
  
  console.log(`⏰ Setting up auto-sync to run every ${intervalMinutes} minutes`);
  
  // Run immediately first time
  processPendingListings();
  
  // Then run periodically
  const intervalId = setInterval(async () => {
    console.log(`⏰ Scheduled auto-sync starting at ${new Date().toISOString()}`);
    await processPendingListings();
  }, intervalMs);
  
  return intervalId;
}

module.exports = {
  processPendingListings,
  scheduleAutoSync
};