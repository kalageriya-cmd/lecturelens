/* =====================================================
   LECTURELENS - STEP 11C
   REAL GEMINI AI + MULTILINGUAL TRANSLATION
   ORIGINAL NOTES PRESERVED
===================================================== */


/* =====================================================
   LOGIN
===================================================== */

const DEMO_EMAIL = "student@lecturelens.com";
const DEMO_PASSWORD = "LectureLens123";

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


            if (
                email === DEMO_EMAIL &&
                password === DEMO_PASSWORD
            ) {

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
                    "Invalid email or password.";

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


    if (pageInfo[pageId]) {

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
                            text

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
                    : [],

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
                text

        };


        /* ==========================================
           IMPORTANT:
           SAVE ORIGINAL NOTES SEPARATELY
        ========================================== */

        saveOriginalNotes(
            notes
        );


        /* ==========================================
           CURRENT DISPLAYED NOTES
        ========================================== */

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
            "REAL GEMINI AI NOTES GENERATED SUCCESSFULLY!"
        );


        alert(
            "✨ AI notes generated successfully!"
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
                    notes.translatedLanguage
                        ? `
                            <small>
                                🌐 Translated to
                                ${escapeHTML(
                                    notes.translatedLanguage
                                )}
                            </small>
                          `
                        : ""
                }

            </div>


            <div class="note-section">

                <h3>
                    📌 Summary
                </h3>

                <p>
                    ${escapeHTML(
                        notes.summary || ""
                    )}
                </p>

            </div>


            <div class="note-section">

                <h3>
                    🔑 Key Points
                </h3>

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

                <h3>
                    💡 Important Concepts
                </h3>

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

                <h3>
                    📖 Definitions
                </h3>

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

                <h3>
                    ❓ Revision Questions
                </h3>

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

                <h3>
                    🎙️ Transcript
                </h3>

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
                                    point
                                        .toLowerCase()
                                        .includes(
                                            concept.toLowerCase()
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
            Click a card to flip it
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
                                            Card ${index + 1}
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
                                            Answer
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

        (notes.concepts || [])
            .slice(0, 5)
            .forEach(
                concept => {

                    questions.push({

                        question:
                            "Which concept was discussed in the lecture?",

                        options: [

                            concept,

                            "Unrelated topic",

                            "Random concept",

                            "None of these"

                        ],

                        answer: 0

                    });

                }
            );

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

                                result.textContent =
                                    `🎉 Your score: ${score}/${questions.length}`;

                            }

                        }

                    }
                );

            }
        );

}


/* =====================================================
   STEP 11C
   MULTILINGUAL NOTE TRANSLATION
   ORIGINAL NOTES ARE ALWAYS USED
===================================================== */

const notesLanguageSelect =
    document.getElementById(
        "notesLanguageSelect"
    );


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

    /*
       IMPORTANT:
       Always get the ORIGINAL notes.
       Never translate an already translated version.
    */

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


    /*
       Backward compatibility:
       If original notes do not exist yet,
       use current notes and save them as original.
    */

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
            : "English";


    /*
       If user chooses the same language as original,
       simply show original notes.
    */

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


        return;

    }


    /* =================================================
       LOADING STATE
    ================================================= */

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

                        /*
                           CRITICAL:
                           Send originalNotes,
                           not currently displayed notes.
                        */

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


        /*
           Create translated notes object.
        */

        const translatedNotes = {

            ...data.notes,

            date:
                new Date()
                    .toLocaleString(),

            translatedLanguage:
                targetLanguage

        };


        /*
           IMPORTANT:
           Save translated notes separately
           as the current displayed version.

           Original notes remain untouched.
        */

        localStorage.setItem(
            "lectureLensTranslatedNotes",
            JSON.stringify(
                translatedNotes
            )
        );


        saveNotes(
            translatedNotes
        );


        /*
           Display translated notes.
        */

        displayNotes(
            translatedNotes
        );


        /*
           Also translate/update flashcards
           and quiz.
        */

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