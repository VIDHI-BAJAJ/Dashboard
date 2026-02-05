// services/portalConnections.js
async function getOrCreateMagicbricksConnection(db, brokerId) {
    const portal = 'magicbricks';
  
    const existing = await db.portal_connections.findOne({ broker_id: brokerId, portal });
    if (existing) return existing;
  
    const xmlFeedUrl = `${process.env.PUBLIC_APP_URL}/feeds/magicbricks.xml`; // fixed URL
  
    return db.portal_connections.insert({
      broker_id: brokerId,
      portal,
      status: 'inactive',
      activation_email_sent: false,
      xml_feed_url: xmlFeedUrl,
    });
  }