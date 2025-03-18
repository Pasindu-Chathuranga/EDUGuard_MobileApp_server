const ProgressReports = require("../model/userData");

class AnalyticsController {
    async getPostureAndStress(req, res) {
        try {

            console.log("Fetching data for user:", req.params.id);
            const data = await ProgressReports.find({ 'UserId': req.params.id }, { PostureData: 1, StressData: 1 });
            console.log("Database response:", data);

            if (!data.length) {
                return res.status(404).json({ success: false, message: "No data found" });
            }

            // Organizing data by start and end dates
            const organizedRecords = data.map(record => ({
                posture: record.PostureData ? {
                    start: record.PostureData.StartTime || null,
                    end: record.PostureData.EndTime || null
                } : null,
                stress: record.StressData ? {
                    start: record.StressData.StartTime || null,
                    end: record.StressData.EndTime || null
                } : null
            }));

            res.json({
                success: true,
                userId,
                records: organizedRecords,
            });

        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    async getHydrationLevels(req, res) {
        try {
            const userId = req.params.id;
            const data = await ProgressReports.find({ UserId: userId }, { HydrationData: 1 });

            if (!data) return res.status(404).json({ success: false, message: "No data found" });

            res.json({
                userId,
                hydrationCount: data.HydrationData?.Outputs?.length || 0,
            });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    async getEyeStateDistribution(req, res) {
        try {
            const userId = req.params.id;
            const data = await ProgressReports.find({ UserId: userId }, { CVSData: 1 });

            if (!data) return res.status(404).json({ success: false, message: "No data found" });

            let eyeStates = { Open: 0, Closed: 0 };

            data.CVSData?.Outputs?.forEach(record => {
                let parsedRecord;
                try {
                    parsedRecord = typeof record === "string" ? JSON.parse(record) : record;
                } catch (error) {
                    console.error("Error parsing record:", error);
                    return;
                }
                if (parsedRecord.eye_state === "Open") eyeStates.Open++;
                else if (parsedRecord.eye_state === "Closed") eyeStates.Closed++;
            });

            res.json(eyeStates);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    async getBlinkCount(req, res) {
        try {
            const userId = req.params.id;
            const data = await ProgressReports.find({ UserId: userId }, { CVSData: 1 });

            if (!data) return res.status(404).json({ success: false, message: "No data found" });

            const blinkData = data.CVSData?.Outputs?.map(record => {
                let parsedRecord;
                try {
                    parsedRecord = JSON.parse(record);
                } catch (error) {
                    console.error("Error parsing record:", error);
                    return null;
                }
                return parsedRecord ? {
                    time: parsedRecord.time || data.CVSData?.StartTime,
                    blinkCount: parsedRecord.blink_count || 0
                } : null;
            }).filter(item => item !== null);

            res.json(blinkData);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    async getPostureStressHeatmap(req, res) {
        try {
            const userId = req.params.id;
            const data = await ProgressReports.find({ UserId: userId }, { PostureData: 1, StressData: 1 });

            if (!data) return res.status(404).json({ success: false, message: "No data found" });

            res.json({
                time: data.PostureData?.StartTime || null,
                posture: data.PostureData?.Outputs?.length || 0,
                stress: data.StressData?.Outputs?.length || 0,
            });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

module.exports = new AnalyticsController();
