/* =====================================================
   LECTURELENS - BACKEND
   STEP 11A - AI NOTES + MULTILINGUAL TRANSLATION
===================================================== */

const express = require("express");
const cors = require("cors");
const path = require("path");

// Load .env from the backend folder
require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// Gemini model
const MODEL = "gemini-3.5-flash-lite";

/* =====================================================
   CHECK API KEY
===================================================== */

if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is missing from backend/.env");
} else {
    console.log("✅ Gemini API key loaded.");
}

/* =====================================================
   HOME ROUTE
===================================================== */

app.get("/", (req, res) => {
    res.json({
        message: "LectureLens AI Backend is running!"
    });
});

/* =====================================================
   GEMINI REST API HELPER
===================================================== */

async function callGemini(prompt) {

    const geminiURL =
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(
            process.env.GEMINI_API_KEY
        )}`;

    const response = await fetch(geminiURL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ]
        })
    });

    const result = await response.json();

    if (!response.ok) {

        console.error("Gemini API error:");
        console.error(result);

        throw new Error(
            result?.error?.message ||
            "Gemini API request failed"
        );
    }

    const aiText =
        result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
        throw new Error(
            "Gemini returned an empty response"
        );
    }

    return aiText;
}

/* =====================================================
   GENERATE AI NOTES
===================================================== */

app.post("/api/generate-notes", async (req, res) => {

    console.log("🔥 AI NOTES ROUTE ACTIVE");

    try {

        const { transcript } = req.body;

        if (!transcript || !transcript.trim()) {

            return res.status(400).json({
                error: "Transcript is required"
            });
        }

        console.log("Transcript received.");
        console.log("Sending transcript to Gemini AI...");

        const prompt = `
You are LectureLens, an AI assistant that converts classroom lecture
transcripts into clear, useful and student-friendly study notes.

Analyze the following lecture transcript.

Return ONLY valid JSON.

Use exactly this structure:

{
  "title": "A suitable title for the lecture",
  "summary": "A clear short summary of the lecture",
  "keyPoints": [
    "Important point 1",
    "Important point 2",
    "Important point 3"
  ],
  "concepts": [
    "Important concept 1",
    "Important concept 2"
  ],
  "definitions": [
    {
      "term": "Term",
      "definition": "Simple definition"
    }
  ],
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3"
  ],
  "flashcards": [
    {
      "question": "Question",
      "answer": "Answer"
    }
  ],
  "quiz": [
    {
      "question": "Question",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": "Correct option"
    }
  ]
}

RULES:

- Use ONLY information supported by the transcript.
- Do not invent facts.
- Keep explanations simple and student-friendly.
- Identify the most important concepts.
- Create useful exam/revision questions.
- Create exactly 5 flashcards when enough information is available.
- Create exactly 5 multiple-choice quiz questions when enough information is available.
- Each quiz question must have 4 options.
- The "answer" must exactly match one of the options.
- Return ONLY valid JSON.
- Do not use markdown code fences.

LECTURE TRANSCRIPT:

${transcript}
`;

        const aiText = await callGemini(prompt);

        console.log("Gemini response received.");

        let notes;

        try {

            let cleanedText = aiText.trim();

            // Remove markdown code fences if Gemini adds them
            if (cleanedText.startsWith("```json")) {

                cleanedText = cleanedText
                    .replace(/^```json\s*/, "")
                    .replace(/\s*```$/, "")
                    .trim();

            } else if (cleanedText.startsWith("```")) {

                cleanedText = cleanedText
                    .replace(/^```\s*/, "")
                    .replace(/\s*```$/, "")
                    .trim();
            }

            notes = JSON.parse(cleanedText);

        } catch (parseError) {

            console.error("❌ AI returned invalid JSON.");

            return res.status(500).json({
                error: "AI returned an invalid response",
                rawResponse: aiText
            });
        }

        console.log("✅ AI notes generated successfully.");

        res.json({

            success: true,

            transcript: transcript,

            notes: notes

        });

    } catch (error) {

        console.error("❌ Gemini notes error:");
        console.error(error);

        res.status(500).json({

            error: "Failed to generate AI notes",

            details: error.message

        });
    }
});

/* =====================================================
   TRANSLATE AI NOTES
===================================================== */

app.post("/api/translate", async (req, res) => {

    console.log("🔥 TRANSLATION ROUTE ACTIVE");

    try {

        const { notes, targetLanguage } = req.body;

        /* ---------------------------------------------
           VALIDATION
        --------------------------------------------- */

        if (!notes) {

            return res.status(400).json({
                error: "Notes are required"
            });
        }

        if (!targetLanguage) {

            return res.status(400).json({
                error: "Target language is required"
            });
        }

        console.log(
            `Translating notes to ${targetLanguage}...`
        );

        /* ---------------------------------------------
           TRANSLATION PROMPT
        --------------------------------------------- */

        const prompt = `
You are LectureLens, an AI translation assistant.

Translate the following lecture notes into ${targetLanguage}.

IMPORTANT RULES:

- Translate naturally and accurately.
- Preserve the exact JSON structure.
- Do not add new fields.
- Do not remove any fields.
- Do not change the meaning.
- Do not invent information.
- Keep technical terms understandable for students.
- Translate the title.
- Translate the summary.
- Translate key points.
- Translate concepts.
- Translate definitions.
- Translate revision questions.
- Translate flashcard questions and answers.
- Translate quiz questions and options.
- Translate the quiz answer consistently.
- The quiz "answer" must still exactly match one of the translated options.
- Keep the transcript translated as well if it exists.
- Return ONLY valid JSON.
- Do not use markdown code fences.

LECTURE NOTES:

${JSON.stringify(notes)}
`;

        /* ---------------------------------------------
           DIRECT GEMINI REST API
           
           This avoids Google Cloud default credentials.
        --------------------------------------------- */

        console.log(
            "Sending translation request directly to Gemini..."
        );

        const aiText = await callGemini(prompt);

        console.log(
            "Gemini translation response received."
        );

        /* ---------------------------------------------
           CLEAN RESPONSE
        --------------------------------------------- */

        let cleanedText = aiText.trim();

        if (cleanedText.startsWith("```json")) {

            cleanedText = cleanedText
                .replace(/^```json\s*/, "")
                .replace(/\s*```$/, "")
                .trim();

        } else if (cleanedText.startsWith("```")) {

            cleanedText = cleanedText
                .replace(/^```\s*/, "")
                .replace(/\s*```$/, "")
                .trim();
        }

        /* ---------------------------------------------
           PARSE TRANSLATION
        --------------------------------------------- */

        let translatedNotes;

        try {

            translatedNotes =
                JSON.parse(cleanedText);

        } catch (parseError) {

            console.error(
                "❌ Gemini returned invalid translation JSON:"
            );

            console.error(cleanedText);

            return res.status(500).json({

                error: "AI returned invalid translation",

                rawResponse: cleanedText

            });
        }

        console.log(
            "✅ Translation generated successfully."
        );

        /* ---------------------------------------------
           SEND RESULT
        --------------------------------------------- */

        res.json({

            success: true,

            targetLanguage: targetLanguage,

            notes: translatedNotes

        });

    } catch (error) {

        console.error(
            "❌ Translation API error:"
        );

        console.error(error);

        res.status(500).json({

            error: "Failed to translate notes",

            details: error.message

        });
    }
});

/* =====================================================
   START SERVER
===================================================== */

app.listen(PORT, () => {

    console.log(
        `LectureLens AI backend running on http://localhost:${PORT}`
    );

});