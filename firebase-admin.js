import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  addDoc,
  deleteDoc,
getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const adminPassword = "tanish#satyam777";
// const admins = ["Tani", "Satyam Chechediya"];

function hasFirebaseConfig() {
  return Object.values(firebaseConfig).every((value) => value && !value.startsWith("YOUR_"));
}

function createRequestCard(request, onStatusChange) {
  const status = request.status || "Pending";
  const card = document.createElement("article");
  card.className = "booking-card admin-request-card";
  card.innerHTML = `
    <div class="booking-card-head">
      <h3>${request.name || "Unnamed Devotee"}</h3>
      <span class="status-pill status-${status.toLowerCase()}">${status}</span>
    </div>
    <p><strong>Mobile Number:</strong> ${request.mobileNumber || "-"}</p>
    <p><strong>Option 1 Date:</strong> ${request.option1Date || "-"}</p>
    <p><strong>Option 1 Time:</strong> ${request.option1Time || "-"}</p>
    <p><strong>Option 2 Date:</strong> ${request.option2Date || "-"}</p>
    <p><strong>Option 2 Time:</strong> ${request.option2Time || "-"}</p>
    <div class="admin-actions">
      <button class="btn btn-approve" type="button" data-status="Approved">Approve</button>
      <button class="btn btn-reject" type="button" data-status="Rejected">Reject</button>
    </div>
  `;

  card.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", () => onStatusChange(request.id, button.dataset.status, card));
  });

  return card;
}

function renderRequests(container, requests, onStatusChange) {
  container.innerHTML = "";

  if (!requests.length) {
    const empty = document.createElement("p");
    empty.className = "form-message";
    empty.textContent = "No booking requests found.";
    container.appendChild(empty);
    return;
  }

  requests.forEach((request) => {
    container.appendChild(createRequestCard(request, onStatusChange));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const adminLogin = document.querySelector("#adminLogin");
  const loginPanel = document.querySelector("#loginPanel");
  const adminPanel = document.querySelector("#adminPanel");
  const adminBookings = document.querySelector("#adminBookings");
  const adminMessage = document.querySelector("#adminMessage");
  const logoutAdmin = document.querySelector("#logoutAdmin");

  if (!adminLogin || !adminPanel || !adminBookings || !adminMessage) return;

if (!hasFirebaseConfig()) {
  adminMessage.textContent = "Firebase config is missing.";
  return;
}

  async function updateRequestStatus(requestId, status, card) {
    if (!db) return;

    card.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
    });
    adminMessage.textContent = `Updating status to ${status}...`;

    try {
      await updateDoc(doc(db, "aarti_requests", requestId), {
        status,
        updatedAt: serverTimestamp()
      });
      adminMessage.textContent = `Status updated to ${status}.`;
      await loadRequests();
    } catch (error) {
      adminMessage.textContent = "Unable to update status. Please try again.";
      card.querySelectorAll("button").forEach((button) => {
        button.disabled = false;
      });
      console.error("Firestore admin update error:", error);
    }
  }

  async function loadRequests() {
    if (!db) {
      adminMessage.textContent = "Firebase config is missing. Please update firebase-config.js.";
      return;
    }

    adminMessage.textContent = "Loading booking requests...";

    try {
      const requestsQuery = query(collection(db, "aarti_requests"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(requestsQuery);
      const requests = snapshot.docs.map((requestDoc) => ({
        id: requestDoc.id,
        ...requestDoc.data()
      }));

      renderRequests(adminBookings, requests, updateRequestStatus);
      adminMessage.textContent = "";
    } catch (error) {
      adminMessage.textContent = "Unable to load booking requests. Please check Firebase permissions.";
      console.error("Firestore admin load error:", error);
    }
  }

  adminLogin.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector("#adminName").value.trim();
const password = document.querySelector("#adminPassword").value;

if (
  !(
    (username === "tanish" && password === "tanish942666") ||
    (username === "satyam" && password === "satyam@927777")
  )
) {
  alert("Invalid admin login details.");
  return;
}

    loginPanel.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    window.isAdminLoggedIn = true;
    loadAnnouncements();
    await loadRequests();
  });

  logoutAdmin.addEventListener("click", () => {
window.isAdminLoggedIn = false;
    
    adminPanel.classList.add("hidden");
    loginPanel.classList.remove("hidden");
    adminBookings.innerHTML = "";
    adminMessage.textContent = "";
    adminLogin.reset();
  });

const addAnnouncementBtn = document.querySelector("#addAnnouncement");

if (addAnnouncementBtn) {
  addAnnouncementBtn.addEventListener("click", async () => {
    const text = document.querySelector("#announcementText").value.trim();

    if (!text) {
      alert("Enter announcement first");
      return;
    }

    try {
      await addDoc(collection(db, "announcements"), {
        text: text,
        createdAt: serverTimestamp()
      });

      document.querySelector("#announcementText").value = "";
      alert("Announcement Saved Successfully");
      loadAnnouncements();
    } catch (error) {
      console.error(error);
      alert("Error saving announcement");
       }
  });
 
  const saveWinnerBtn = document.querySelector("#saveWinner");

if (saveWinnerBtn) {
  saveWinnerBtn.addEventListener("click", async () => {
    const gameName = document.querySelector("#gameName").value.trim();
    const firstRank = document.querySelector("#firstRank").value.trim();
    const secondRank = document.querySelector("#secondRank").value.trim();
    const thirdRank = document.querySelector("#thirdRank").value.trim();

    if (!gameName) {
      alert("Enter Game Name");
      return;
    }

    try {
      await addDoc(collection(db, "game_winners"), {
        gameName,
        firstRank,
        secondRank,
        thirdRank,
        createdAt: serverTimestamp()
      });

      document.querySelector("#gameName").value = "";
      document.querySelector("#firstRank").value = "";
      document.querySelector("#secondRank").value = "";
      document.querySelector("#thirdRank").value = "";

      alert("Winner Saved Successfully");
      loadWinnersAdmin();
    } catch (error) {
      console.error(error);
      alert("Error Saving Winner");
    }
  });
}
}
});
async function loadAnnouncements() {
  const announcementList = document.querySelector("#announcementList");

  if (!announcementList) return;

  announcementList.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "announcements"));

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      const div = document.createElement("div");

      div.innerHTML = `
        <p>${data.text}</p>
        <button class="deleteAnnouncement" data-id="${docSnap.id}">
          Delete
        </button>
      `;

      announcementList.appendChild(div);
    });

    document.querySelectorAll(".deleteAnnouncement").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;

        await deleteDoc(doc(db, "announcements", id));

        loadAnnouncements();
      });
    });

  } catch (error) {
    console.error(error);
  }
}
async function loadWinnersAdmin() {
    const winnerList = document.querySelector("#winnerList");

    if (!winnerList) return;

    winnerList.innerHTML = "";

    try {
        const snapshot = await getDocs(collection(db, "game_winners"));

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();

            const div = document.createElement("div");

            div.innerHTML = `
                <h4>${data.gameName}</h4>
                <p>🥇 ${data.firstRank}</p>
                <p>🥈 ${data.secondRank}</p>
                <p>🥉 ${data.thirdRank}</p>
<button class="editWinner"
data-id="${docSnap.id}"
data-game="${data.gameName}"
data-first="${data.firstRank}"
data-second="${data.secondRank}"
data-third="${data.thirdRank}">
    Edit Winner
</button>

<button class="deleteWinner" data-id="${docSnap.id}">
    Delete Winner
</button>
               
            `;

            winnerList.appendChild(div);
        });

        document.querySelectorAll(".deleteWinner").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const id = btn.dataset.id;

                await deleteDoc(doc(db, "game_winners", id));

                loadWinnersAdmin();
            });
        });
document.querySelectorAll(".editWinner").forEach((btn) => {
  btn.addEventListener("click", () => {

    document.querySelector("#gameName").value = btn.dataset.game;
    document.querySelector("#firstRank").value = btn.dataset.first;
    document.querySelector("#secondRank").value = btn.dataset.second;
    document.querySelector("#thirdRank").value = btn.dataset.third;

    deleteDoc(doc(db, "game_winners", btn.dataset.id));

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});
    } catch (error) {
        console.error(error);
    }
}
