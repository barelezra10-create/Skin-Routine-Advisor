import express from "express";
import multer from "multer";
import OpenAI from "openai";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const imagePath = req.file.path;

    const result = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "user", content: "Analyze this image and describe the user's skin type and skincare needs." },
        { role: "user", content: [{ type: "input_image", image_url: fs.createReadStream(imagePath) }] },
      ],
    });

    fs.unlinkSync(imagePath); // delete after analysis

    res.json({ result: result.output_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

export default router;
