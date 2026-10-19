
const userInput = document.getElementById("userInput");
const actionBtn = document.getElementById("actionBtn");
const output = document.getElementById("output");
const featureButtons = document.querySelectorAll(".feature");

let selectedFeature = "ask";

featureButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectedFeature = button.dataset.feature;

        featureButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const buttonTexts = {
            ask: "Ask Gemini",
            summary: "Summarize Text",
            ideas: "Generate Ideas",
            definition: "Find Definition"
        };

        const placeholders = {
            ask: "Ask your question...",
            summary: "Paste the text you want to summarize...",
            ideas: "Enter a topic to generate ideas...",
            definition: "Enter a word to find its definition..."
        };

        actionBtn.textContent = buttonTexts[selectedFeature];
        userInput.placeholder = placeholders[selectedFeature];
    });
});

actionBtn.addEventListener("click", async () => {
    const userText = userInput.value.trim();

    if (userText === "") {
        output.textContent = "Please enter some text first.";
        return;
    }

    let prompt = "";

    if (selectedFeature === "ask") {
        prompt = `Answer this question in simple language 2 to 3 line : ${userText}`;
    } else if (selectedFeature === "summary") {
        prompt = `Summarize 5 to 6linethis text in simple language: ${userText}`;
    } else if (selectedFeature === "ideas") {
        prompt = `Generate 1 to 2 line creative ideas about this topic: ${userText}`;
    } else if (selectedFeature === "definition") {
        prompt = `Give the 2 to 3 line meaning, simple definition, and one example of: ${userText}`;
    }

    try {
        actionBtn.disabled = true;
        actionBtn.textContent = "Generating...";
        output.textContent = "Please wait, generating your answer...";

        

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
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
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error?.message || "API request failed."
            );
        }

        const answer =
            data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!answer) {
            throw new Error("No answer received from Gemini.");
        }

        output.textContent = answer;

    } catch (error) {
        console.error("Error:", error);
        output.textContent = `Something went wrong: ${error.message}`;

    } finally {
        actionBtn.disabled = false;

        const buttonTexts = {
            ask: "Ask Gemini",
            summary: "Summarize Text",
            ideas: "Generate Ideas",
            definition: "Find Definition"
        };

        actionBtn.textContent = buttonTexts[selectedFeature];
    }
});
