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
    // Read image file and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");
    const dataUri = `data:image/jpeg;base64,${base64Image}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a skincare expert analyzing a user's face photo. Provide a short, friendly analysis including skin type, visible issues, and general care advice.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Please analyze this skin photo and describe what you see." },
            { type: "image_url", image_url: dataUri },
          ],
        },
      ],
    });

    // Delete temp image
    fs.unlinkSync(imagePath);

    const result = response.choices[0].message.content;
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

export default router;
