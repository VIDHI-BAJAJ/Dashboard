// services/reaXmlGenerator.js
// Converts MongoDB listing (JSON) → REAXML format
// Supports: residential, rental, commercial, land, rural
// Based on official REAXML spec from REA partner docs

function formatDate(date) {
    // REA date format: 2009-01-01-12:30:00
    const d = date ? new Date(date) : new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}-${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
  
  function escapeXml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g,  "&amp;")
      .replace(/</g,  "&lt;")
      .replace(/>/g,  "&gt;")
      .replace(/"/g,  "&quot;")
      .replace(/'/g,  "&apos;");
  }
  
  // ─────────────────────────────────────────────────────────────
  // MAIN EXPORT — converts listing + agentId → XML string
  // ─────────────────────────────────────────────────────────────
  function generateREAXML(listing, agentId) {
    const now         = formatDate(new Date());
    const listingType = listing.listingType || "residential";
    const status      = mapStatus(listing.status || "active");
  
    let innerXml = "";
  
    switch (listingType) {
      case "residential":
        innerXml = buildResidential(listing, agentId, status, now);
        break;
      case "rental":
        innerXml = buildRental(listing, agentId, status, now);
        break;
      case "commercial":
        innerXml = buildCommercial(listing, agentId, status, now);
        break;
      case "land":
        innerXml = buildLand(listing, agentId, status, now);
        break;
      case "rural":
        innerXml = buildRural(listing, agentId, status, now);
        break;
      default:
        innerXml = buildResidential(listing, agentId, status, now);
    }
  
    return `<?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE propertyList SYSTEM "http://reaxml.realestate.com.au/propertyList.dtd">
  <propertyList date="${now}">
  ${innerXml}
  </propertyList>`;
  }
  
  // ── Map your DB status → REA status ───────────────────────────
  function mapStatus(status) {
    const map = {
      active:    "current",
      sold:      "sold",
      leased:    "leased",
      withdrawn: "withdrawn",
      offmarket: "withdrawn",
    };
    return map[status] || "current";
  }
  
  // ── Shared address block ───────────────────────────────────────
  function buildAddress(addr) {
    if (!addr) return "";
    return `
      <address display="yes">
        ${addr.subNumber    ? `<subNumber>${escapeXml(addr.subNumber)}</subNumber>` : ""}
        ${addr.streetNumber ? `<streetNumber>${escapeXml(addr.streetNumber)}</streetNumber>` : ""}
        ${addr.street       ? `<street>${escapeXml(addr.street)}</street>` : ""}
        <suburb display="yes">${escapeXml(addr.suburb || "")}</suburb>
        <state>${escapeXml(addr.state || "")}</state>
        <postcode>${escapeXml(addr.postcode || "")}</postcode>
        <country>${escapeXml(addr.country || "AUS")}</country>
      </address>`;
  }
  
  // ── Shared features block ──────────────────────────────────────
  function buildFeatures(feat, toggleFeatures = [], otherFeatures = "") {
    if (!feat) return "";
    const tf = Array.isArray(toggleFeatures) ? toggleFeatures : [];
    return `
      <features>
        ${feat.bedrooms    ? `<bedrooms>${feat.bedrooms}</bedrooms>` : ""}
        ${feat.bathrooms   ? `<bathrooms>${feat.bathrooms}</bathrooms>` : ""}
        ${feat.ensuite     ? `<ensuite>${feat.ensuite}</ensuite>` : ""}
        ${feat.garages     ? `<garages>${feat.garages}</garages>` : ""}
        ${feat.carports    ? `<carports>${feat.carports}</carports>` : ""}
        ${tf.includes("remoteGarage")    ? "<remoteGarage>yes</remoteGarage>"   : ""}
        ${tf.includes("secureParking")   ? "<secureParking>yes</secureParking>" : ""}
        ${tf.includes("airConditioning") ? "<airConditioning>1</airConditioning>" : ""}
        ${tf.includes("alarmSystem")     ? "<alarmSystem>1</alarmSystem>"       : ""}
        ${tf.includes("pool")            ? '<pool type="inground">yes</pool>'   : ""}
        ${tf.includes("spa")             ? '<spa type="inground">yes</spa>'     : ""}
        ${tf.includes("tennisCourt")     ? "<tennisCourt>yes</tennisCourt>"     : ""}
        ${tf.includes("balcony")         ? "<balcony>yes</balcony>"             : ""}
        ${tf.includes("deck")            ? "<deck>yes</deck>"                   : ""}
        ${tf.includes("courtyard")       ? "<courtyard>yes</courtyard>"         : ""}
        ${tf.includes("shed")            ? "<shed>yes</shed>"                   : ""}
        ${tf.includes("fullyFenced")     ? "<fullyFenced>yes</fullyFenced>"     : ""}
        ${tf.includes("openFirePlace")   ? "<openFirePlace>1</openFirePlace>"   : ""}
        ${otherFeatures ? `<otherFeatures>${escapeXml(otherFeatures)}</otherFeatures>` : ""}
      </features>`;
  }
  
  // ── Shared images block ────────────────────────────────────────
  function buildImages(images = [], now) {
    if (!images.length) return "";
    return `
      <images>
        ${images.map((url, i) => {
          const id = i === 0 ? "m" : String.fromCharCode(97 + i); // m, a, b, c...
          const fmt = url.split(".").pop()?.toLowerCase() || "jpg";
          return `<img id="${id}" modTime="${now}" url="${escapeXml(url)}" format="${fmt}"/>`;
        }).join("\n      ")}
      </images>`;
  }
  
  // ── Shared floorplans block ────────────────────────────────────
  function buildFloorplans(floorplans = [], now) {
    if (!floorplans.length) return "";
    return `
      <objects>
        ${floorplans.map((url, i) => {
          const fmt = url.split(".").pop()?.toLowerCase() || "gif";
          return `<floorplan id="${i+1}" modTime="${now}" url="${escapeXml(url)}" format="${fmt}"/>`;
        }).join("\n      ")}
      </objects>`;
  }
  
  // ── Listing agent block ────────────────────────────────────────
  function buildListingAgent(agent) {
    if (!agent?.name) return "";
    return `
      <listingAgent>
        <name>${escapeXml(agent.name)}</name>
        ${agent.mobile ? `<telephone type="mobile">${escapeXml(agent.mobile)}</telephone>` : ""}
        ${agent.email  ? `<email>${escapeXml(agent.email)}</email>`                         : ""}
      </listingAgent>`;
  }
  
  // ── Land/building details ──────────────────────────────────────
  function buildLandDetails(landDetails) {
    if (!landDetails?.area) return "";
    return `
      <landDetails>
        <area unit="${landDetails.unit || "squareMeter"}">${landDetails.area}</area>
      </landDetails>`;
  }
  
  function buildBuildingDetails(buildingDetails) {
    if (!buildingDetails?.area) return "";
    return `
      <buildingDetails>
        <area unit="${buildingDetails.unit || "square"}">${buildingDetails.area}</area>
        ${buildingDetails.energyRating ? `<energyRating>${buildingDetails.energyRating}</energyRating>` : ""}
      </buildingDetails>`;
  }
  
  // ─────────────────────────────────────────────────────────────
  // RESIDENTIAL
  // ─────────────────────────────────────────────────────────────
  function buildResidential(listing, agentId, status, now) {
    const p    = listing.property || {};
    const addr = p.address || {};
    const feat = p.features || {};
  
    // Sold listing — minimal fields only
    if (status === "sold") {
      return `  <residential modTime="${now}" status="sold">
      <agentID>${escapeXml(agentId)}</agentID>
      <uniqueID>${escapeXml(listing._id.toString())}</uniqueID>
      <soldDetails>
        <price display="yes">${p.price || 0}</price>
        <date>${now}</date>
      </soldDetails>
    </residential>`;
    }
  
    // Withdrawn listing
    if (status === "withdrawn") {
      return `  <residential modTime="${now}" status="withdrawn">
      <agentID>${escapeXml(agentId)}</agentID>
      <uniqueID>${escapeXml(listing._id.toString())}</uniqueID>
    </residential>`;
    }
  
    // Current listing — full details
    return `  <residential modTime="${now}" status="current">
      <agentID>${escapeXml(agentId)}</agentID>
      <uniqueID>${escapeXml(listing._id.toString())}</uniqueID>
      <authority value="exclusive"/>
      <underOffer value="${listing.underOffer === "yes" ? "yes" : "no"}"/>
      ${listing.property?.newConstruction ? "<newConstruction>1</newConstruction>" : ""}
      ${buildListingAgent(listing.agent)}
      <price display="yes">${p.price || 0}</price>
      ${p.priceView ? `<priceView>${escapeXml(p.priceView)}</priceView>` : ""}
      ${buildAddress(addr)}
      <category name="${escapeXml(p.category || "House")}"/>
      <headline>${escapeXml(p.headline || "")}</headline>
      <description>${escapeXml(p.description || "")}</description>
      ${buildFeatures(feat, p.toggleFeatures, p.otherFeatures)}
      ${buildLandDetails(p.landDetails)}
      ${buildBuildingDetails(p.buildingDetails)}
      ${p.inspection?.start ? `
      <inspectionTimes>
        <inspection>${escapeXml(p.inspection.start)}</inspection>
      </inspectionTimes>` : ""}
      ${listing.vendor?.name ? `
      <vendorDetails>
        <name>${escapeXml(listing.vendor.name)}</name>
        ${listing.vendor.phone ? `<telephone type="mobile">${escapeXml(listing.vendor.phone)}</telephone>` : ""}
      </vendorDetails>` : ""}
      ${buildImages(p.images, now)}
      ${buildFloorplans(p.floorplans, now)}
    </residential>`;
  }
  
  // ─────────────────────────────────────────────────────────────
  // RENTAL
  // ─────────────────────────────────────────────────────────────
  function buildRental(listing, agentId, status, now) {
    const p    = listing.property || {};
    const addr = p.address || {};
    const feat = p.features || {};
  
    if (status === "leased" || status === "withdrawn") {
      return `  <rental modTime="${now}" status="${status}">
      <agentID>${escapeXml(agentId)}</agentID>
      <uniqueID>${escapeXml(listing._id.toString())}</uniqueID>
    </rental>`;
    }
  
    return `  <rental modTime="${now}" status="current">
      <agentID>${escapeXml(agentId)}</agentID>
      <uniqueID>${escapeXml(listing._id.toString())}</uniqueID>
      <depositTaken value="no"/>
      ${buildListingAgent(listing.agent)}
      <rent period="week">${p.price || 0}</rent>
      ${p.newConstruction ? "<newConstruction>true</newConstruction>" : ""}
      ${buildAddress(addr)}
      <category name="${escapeXml(p.category || "House")}"/>
      <headline>${escapeXml(p.headline || "")}</headline>
      <description>${escapeXml(p.description || "")}</description>
      ${buildFeatures(feat, p.toggleFeatures, p.otherFeatures)}
      ${buildLandDetails(p.landDetails)}
      ${buildBuildingDetails(p.buildingDetails)}
      ${buildImages(p.images, now)}
      ${buildFloorplans(p.floorplans, now)}
    </rental>`;
  }
  
  // ─────────────────────────────────────────────────────────────
  // COMMERCIAL
  // ─────────────────────────────────────────────────────────────
  function buildCommercial(listing, agentId, status, now) {
    const p    = listing.property || {};
    const addr = p.address || {};
  
    if (status === "sold" || status === "withdrawn") {
      return `  <commercial modTime="${now}" status="${status}">
      <agentID>${escapeXml(agentId)}</agentID>
      <uniqueID>${escapeXml(listing._id.toString())}</uniqueID>
      ${status === "sold" ? `
      <soldDetails>
        <price display="yes">${p.price || 0}</price>
        <date>${now}</date>
      </soldDetails>` : ""}
    </commercial>`;
    }
  
    return `  <commercial modTime="${now}" status="current">
      <agentID>${escapeXml(agentId)}</agentID>
      <uniqueID>${escapeXml(listing._id.toString())}</uniqueID>
      <commercialListingType value="sale"/>
      <underOffer value="no"/>
      ${buildListingAgent(listing.agent)}
      <price display="yes">${p.price || 0}</price>
      ${p.priceView ? `<priceView>${escapeXml(p.priceView)}</priceView>` : ""}
      ${buildAddress(addr)}
      <commercialCategory name="${escapeXml(p.category || "Other")}"/>
      <headline>${escapeXml(p.headline || "")}</headline>
      <description>${escapeXml(p.description || "")}</description>
      ${buildLandDetails(p.landDetails)}
      ${buildBuildingDetails(p.buildingDetails)}
      ${buildImages(p.images, now)}
      ${buildFloorplans(p.floorplans, now)}
    </commercial>`;
  }
  
  // ─────────────────────────────────────────────────────────────
  // LAND
  // ─────────────────────────────────────────────────────────────
  function buildLand(listing, agentId, status, now) {
    const p    = listing.property || {};
    const addr = p.address || {};
  
    if (status === "sold" || status === "withdrawn") {
      return `  <land modTime="${now}" status="${status}">
      <agentID>${escapeXml(agentId)}</agentID>
      <uniqueID>${escapeXml(listing._id.toString())}</uniqueID>
      ${status === "sold" ? `
      <soldDetails>
        <price display="yes">${p.price || 0}</price>
        <date>${now}</date>
      </soldDetails>` : ""}
    </land>`;
    }
  
    return `  <land modTime="${now}" status="current">
      <agentID>${escapeXml(agentId)}</agentID>
      <uniqueID>${escapeXml(listing._id.toString())}</uniqueID>
      <authority value="exclusive"/>
      <underOffer value="no"/>
      ${buildListingAgent(listing.agent)}
      <price display="yes">${p.price || 0}</price>
      ${p.priceView ? `<priceView>${escapeXml(p.priceView)}</priceView>` : ""}
      ${buildAddress(addr)}
      <landCategory name="${escapeXml(p.category || "Residential")}"/>
      <headline>${escapeXml(p.headline || "")}</headline>
      <description>${escapeXml(p.description || "")}</description>
      ${buildLandDetails(p.landDetails)}
      ${buildImages(p.images, now)}
      ${buildFloorplans(p.floorplans, now)}
    </land>`;
  }
  
  // ─────────────────────────────────────────────────────────────
  // RURAL
  // ─────────────────────────────────────────────────────────────
  function buildRural(listing, agentId, status, now) {
    const p    = listing.property || {};
    const addr = p.address || {};
    const feat = p.features || {};
  
    if (status === "sold" || status === "withdrawn") {
      return `  <rural modTime="${now}" status="${status}">
      <agentID>${escapeXml(agentId)}</agentID>
      <uniqueID>${escapeXml(listing._id.toString())}</uniqueID>
      ${status === "sold" ? `
      <soldDetails>
        <price display="yes">${p.price || 0}</price>
        <date>${now}</date>
      </soldDetails>` : ""}
    </rural>`;
    }
  
    return `  <rural modTime="${now}" status="current">
      <agentID>${escapeXml(agentId)}</agentID>
      <uniqueID>${escapeXml(listing._id.toString())}</uniqueID>
      <authority value="exclusive"/>
      <underOffer value="no"/>
      ${buildListingAgent(listing.agent)}
      <price display="yes">${p.price || 0}</price>
      ${p.priceView ? `<priceView>${escapeXml(p.priceView)}</priceView>` : ""}
      ${buildAddress(addr)}
      <ruralCategory name="${escapeXml(p.category || "Cropping")}"/>
      <headline>${escapeXml(p.headline || "")}</headline>
      <description>${escapeXml(p.description || "")}</description>
      ${buildFeatures(feat, p.toggleFeatures, p.otherFeatures)}
      ${buildLandDetails(p.landDetails)}
      ${buildBuildingDetails(p.buildingDetails)}
      ${buildImages(p.images, now)}
      ${buildFloorplans(p.floorplans, now)}
    </rural>`;
  }
  
  module.exports = { generateREAXML };