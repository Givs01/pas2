const url = 'https://script.google.com/macros/s/AKfycbxbRVnLHfId93usYNsjHTUV_A1uaO4gpHzPisECC_Vwwx0hcgprm5XBzeWwDhYHj-Zp/exec';

document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to each scroll button
    var buttons = document.getElementsByClassName('scroll-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function() {
            scrollToBottom(this.id);
        });
    }

    // Check if there is an active button stored in sessionStorage
    var activeButtonId = sessionStorage.getItem('activeButtonId');
    if (activeButtonId) {
        scrollToBottom(activeButtonId); // Activate the stored button
    } else {
        scrollToBottom('b1'); // Default to 'gi' button if no active button is stored
    }

    // Load draft files from sessionStorage
    loadDraftFiles();
});


function scrollToBottom(buttonId) {
    var buttons = document.getElementsByClassName('scroll-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    
    // Show/hide forms based on the button clicked
    var formIds = ['gi', 'ws', 'sd', 'swm', 'ut'];
    var headings = ['General Information', 'Water Supply', 'Sewerage and Drainage', 'Solid Waste Management', 'ULBs Undertaking']; // Update with your heading texts
    for (var i = 0; i < formIds.length; i++) {
        var form = document.getElementById(formIds[i]);
        if (buttonId === 'b' + (i + 1)) {
            form.style.display = 'block';
            var headingElement = document.getElementById('sheetN').querySelector('h2');
            headingElement.innerText = headings[i] + ': FY 2023-2024'; // Update heading text
            buttons[i].classList.add('active'); 
            sessionStorage.setItem('activeButtonId', buttonId); // Store the active button ID in sessionStorage
        } else {
            form.style.display = 'none';
        }
    }
}

let inactivityTimeout;
let logoutTimeout;



function login() {
    document.getElementById('errorMsg').style.display = 'none';
    document.getElementById('login-btn').style.display = 'none';
    document.getElementById('loader1').style.display = 'block';

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`${url}?action=verifyLogin&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
        .then(response => response.text())
        .then(text => {
            if (text.trim() === 'success') {
                document.getElementById('loader1').style.display = 'none';
                sessionStorage.setItem('username', username);
                showLoggedInState(username);
            } else {
                document.getElementById('loader1').style.display = 'none';
                document.getElementById('login-btn').style.display = 'block';
                document.getElementById('errorMsg').textContent = 'Login failed! Please check your username and password.';
                document.getElementById('errorMsg').style.display = 'block';
                document.getElementById('login-btn').style.display = 'flex';
            }
        })
        .catch(error => {
            document.getElementById('loader1').style.display = 'none';
            console.error('Error:', error);
            document.getElementById('errorMsg').textContent = 'An error occurred during login. Please try again later.';
            document.getElementById('errorMsg').style.display = 'block';
            document.getElementById('login-btn').style.display = 'flex';
            // Reset username and password inputs
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        });
}

function logout() {
    sessionStorage.clear();
    showLoggedOutState();
}


function showLoggedInState(username) {
    console.log(`User ${username} is logged in`);
    document.getElementById('loader1').style.display = 'none';
    document.getElementById('logout').style.display = 'flex';
    document.getElementById('dp-1').style.display = 'none';
    document.getElementById('dp-2').style.display = 'block';
    document.getElementById('login').style.display = 'none';
    document.getElementById('ws').style.display = 'none';
    document.getElementById('sd').style.display = 'none';
    document.getElementById('swm').style.display = 'none';
    document.getElementById('ulbDisplay').textContent = username;
    document.getElementById('ulbDisplay1').textContent = username;
    scrollToBottom('b1'); // Redirect to 'gi' button when user logs in
    startInactivityTimer();
}

function showLoggedOutState() {
    document.getElementById('dp-2').style.display = 'none';
    document.getElementById('dp-1').style.display = 'block';
    document.getElementById('login').style.display = 'flex';
    document.getElementById('logout').style.display = 'none';
    document.getElementById('login-btn').style.display = 'block';
    document.getElementById('loader1').style.display = 'none';
    clearTimeout(inactivityTimeout);
    clearTimeout(logoutTimeout);
    document.getElementById('custom-alert').style.display = 'none';
}

// Check if user is already logged in on page load
window.addEventListener('load', () => {
    const username = sessionStorage.getItem('username');
    if (username) {
        showLoggedInState(username);
    }
});

function startInactivityTimer() {
    clearTimeout(inactivityTimeout);
    clearTimeout(logoutTimeout);

    inactivityTimeout = setTimeout(() => {
        document.getElementById('custom-alert').style.display = 'flex';
        logoutTimeout = setTimeout(() => {
            logout();
        }, 600000); 
    }, 660000); 
}

// Reset inactivity timer on user interaction
['click', 'mousemove', 'keypress'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer);
});

function resetInactivityTimer() {
    console.log("Activity detected. Resetting inactivity timer.");
    clearTimeout(inactivityTimeout);
    clearTimeout(logoutTimeout);
    document.getElementById('custom-alert').style.display = 'none';
    startInactivityTimer();
}




function closePopup() {
    var popup = document.getElementById("success-popup");
    popup.style.display = "none";
}

function checkFile(input, errorId) {
    var file = input.files[0];
    var fileSize = file.size; // Size in bytes
    var maxSize = 1048576; // 1 MB in bytes

    if (fileSize > maxSize) {
        document.getElementById(errorId).style.display = "block";
        input.value = ''; // Reset file input
    } else {
        document.getElementById(errorId).style.display = "none";
    }
}

function giNextFileCheck(event) {
    event.preventDefault();
    if (q1.selectedIndex === 0 || q2.selectedIndex === 0 || q3.selectedIndex === 0) {
        alert("Select the document type.");
        return; // Stop further execution
    }
    if (!fileInput1.files[0]) {
        alert("Please attach all files.");
        return; // Stop further execution
    }
    saveDraft(); // Save the draft before navigating
    document.getElementById('ws').style.display = 'block';
    var wsButton = document.getElementById('b2'); // Assuming the id of the button for "Water Supply" is 'b2'
    if (wsButton) {
        wsButton.click(); // Trigger the click event
    }
}

function wsNextFileCheck(event) {
    event.preventDefault();
    if (q4.selectedIndex === 0) {
        alert("Select the document type.");
        return; // Stop further execution
    }
    if (!fileInput4.files[0]) {
        alert("Please attach all files.");
        return; // Stop further execution
    }
    saveDraft(); // Save the draft before navigating
    document.getElementById('sd').style.display = 'block';
    var sdButton = document.getElementById('b3'); // Assuming the id of the button for "sd" is 'b3'
    if (sdButton) {
        sdButton.click(); // Trigger the click event
    }
}

function sdNextFileCheck(event) {
    event.preventDefault();
    saveDraft(); // Save the draft before navigating
    document.getElementById('swm').style.display = 'block';
    var swmButton = document.getElementById('b4'); // Assuming the id of the button for "Solid Waste Management" is 'b4'
    if (swmButton) {
        swmButton.click(); // Trigger the click event
    }
}

function swmNextFileCheck(event) {
    event.preventDefault();
    saveDraft(); // Save the draft before navigating
    document.getElementById('ut').style.display = 'block';
    var utButton = document.getElementById('b5'); // Assuming the id of the button for "ULBs Undertaking" is 'b5'
    if (utButton) {
        utButton.click(); // Trigger the click event
    }
}

function saveDraft() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const formData = new FormData(form);
        const formId = form.id;
        let draftData = {};

        formData.forEach((value, key) => {
            if (value instanceof File) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    draftData[key] = {
                        name: value.name,
                        data: e.target.result
                    };
                    sessionStorage.setItem(formId, JSON.stringify(draftData));
                };
                reader.readAsDataURL(value);
            } else {
                draftData[key] = value;
            }
        });
    });
}

// Save draft on form change
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('change', saveDraft);
});

function loadDraftFiles() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const formId = form.id;
        const draftData = JSON.parse(sessionStorage.getItem(formId));
        if (draftData) {
            Object.keys(draftData).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input && input.type === 'file') {
                    const fileData = draftData[key];
                    const blob = dataURLtoBlob(fileData);
                    const file = new File([blob], 'draftFile'); // Default file name
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    input.files = dataTransfer.files;
                } else if (input) {
                    input.value = draftData[key];
                }
            });
        }
    });
}



function dataURLtoBlob(dataURL) {
    const [header, data] = dataURL.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(data);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mime });
}

function loadDraftFiles() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const formId = form.id;
        const draftData = JSON.parse(sessionStorage.getItem(formId));
        if (draftData) {
            Object.keys(draftData).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input && input.type === 'file') {
                    const fileInfo = draftData[key];
                    if (fileInfo && fileInfo.data) {
                        const blob = dataURLtoBlob(fileInfo.data);
                        const file = new File([blob], fileInfo.name);
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        input.files = dataTransfer.files;
                    }
                } else if (input) {
                    input.value = draftData[key];
                }
            });
        }
    });
}

// Restore drafts when the page is loaded
document.addEventListener('DOMContentLoaded', loadDraftFiles);



function captureAndSendFormData(url) {
    var formData = new FormData();
    
    // Get the file input elements
    var fileInputs = [
        document.getElementById("fileInput1"),
        document.getElementById("fileInput2"),
        document.getElementById("fileInput3"),
        document.getElementById("fileInput4"),
        document.getElementById("fileInput5"),
        document.getElementById("fileInput6"),
        document.getElementById("fileInput7"),
        document.getElementById("fileInput8"),
        document.getElementById("fileInput9"),
        document.getElementById("fileInput10"),
        document.getElementById("fileInput11"),
        document.getElementById("fileInput12"),
        document.getElementById("fileInput13"),
        document.getElementById("fileInput14"),
        document.getElementById("fileInput15"),
        document.getElementById("fileInput16"),
        document.getElementById("fileInput17"),
        document.getElementById("fileInput18"),
        document.getElementById("fileInput19"),
        document.getElementById("fileInput20"),
        document.getElementById("fileInput21"),
        document.getElementById("fileInput22"),
        document.getElementById("fileInput23"),
        document.getElementById("fileInput24"),
        document.getElementById("fileInput25"),
        document.getElementById("fileInput26"),
        document.getElementById("fileInput27"),
        document.getElementById("fileInput28"),
        document.getElementById("fileInput29"),
        document.getElementById("fileInput30"),
        document.getElementById("fileInput31")
    ];
    
    // Get the selected files
    var files = fileInputs.map(input => input.files[0]);

    // Add other form data to FormData object
    formData.append("ulb", document.getElementById("ulbDisplay").textContent);
    formData.append("q1", document.getElementById("q1").value);
    formData.append("q2", document.getElementById("q2").value);
    formData.append("q3", document.getElementById("q3").value);
    formData.append("q4", document.getElementById("q4").value);
    formData.append("q5", document.getElementById("q5").value);
    formData.append("q6", document.getElementById("q6").value);
    formData.append("q7", document.getElementById("q7").value);
    formData.append("q8", document.getElementById("q8").value);
    formData.append("q9", document.getElementById("q9").value);
    formData.append("q10", document.getElementById("q10").value);
    formData.append("q10", document.getElementById("q10").value);
    formData.append("q11", document.getElementById("q11").value);
    formData.append("q12", document.getElementById("q12").value);
    formData.append("q13", document.getElementById("q13").value);
    formData.append("q14", document.getElementById("q14").value);
    formData.append("q15", document.getElementById("q15").value);
    formData.append("q16", document.getElementById("q16").value);
    formData.append("q17", document.getElementById("q17").value);
    formData.append("q18", document.getElementById("q18").value);
    formData.append("q19", document.getElementById("q19").value);
    formData.append("q20", document.getElementById("q20").value);
    formData.append("q21", document.getElementById("q21").value);
    formData.append("q22", document.getElementById("q22").value);
    formData.append("q23", document.getElementById("q23").value);
    formData.append("q24", document.getElementById("q24").value);
    formData.append("q25", document.getElementById("q25").value);
    formData.append("q26", document.getElementById("q26").value);
    formData.append("q27", document.getElementById("q27").value);
    formData.append("q28", document.getElementById("q28").value);
    formData.append("q29", document.getElementById("q29").value);
    formData.append("q30", document.getElementById("q30").value);
    formData.append("q31", document.getElementById("q31").value);


    // Function to handle the form submission after reading all files
    function sendFormData() {
        // Prepare and send the form data
        var button = document.getElementById("submit");
        var submittingPopup = document.getElementById('submitting-popup');
        submittingPopup.style.display = "flex";
        document.getElementById('loader').style.display = 'block';
        button.classList.add("gray-button");

        fetch(url, {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            submittingPopup.style.display = "none";
            var successPopup = document.getElementById("success-popup");
            successPopup.style.display = "flex";
            // Reset form
            const forms = document.querySelectorAll("form");
            forms.forEach(form => form.reset());
            button.classList.remove("gray-button");
            sessionStorage.clear();
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred while submitting data (SendFormData). Please try again later.");
            submittingPopup.style.display = "none";
            button.classList.remove("gray-button");
        });
    }

    // Function to read files using FileReader
    function readFilesAndAppendToFormData(index = 0) {
        if (index < files.length) {
            let file = files[index];
            if (file) {
                let reader = new FileReader();
                reader.onload = function(e) {
                    formData.append("file" + (index + 1), e.target.result);
                    readFilesAndAppendToFormData(index + 1); // Read the next file
                };
                reader.onerror = function(e) {
                    console.error('File read error:', e);
                    alert("File reader is not working for file " + (index + 1) + ". Please try again.");
                    return;
                };
                reader.readAsDataURL(file);
            } else {
                readFilesAndAppendToFormData(index + 1); // Skip to the next file if current file input is empty
            }
        } else {
            sendFormData(); // All files have been read, now send the form data
        }
    }

    readFilesAndAppendToFormData(); // Start reading files
}

// Attach the event listener to the submit button
document.getElementById("submit").addEventListener("click", function(event) {
    event.preventDefault();  // Prevent the default form submission
    captureAndSendFormData(url);
});
