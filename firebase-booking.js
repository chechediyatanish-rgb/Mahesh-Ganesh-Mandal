import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const utsavStartDate = "2026-09-14";
const utsavEndDate = "2026-09-25";

function isValidUtsavDate(dateValue) {
  return dateValue >= utsavStartDate && dateValue <= utsavEndDate;
}

function hasFirebaseConfig() {
  return Object.values(firebaseConfig).every((value) => value && !value.startsWith("YOUR_"));
}

document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.querySelector("#bookingForm");
  if (!bookingForm) return;

  const submitButton = bookingForm.querySelector("button[type='submit']");
  const message = document.querySelector("#bookingMessage");
  const option1Date = document.querySelector("#option1Date");
  const option2Date = document.querySelector("#option2Date");
  const option1Time = document.querySelector("#option1Time");
  const option2Time = document.querySelector("#option2Time");

  let db = null;
  if (hasFirebaseConfig()) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }

  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstDate = option1Date.value;
    const secondDate = option2Date.value;
    const firstTime = option1Time.value;
    const secondTime = option2Time.value;

    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      return;
    }

    if (!isValidUtsavDate(firstDate) || !isValidUtsavDate(secondDate)) {
      message.textContent = "Please select dates between 14 September 2026 and 25 September 2026 only.";
      return;
    }

    if (firstDate === secondDate && firstTime === secondTime) {
      message.textContent = "Preferred Option 1 and Preferred Option 2 cannot have the same date and time.";
      return;
    }

    if (!db) {
      message.textContent = "Firebase config is missing. Please update firebase-config.js.";
      return;
    }

    submitButton.disabled = true;
    message.textContent = "Submitting booking request...";

    try {
      await addDoc(collection(db, "aarti_requests"), {
        name: document.querySelector("#name").value.trim(),
        mobileNumber: document.querySelector("#mobile").value.trim(),
        option1Date: firstDate,
        option1Time: firstTime,
        option2Date: secondDate,
        option2Time: secondTime,
        status: "Pending",
        createdAt: serverTimestamp()
      });

      bookingForm.reset();
      message.textContent = "Booking Request Submitted Successfully";
    } catch (error) {
      message.textContent = "Unable to submit booking request. Please try again.";
      console.error("Firestore booking error:", error);
    } finally {
      submitButton.disabled = false;
    }
  });
});
