document.addEventListener('DOMContentLoaded', () => {
    const openSettings = document.getElementById('open-settings');
    const settingsModal = document.getElementById('settings-modal');

    // Open settings modal when settings icon is clicked
    openSettings.addEventListener('click', () => {
        settingsModal.style.display = 'block';
    });
});

// Function to close settings modal
function closeSettings() {
    const settingsModal = document.getElementById('settings-modal');
    settingsModal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const icons = document.querySelectorAll('.icon');
    const codeContent = document.getElementById('code-content');
    const runButton = document.querySelector('#run-button');
    const iframeOutput = document.querySelector('#iframe-output');
    const terminalOutput = document.querySelector('#terminal-output');

    // Tab switching functionality
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            // Update code content
            const file = tab.getAttribute('data-file');
            codeContent.value = fileContents[file]; // Use value for textarea
        });
    });

    // Sidebar icon switching functionality
    icons.forEach(icon => {
        icon.addEventListener('click', () => {
            // Remove active class from all icons
            icons.forEach(i => i.classList.remove('active'));
            // Add active class to clicked icon
            icon.classList.add('active');
        });
    });


    // Resize textarea dynamically
    function resizeTextarea() {
        codeContent.style.height = 'auto';
        codeContent.style.height = `${codeContent.scrollHeight}px`;
    }

    // Initial resize when page loads
    resizeTextarea();

    // Event listener for input to dynamically resize the textarea
    codeContent.addEventListener('input', resizeTextarea);

    // Update file contents when text is changed in the textarea
    codeContent.addEventListener('input', () => {
        const activeTab = document.querySelector('.tab.active');
        const fileName = activeTab.getAttribute('data-file');
        fileContents[fileName] = codeContent.value;
    });

    // When the Run button is clicked
    runButton.addEventListener('click', () => {
        const htmlCode = fileContents["index.html"];
        const cssCode = fileContents["style.css"];
        const jsCode = fileContents["script.js"];

        // Combine HTML, CSS, and JS to inject into the iframe
        const iframeDoc = iframeOutput.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>${cssCode}</style>
                <title>Live Preview</title>
            </head>
            <body>
                ${htmlCode}
                <script>${jsCode}</script>
            </body>
            </html>
        `);
        iframeDoc.close();
        // Output success message to terminal
        terminalOutput.textContent = "Code Executed Successfully!";
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const icons = document.querySelectorAll('.icon');
    const codeContent = document.getElementById('code-content');
    const iframeOutput = document.getElementById('iframe-output');
    const fileInput = document.getElementById('file-input');
    const terminalOutput = document.querySelector('#terminal-output');
    const fileContents = {
        "index.html": "<!-- This is index.html -->\n<h1>Hello, World!</h1>",
        "style.css": "/* This is style.css */\nbody { background-color:rgb(186, 248, 224); }",
        "script.js": "// This is script.js\nconsole.log('Hello, JavaScript!');"
    };

    // Active File Tracking
    let activeFile = 'index.html';
    codeContent.value = fileContents[activeFile];

    // Tab Switching Logic
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeFile = tab.getAttribute('data-file');
            codeContent.value = fileContents[activeFile];
        });
    });

    // Code Content Input Logic
    codeContent.addEventListener('input', () => {
        fileContents[activeFile] = codeContent.value;
        updateOutput();
    });

    // Sidebar Icon Logic
    icons.forEach(icon => {
        icon.addEventListener('click', () => {
            icons.forEach(i => i.classList.remove('active'));
            icon.classList.add('active');
        });
    });

    // Hidden File Input Logic
    document.getElementById('open-file').addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                fileContents[activeFile] = e.target.result;
                codeContent.value = e.target.result;
                updateOutput();
            };
            reader.readAsText(file);
        }
    });

    // Update Iframe Output
    function updateOutput() {
        const htmlCode = fileContents['index.html'];
        const cssCode = fileContents['style.css'];
        const jsCode = fileContents['script.js'];
        const terminalOutput = document.querySelector('#terminal-output');

        const iframeDoc = iframeOutput.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>${cssCode}</style>
                <title>Live Preview</title>
            </head>
            <body>
                ${htmlCode}
                <script>${jsCode}<\/script>
            </body>
            </html>
        `);
        iframeDoc.close();
        // Output success message to terminal
        terminalOutput.textContent = "Code Executed Successfully!";
    }
    // Initial Load
    updateOutput();
});

document.addEventListener('DOMContentLoaded', () => {
    const codeContent = document.getElementById('code-content');
    const cursorPositionSpan = document.getElementById('cursor-position');
    const spacesCountSpan = document.getElementById('spaces-count');

    // Function to update the cursor position and spaces count
    function updateEditorInfo() {
        const cursorPos = codeContent.selectionStart;
        const text = codeContent.value;

        // Calculate the line and column number
        const lines = text.substring(0, cursorPos).split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;

        // Update the cursor position display
        cursorPositionSpan.textContent = `Ln ${line}, Col ${column}`;

        // Count the spaces or tabs in the current line
        const currentLine = lines[lines.length - 1];
        const spacesCount = currentLine.length - currentLine.trimStart().length;
        spacesCountSpan.textContent = `Spaces: ${spacesCount}`;
    }

    // Event listener for updating the editor information
    codeContent.addEventListener('input', updateEditorInfo);
    codeContent.addEventListener('click', updateEditorInfo);
    codeContent.addEventListener('keyup', updateEditorInfo);

    // Initial update on page load
    updateEditorInfo();

    //Explanation:
    // updateEditorInfo function: This function is responsible for calculating and updating the cursor position and spaces count.
    // It gets the position of the cursor using selectionStart.
    // It calculates the current line number and column number by splitting the text based on newlines and counting the characters in the current line.
    // It calculates the number of leading spaces on the current line to display the spaces count.
    // Event listeners: We listen for input, click, and keyup events on the textarea to ensure the information is updated whenever the user types, clicks, or moves the cursor.
});