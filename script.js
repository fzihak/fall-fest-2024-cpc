const fileInput = document.getElementById("fileInput");
const photo = document.getElementById("photo");
const frame = document.getElementById("frame");
const brightnessSlider = document.getElementById("brightnessSlider");
const contrastSlider = document.getElementById("contrastSlider");
const previewButton = document.getElementById("preview");
const downloadButton = document.getElementById("download");

let isDragging = false;
let startX, startY;

// Upload Image
fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            photo.src = e.target.result;
            photo.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

// Drag and Move Photo
const startDrag = (e) => {
    isDragging = true;
    startX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    startY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
};

const moveDrag = (e) => {
    if (!isDragging) return;

    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    photo.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    startX = clientX;
    startY = clientY;
};

const endDrag = () => {
    isDragging = false;
};

// Apply Drag Events
photo.addEventListener("mousedown", startDrag);
photo.addEventListener("mousemove", moveDrag);
photo.addEventListener("mouseup", endDrag);

photo.addEventListener("touchstart", startDrag, { passive: false });
photo.addEventListener("touchmove", moveDrag, { passive: false });
photo.addEventListener("touchend", endDrag);

// Brightness and Contrast
brightnessSlider.addEventListener("input", () => {
    updateFilters();
});

contrastSlider.addEventListener("input", () => {
    updateFilters();
});

function updateFilters() {
    const brightness = brightnessSlider.value;
    const contrast = contrastSlider.value;
    photo.style.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
}

// Preview Photo
previewButton.addEventListener("click", () => {
    alert("Preview functionality is under development!");
});

// Download Photo
downloadButton.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = frame.offsetWidth;
    canvas.height = frame.offsetHeight;

    ctx.drawImage(photo, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

    const link = document.createElement("a");
    link.download = "edited-photo.png";
    link.href = canvas.toDataURL();
    link.click();
});
