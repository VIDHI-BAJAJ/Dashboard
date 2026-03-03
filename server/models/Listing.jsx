const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema(
  {
    // ── Basic ──────────────────────────────────────────────────────
    title:           { type: String, required: true, trim: true },
    listingType:     { type: String, default: "residential" },
    propStyle:       { type: String, default: "House" },
    listingStatus:   { type: String, default: "active" },
    authority:       { type: String, default: "exclusive" },
    underOffer:      { type: String, default: "no" },
    locationArea:    { type: String },
    priceAud:        { type: Number },
    newConstruction: { type: String },

    // ── Agent / Platform IDs ───────────────────────────────────────
    agentName:      { type: String },
    agentMobile:    { type: String },
    agentEmail:     { type: String },
    agencyId:       { type: String },
    agentId:        { type: String },
    reaAgentId:     { type: String },
    uniqueId:       { type: String },
    domainClientId: { type: String },

    // ── Location ───────────────────────────────────────────────────
    subNumber:    { type: String },
    lotNumber:    { type: String },
    streetNum:    { type: String },
    street:       { type: String },
    suburb:       { type: String },
    state:        { type: String },
    postcode:     { type: String },
    municipality: { type: String },

    // ── Property Details ───────────────────────────────────────────
    bedrooms:    { type: Number },
    bathrooms:   { type: Number },
    ensuites:    { type: Number },
    garages:     { type: Number },
    carports:    { type: Number },
    carSpaces:   { type: Number },
    toilets:     { type: Number },
    livingAreas: { type: Number },
    openSpaces:  { type: Number },
    heatingType: { type: String },
    hotWater:    { type: String },

    toggleFeatures: [{ type: String }],
    ecoFeatures:    [{ type: String }],
    views:          [{ type: String }],
    idealFor:       [{ type: String }],

    // ── Size & Build ───────────────────────────────────────────────
    landArea:     { type: Number },
    landUnit:     { type: String, default: "squareMeter" },
    frontage:     { type: Number },
    sqft:         { type: Number },
    buildArea:    { type: Number },
    energyRating: { type: Number },
    floorLevel:   { type: Number },
    furnishing:   { type: String },
    yearBuilt:    { type: Number },

    // ── Pricing ────────────────────────────────────────────────────
    priceView:     { type: String },
    pricePrefix:   { type: String },
    priceFrom:     { type: Number },
    priceTo:       { type: Number },
    priceDisplay:  { type: String, default: "yes" },
    rentPeriod:    { type: String },
    bond:          { type: Number },
    dateAvailable: { type: String },

    // ── Description ────────────────────────────────────────────────
    headline:       { type: String },
    description:    { type: String },
    otherFeatures:  { type: String },
    customFeatures: [{ type: String }],

    // ── Photos (base64 strings) ────────────────────────────────────
    photos: [{ type: String }],

    // ── Schedule ───────────────────────────────────────────────────
    inspStart:   { type: String },
    inspEnd:     { type: String },
    auctionDate: { type: String },
    soldPrice:   { type: Number },
    soldDate:    { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", ListingSchema);