const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
    StartTime: { type: Date, default: null },
    EndTime: { type: Date, default: null },
    Outputs: { type: Array, default: [] }
});

const UserDataSchema = new mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    PostureData: { type: DataSchema, default: {} },
    StressData: { type: DataSchema, default: {} },
    CVSData: { type: DataSchema, default: {} },
    HydrationData: { type: DataSchema, default: {} }
}, { timestamps: true });

const ProgressReports = mongoose.model("ProgressReport", UserDataSchema, "ProgressReports"); 

module.exports = ProgressReports;
