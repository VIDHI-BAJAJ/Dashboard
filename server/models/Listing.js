// // models/Listing.js
// const mongoose = require("mongoose");

// const ListingSchema = new mongoose.Schema(
//   {
//     listingType:  { type: String },
//     status:       { type: String, default: "active" },
//     uniqueID:     { type: String },

//     property: {
//       category:        String,
//       newConstruction: Boolean,
//       address: {
//         subNumber:         String,
//         streetNumber:      String,
//         street:            String,
//         suburb:            String,
//         state:             String,
//         postcode:          String,
//         country:           { type: String, default: "AUS" },
//         hideStreetAddress: Boolean,
//       },
//       price:       String,
//       priceView:   String,
//       headline:    String,
//       description: String,
//       features: {
//         bedrooms:    Number,
//         bathrooms:   Number,
//         ensuite:     Number,
//         garages:     Number,
//         carports:    Number,
//         openSpaces:  Number,
//         toilets:     Number,
//         livingAreas: Number,
//       },
//       landDetails: {
//         area: String,
//         unit: String,
//       },
//       buildingDetails: {
//         area:         String,
//         energyRating: String,
//       },
//       toggleFeatures:         [String],
//       ecoFeatures:            [String],
//       otherFeatures:          String,
//       images:                 [String],   // /api/files/:id URLs
//       floorplans:             [String],
//       statementOfInformation: String,
//       frontPageImage:         String,
//     },

//     vendor: {
//       name:               String,
//       email:              String,
//       phone:              String,
//       sendCampaignReport: Boolean,
//     },

//     agent: {
//       id:     String,
//       name:   String,
//       mobile: String,
//       email:  String,
//     },

//     auction: {
//       date:       String,
//       result:     String,
//       maximumBid: String,
//     },

//     inspection: {
//       start: String,
//       end:   String,
//     },

//     links: {
//       video:         String,
//       onlineTour1:   String,
//       onlineTour2:   String,
//       agencyListing: String,
//     },
//   },
//   rea_portal: {
//     status: {
//       type: String,
//       enum: ['none', 'pending', 'connected', 'timeout'],
//       default: 'none',
//       // none      = user hasn't clicked Setup Sync yet
//       // pending   = user clicked Setup Sync, waiting for REA email
//       // connected = REA email received, button becomes Publish
//       // timeout   = 72hrs passed, no email from REA
//     },
//     ticket_number: {
//       type: String,
//       default: null,
//       // Stores "6384378" from "Ticket #6384378" in REA's email
//       // Useful for support — "Your REA ticket number is #6384378"
//     },
//     sync_initiated_at: {
//       type: Date,
//       default: null,
//       // When user clicked Setup Sync
//     },
//     connected_at: {
//       type: Date,
//       default: null,
//       // When REA email was detected — portal became active
//     },
//     timeout_at: {
//       type: Date,
//       default: null,
//       // When 72hr timeout fired with no REA response
//     },
//   },
//   { timestamps: true }
// );






// module.exports = mongoose.models.Listing || mongoose.model("Listing", ListingSchema);



// models/Listing.js
const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema(
  {
    listingType:  { type: String },
    status:       { type: String, default: "active" },
    uniqueID:     { type: String },

    property: {
      category:        String,
      newConstruction: Boolean,
      address: {
        subNumber:         String,
        streetNumber:      String,
        street:            String,
        suburb:            String,
        state:             String,
        postcode:          String,
        country:           { type: String, default: "AUS" },
        hideStreetAddress: Boolean,
      },
      price:       String,
      priceView:   String,
      headline:    String,
      description: String,
      features: {
        bedrooms:    Number,
        bathrooms:   Number,
        ensuite:     Number,
        garages:     Number,
        carports:    Number,
        openSpaces:  Number,
        toilets:     Number,
        livingAreas: Number,
      },
      landDetails: {
        area: String,
        unit: String,
      },
      buildingDetails: {
        area:         String,
        energyRating: String,
      },
      toggleFeatures:         [String],
      ecoFeatures:            [String],
      otherFeatures:          String,
      images:                 [String],
      floorplans:             [String],
      statementOfInformation: String,
      frontPageImage:         String,
    },

    vendor: {
      name:               String,
      email:              String,
      phone:              String,
      sendCampaignReport: Boolean,
    },

    agent: {
      id:     String,
      name:   String,
      mobile: String,
      email:  String,
    },

    auction: {
      date:       String,
      result:     String,
      maximumBid: String,
    },

    inspection: {
      start: String,
      end:   String,
    },

    links: {
      video:         String,
      onlineTour1:   String,
      onlineTour2:   String,
      agencyListing: String,
    },

    // ── REA portal sync status ──
    // NOTE: rea_portal is NOT used for portal connection status anymore.
    // Portal connection is stored in the Portal model (Portal.js).
    // You can safely remove this block if you don't need per-listing tracking.
    // Keeping it here in case you want to track publish status per listing later.
    rea_portal: {
      status: {
        type: String,
        enum: ["none", "pending", "connected", "timeout"],
        default: "none",
      },
      ticket_number: {
        type: String,
        default: null,
      },
      sync_initiated_at: {
        type: Date,
        default: null,
      },
      connected_at: {
        type: Date,
        default: null,
      },
      timeout_at: {
        type: Date,
        default: null,
      },
    },

  },
  { timestamps: true }  // ← { timestamps } is the SECOND argument to Schema()
);


module.exports = mongoose.models.Listing || mongoose.model("Listing", ListingSchema);