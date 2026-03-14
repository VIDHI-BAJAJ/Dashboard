const mongoose = require("mongoose");

const portalIntegrationSchema = new mongoose.Schema({
  agencyId: {
    type: String,
    required: true,
  },

  portal: {
    type: String,
    required: true,
  },

  active: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PortalIntegration", portalIntegrationSchema);