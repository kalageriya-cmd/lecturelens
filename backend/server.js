/* =====================================================
   LECTURELENS - BACKEND
   STEP 12B - AI NOTES + TRANSLATION + IMAGE ANALYSIS
===================================================== */

const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const app = express();

const PORT = 5000;
const MODEL = "gemini-3.5-flash-lite";

/* =====================================================
   MIDDLEWARE
===================================================== */

app.use(cors());

app.use(express.json({
    limit: "10mb"
}));


/* =====================================================
   MULTER - IMAGE UPLOAD CONFIGURATION
===================================================== */

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 10 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/jpg"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only PNG, JPG and JPEG images are allowed."
                )
            );
        }
    }
});


/* =====================================================
   CHECK GEMINI API KEY
===================================================== */

if (!process.env.GEMINI_API_KEY) {

    console.error(
        "❌ GEMINI_API_KEY is missing from .env"
    );

} else {

    console.log(
        "✅ Gemini API key loaded."
    );
}


/* =====================================================
   GEMINI TEXT API
===================================================== */

async function callGemini(prompt) {

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error(
            "GEMINI_API_KEY is missing."
        );
    }

    const url =
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url, {

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

        throw new Error(
            result?.error?.message ||
            "Gemini request failed."
        );
    }

    const aiText =
        result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {

        throw new Error(
            "Gemini returned an empty response."
        );
    }

    return aiText;
}


/* =====================================================
   GEMINI IMAGE API
===================================================== */

async function callGeminiWithImage(
    prompt,
    imageBuffer,
    mimeType
) {

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {

        throw new Error(
            "GEMINI_API_KEY is missing."
        );
    }

    const url =
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const base64Image =
        imageBuffer.toString("base64");

    const response = await fetch(url, {

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
                        },

                        {
                            inline_data: {

                                mime_type: mimeType,

                                data: base64Image
                            }
                        }

                    ]
                }

            ]

        })

    });

    const result = await response.json();

    if (!response.ok) {

        throw new Error(
            result?.error?.message ||
            "Gemini image analysis request failed."
        );
    }

    const aiText =
        result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {

        throw new Error(
            "Gemini returned an empty image analysis."
        );
    }

    return aiText;
}


/* =====================================================
   HOME ROUTE
===================================================== */

app.get("/", (req, res) => {

    res.json({
        message:
            "LectureLens AI Backend is running!"
    });

});


/* =====================================================
   GENERATE AI NOTES
===================================================== */

app.post(
    "/api/generate-notes",
    async (req, res) => {

        try {

            const transcript =
                req.body.transcript;

            if (!transcript) {

                return res.status(400).json({
                    error:
                        "Transcript is required."
                });

            }


            const prompt = `
You are LectureLens AI, an educational
note-taking assistant.

Analyze the following classroom lecture transcript.

Create clear, useful and student-friendly study notes.

Return ONLY valid JSON.

Use exactly this structure:

{
  "title": "Short lecture title",
  "summary": "A concise summary of the lecture",
  "keyPoints": [
    "Important point 1",
    "Important point 2",
    "Important point 3"
  ],
  "concepts": [
    "Important concept 1",
    "Important concept 2",
    "Important concept 3"
  ],
  "definitions": [
    {
      "term": "Term",
      "definition": "Simple definition"
    }
  ],
  "revisionQuestions": [
    "Question 1",
    "Question 2",
    "Question 3"
  ]
}

Rules:
- Keep explanations simple.
- Do not invent information.
- Extract important concepts from the transcript.
- Make notes useful for revision.
- Do not use Markdown.
- Return only the JSON object.

LECTURE TRANSCRIPT:

${transcript}
`;


            let aiText =
                await callGemini(prompt);


            aiText = aiText
                .replace(
                    /^```json\s*/i,
                    ""
                )
                .replace(
                    /^```\s*/i,
                    ""
                )
                .replace(
                    /\s*```$/i,
                    ""
                )
                .trim();


            const notes =
                JSON.parse(aiText);


            res.json({

                success: true,

                notes: notes

            });


        } catch (error) {

            console.error(
                "Notes generation error:",
                error
            );

            res.status(500).json({

                error:
                    "Failed to generate notes",

                details:
                    error.message

            });

        }

    }
);


/* =====================================================
   TRANSLATE NOTES
===================================================== */

app.post(
    "/api/translate",
    async (req, res) => {

        try {

            const notes =
                req.body.notes;

            const targetLanguage =
                req.body.targetLanguage;


            if (!notes) {

                return res.status(400).json({

                    error:
                        "Notes are required."

                });

            }


            if (!targetLanguage) {

                return res.status(400).json({

                    error:
                        "Target language is required."

                });

            }


            const prompt = `
You are LectureLens AI.

Translate the following educational notes
into ${targetLanguage}.

IMPORTANT:
- Preserve the exact JSON structure.
- Translate all meaningful text.
- Do not translate JSON property names.
- Keep the content accurate.
- Keep the language simple and student-friendly.
- Do not add or remove information.
- Return ONLY valid JSON.
- Do not use Markdown.

NOTES:

${JSON.stringify(notes)}
`;


            let aiText =
                await callGemini(prompt);


            aiText = aiText
                .replace(
                    /^```json\s*/i,
                    ""
                )
                .replace(
                    /^```\s*/i,
                    ""
                )
                .replace(
                    /\s*```$/i,
                    ""
                )
                .trim();


            const translatedNotes =
                JSON.parse(aiText);


            res.json({

                success: true,

                targetLanguage:
                    targetLanguage,

                notes:
                    translatedNotes

            });


        } catch (error) {

            console.error(
                "Translation error:",
                error
            );

            res.status(500).json({

                error:
                    "Failed to translate notes",

                details:
                    error.message

            });

        }

    }
);


/* =====================================================
   STEP 12B
   AI IMAGE / DIAGRAM ANALYSIS
===================================================== */

app.post(
    "/api/analyze-image",
    upload.single("image"),

    async (req, res) => {

        try {

            /* -----------------------------------------
               CHECK IMAGE
            ----------------------------------------- */

            if (!req.file) {

                return res.status(400).json({

                    error:
                        "No image uploaded."

                });

            }


            /* -----------------------------------------
               AI PROMPT
            ----------------------------------------- */

            const prompt = `
You are an AI assistant inside LectureLens,
an educational accessibility application.

Carefully examine the uploaded image.

The image may contain:

- Educational diagrams
- Flowcharts
- Graphs
- Equations
- ER diagrams
- UML diagrams
- Tables
- Smart-board drawings
- Scientific figures
- Other educational visuals

Identify what is actually visible in the image.

Explain the visual in a simple,
student-friendly way.

Pay close attention to:

- Labels
- Components
- Arrows
- Relationships
- Direction or flow
- Graph axes
- Graph trends
- Equations
- Tables
- Important visual details

Do NOT invent information that is not visible.

If something is unclear,
say that it is unclear.

Create useful revision points.

Also create accessibility-friendly alt text
that clearly describes the visual for a visually
impaired student.

Return ONLY valid JSON.

Use exactly this structure:

{
  "title": "Name or type of the visual",
  "description": "Short description of what the image contains",
  "components": [
    "Important component 1",
    "Important component 2",
    "Important component 3"
  ],
  "explanation": "Simple student-friendly explanation of the visual",
  "keyPoints": [
    "Important point 1",
    "Important point 2",
    "Important point 3"
  ],
  "altText": "A clear accessibility-friendly description of the image"
}

Rules:

- Do not use Markdown.
- Do not put JSON inside code fences.
- Return only the JSON object.
- Do not invent information.
- If something cannot be identified clearly, mention that it is unclear.
`;


            /* -----------------------------------------
               SEND IMAGE TO GEMINI
            ----------------------------------------- */

            let aiText =
                await callGeminiWithImage(

                    prompt,

                    req.file.buffer,

                    req.file.mimetype

                );


            /* -----------------------------------------
               CLEAN GEMINI RESPONSE
            ----------------------------------------- */

            aiText = aiText
                .replace(
                    /^```json\s*/i,
                    ""
                )
                .replace(
                    /^```\s*/i,
                    ""
                )
                .replace(
                    /\s*```$/i,
                    ""
                )
                .trim();


            /* -----------------------------------------
               CONVERT RESPONSE TO JSON
            ----------------------------------------- */

            const analysis =
                JSON.parse(aiText);


            /* -----------------------------------------
               SEND RESULT TO FRONTEND
            ----------------------------------------- */

            res.json({

                success: true,

                analysis:
                    analysis

            });


        } catch (error) {

            console.error(
                "Image analysis error:",
                error
            );

            res.status(500).json({

                error:
                    "Failed to analyze image",

                details:
                    error.message

            });

        }

    }
);


/* =====================================================
   START SERVER
===================================================== */

app.listen(PORT, () => {

    console.log(
        `LectureLens AI backend running on http://localhost:${PORT}`
    );

});