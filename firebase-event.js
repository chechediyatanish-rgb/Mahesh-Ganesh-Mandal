import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
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

    snapshot.forEach((doc) => {
      const data = doc.data();

      const item = document.createElement("article");
      item.className = "event-item";
      item.innerHTML = `<p>${data.text}</p>`;

      container.appendChild(item);
    });
  } catch (error) {
    console.error(error);
  }
}

loadAnnouncements();
