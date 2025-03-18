const express = require("express");
const router = express.Router();
const AnalyticsController = require("../controller/userData");

router.get("/posture-stress/:id", AnalyticsController.getPostureAndStress);
router.get("/hydration/:id", AnalyticsController.getHydrationLevels);
router.get("/eye-state/:id", AnalyticsController.getEyeStateDistribution);
router.get("/blink-count/:id", AnalyticsController.getBlinkCount);
router.get("/heatmap/:id", AnalyticsController.getPostureStressHeatmap);

module.exports = router;
