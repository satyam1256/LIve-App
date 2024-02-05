// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(
    "mongodb+srv://Satyam:DtgwbcblfuekTDQ6@cluster0.engobf0.mongodb.net/",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

const overlaySchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        enum: ["top-left", "top-right", "bottom-left", "bottom-right"],
        required: true,
    },
    size: {
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
    },
    // Add more fields as needed
});

const SettingSchema = new mongoose.Schema({
    volume: {
        type: Number,
        default: 0.5,
        min: 0,
        max: 1,
    },
    // Add more setting fields as needed
});

const Overlay = mongoose.model("Overlay", overlaySchema);
const Setting = mongoose.model("Setting", SettingSchema);

app.use(bodyParser.json());

app.post(
    "/api/overlay",
    [
        body("text").notEmpty().withMessage("Text cannot be empty"),
        body("position")
            .isIn(["top-left", "top-right", "bottom-left", "bottom-right"])
            .withMessage("Invalid position"),
        body("fontSize").isNumeric().withMessage("Font size must be a number"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newOverlay = new Overlay(req.body);
            const savedOverlay = await newOverlay.save();
            res.status(201).json(savedOverlay);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

app.get("/api/overlay", async (req, res) => {
    try {
        const overlays = await Overlay.find();
        res.status(200).json(overlays);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/api/setting", async (req, res) => {
    try {
        const newSetting = new Setting(req.body);
        const savedSetting = await newSetting.save();
        res.status(201).json(savedSetting);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/api/setting", async (req, res) => {
    try {
        const settings = await Setting.find();
        res.status(200).json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
