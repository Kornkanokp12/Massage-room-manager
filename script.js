const addRoomBtn = document.getElementById("addRoomBtn");
const roomModal = document.getElementById("roomModal");
const closeModal = document.getElementById("closeModal");
const roomForm = document.getElementById("roomForm");
const roomContainer = document.getElementById("roomContainer");
const modalTitle = document.getElementById("modalTitle");

const roomNameInput = document.getElementById("roomName");
const therapistInput = document.getElementById("therapistName");
const statusInput = document.getElementById("roomStatus");

let editingCard = null;

// Open Add Room form
addRoomBtn.addEventListener("click", () => {
    editingCard = null;
    modalTitle.textContent = "Add Room";
    roomForm.reset();
    roomModal.style.display = "block";
});

// Close form
closeModal.addEventListener("click", () => {
    roomModal.style.display = "none";
});

// Close when clicking outside form
window.addEventListener("click", (event) => {
    if (event.target === roomModal) {
        roomModal.style.display = "none";
    }
});

// Save room
roomForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const roomName = roomNameInput.value.trim();
    const therapist =
        therapistInput.value.trim() || "Not Assigned";
    const status = statusInput.value;

    if (editingCard) {
        updateRoomCard(
            editingCard,
            roomName,
            therapist,
            status
        );
    } else {
        createRoomCard(
            roomName,
            therapist,
            status
        );
    }

    roomModal.style.display = "none";
    roomForm.reset();
    editingCard = null;

    updateSummary();
});

// Create room
function createRoomCard(roomName, therapist, status) {

    const card = document.createElement("div");
    card.className = "room-card";

    card.innerHTML = `
        <div class="room-header">
            <h3>${roomName}</h3>
            <span class="status ${getStatusClass(status)}">
                ${status}
            </span>
        </div>

        <p>
            <strong>Therapist:</strong>
            <span class="therapist">${therapist}</span>
        </p>

        <div class="room-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    roomContainer.appendChild(card);
}

// Update room
function updateRoomCard(card, roomName, therapist, status) {

    card.querySelector("h3").textContent = roomName;

    card.querySelector(".therapist").textContent =
        therapist;

    const statusElement =
        card.querySelector(".status");

    statusElement.textContent = status;

    statusElement.className =
        "status " + getStatusClass(status);
}

// Edit and Delete
roomContainer.addEventListener("click", (event) => {

    const card = event.target.closest(".room-card");

    if (!card) return;

    // Delete
    if (event.target.classList.contains("delete-btn")) {

        const roomName =
            card.querySelector("h3").textContent;

        const confirmDelete =
            confirm(`Delete ${roomName}?`);

        if (confirmDelete) {
            card.remove();
            updateSummary();
        }
    }

    // Edit
    if (event.target.classList.contains("edit-btn")) {

        editingCard = card;

        modalTitle.textContent = "Edit Room";

        roomNameInput.value =
            card.querySelector("h3").textContent;

        therapistInput.value =
            card.querySelector(".therapist")?.textContent.trim()
            || card.querySelector("p").textContent
                .replace("Therapist:", "")
                .trim();

        statusInput.value =
            card.querySelector(".status").textContent.trim();

        roomModal.style.display = "block";
    }
});

// Status CSS class
function getStatusClass(status) {

    if (status === "Available") {
        return "available";
    }

    if (status === "In Use") {
        return "in-use";
    }

    return "cleaning";
}

// Update dashboard numbers
function updateSummary() {

    const cards =
        document.querySelectorAll(".room-card");

    let available = 0;
    let inUse = 0;
    let cleaning = 0;

    cards.forEach((card) => {

        const status =
            card.querySelector(".status")
                .textContent.trim();

        if (status === "Available") {
            available++;
        }

        if (status === "In Use") {
            inUse++;
        }

        if (status === "Needs Cleaning") {
            cleaning++;
        }
    });

    document.getElementById("totalRooms").textContent =
        cards.length;

    document.getElementById("availableRooms").textContent =
        available;

    document.getElementById("inUseRooms").textContent =
        inUse;

    document.getElementById("cleaningRooms").textContent =
        cleaning;
}

updateSummary();