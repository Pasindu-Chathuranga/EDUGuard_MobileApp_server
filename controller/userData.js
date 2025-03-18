const ProgressReports = require("../model/userData");

class AnalyticsController {
    async getPostureAndStress(req, res) {
        try {
            console.log("Fetching data for user:", req.params.id);
            const data = await ProgressReports.find(
                { UserId: req.params.id },
                { PostureData: 1, StressData: 1, createdAt: 1 }
            );

            console.log("Database response:", data);

            if (!data.length) {
                return res.status(404).json({ success: false, message: "No data found" });
            }

            // Filter out records with valid StartTime
            const filteredData = data.filter(item => item.PostureData.StartTime || item.StressData.StartTime);

            // Sort data by StartTime (ascending order)
            const sortedData = filteredData.sort((a, b) => {
                const dateA = new Date(a.PostureData.StartTime || a.StressData.StartTime);
                const dateB = new Date(b.PostureData.StartTime || b.StressData.StartTime);
                return dateA - dateB; // Change to dateB - dateA for descending order
            });

            res.json({
                success: true,
                userId: req.params.id,
                data: sortedData,
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
                success: true,
                userId,
                data: data,
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



            res.json({
                success: true,
                userId,
                data: data,
            });

        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    async getBlinkCount(req, res) {
        try {
            const userId = req.params.id;
            const data = await ProgressReports.find({ UserId: userId }, { CVSData: 1 });

            if (!data) return res.status(404).json({ success: false, message: "No data found" });
            res.json({
                data: data
            });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    async getPostureStressHeatmap(req, res) {
        try {
            const userId = req.params.id;
            const data = await ProgressReports.find({ UserId: userId }, { PostureData: 1, StressData: 1 });

            if (!data) return res.status(404).json({ success: false, message: "No data found" });
            console.log(data)


            res.json({
                success: true,
                userId,
                data: data,
            });

        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

module.exports = new AnalyticsController();
