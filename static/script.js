document.getElementById("generate-text").addEventListener("click", function () {
    let difficulty = document.getElementById("difficulty").value;
    fetch("/generate_text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty: difficulty }),
    })
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("typing-text").innerText = data.text;
            document.getElementById("user-input").value = "";
            document.getElementById("result").innerText = "";
        });
});

document
    .getElementById("analyze-typing")
    .addEventListener("click", function () {
        let userInput = document.getElementById("user-input").value;
        let originalText = document.getElementById("typing-text").innerText;

        fetch("/analyze_typing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_input: userInput,
                original_text: originalText,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                document.getElementById(
                    "result"
                ).innerText = `Accuracy: ${data.accuracy}% | Speed: ${data.speed} WPM\n${data.feedback}`;
            });
    });

document.getElementById("start-button").addEventListener("click", function () {
    document.getElementById("user-input").focus();
});

// the timing logic
let startTime;

document.getElementById("start-button").addEventListener("click", function () {
    startTime = new Date(); // Start timing when user clicks 'Start'
    document.getElementById("user-input").focus();
});

document
    .getElementById("analyze-typing")
    .addEventListener("click", function () {
        if (!startTime) {
            alert("Please start typing first!");
            return;
        }

        let endTime = new Date();
        let timeTaken = (endTime - startTime) / 1000; // Convert to seconds

        let userInput = document.getElementById("user-input").value;
        let originalText = document.getElementById("typing-text").innerText;

        fetch("/analyze_typing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_input: userInput,
                original_text: originalText,
                time_taken: timeTaken,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                document.getElementById(
                    "result"
                ).innerText = `Accuracy: ${data.accuracy}% | Speed: ${data.speed} WPM\n${data.feedback}`;
            });
    });
