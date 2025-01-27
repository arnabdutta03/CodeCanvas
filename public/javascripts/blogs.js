document.addEventListener("DOMContentLoaded", () => {
  // Get elements
  const newPostBtn = document.getElementById("new"); // "New Post" link
  const modals = document.querySelectorAll(".modal"); // All modals (if you have multiple modals)
  const closeModalBtns = document.querySelectorAll(".close-btn"); // Close buttons inside modals

  // Check if elements exist
  if (!newPostBtn || !modals.length || !closeModalBtns.length) {
    console.error("One or more elements are missing in the DOM.");
    return;
  }

  // Show modal on "New Post" link click
  newPostBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const modal = document.getElementById("new-post-modal"); // Target the specific modal
    if (modal) {
      modal.classList.remove("hidden");
    }
  });

  // Hide modal on close button click
  closeModalBtns.forEach((closeBtn) => {
    closeBtn.addEventListener("click", () => {
      const modal = closeBtn.closest(".modal");
      if (modal) {
        modal.classList.add("hidden");
      }
    });
  });

  // Optional: Close modal if the user clicks outside the modal content
  modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.add("hidden");
      }
    });
  });
});
