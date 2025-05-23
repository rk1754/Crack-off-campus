"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const session_model_1 = __importDefault(require("../models/session.model"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
class SlotController {
    constructor() {
        this.createSlot = async (req, res) => {
            try {
                const { time, title, service_name, description, meeting_duration, price } = req.body;
                if (!time || !title || !description || !meeting_duration || !price) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide all the required fields"
                    });
                    return;
                }
                const admin = req.admin;
                if (!admin) {
                    res.status(401).json({
                        success: false,
                        message: "Unauthorized"
                    });
                    return;
                }
                let imageUrl = undefined;
                if (req.file) {
                    const uploadResult = await cloudinary_1.default.uploader.upload(req.file.path, {
                        folder: "session_slots"
                    });
                    imageUrl = uploadResult.secure_url;
                }
                const session = await session_model_1.default.create({
                    time,
                    title,
                    description,
                    meeting_duration,
                    price,
                    isBooked: false,
                    ratings: 0,
                    admin_id: admin.id,
                    image_url: imageUrl
                });
                res.status(201).json({
                    success: true,
                    message: "Slot created successfully",
                    session
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong"
                });
            }
        };
        this.getAllSlots = async (req, res) => {
            try {
                const slots = await session_model_1.default.findAll();
                if (!slots || slots.length === 0) {
                    res.status(404).json({
                        success: false,
                        message: "No slots found"
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: "Slots fetched successfully",
                    slots
                });
                return;
            }
            catch (err) {
                console.log(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong"
                });
                return;
            }
        };
        this.getSlotById = async (req, res) => {
            try {
                const id = req.params.id;
                if (!id) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide a valid id"
                    });
                    return;
                }
                const slot = await session_model_1.default.findOne({
                    where: {
                        id
                    }
                });
                if (!slot) {
                    res.status(404).json({
                        success: false,
                        message: "Slot not found"
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: "Slot fetched successfully",
                    slot
                });
                return;
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong"
                });
                return;
            }
        };
        this.updateSlot = async (req, res) => {
            try {
                const data = req.body;
                const id = req.params.id;
                if (!id) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide a valid id"
                    });
                    return;
                }
                await session_model_1.default.update(data, {
                    where: {
                        id
                    }
                });
                res.status(200).json({
                    success: true,
                    message: "Slot updated successfully"
                });
                return;
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong"
                });
                return;
            }
        };
        this.deleteSlot = async (req, res) => {
            try {
                const id = req.params.id;
                if (!id) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide a valid id"
                    });
                    return;
                }
                await session_model_1.default.destroy({
                    where: { id }
                });
                res.status(200).json({
                    success: true,
                    message: "Slot deleted successfully"
                });
                return;
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong"
                });
                return;
            }
        };
        this.createSlotsForNextWeek = async (req, res) => {
            try {
                const { title, description, meeting_duration, price } = req.body;
                if (!title || !description || !meeting_duration || !price) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide all the required fields"
                    });
                    return;
                }
                const admin = req.admin;
                if (!admin) {
                    res.status(401).json({
                        success: false,
                        message: "Unauthorized"
                    });
                    return;
                }
                const slots = [];
                const now = new Date();
                const nextWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - now.getDay()));
                const nextWeekEnd = new Date(nextWeekStart);
                nextWeekEnd.setDate(nextWeekStart.getDate() + 7);
                for (let day = new Date(nextWeekStart); day < nextWeekEnd; day.setDate) {
                    const dayStart = new Date(day);
                    dayStart.setHours(21, 0, 0, 0);
                    const dayEnd = new Date(day);
                    dayEnd.setHours(0, 0, 0, 0);
                    for (let time = new Date(dayStart); time < dayEnd; time.setMinutes(time.getMinutes() + 30)) {
                        slots.push({
                            time: new Date(time),
                            title,
                            description,
                            meeting_duration,
                            price,
                            isBooked: false,
                            ratings: 0,
                            admin_id: req.admin?.id
                        });
                    }
                }
                const createdSlots = await session_model_1.default.bulkCreate(slots);
                res.status(201).json({
                    success: true,
                    message: "Slots for the next week created successfully",
                    slots: createdSlots
                });
                return;
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong"
                });
                return;
            }
        };
        this.replicateSlotsToNextWeek = async (req, res) => {
            try {
                const admin = req.admin;
                if (!admin) {
                    res.status(401).json({
                        success: false,
                        message: "Unauthorized"
                    });
                    return;
                }
                const now = new Date();
                const currentWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
                const currentWeekEnd = new Date(currentWeekStart);
                currentWeekEnd.setDate(currentWeekStart.getDate() + 7);
                const currentWeekSlots = await session_model_1.default.findAll({
                    where: {
                        time: {
                            [sequelize_1.Op.between]: [currentWeekStart, currentWeekEnd],
                        },
                        admin_id: admin.id,
                    },
                    raw: true,
                });
                if (!currentWeekSlots || currentWeekSlots.length === 0) {
                    res.status(404).json({
                        success: false,
                        message: "No slots found for the current week"
                    });
                    return;
                }
                const nextWeekSlots = currentWeekSlots.map((slot) => {
                    const nextWeekTime = new Date(slot.time);
                    nextWeekTime.setDate(nextWeekTime.getDate() + 7);
                    return {
                        ...slot,
                        time: nextWeekTime,
                        isBooked: false,
                        ratings: 0,
                    };
                });
                const filteredSlots = nextWeekSlots.map(({ id, createdAt, updatedAt, ...rest }) => rest);
                const createdSlots = await session_model_1.default.bulkCreate(filteredSlots);
                res.status(201).json({
                    success: true,
                    message: "Slots for the next week created successfully",
                    slots: createdSlots
                });
                return;
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong"
                });
                return;
            }
        };
    }
}
;
exports.default = SlotController;
