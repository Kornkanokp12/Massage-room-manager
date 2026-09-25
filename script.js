
const SUPABASE_URL = "https://xcpxzyaporcxrjdfecdd.supabase.co"
const SUPABASE_KEY = "sb_publishable_mx8YTSl1ZDf04lKGyMNYbg_hfdtm1fh"

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
const addRoomBtn = document.getElementById("addRoomBtn");
const roomModal = document.getElementById("roomModal");
const closeModal = document.getElementById("closeModal");
const roomForm = document.getElementById("roomForm");
const roomContainer = document.getElementById("roomContainer");
const modalTitle = document.getElementById("modalTitle");

const roomNameInput = document.getElementById("roomName");
const therapistInput = document.getElementById("therapistName");
const statusInput = document.getElementById("roomStatus");

let editingRoomId = null;


// ========================================
// LOAD ROOMS FROM SUPABASE
// ========================================

async function loadRooms() {

    const { data, error } = await supabaseClient
        .from("rooms")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error("Error loading rooms:", error);
        alert("Could not load rooms from database.");
        return;
    }

    roomContainer.innerHTML = "";

    data.forEach(room => {
        createRoomCard(room);
    });

    updateSummary();
}


// ========================================
// CREATE ROOM CARD
// ========================================

function createRoomCard(room) {

    const card = document.createElement("div");
    card.className = "room-card";

    card.dataset.id = room.id;

    card.innerHTML = `
        <div class="room-header">
            <h3>${room.room_name}</h3>

            <span class="status ${getStatusClass(room.status)}">
                ${room.status}
            </span>
        </div>

        <p>
            <strong>Therapist:</strong>
            <span class="therapist">
                ${room.therapist || "Not Assigned"}
            </span>
        </p>

        <div class="room-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    roomContainer.appendChild(card);
}


// ========================================
// OPEN ADD ROOM FORM
// ========================================

addRoomBtn.addEventListener("click", () => {

    editingRoomId = null;

    modalTitle.textContent = "Add Room";

    roomForm.reset();

    roomModal.style.display = "block";
});


// ========================================
// CLOSE MODAL
// ========================================

closeModal.addEventListener("click", () => {
    roomModal.style.display = "none";
});


window.addEventListener("click", event => {

    if (event.target === roomModal) {
        roomModal.style.display = "none";
    }
});


// ========================================
// ADD OR UPDATE ROOM
// ========================================

roomForm.addEventListener("submit", async event => {

    event.preventDefault();

    const roomName = roomNameInput.value.trim();

    const therapist =
        therapistInput.value.trim() || "Not Assigned";

    const status = statusInput.value;


    // UPDATE EXISTING ROOM
    if (editingRoomId) {

        const { error } = await supabaseClient
            .from("rooms")
            .update({
                room_name: roomName,
                therapist: therapist,
                status: status
            })
            .eq("id", editingRoomId);

        if (error) {
            console.error(error);
            alert("Error updating room.");
            return;
        }

    }

    // CREATE NEW ROOM
    else {

        const { error } = await supabaseClient
            .from("rooms")
            .insert([
                {
                    room_name: roomName,
                    therapist: therapist,
                    status: status
                }
            ]);

        if (error) {
            console.error(error);
            alert("Error adding room.");
            return;
        }
    }


    roomModal.style.display = "none";

    roomForm.reset();

    editingRoomId = null;

    await loadRooms();
});


// ========================================
// EDIT OR DELETE ROOM
// ========================================

roomContainer.addEventListener("click", async event => {

    const card = event.target.closest(".room-card");

    if (!card) return;

    const roomId = card.dataset.id;


    // EDIT
    if (event.target.classList.contains("edit-btn")) {

        editingRoomId = roomId;

        modalTitle.textContent = "Edit Room";

        roomNameInput.value =
            card.querySelector("h3").textContent.trim();

        therapistInput.value =
            card.querySelector(".therapist")
                .textContent.trim();

        statusInput.value =
            card.querySelector(".status")
                .textContent.trim();

        roomModal.style.display = "block";
    }


    // DELETE
    if (event.target.classList.contains("delete-btn")) {

        const roomName =
            card.querySelector("h3").textContent.trim();

        const confirmDelete =
            confirm(`Delete ${roomName}?`);

        if (!confirmDelete) return;


        const { error } = await supabaseClient
            .from("rooms")
            .delete()
            .eq("id", roomId);


        if (error) {
            console.error(error);
            alert("Error deleting room.");
            return;
        }


        await loadRooms();
    }
});


// ========================================
// STATUS STYLE
// ========================================

function getStatusClass(status) {

    if (status === "Available") {
        return "available";
    }

    if (status === "In Use") {
        return "in-use";
    }

    return "cleaning";
}


// ========================================
// UPDATE DASHBOARD NUMBERS
// ========================================

function updateSummary() {

    const cards =
        document.querySelectorAll(".room-card");

    let available = 0;
    let inUse = 0;
    let cleaning = 0;


    cards.forEach(card => {

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


// ========================================
// START APPLICATION
// ========================================

loadRooms();