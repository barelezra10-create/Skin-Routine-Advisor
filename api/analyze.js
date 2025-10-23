const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    // Read the body as JSON (expects { image: base64String })
    const body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });
      req.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    });

    const { image } = body;
    if (!image) {
      res.status(400).json({ error: 'No image provided' });
      return;
    }

    // Construct data URI for OpenAI vision
    const dataUri = `data:image/jpeg;base64,${image}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a skincare expert analyzing a user's face photo. Provide a short, friendly analysis including skin type, visible issues, and general care advice.",
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

    const result = response.choices[0].message.content;
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
