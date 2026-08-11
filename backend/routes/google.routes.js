const express = require("express");
const path = require("path");
const router = express.Router();

const { getLocationName } = require("../controllers/googleApiController");

router.post('/geocode-address', getLocationName);


module.exports = router;
