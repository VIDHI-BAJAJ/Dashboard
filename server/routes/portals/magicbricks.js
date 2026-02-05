router.post('/initiate', async (req, res) => {
    const { companyId, listingIds } = req.body;
  
    // 1️⃣ Check if already activated
    const existing = await db.query(
      `SELECT * FROM portal_connections
       WHERE company_id=$1 AND portal='magicbricks'`,
      [companyId]
    );
  
    // If email already sent → STOP
    if (existing.rows.length && existing.rows[0].activation_email_sent) {
      return res.status(400).json({
        error: 'Magicbricks already activated'
      });
    }
  
    // 2️⃣ Create permanent XML URL
    const xmlFeedUrl =
      `https://api.yourdomain.com/feeds/magicbricks/${companyId}.xml`;
  
    // 3️⃣ Save portal state
    await db.query(`
      INSERT INTO portal_connections
        (company_id, portal, status, xml_feed_url)
      VALUES ($1, 'magicbricks', 'pending', $2)
      ON CONFLICT (company_id, portal)
      DO UPDATE SET
        xml_feed_url=$2,
        status='pending'
    `, [companyId, xmlFeedUrl]);
  
    // 4️⃣ Return email draft (frontend shows it)
    res.json({
      xmlFeedUrl,
      emailDraft: `
  To: partners@magicbricks.com
  Subject: XML Feed Integration Request
  
  Hello Magicbricks Team,
  
  Please activate XML feed integration.
  
  Company ID: ${companyId}
  Feed URL: ${xmlFeedUrl}
  
  Regards,
  Your Company Name
  `
    });
  });

  

  router.post('/confirm-email', async (req, res) => {
    const { companyId } = req.body;
  
    await db.query(`
      UPDATE portal_connections
      SET
        activation_email_sent = true,
        status = 'awaiting_magicbricks',
        updated_at = now()
      WHERE company_id=$1 AND portal='magicbricks'
    `, [companyId]);
  
    res.json({ success: true });
  });
  