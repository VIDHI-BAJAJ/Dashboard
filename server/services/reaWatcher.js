// const { ImapFlow } = require("imapflow");
// const Portal = require("../models/Portal");

// async function checkREAEmail() {
//   const client = new ImapFlow({
//     host: "imap.gmail.com", port: 993, secure: true,
//     auth: { user: process.env.REA_EMAIL_USER, pass: process.env.REA_EMAIL_APP_PASS },
//     logger: false,
//   });
//   try {
//     await client.connect();
//     await client.mailboxOpen("INBOX");
//     const mails = await client.search({
//       from: "vidhibajaj2603@gmail.com",  // ← who SENDS the test email
//       subject: "Change my uploader",
//       seen: false,
//     });
//       console.log("📬 Emails found:", mails.length); // ← ADD THIS LINE

//     if (mails.length > 0) {
//       const ticketNumber = await extractTicketNumber(client, mails[0]);
//       await client.messageFlagsAdd(mails, ["\\Seen"]);
//       await client.logout();
//       await Portal.findOneAndUpdate(
//         { portalId: "realestate" },
//         { status: "connected", ticketNumber, connectedAt: new Date() },
//         { upsert: true, new: true }
//       );
//       console.log(`✅ REA portal connected — Ticket #${ticketNumber}`);
//       return "connected";
//     }
//     await client.logout();
//     return "pending";
//   } catch (error) {
//     console.error("IMAP error:", error.message);
//     try { await client.logout(); } catch {}
//     return "pending";
//   }
// }

// async function extractTicketNumber(client, msgId) {
//   try {
//     for await (const msg of client.fetch([msgId], { envelope: true })) {
//       const subject = msg.envelope?.subject || "";
//       const match = subject.match(/Ticket #(\d+)/i);
//       return match ? match[1] : null;
//     }
//   } catch { return null; }
// }

// function startPolling() {
//   console.log("📧 Watching inbox for REA confirmation email...");
//   const interval = setInterval(async () => {
//     const result = await checkREAEmail();
//     if (result === "connected") { clearInterval(interval); clearTimeout(timeoutTimer); }
//   }, 60_000);
//   const timeoutTimer = setTimeout(async () => {
//     clearInterval(interval);
//     const portal = await Portal.findOne({ portalId: "realestate" });
//     if (portal?.status === "pending") {
//       await Portal.findOneAndUpdate({ portalId: "realestate" }, { status: "timeout", timeoutAt: new Date() });
//     }
//   }, 72 * 60 * 60 * 1000);
// }

// module.exports = { startPolling };



// services/reaWatcher.js
// Watches inbox for REA confirmation email
// Now per-user — each agent's polling is independent

const { ImapFlow } = require("imapflow");
const Portal = require("../models/Portal");

async function checkREAEmail(userId) {
  const client = new ImapFlow({
    host:   "imap.gmail.com",
    port:   993,
    secure: true,
    auth: {
      user: process.env.REA_EMAIL_USER,
      pass: process.env.REA_EMAIL_APP_PASS,
    },
    logger: false,
  });

  try {
    await client.connect();
    await client.mailboxOpen("INBOX");

    const mails = await client.search({
      from:    "vidhibajaj2603@gmail.com", // ← change to "rea-group.com" for production
      subject: "Change my uploader",
      seen:    false,
    });

    
    console.log(`📬 Emails found for user ${userId}:`, mails.length);

    if (mails.length > 0) {
      const ticketNumber = await extractTicketNumber(client, mails[0]);
      await client.messageFlagsAdd(mails, ["\\Seen"]);
      await client.logout();

      await Portal.findOneAndUpdate(
        { userId, portalId: "realestate" },
        {
          status:       "connected",
          ticketNumber: ticketNumber,
          connectedAt:  new Date(),
        },
        { upsert: true, new: true }
      );

      console.log(`✅ REA portal connected for user ${userId} — Ticket #${ticketNumber}`);
      return "connected";
    }

    await client.logout();
    return "pending";

  } catch (error) {
    console.error(`❌ IMAP error for user ${userId}:`, error.message);
    try { await client.logout(); } catch {}
    return "pending";
  }
}

async function extractTicketNumber(client, msgId) {
  try {
    for await (const msg of client.fetch([msgId], { envelope: true })) {
      const subject = msg.envelope?.subject || "";
      const match   = subject.match(/Ticket #(\d+)/i);
      return match ? match[1] : null;
    }
  } catch { return null; }
}

function startPolling(userId) {
  console.log(`📧 Watching inbox for REA email — user ${userId}`);

  const interval = setInterval(async () => {
    console.log(`🔍 Checking inbox for user ${userId}...`);
    const result = await checkREAEmail(userId);

    if (result === "connected") {
      clearInterval(interval);
      clearTimeout(timeoutTimer);
    }
  }, 60_000);

  const timeoutTimer = setTimeout(async () => {
    clearInterval(interval);
    const portal = await Portal.findOne({ userId, portalId: "realestate" });
    if (portal?.status === "pending") {
      await Portal.findOneAndUpdate(
        { userId, portalId: "realestate" },
        { status: "timeout", timeoutAt: new Date() }
      );
      console.log(`⏱ REA polling timed out for user ${userId}`);
    }
  }, 72 * 60 * 60 * 1000);
}

module.exports = { startPolling };