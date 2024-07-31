const express = require("express");
const { Pool } = require("pg");
const { OpenAI } = require("openai");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT || 5000;

// Initialize PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

app.use(express.json());

// Function to create table if it does not exist
const createTableIfNotExists = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS translations (
      id SERIAL PRIMARY KEY,
      message TEXT,
      language VARCHAR(50),
      model VARCHAR(50),
      corrected_text TEXT,
      translated_text TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log("Table created or already exists.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
};

// Call the function to ensure the table is created when the server starts
createTableIfNotExists();

// Endpoint for translation
app.post("/api/translate", async (req, res) => {
  const { message, language, model } = req.body;
  try {
    // Text Correction
    const correctionResponse = await openai.completions.create({
      model: model || "gpt-3.5-turbo-instruct",
      prompt: `Correct this text: ${message}`,
      temperature: 0.3,
      max_tokens: 100,
    });

    const correctedText = correctionResponse.choices[0].text.trim();

    // Translation
    const translationResponse = await openai.completions.create({
      model: model || "gpt-3.5-turbo-instruct",
      prompt: `Translate this into ${language}: ${correctedText}`,
      temperature: 0.3,
      max_tokens: 100,
    });

    const translatedText = translationResponse.choices[0].text.trim();

    // Store result in PostgreSQL
    await pool.query(
      "INSERT INTO translations (message, language, model, corrected_text, translated_text) VALUES ($1, $2, $3, $4, $5)",
      [message, language, model, correctedText, translatedText]
    );

    res.json({ correctedText, translatedText });
  } catch (error) {
    console.error("Error in translation request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
