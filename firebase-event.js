import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadAnnouncements() {
  const container = document.getElementById("announcementList");
  if (!container) return;

  try {
    const q = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      container.innerHTML = "<p>No announcements yet.</p>";
      return;
    }

    container.innerHTML = "";

    snapshot.forEach((announcementDoc) => {
     const data = announcementDoc.data();

      const item = document.createElement("article");
      item.className = "event-item";
      item.innerHTML =`<p>${data.text}</p>`;

      container.appendChild(item);
});
       } catch (error) {
    console.error(error);
  }
}

loadAnnouncements();
async function loadWinners() {
  const container = document.getElementById("winnerList");
  if (!container) return;

  try {
    const q = query(
      collection(db, "game_winners"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      container.innerHTML = "<p>Winners will be announced soon.</p>";
      return;
    }

    container.innerHTML = "";

    snapshot.forEach((doc) => {
      const data = doc.data();

      const item = document.createElement("article");
      item.className = "event-item";

      item.innerHTML = `
        <h3>${data.gameName}</h3>
        <p>🥇 ${data.firstRank}</p>
        <p>🥈 ${data.secondRank}</p>
        <p>🥉 ${data.thirdRank}</p>
      `;

      container.appendChild(item);
    });
  } catch (error) {
    console.error(error);
  }
}
loadAnnouncements();
loadWinners();
