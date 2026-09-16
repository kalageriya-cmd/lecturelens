/* =====================================================
   LECTURELENS - STEP 13
   REAL GEMINI AI + MULTILINGUAL TRANSLATION
   AI DIAGRAM ANALYSIS
   SAVE DIAGRAM ANALYSIS
   ORIGINAL NOTES PRESERVED
===================================================== */

// =====================================================
// SECURITY VERIFICATION
// =====================================================

const securityPage = document.getElementById("securityPage");
const securityPin = document.getElementById("securityPin");
const verifySecurityBtn = document.getElementById("verifySecurityBtn");
const securityError = document.getElementById("securityError");

const SECURITY_PIN = "2007";

if (verifySecurityBtn && securityPin) {

    verifySecurityBtn.addEventListener("click", () => {

        const enteredPin = securityPin.value.trim();

        if (enteredPin === SECURITY_PIN) {

            if (securityPage) {
                securityPage.classList.add("hidden");
            }

            const loginPageElement =
                document.getElementById("loginPage");

            if (loginPageElement) {
                loginPageElement.classList.remove("hidden");
            }

            if (securityError) {
                securityError.textContent = "";
            }

            securityPin.value = "";

        } else {

            if (securityError) {
                securityError.textContent =
                    "❌ Incorrect PIN. Please try again.";
            }

            securityPin.value = "";
            securityPin.focus();
        }

    });


    securityPin.addEventListener("keypress", (event) => {

        if (event.key === "Enter") {
            verifySecurityBtn.click();
        }

    });

}
/* =====================================================
   LOGIN
===================================================== */

const loginPage =
    document.getElementById("loginPage");

const appPage =
    document.getElementById("appPage");

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const rememberMe =
    document.getElementById("rememberMe");

const loginError =
    document.getElementById("loginError");


function showApplication() {

    loginPage.classList.add("hidden");

    appPage.classList.remove("hidden");

    updateDashboardStats();

    loadSavedNotes();

    loadFlashcards();

    loadQuiz();

}


function showLogin() {

    loginPage.classList.remove("hidden");

    appPage.classList.add("hidden");

}


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value.trim();


            if (email && password) {

                loginError.textContent = "";

                if (rememberMe.checked) {

                    localStorage.setItem(
                        "lectureLensLoggedIn",
                        "true"
                    );

                }

                showApplication();

            } else {

                loginError.textContent =
                    "Please enter email and password.";

            }

        }
    );

}


/* =====================================================
   LOGOUT
===================================================== */

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                "lectureLensLoggedIn"
            );

            showLogin();

        }
    );

}


/* =====================================================
   AUTO LOGIN
===================================================== */

if (
    localStorage.getItem(
        "lectureLensLoggedIn"
    ) === "true"
) {

    showApplication();

}


/* =====================================================
   NAVIGATION
===================================================== */

const navButtons =
    document.querySelectorAll(".nav-btn");

const pages =
    document.querySelectorAll(".page");

const pageTitle =
    document.getElementById("pageTitle");

const pageSubtitle =
    document.getElementById("pageSubtitle");


const pageInfo = {

    dashboard: {
        title: "Dashboard",
        subtitle: "Welcome back to LectureLens"
    },

    liveLecture: {
        title: "Live Lecture",
        subtitle: "Capture your lecture in real time"
    },

    notes: {
        title: "My Notes",
        subtitle: "Your smart structured lecture notes"
    },

    flashcards: {
        title: "Flashcards",
        subtitle: "Review important concepts"
    },

    quiz: {
        title: "Quiz",
        subtitle: "Test your understanding"
    },

    accessibility: {
        title: "Accessibility",
        subtitle: "Customize your learning experience"
    }

};


function showPage(pageId) {

    pages.forEach(function(page) {

        page.classList.remove(
            "active-page"
        );

    });


    const selectedPage =
        document.getElementById(pageId);


    if (selectedPage) {

        selectedPage.classList.add(
            "active-page"
        );

    }


    navButtons.forEach(function(button) {

        button.classList.remove(
            "active"
        );


        if (
            button.dataset.page === pageId
        ) {

            button.classList.add(
                "active"
            );

        }

    });


if (
    pageInfo[pageId] &&
    pageTitle &&
    pageSubtitle
) {

    pageTitle.textContent =
        pageInfo[pageId].title;

    pageSubtitle.textContent =
        pageInfo[pageId].subtitle;

}

}


navButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            showPage(
                button.dataset.page
            );

        }
    );

});


/* =====================================================
   QUICK ACTIONS
===================================================== */

document
    .querySelectorAll(".quick-btn")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                showPage(
                    button.dataset.pageTarget
                );

            }
        );

    });


/* =====================================================
   DASHBOARD START
===================================================== */

const dashboardStartBtn =
    document.getElementById(
        "dashboardStartBtn"
    );


if (dashboardStartBtn) {

    dashboardStartBtn.addEventListener(
        "click",
        function() {

            showPage("liveLecture");

        }
    );

}


/* =====================================================
   LIVE SPEECH RECOGNITION
===================================================== */

const startLectureBtn =
    document.getElementById(
        "startLectureBtn"
    );

const stopLectureBtn =
    document.getElementById(
        "stopLectureBtn"
    );

const transcriptBox =
    document.getElementById(
        "transcript"
    );

const lectureStatus =
    document.getElementById(
        "lectureStatus"
    );

const recordingIndicator =
    document.getElementById(
        "recordingIndicator"
    );

const languageSelect =
    document.getElementById(
        "languageSelect"
    );


let recognition = null;

let isListening = false;

let finalTranscript = "";


const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (
    SpeechRecognition &&
    startLectureBtn &&
    stopLectureBtn
) {

    recognition =
        new SpeechRecognition();

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang =
        languageSelect
            ? languageSelect.value
            : "en-IN";


    recognition.onstart =
        function() {

            isListening = true;


            if (lectureStatus) {

                lectureStatus.textContent =
                    "🔴 Listening...";

            }


            if (recordingIndicator) {

                recordingIndicator.style.opacity =
                    "1";

            }


            startLectureBtn.disabled =
                true;

            stopLectureBtn.disabled =
                false;

        };


    recognition.onresult =
        function(event) {

            let interimTranscript = "";


            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                const text =
                    event.results[i][0]
                        .transcript;


                if (
                    event.results[i].isFinal
                ) {

                    finalTranscript +=
                        text + " ";

                } else {

                    interimTranscript +=
                        text;

                }

            }


            if (transcriptBox) {

                transcriptBox.textContent =
                    finalTranscript +
                    interimTranscript;

            }

        };


    recognition.onerror =
        function(event) {

            console.log(
                "Speech recognition error:",
                event.error
            );


            if (lectureStatus) {

                if (
                    event.error ===
                    "not-allowed"
                ) {

                    lectureStatus.textContent =
                        "❌ Microphone permission denied.";

                } else {

                    lectureStatus.textContent =
                        "⚠️ Speech recognition error.";

                }

            }

        };


    recognition.onend =
        function() {

            if (isListening) {

                try {

                    recognition.start();

                } catch (error) {

                    console.log(error);

                }

            }

        };

}


/* =====================================================
   START LECTURE
===================================================== */

if (startLectureBtn) {

    startLectureBtn.addEventListener(
        "click",
        function() {

            if (!recognition) {

                alert(
                    "Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge."
                );

                return;

            }


            finalTranscript = "";


            if (transcriptBox) {

                transcriptBox.textContent =
                    "Listening to your lecture...";

            }


            recognition.lang =
                languageSelect
                    ? languageSelect.value
                    : "en-IN";


            try {

                recognition.start();

            } catch (error) {

                console.log(error);

            }

        }
    );

}


/* =====================================================
   STOP LECTURE
===================================================== */

if (stopLectureBtn) {

    stopLectureBtn.addEventListener(
        "click",
        function() {

            isListening = false;


            if (recognition) {

                recognition.stop();

            }


            if (lectureStatus) {

                lectureStatus.textContent =
                    "🟢 Lecture stopped";

            }


            if (recordingIndicator) {

                recordingIndicator.style.opacity =
                    "0.3";

            }


            startLectureBtn.disabled =
                false;

            stopLectureBtn.disabled =
                true;


            if (
                finalTranscript.trim().length > 0
            ) {

                alert(
                    "Lecture captured! Now click 'Generate Smart Notes'."
                );

            }

        }
    );

}


/* =====================================================
   SPEECH LANGUAGE
===================================================== */

if (languageSelect) {

    languageSelect.addEventListener(
        "change",
        function() {

            if (recognition) {

                recognition.lang =
                    languageSelect.value;

            }

        }
    );

}


/* =====================================================
   SAVE NOTES
===================================================== */

function saveNotes(notes) {

    localStorage.setItem(
        "lectureLensSmartNotes",
        JSON.stringify(notes)
    );

}


/* =====================================================
   SAVE ORIGINAL NOTES
===================================================== */

function saveOriginalNotes(notes) {

    localStorage.setItem(
        "lectureLensOriginalNotes",
        JSON.stringify(notes)
    );

}


/* =====================================================
   LOAD SAVED NOTES
===================================================== */

function loadSavedNotes() {

    const saved =
        localStorage.getItem(
            "lectureLensSmartNotes"
        );


    if (!saved) return;


    try {

        const notes =
            JSON.parse(saved);

        displayNotes(notes);

    } catch (error) {

        console.log(error);

    }

}


/* =====================================================
   AI NOTE GENERATION
===================================================== */

const generateNotesBtn =
    document.getElementById(
        "generateNotesBtn"
    );

const regenerateNotesBtn =
    document.getElementById(
        "regenerateNotesBtn"
    );


/* =====================================================
   GLOBAL LEARNING LANGUAGE
===================================================== */

let selectedLanguage =
    localStorage.getItem(
        "lectureLensLanguage"
    ) || "English";


const notesLanguageSelect =
    document.getElementById(
        "notesLanguageSelect"
    );


if (notesLanguageSelect) {

    notesLanguageSelect.value =
        selectedLanguage;


    if (
        notesLanguageSelect.value !==
        selectedLanguage
    ) {

        selectedLanguage =
            notesLanguageSelect.value ||
            "English";

    }


    notesLanguageSelect.addEventListener(
        "change",
        function() {

            selectedLanguage =
                this.value || "English";


            localStorage.setItem(
                "lectureLensLanguage",
                selectedLanguage
            );

        }
    );

}


/* =====================================================
   GENERATE SMART NOTES
===================================================== */

async function generateSmartNotes() {

    let text =
        finalTranscript.trim();


    if (!text && transcriptBox) {

        const existing =
            transcriptBox.textContent.trim();


        if (
            existing &&
            existing !==
                "Your transcript will appear here..." &&
            existing !==
                "Listening to your lecture..."
        ) {

            text = existing;

        }

    }


    if (!text) {

        alert(
            "Please record a lecture first."
        );

        return;

    }


    const buttons = [

        generateNotesBtn,

        regenerateNotesBtn

    ];


    buttons.forEach(function(button) {

        if (button) {

            button.disabled = true;

            button.dataset.originalText =
                button.textContent;

            button.textContent =
                "🤖 Generating AI Notes...";

        }

    });


    try {

        console.log(
            "Sending transcript to Gemini AI..."
        );


        const response =
            await fetch(
                "http://localhost:5000/api/generate-notes",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        transcript:
                            text,

                        targetLanguage:
                            selectedLanguage

                    })

                }
            );


        const data =
            await response.json();


        console.log(
            "Backend response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.details ||
                data.error ||
                "AI request failed"
            );

        }


        const aiNotes =
            data.notes;


        if (!aiNotes) {

            throw new Error(
                "Backend did not return AI notes."
            );

        }


        const notes = {

            title:
                aiNotes.title ||
                "Lecture Notes",


            date:
                new Date()
                    .toLocaleString(),


            summary:
                aiNotes.summary ||
                "No summary generated.",


            keyPoints:
                Array.isArray(
                    aiNotes.keyPoints
                )
                    ? aiNotes.keyPoints
                    : [],


            concepts:
                Array.isArray(
                    aiNotes.concepts
                )
                    ? aiNotes.concepts
                    : [],


            definitions:
                Array.isArray(
                    aiNotes.definitions
                )
                    ? aiNotes.definitions
                    : [],


            questions:
                Array.isArray(
                    aiNotes.questions
                )
                    ? aiNotes.questions
                    : (
                        Array.isArray(
                            aiNotes.revisionQuestions
                        )
                            ? aiNotes.revisionQuestions
                            : []
                    ),


            flashcards:
                Array.isArray(
                    aiNotes.flashcards
                )
                    ? aiNotes.flashcards
                    : [],


            quiz:
                Array.isArray(
                    aiNotes.quiz
                )
                    ? aiNotes.quiz
                    : [],


            transcript:
                data.transcript ||
                text,


            translatedLanguage:
                selectedLanguage

        };


        saveOriginalNotes(
            notes
        );


        saveNotes(
            notes
        );


        displayNotes(
            notes
        );


        createFlashcards(
            notes
        );


        createQuiz(
            notes
        );


        updateDashboardStats();


        showPage("notes");


        console.log(
            "✅ AI notes generated successfully in:",
            selectedLanguage
        );

    } catch (error) {

        console.error(
            "AI connection error:",
            error
        );


        alert(
            "❌ Could not generate AI notes.\n\n" +
            error.message
        );

    } finally {

        buttons.forEach(function(button) {

            if (button) {

                button.disabled =
                    false;

                button.textContent =
                    button.dataset.originalText ||
                    "Generate Smart Notes";

            }

        });

    }

}


/* =====================================================
   NOTE BUTTONS
===================================================== */

if (generateNotesBtn) {

    generateNotesBtn.addEventListener(
        "click",
        generateSmartNotes
    );

}


if (regenerateNotesBtn) {

    regenerateNotesBtn.addEventListener(
        "click",
        generateSmartNotes
    );

}

/* =====================================================
   MULTILINGUAL UI TEXT
===================================================== */

const uiText = {

    English: {
        summary: "Summary",
        keyPoints: "Key Points",
        concepts: "Important Concepts",
        definitions: "Definitions",
        revisionQuestions: "Revision Questions",
        transcript: "Transcript",

        flashcards: "Flashcards",
        clickToFlip: "Click a card to flip it",
        card: "Card",
        answer: "Answer",

        quiz: "Quiz",
        yourScore: "Your score"
    },

    Hindi: {
        summary: "सारांश",
        keyPoints: "मुख्य बिंदु",
        concepts: "महत्वपूर्ण अवधारणाएँ",
        definitions: "परिभाषाएँ",
        revisionQuestions: "पुनरावृत्ति प्रश्न",
        transcript: "प्रतिलेख",

        flashcards: "फ्लैशकार्ड",
        clickToFlip: "कार्ड पलटने के लिए क्लिक करें",
        card: "कार्ड",
        answer: "उत्तर",

        quiz: "प्रश्नोत्तरी",
        yourScore: "आपका स्कोर"
    },

    Kannada: {
        summary: "ಸಾರಾಂಶ",
        keyPoints: "ಮುಖ್ಯ ಅಂಶಗಳು",
        concepts: "ಪ್ರಮುಖ ಪರಿಕಲ್ಪನೆಗಳು",
        definitions: "ವ್ಯಾಖ್ಯಾನಗಳು",
        revisionQuestions: "ಪುನರವಲೋಕನ ಪ್ರಶ್ನೆಗಳು",
        transcript: "ಪ್ರತಿಲಿಪಿ",

        flashcards: "ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್‌ಗಳು",
        clickToFlip: "ಕಾರ್ಡ್ ತಿರುಗಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
        card: "ಕಾರ್ಡ್",
        answer: "ಉತ್ತರ",

        quiz: "ಪ್ರಶ್ನೋತ್ತರ",
        yourScore: "ನಿಮ್ಮ ಅಂಕ"
    },

    Marathi: {
        summary: "सारांश",
        keyPoints: "महत्त्वाचे मुद्दे",
        concepts: "महत्त्वाच्या संकल्पना",
        definitions: "व्याख्या",
        revisionQuestions: "पुनरावलोकन प्रश्न",
        transcript: "लिप्यंतरण",

        flashcards: "फ्लॅशकार्ड्स",
        clickToFlip: "कार्ड उलटण्यासाठी क्लिक करा",
        card: "कार्ड",
        answer: "उत्तर",

        quiz: "प्रश्नमंजुषा",
        yourScore: "तुमचा गुण"
    },

    Telugu: {
        summary: "సారాంశం",
        keyPoints: "ముఖ్య అంశాలు",
        concepts: "ముఖ్యమైన భావనలు",
        definitions: "నిర్వచనాలు",
        revisionQuestions: "పునశ్చరణ ప్రశ్నలు",
        transcript: "ట్రాన్స్‌క్రిప్ట్",

        flashcards: "ఫ్లాష్‌కార్డులు",
        clickToFlip: "కార్డ్‌ను తిప్పడానికి క్లిక్ చేయండి",
        card: "కార్డ్",
        answer: "సమాధానం",

        quiz: "క్విజ్",
        yourScore: "మీ స్కోర్"
    },

    Tamil: {
        summary: "சுருக்கம்",
        keyPoints: "முக்கிய குறிப்புகள்",
        concepts: "முக்கிய கருத்துகள்",
        definitions: "வரையறைகள்",
        revisionQuestions: "மறுபரிசீலனை கேள்விகள்",
        transcript: "படியெடுத்த உரை",

        flashcards: "ஃப்ளாஷ்கார்டுகள்",
        clickToFlip: "கார்டைத் திருப்ப கிளிக் செய்யவும்",
        card: "கார்டு",
        answer: "பதில்",

        quiz: "வினாடி வினா",
        yourScore: "உங்கள் மதிப்பெண்"
    }
};


/* =====================================================
   DISPLAY NOTES
===================================================== */

function displayNotes(notes) {

    const container =
        document.getElementById(
            "notesContent"
        );


    if (!container) return;


    const definitions =
        Array.isArray(notes.definitions)
            ? notes.definitions
            : [];


    const keyPoints =
        Array.isArray(notes.keyPoints)
            ? notes.keyPoints
            : [];


    const concepts =
        Array.isArray(notes.concepts)
            ? notes.concepts
            : [];


    const questions =
        Array.isArray(notes.questions)
            ? notes.questions
            : [];


    container.innerHTML = `

        <div class="notes-wrapper">

            <div class="note-header">

                <h2>
                    ${escapeHTML(
                        notes.title ||
                        "Lecture Notes"
                    )}
                </h2>

                <small>
                    Generated on
                    ${escapeHTML(
                        notes.date || ""
                    )}
                </small>

                ${
                    notes.translatedLanguage &&
                    notes.translatedLanguage !== "English"
                        ? `
                            <small>
                                🌐 ${escapeHTML(
                                    notes.translatedLanguage
                                )}
                            </small>
                          `
                        : ""
                }

            </div>


            <div class="note-section">

                <h3>📌 ${uiText[notes.translatedLanguage || "English"].summary}</h3>

                <p>
                    ${escapeHTML(
                        notes.summary || ""
                    )}
                </p>

            </div>


            <div class="note-section">

                <h3>🔑 ${uiText[notes.translatedLanguage || "English"].keyPoints}</h3>

                ${
                    keyPoints.length > 0

                    ?

                    `<ul>

                        ${
                            keyPoints
                                .map(
                                    point =>
                                        `<li>
                                            ${escapeHTML(point)}
                                        </li>`
                                )
                                .join("")
                        }

                    </ul>`

                    :

                    `<p>
                        No key points generated.
                    </p>`
                }

            </div>


            <div class="note-section">

                <h3>💡 ${uiText[notes.translatedLanguage || "English"].concepts}</h3>

                ${
                    concepts.length > 0

                    ?

                    `<div class="concept-tags">

                        ${
                            concepts
                                .map(
                                    concept =>
                                        `<span class="concept-tag">
                                            ${escapeHTML(concept)}
                                        </span>`
                                )
                                .join("")
                        }

                    </div>`

                    :

                    `<p>
                        No concepts generated.
                    </p>`
                }

            </div>


            <div class="note-section">

                <h3>📖 ${uiText[notes.translatedLanguage || "English"].definitions}</h3>

                ${
                    definitions.length > 0

                    ?

                    definitions
                        .map(
                            definition => {

                                if (
                                    typeof definition ===
                                    "object"
                                ) {

                                    return `

                                        <div class="question-card">

                                            <strong>
                                                ${escapeHTML(
                                                    definition.term ||
                                                    ""
                                                )}
                                            </strong>

                                            <p>
                                                ${escapeHTML(
                                                    definition.definition ||
                                                    ""
                                                )}
                                            </p>

                                        </div>

                                    `;

                                }


                                return `

                                    <div class="question-card">

                                        ${escapeHTML(
                                            definition
                                        )}

                                    </div>

                                `;

                            }
                        )
                        .join("")

                    :

                    `<p>
                        No definitions generated.
                    </p>`
                }

            </div>


            <div class="note-section">

                <h3>❓ ${uiText[notes.translatedLanguage || "English"].revisionQuestions}</h3>

                ${
                    questions.length > 0

                    ?

                    `<ul>

                        ${
                            questions
                                .map(
                                    question =>
                                        `<li>
                                            ${escapeHTML(
                                                question
                                            )}
                                        </li>`
                                )
                                .join("")
                        }

                    </ul>`

                    :

                    `<p>
                        No revision questions generated.
                    </p>`
                }

            </div>


            <div class="note-section">

                <h3>🎙️ ${uiText[notes.translatedLanguage || "English"].transcript}</h3>

                <p>
                    ${escapeHTML(
                        notes.transcript || ""
                    )}
                </p>

            </div>

        </div>

    `;

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(text) {

    if (
        text === null ||
        text === undefined
    ) {

        return "";

    }


    return String(text)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   FLASHCARDS
===================================================== */

function createFlashcards(notes) {

    let flashcards = [];


    if (
        Array.isArray(notes.flashcards) &&
        notes.flashcards.length > 0
    ) {

        flashcards =
            notes.flashcards

                .map(card => ({

                    question:
                        card.question ||
                        "",

                    answer:
                        card.answer ||
                        ""

                }))

                .filter(
                    card =>
                        card.question &&
                        card.answer
                );

    }


    if (flashcards.length === 0) {

        flashcards =
            (notes.concepts || [])
                .slice(0, 8)
                .map(concept => {

                    const related =
                        (notes.keyPoints || [])
                            .find(
                                point =>
                                    String(point)
                                        .toLowerCase()
                                        .includes(
                                            String(concept)
                                                .toLowerCase()
                                        )
                            );


                    return {

                        question:
                            `What is ${concept}?`,

                        answer:
                            related ||
                            `Review the lecture section about ${concept}.`

                    };

                });

    }


    localStorage.setItem(
        "lectureLensFlashcards",
        JSON.stringify(
            flashcards
        )
    );


    displayFlashcards(
        flashcards
    );

}


/* =====================================================
   LOAD FLASHCARDS
===================================================== */

function loadFlashcards() {

    const saved =
        localStorage.getItem(
            "lectureLensFlashcards"
        );


    if (!saved) return;


    try {

        displayFlashcards(
            JSON.parse(saved)
        );

    } catch (error) {

        console.log(error);

    }

}


/* =====================================================
   FLASHCARDS
===================================================== */

function createFlashcards(notes) {

    let flashcards = [];

    /* -----------------------------------------
       USE AI GENERATED FLASHCARDS
    ----------------------------------------- */

    if (
        Array.isArray(notes.flashcards) &&
        notes.flashcards.length > 0
    ) {

        flashcards =
            notes.flashcards
                .map(card => ({
                    question:
                        card.question ||
                        "",

                    answer:
                        card.answer ||
                        ""
                }))
                .filter(
                    card =>
                        card.question &&
                        card.answer
                );
    }

    /* =====================================================
   DISPLAY FLASHCARDS
===================================================== */

function displayFlashcards(cards) {

    const container =
        document.getElementById(
            "flashcardContainer"
        );

    if (!container) return;

    if (
        !cards ||
        cards.length === 0
    ) {
        return;
    }

    container.innerHTML = `
        <p class="flashcard-number">
            ${uiText[selectedLanguage || "English"].clickToFlip}
        </p>

        ${
            cards
                .map(
                    (card, index) => `
                        <div
                            class="flashcard"
                            onclick="this.classList.toggle('flipped')"
                        >

                            <div class="flashcard-inner">

                                <div class="flashcard-front">

                                    <div>

                                        <small>
                                            ${uiText[selectedLanguage || "English"].card} ${index + 1}
                                        </small>

                                        <h2>
                                            ${escapeHTML(
                                                card.question
                                            )}
                                        </h2>

                                    </div>

                                </div>


                                <div class="flashcard-back">

                                    <div>

                                        <h3>
                                           ${uiText[selectedLanguage || "English"].answer}
                                        </h3>

                                        <p>
                                            ${escapeHTML(
                                                card.answer
                                            )}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>
                    `
                )
                .join("")
        }
    `;
}

    /* -----------------------------------------
       FALLBACK FLASHCARDS
       IN SELECTED LANGUAGE
    ----------------------------------------- */

    if (flashcards.length === 0) {

        const language =
            notes.translatedLanguage ||
            (notesLanguageSelect
                ? notesLanguageSelect.value
                : "English");


        const fallbackText = {

            English: {
                question: concept =>
                    `What is ${concept}?`,

                answer: concept =>
                    `Review the lecture section about ${concept}.`
            },

            Hindi: {
                question: concept =>
                    `${concept} क्या है?`,

                answer: concept =>
                    `${concept} के बारे में व्याख्यान के भाग को दोहराएँ।`
            },

            Kannada: {
                question: concept =>
                    `${concept} ಎಂದರೇನು?`,

                answer: concept =>
                    `${concept} ಬಗ್ಗೆ ಉಪನ್ಯಾಸದ ಭಾಗವನ್ನು ಪರಿಶೀಲಿಸಿ.`
            },

            Telugu: {
                question: concept =>
                    `${concept} అంటే ఏమిటి?`,

                answer: concept =>
                    `${concept} ಕುರಿತು ಉಪన్యాసంలోని భాగాన్ని సమీక్షించండి.`
            },

            Tamil: {
                question: concept =>
                    `${concept} என்றால் என்ன?`,

                answer: concept =>
                    `${concept} பற்றிய விரிவுரை பகுதியை மீண்டும் பார்க்கவும்.`
            },

            Marathi: {
                question: concept =>
                    `${concept} म्हणजे काय?`,

                answer: concept =>
                    `${concept} பற்றிய व्याख्यानाचा भाग पुन्हा पहा.`
            }
        };


        const selectedText =
            fallbackText[language] ||
            fallbackText.English;


        flashcards =
            (notes.concepts || [])
                .slice(0, 8)
                .map(concept => {

                    const related =
                        (notes.keyPoints || [])
                            .find(
                                point =>
                                    point
                                        .toLowerCase()
                                        .includes(
                                            concept.toLowerCase()
                                        )
                            );


                    return {

                        question:
                            selectedText.question(
                                concept
                            ),

                        answer:
                            related ||
                            selectedText.answer(
                                concept
                            )
                    };

                });
    }


    /* -----------------------------------------
       SAVE FLASHCARDS
    ----------------------------------------- */

    localStorage.setItem(
        "lectureLensFlashcards",
        JSON.stringify(
            flashcards
        )
    );


    displayFlashcards(
        flashcards
    );

}
/* =====================================================
   QUIZ
===================================================== */

function createQuiz(notes) {

    let questions = [];


    if (
        Array.isArray(notes.quiz) &&
        notes.quiz.length > 0
    ) {

        questions =
            notes.quiz

                .map(q => {

                    const correctAnswer =
                        q.answer;

                    let answerIndex =
                        -1;


                    if (
                        Array.isArray(
                            q.options
                        )
                    ) {

                        answerIndex =
                            q.options.findIndex(
                                option =>
                                    String(option)
                                        .trim()
                                        .toLowerCase() ===
                                    String(correctAnswer)
                                        .trim()
                                        .toLowerCase()
                            );

                    }


                    return {

                        question:
                            q.question ||
                            "",

                        options:
                            Array.isArray(
                                q.options
                            )
                                ? q.options
                                : [],

                        answer:
                            answerIndex >= 0
                                ? answerIndex
                                : 0

                    };

                })

                .filter(
                    q =>
                        q.question &&
                        q.options.length >= 2
                );

    }


    if (questions.length === 0) {
    const quizTexts = {
        English: {
            question: "Which concept was discussed in the lecture?",
            unrelated: "Unrelated topic",
            random: "Random concept",
            none: "None of these"
        },

        Hindi: {
            question: "व्याख्यान में किस अवधारणा पर चर्चा की गई?",
            unrelated: "असंबंधित विषय",
            random: "यादृच्छिक अवधारणा",
            none: "इनमें से कोई नहीं"
        },

        Kannada: {
            question: "ಉಪನ್ಯಾಸದಲ್ಲಿ ಯಾವ ಪರಿಕಲ್ಪನೆಯನ್ನು ಚರ್ಚಿಸಲಾಯಿತು?",
            unrelated: "ಸಂಬಂಧವಿಲ್ಲದ ವಿಷಯ",
            random: "ಯಾದೃಚ್ಛಿಕ ಪರಿಕಲ್ಪನೆ",
            none: "ಇವುಗಳಲ್ಲಿ ಯಾವುದೂ ಅಲ್ಲ"
        },

        Telugu: {
            question: "ఉపన్యాసంలో ఏ భావన గురించి చర్చించారు?",
            unrelated: "సంబంధం లేని విషయం",
            random: "యాదృచ్ఛిక భావన",
            none: "వీటిలో ఏదీ కాదు"
        },

        Tamil: {
            question: "விரிவுரையில் எந்த கருத்து விவாதிக்கப்பட்டது?",
            unrelated: "தொடர்பில்லாத தலைப்பு",
            random: "சீரற்ற கருத்து",
            none: "இவற்றில் எதுவுமில்லை"
        },

        Marathi: {
            question: "व्याख्यानात कोणत्या संकल्पनेवर चर्चा करण्यात आली?",
            unrelated: "असंबंधित विषय",
            random: "यादृच्छिक संकल्पना",
            none: "यापैकी कोणतेही नाही"
        }
    };

    const texts = quizTexts[selectedLanguage] || quizTexts.English;

    (notes.concepts || [])
        .slice(0, 5)
        .forEach(concept => {
            questions.push({
                question: texts.question,
                options: [
                    concept,
                    texts.unrelated,
                    texts.random,
                    texts.none
                ],
                answer: 0
            });
        });
}

    localStorage.setItem(
        "lectureLensQuiz",
        JSON.stringify(
            questions
        )
    );


    displayQuiz(
        questions
    );

}


/* =====================================================
   LOAD QUIZ
===================================================== */

function loadQuiz() {

    const saved =
        localStorage.getItem(
            "lectureLensQuiz"
        );


    if (!saved) return;


    try {

        displayQuiz(
            JSON.parse(saved)
        );

    } catch (error) {

        console.log(error);

    }

}


/* =====================================================
   DISPLAY QUIZ
===================================================== */

function displayQuiz(questions) {

    const container =
        document.getElementById(
            "quizContainer"
        );


    if (!container) return;


    if (
        !questions ||
        questions.length === 0
    ) {

        return;

    }


    let score = 0;

    let answered = 0;


    container.innerHTML = `

        <div
            id="quizScore"
            class="quiz-result"
            style="display:none"
        >
        </div>


        ${
            questions
                .map(
                    (q, index) => `

                        <div
                            class="quiz-question"
                            data-question="${index}"
                        >

                            <h3>

                                ${index + 1}.

                                ${escapeHTML(
                                    q.question
                                )}

                            </h3>


                            ${
                                q.options
                                    .map(
                                        (
                                            option,
                                            optionIndex
                                        ) => `

                                            <button
                                                class="quiz-option"
                                                data-question="${index}"
                                                data-option="${optionIndex}"
                                            >

                                                ${escapeHTML(
                                                    option
                                                )}

                                            </button>

                                        `
                                    )
                                    .join("")
                            }

                        </div>

                `
                )
                .join("")
        }

    `;


    document
        .querySelectorAll(
            ".quiz-option"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        const questionIndex =
                            Number(
                                button.dataset.question
                            );


                        const optionIndex =
                            Number(
                                button.dataset.option
                            );


                        const question =
                            questions[
                                questionIndex
                            ];


                        const parent =
                            button.closest(
                                ".quiz-question"
                            );


                        if (
                            parent.dataset.answered
                        ) {

                            return;

                        }


                        parent.dataset.answered =
                            "true";


                        const allOptions =
                            parent.querySelectorAll(
                                ".quiz-option"
                            );


                        allOptions.forEach(
                            option => {

                                option.disabled =
                                    true;

                            }
                        );


                        if (
                            optionIndex ===
                            question.answer
                        ) {

                            button.style.background =
                                "#dff5e3";

                            score++;

                        } else {

                            button.style.background =
                                "#ffe1e1";


                            const correctButton =
                                parent.querySelector(
                                    `[data-option="${question.answer}"]`
                                );


                            if (correctButton) {

                                correctButton.style.background =
                                    "#dff5e3";

                            }

                        }


                        answered++;


                        if (
                            answered ===
                            questions.length
                        ) {

                            const result =
                                document.getElementById(
                                    "quizScore"
                                );


                            if (result) {

                                result.style.display =
                                    "block";


                                const language =
    selectedLanguage || "English";

const text =
    uiText[language] || uiText.English;

result.textContent =
    `🎉 ${text.yourScore}: ${score}/${questions.length}`;

                            }

                        }

                    }
                );

            }
        );

}

/* =====================================================
   TRANSLATION
===================================================== */

const translateNotesBtn =
    document.getElementById(
        "translateNotesBtn"
    );

const translationStatus =
    document.getElementById(
        "translationStatus"
    );


if (translateNotesBtn) {

    translateNotesBtn.addEventListener(
        "click",
        translateNotes
    );

}


/* =====================================================
   TRANSLATE NOTES
===================================================== */

async function translateNotes() {

    let originalNotes = null;


    const originalSaved =
        localStorage.getItem(
            "lectureLensOriginalNotes"
        );


    if (originalSaved) {

        try {

            originalNotes =
                JSON.parse(
                    originalSaved
                );

        } catch (error) {

            console.log(
                "Could not parse original notes:",
                error
            );

        }

    }


    if (!originalNotes) {

        const currentSaved =
            localStorage.getItem(
                "lectureLensSmartNotes"
            );


        if (!currentSaved) {

            alert(
                "Please generate AI notes first."
            );

            return;

        }


        try {

            originalNotes =
                JSON.parse(
                    currentSaved
                );


            saveOriginalNotes(
                originalNotes
            );

        } catch (error) {

            alert(
                "Could not load your saved notes."
            );

            return;

        }

    }


    const targetLanguage =
        notesLanguageSelect
            ? notesLanguageSelect.value
            : selectedLanguage || "English";


    selectedLanguage =
        targetLanguage;


    localStorage.setItem(
        "lectureLensLanguage",
        selectedLanguage
    );


    if (
        targetLanguage ===
        "English"
    ) {

        const restoredNotes = {

            ...originalNotes,

            translatedLanguage:
                null,

            date:
                new Date()
                    .toLocaleString()

        };


        saveNotes(
            restoredNotes
        );


        displayNotes(
            restoredNotes
        );


        createFlashcards(
            restoredNotes
        );


        createQuiz(
            restoredNotes
        );


        if (translationStatus) {

            translationStatus.textContent =
                "✅ Original English notes restored.";

        }


        updateDashboardStats();

        return;

    }


    translateNotesBtn.disabled =
        true;


    translateNotesBtn.textContent =
        "🤖 Translating...";


    if (translationStatus) {

        translationStatus.textContent =
            `Translating original notes to ${targetLanguage}...`;

    }


    try {

        console.log(
            "Sending ORIGINAL notes for translation..."
        );


        const response =
            await fetch(
                "http://localhost:5000/api/translate",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        notes:
                            originalNotes,

                        targetLanguage:
                            targetLanguage

                    })

                }
            );


        const data =
            await response.json();


        console.log(
            "Translation response:",
            data
        );


        if (!response.ok) {

            throw new Error(

                data.details ||

                data.error ||

                "Translation failed."

            );

        }


        if (!data.notes) {

            throw new Error(
                "No translated notes received."
            );

        }


        const translatedNotes = {

            ...data.notes,

            date:
                new Date()
                    .toLocaleString(),

            translatedLanguage:
                targetLanguage

        };


        localStorage.setItem(
            "lectureLensTranslatedNotes",
            JSON.stringify(
                translatedNotes
            )
        );


        saveNotes(
            translatedNotes
        );


        displayNotes(
            translatedNotes
        );


        createFlashcards(
            translatedNotes
        );


        createQuiz(
            translatedNotes
        );


        updateDashboardStats();


        if (translationStatus) {

            translationStatus.textContent =
                `✅ Notes translated to ${targetLanguage}`;

        }


        console.log(
            "✅ Translation successful."
        );


    } catch (error) {

        console.error(
            "Translation error:",
            error
        );


        if (translationStatus) {

            translationStatus.textContent =
                "❌ Translation failed.";

        }


        alert(
            "❌ Could not translate notes.\n\n" +
            error.message
        );


    } finally {

        translateNotesBtn.disabled =
            false;


        translateNotesBtn.textContent =
            "🌐 Translate Notes";

    }

}


/* =====================================================
   DASHBOARD STATISTICS
===================================================== */

function updateDashboardStats() {

    const notes =
        localStorage.getItem(
            "lectureLensSmartNotes"
        );


    const flashcards =
        localStorage.getItem(
            "lectureLensFlashcards"
        );


    const quiz =
        localStorage.getItem(
            "lectureLensQuiz"
        );


    const notesCount =
        document.getElementById(
            "notesCount"
        );


    if (notesCount) {

        notesCount.textContent =
            notes ? "1" : "0";

    }


    try {

        const cards =
            JSON.parse(
                flashcards
            );


        const flashcardCount =
            document.getElementById(
                "flashcardCount"
            );


        if (flashcardCount) {

            flashcardCount.textContent =
                cards?.length || 0;

        }

    } catch {

        const flashcardCount =
            document.getElementById(
                "flashcardCount"
            );


        if (flashcardCount) {

            flashcardCount.textContent =
                "0";

        }

    }


    try {

        const questions =
            JSON.parse(
                quiz
            );


        const quizCount =
            document.getElementById(
                "quizCount"
            );


        if (quizCount) {

            quizCount.textContent =
                questions?.length || 0;

        }

    } catch {

        const quizCount =
            document.getElementById(
                "quizCount"
            );


        if (quizCount) {

            quizCount.textContent =
                "0";

        }

    }


    const lectureCount =
        document.getElementById(
            "lectureCount"
        );


    if (lectureCount) {

        lectureCount.textContent =
            finalTranscript
                ? "1"
                : (
                    notes
                        ? "1"
                        : "0"
                );

    }

}


/* =====================================================
   ACCESSIBILITY
===================================================== */

const fontSizeSelect =
    document.getElementById(
        "fontSizeSelect"
    );


if (fontSizeSelect) {

    fontSizeSelect.addEventListener(
        "change",
        function() {

            document.body.classList.remove(
                "font-large",
                "font-xlarge"
            );


            if (
                this.value === "large"
            ) {

                document.body.classList.add(
                    "font-large"
                );

            }


            if (
                this.value === "xlarge"
            ) {

                document.body.classList.add(
                    "font-xlarge"
                );

            }

        }
    );

}


const spacingSelect =
    document.getElementById(
        "spacingSelect"
    );


if (spacingSelect) {

    spacingSelect.addEventListener(
        "change",
        function() {

            document.body.classList.remove(
                "spacing-wide",
                "spacing-extra"
            );


            if (
                this.value === "wide"
            ) {

                document.body.classList.add(
                    "spacing-wide"
                );

            }


            if (
                this.value === "extra"
            ) {

                document.body.classList.add(
                    "spacing-extra"
                );

            }

        }
    );

}


const contrastBtn =
    document.getElementById(
        "contrastBtn"
    );


if (contrastBtn) {

    contrastBtn.addEventListener(
        "click",
        function() {

            document.body.classList.toggle(
                "high-contrast"
            );


            if (
                document.body.classList.contains(
                    "high-contrast"
                )
            ) {

                this.textContent =
                    "Disable";

            } else {

                this.textContent =
                    "Enable";

            }

        }
    );

}


/* =====================================================
   STEP 12C
   DIAGRAM ANALYSIS FRONTEND
===================================================== */

const diagramInput =
    document.getElementById(
        "diagramInput"
    );


const diagramPreviewContainer =
    document.getElementById(
        "diagramPreviewContainer"
    );


const diagramPreview =
    document.getElementById(
        "diagramPreview"
    );


const analyzeDiagramBtn =
    document.getElementById(
        "analyzeDiagramBtn"
    );


const removeDiagramBtn =
    document.getElementById(
        "removeDiagramBtn"
    );


const diagramAnalysisStatus =
    document.getElementById(
        "diagramAnalysisStatus"
    );


const diagramAnalysisResult =
    document.getElementById(
        "diagramAnalysisResult"
    );


const diagramAnalysisContent =
    document.getElementById(
        "diagramAnalysisContent"
    );


/* =====================================================
   IMAGE SELECT
===================================================== */

if (diagramInput) {

    diagramInput.addEventListener(
        "change",
        function() {

            const file =
                this.files[0];


            if (!file) {

                return;

            }


            const allowedTypes = [

                "image/png",

                "image/jpeg",

                "image/jpg"

            ];


            if (
                !allowedTypes.includes(
                    file.type
                )
            ) {

                alert(
                    "Please select a PNG, JPG or JPEG image."
                );


                this.value = "";

                return;

            }


            if (
                file.size >
                10 * 1024 * 1024
            ) {

                alert(
                    "Image size must be less than 10 MB."
                );


                this.value = "";

                return;

            }


            const imageURL =
                URL.createObjectURL(
                    file
                );


            diagramPreview.src =
                imageURL;


            diagramPreviewContainer
                .classList
                .remove(
                    "hidden"
                );


            analyzeDiagramBtn.disabled =
                false;


            diagramAnalysisResult
                .classList
                .add(
                    "hidden"
                );


            diagramAnalysisContent.innerHTML =
                "";


            if (diagramAnalysisStatus) {

                diagramAnalysisStatus.textContent =
                    "Image selected. Click Analyze Diagram with AI.";

            }

        }
    );

}


/* =====================================================
   REMOVE IMAGE
===================================================== */

if (removeDiagramBtn) {

    removeDiagramBtn.addEventListener(
        "click",
        function() {

            if (diagramInput) {

                diagramInput.value =
                    "";

            }


            if (diagramPreview) {

                diagramPreview.src =
                    "";

            }


            if (diagramPreviewContainer) {

                diagramPreviewContainer
                    .classList
                    .add(
                        "hidden"
                    );

            }


            if (analyzeDiagramBtn) {

                analyzeDiagramBtn.disabled =
                    true;

            }


            if (diagramAnalysisResult) {

                diagramAnalysisResult
                    .classList
                    .add(
                        "hidden"
                    );

            }


            if (diagramAnalysisContent) {

                diagramAnalysisContent.innerHTML =
                    "";

            }


            if (diagramAnalysisStatus) {

                diagramAnalysisStatus.textContent =
                    "";

            }

        }
    );

}


/* =====================================================
   STEP 13
   ANALYZE + SAVE DIAGRAM ANALYSIS
===================================================== */

if (analyzeDiagramBtn) {

    analyzeDiagramBtn.addEventListener(
        "click",
        async function() {

            const file =
                diagramInput &&
                diagramInput.files
                    ? diagramInput.files[0]
                    : null;


            if (!file) {

                if (diagramAnalysisStatus) {

                    diagramAnalysisStatus.textContent =
                        "Please select an image first.";

                }

                return;

            }


            analyzeDiagramBtn.disabled =
                true;


            if (diagramAnalysisStatus) {

                diagramAnalysisStatus.textContent =
                    "🤖 AI is analyzing the diagram...";

            }


            if (diagramAnalysisResult) {

                diagramAnalysisResult
                    .classList
                    .add(
                        "hidden"
                    );

            }


            try {

                const formData =
                    new FormData();


                formData.append(
                    "image",
                    file
                );


                /*
                   IMPORTANT:
                   Send currently selected language
                   to Gemini for diagram analysis.
                */

                formData.append(
                    "targetLanguage",
                    selectedLanguage || "English"
                );


                /* Send image to backend */

                const response =
                    await fetch(
                        "http://localhost:5000/api/analyze-image",
                        {

                            method: "POST",

                            body: formData

                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Diagram AI response:",
                    data
                );


                /* =================================================
                   STEP 13: SAVE DIAGRAM ANALYSIS
                ================================================= */

                if (
                    data.success &&
                    data.analysis
                ) {

                    localStorage.setItem(
                        "lectureLensDiagramAnalysis",
                        JSON.stringify(
                            data.analysis
                        )
                    );

                }


                /* Check backend response */

                if (!response.ok) {

                    throw new Error(

                        data.details ||

                        data.error ||

                        "Image analysis failed."

                    );

                }


                if (
                    !data.success ||
                    !data.analysis
                ) {

                    throw new Error(
                        "Invalid AI response."
                    );

                }


                /* =================================================
                   DISPLAY DIAGRAM RESULT
                ================================================= */

                const analysis =
                    data.analysis;


                if (diagramAnalysisContent) {

                    diagramAnalysisContent.innerHTML = `

                        <div class="diagram-analysis-wrapper">

                            <div class="diagram-analysis-section">

                                <h3>
                                    📝 Description
                                </h3>

                                <p>
                                    ${escapeHTML(
                                        analysis.description ||
                                        analysis.overview ||
                                        "No description available."
                                    )}
                                </p>

                            </div>


                            ${
                                analysis.labels &&
                                Array.isArray(
                                    analysis.labels
                                ) &&
                                analysis.labels.length > 0

                                ?

                                `

                                <div class="diagram-analysis-section">

                                    <h3>
                                        🏷️ Labels
                                    </h3>

                                    <ul>

                                        ${
                                            analysis.labels
                                                .map(
                                                    label =>
                                                        `<li>
                                                            ${escapeHTML(
                                                                typeof label === "object"
                                                                    ? (
                                                                        label.text ||
                                                                        label.label ||
                                                                        JSON.stringify(label)
                                                                    )
                                                                    : label
                                                            )}
                                                        </li>`
                                                )
                                                .join("")
                                        }

                                    </ul>

                                </div>

                                `

                                :

                                ""

                            }


                            ${
                                analysis.components &&
                                Array.isArray(
                                    analysis.components
                                ) &&
                                analysis.components.length > 0

                                ?

                                `

                                <div class="diagram-analysis-section">

                                    <h3>
                                        🧩 Components
                                    </h3>

                                    <ul>

                                        ${
                                            analysis.components
                                                .map(
                                                    component =>
                                                        `<li>
                                                            ${escapeHTML(
                                                                typeof component === "object"
                                                                    ? (
                                                                        component.name ||
                                                                        component.description ||
                                                                        JSON.stringify(component)
                                                                    )
                                                                    : component
                                                            )}
                                                        </li>`
                                                )
                                                .join("")
                                        }

                                    </ul>

                                </div>

                                `

                                :

                                ""

                            }


                            ${
                                analysis.steps &&
                                Array.isArray(
                                    analysis.steps
                                ) &&
                                analysis.steps.length > 0

                                ?

                                `

                                <div class="diagram-analysis-section">

                                    <h3>
                                        🔄 Working / Flow
                                    </h3>

                                    <ol>

                                        ${
                                            analysis.steps
                                                .map(
                                                    step =>
                                                        `<li>
                                                            ${escapeHTML(
                                                                typeof step === "object"
                                                                    ? (
                                                                        step.description ||
                                                                        step.step ||
                                                                        JSON.stringify(step)
                                                                    )
                                                                    : step
                                                            )}
                                                        </li>`
                                                )
                                                .join("")
                                        }

                                    </ol>

                                </div>

                                `

                                :

                                ""

                            }


                            ${
                                analysis.keyPoints &&
                                Array.isArray(
                                    analysis.keyPoints
                                ) &&
                                analysis.keyPoints.length > 0

                                ?

                                `

                                <div class="diagram-analysis-section">

                                    <h3>
                                        🔑 Key Points
                                    </h3>

                                    <ul>

                                        ${
                                            analysis.keyPoints
                                                .map(
                                                    point =>
                                                        `<li>
                                                            ${escapeHTML(
                                                                point
                                                            )}
                                                        </li>`
                                                )
                                                .join("")
                                        }

                                    </ul>

                                </div>

                                `

                                :

                                ""

                            }


                            ${
                                analysis.summary

                                ?

                                `

                                <div class="diagram-analysis-section">

                                    <h3>
                                        📌 Summary
                                    </h3>

                                    <p>
                                        ${escapeHTML(
                                            analysis.summary
                                        )}
                                    </p>

                                </div>

                                `

                                :

                                ""

                            }

                        </div>

                    `;

                }


                if (diagramAnalysisResult) {

                    diagramAnalysisResult
                        .classList
                        .remove(
                            "hidden"
                        );

                }


                if (diagramAnalysisStatus) {

                    diagramAnalysisStatus.textContent =
                        `✅ Diagram analyzed successfully in ${selectedLanguage || "English"}.`;

                }


                console.log(
                    "✅ Diagram analysis completed."
                );


            } catch (error) {

                console.error(
                    "Diagram analysis error:",
                    error
                );


                if (diagramAnalysisStatus) {

                    diagramAnalysisStatus.textContent =
                        "❌ Diagram analysis failed.";

                }


                alert(
                    "❌ Could not analyze the diagram.\n\n" +
                    error.message
                );


            } finally {

                analyzeDiagramBtn.disabled =
                    false;

            }

        }
    );

}




/* =====================================================
   DIAGRAM ANALYSIS RESULT DISPLAY
===================================================== */

function displaySavedDiagramAnalysis(analysis) {

    if (!analysis) {
        return;
    }


    let html = "";


    /* =================================================
       TITLE
    ================================================= */

    if (analysis.title) {

        html += `

            <h3>
                📌 ${escapeHTML(
                    analysis.title
                )}
            </h3>

        `;

    }


    /* =================================================
       DESCRIPTION
    ================================================= */

    if (analysis.description) {

        html += `

            <div class="diagram-result-section">

                <h4>
                    📝 Description
                </h4>

                <p>
                    ${escapeHTML(
                        analysis.description
                    )}
                </p>

            </div>

        `;

    }


    /* =================================================
       COMPONENTS
    ================================================= */

    if (
        Array.isArray(
            analysis.components
        ) &&
        analysis.components.length > 0
    ) {

        html += `

            <div class="diagram-result-section">

                <h4>
                    🔹 Components
                </h4>

                <ul>

        `;


        analysis.components.forEach(
            component => {

                html += `

                    <li>
                        ${escapeHTML(
                            typeof component === "object"
                                ? (
                                    component.name ||
                                    component.description ||
                                    JSON.stringify(component)
                                )
                                : component
                        )}
                    </li>

                `;

            }
        );


        html += `

                </ul>

            </div>

        `;

    }


    /* =================================================
       EXPLANATION
    ================================================= */

    if (analysis.explanation) {

        html += `

            <div class="diagram-result-section">

                <h4>
                    💡 Simple Explanation
                </h4>

                <p>
                    ${escapeHTML(
                        analysis.explanation
                    )}
                </p>

            </div>

        `;

    }


    /* =================================================
       KEY POINTS
    ================================================= */

    if (
        Array.isArray(
            analysis.keyPoints
        ) &&
        analysis.keyPoints.length > 0
    ) {

        html += `

            <div class="diagram-result-section">

                <h4>
                    ⭐ Key Points
                </h4>

                <ul>

        `;


        analysis.keyPoints.forEach(
            point => {

                html += `

                    <li>
                        ${escapeHTML(
                            typeof point === "object"
                                ? (
                                    point.text ||
                                    point.description ||
                                    JSON.stringify(point)
                                )
                                : point
                        )}
                    </li>

                `;

            }
        );


        html += `

                </ul>

            </div>

        `;

    }


    /* =================================================
       ALT TEXT
    ================================================= */

    if (analysis.altText) {

        html += `

            <div class="diagram-result-section">

                <h4>
                    ♿ Accessibility Alt Text
                </h4>

                <p>
                    ${escapeHTML(
                        analysis.altText
                    )}
                </p>

            </div>

        `;

    }


    /* =================================================
       DISPLAY RESULT
    ================================================= */

    if (
        diagramAnalysisContent
    ) {

        diagramAnalysisContent.innerHTML =
            html;

    }


    if (
        diagramAnalysisResult
    ) {

        diagramAnalysisResult
            .classList
            .remove(
                "hidden"
            );

    }


    if (
        diagramAnalysisStatus
    ) {

        diagramAnalysisStatus.textContent =
            `✅ Diagram analyzed successfully in ${
                selectedLanguage || "English"
            }.`;

    }

}


/* =====================================================
   RESTORE SAVED DIAGRAM RESULT
===================================================== */

function restoreSavedDiagramAnalysis() {

    const saved =
        localStorage.getItem(
            "lectureLensDiagramAnalysis"
        );


    if (!saved) {

        return;

    }


    try {

        const analysis =
            JSON.parse(
                saved
            );


        displaySavedDiagramAnalysis(
            analysis
        );


    } catch (error) {

        console.error(
            "Could not restore diagram analysis:",
            error
        );

    }

}


/* =====================================================
   RESTORE SAVED DIAGRAM
===================================================== */

restoreSavedDiagramAnalysis();


/* =====================================================
   INITIAL DASHBOARD UPDATE
===================================================== */

updateDashboardStats();


/* =====================================================
   INITIAL PAGE
===================================================== */

if (
    !document.querySelector(
        ".active-page"
    )
) {

    showPage(
        "dashboard"
    );

}


/* =====================================================
   DEBUG MESSAGE
===================================================== */

console.log(
    "========================================"
);

console.log(
    "🚀 LectureLens script loaded successfully."
);

console.log(
    "🌐 Selected language:",
    selectedLanguage
);

console.log(
    "🤖 Gemini AI integration ready."
);

console.log(
    "🖼️ Diagram analysis ready."
);

console.log(
    "========================================"
);
