const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

router.post("/", async (req, res) => {
    try {
        const { title, author, category } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const book = await Book.create({
            title: title.trim(),
            author,
            category
        });

        res.status(201).json({
            message: "Book added successfully",
            book
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


router.get("/", async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 5);

        const skip = (page - 1) * limit;

        const books = await Book.find()
            .skip(skip)
            .limit(limit);

        const total = await Book.countDocuments();

        res.status(200).json({
            books,
            currentPage: page,
            totalRecords: total
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


router.patch("/:id", async (req, res) => {
    try {
        const { availability } = req.body;

        if (typeof availability !== "boolean") {
            return res.status(400).json({
                message: "Availability must be true or false"
            });
        }

        const book = await Book.findByIdAndUpdate(
            req.params.id,
            { availability },
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json({
            message: "Availability updated successfully",
            book
        });
    } catch (error) {
        res.status(400).json({
            message: "Invalid book ID or request",
            error: error.message
        });
    }
});

module.exports = router;
