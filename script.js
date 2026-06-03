const bookingKey = "mgm_aarti_bookings";
function getBookings() {
  return JSON.parse(localStorage.getItem(bookingKey) || "[]");
}

function saveBookings(bookings) {
  localStorage.setItem(bookingKey, JSON.stringify(bookings));
}

function createBookingCard(booking) {
  const option1 = booking.option1 || `${booking.option1Date || ""} ${booking.option1Time || ""}`.trim();
  const option2 = booking.option2 || `${booking.option2Date || ""} ${booking.option2Time || ""}`.trim();
  const card = document.createElement("article");
  card.className = "booking-card";
  card.innerHTML = `
    <h3>${booking.name}</h3>
    <p><strong>Mobile:</strong> ${booking.mobile}</p>
    <p><strong>Preferred Option 1:</strong> ${option1}</p>
    <p><strong>Preferred Option 2:</strong> ${option2}</p>
    <p><strong>Status:</strong> <span class="status-pill">${booking.status}</span></p>
    <p><strong>Booking ID:</strong> ${booking.id}</p>
  `;
  return card;
}

function renderBookings(container, bookings, emptyText) {
  if (!container) return;
  container.innerHTML = "";

  if (!bookings.length) {
    const empty = document.createElement("p");
    empty.className = "form-message";
    empty.textContent = emptyText;
    container.appendChild(empty);
    return;
  }

  bookings.forEach((booking) => container.appendChild(createBookingCard(booking)));
}

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const checkStatus = document.querySelector("#checkStatus");
  if (checkStatus) {
    checkStatus.addEventListener("click", () => {
      const mobile = document.querySelector("#statusMobile").value.trim();
      const matches = getBookings().filter((booking) => booking.mobile === mobile);
      renderBookings(document.querySelector("#statusResults"), matches, "No booking found for this mobile number.");
    });
  }

});
