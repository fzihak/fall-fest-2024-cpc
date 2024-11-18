const canvas = new fabric.Canvas('photoCanvas', {
  preserveObjectStacking: true,
  backgroundColor: '#fff',
});

const frameImage = './frames/frame1.png';
let frame;

// Load and scale the frame image
fabric.Image.fromURL(frameImage, (img) => {
  const scaleX = 500 / img.width;
  const scaleY = 400 / img.height;
  const scale = Math.min(scaleX, scaleY);

  frame = img.set({
    selectable: false,
    evented: false,
    scaleX: scale,
    scaleY: scale,
  });

  canvas.setWidth(img.width * scale);
  canvas.setHeight(img.height * scale);
  canvas.add(frame);
  frame.moveTo(9999);
});

document.getElementById('photoUpload').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      fabric.Image.fromURL(reader.result, (img) => {
        const scaleX = frame.scaleX;
        const scaleY = frame.scaleY;
        img.scaleToWidth(frame.width * scaleX);
        img.scaleToHeight(frame.height * scaleY);

        canvas.add(img);
        canvas.setActiveObject(img);
        frame.moveTo(9999);
      });
    };
    reader.readAsDataURL(file);
  }
});

// Brightness filter
document.getElementById('brightnessRange').addEventListener('input', (e) => {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.filters = [new fabric.Image.filters.Brightness({ brightness: parseFloat(e.target.value) })];
    obj.applyFilters();
    canvas.renderAll();
  }
});

// Contrast filter
document.getElementById('contrastRange').addEventListener('input', (e) => {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.filters = [new fabric.Image.filters.Contrast({ contrast: parseFloat(e.target.value) })];
    obj.applyFilters();
    canvas.renderAll();
  }
});

// Reset edits
document.getElementById('resetEdits').addEventListener('click', () => {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.filters = [];
    obj.applyFilters();
    canvas.renderAll();
  }
});

// Preview the enhanced photo
document.getElementById('previewBtn').addEventListener('click', () => {
  const previewWindow = window.open('', '_blank');
  previewWindow.document.write(`<img src="${canvas.toDataURL('image/png')}" alt="Preview" style="width:100%;"/>`);
});

// Enhance photo before download
function enhancePhoto(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Adjust contrast and saturation (basic enhancement)
  const contrast = 1.1; // Slightly increase contrast
  const saturation = 1.2; // Slightly increase saturation
  const adjustBrightness = 10; // Add slight brightness

  for (let i = 0; i < data.length; i += 4) {
    // RGB values
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Apply saturation
    const gray = 0.3 * r + 0.59 * g + 0.11 * b;
    r += (r - gray) * (saturation - 1);
    g += (g - gray) * (saturation - 1);
    b += (b - gray) * (saturation - 1);

    // Apply contrast
    r = (r - 128) * contrast + 128;
    g = (g - 128) * contrast + 128;
    b = (b - 128) * contrast + 128;

    // Adjust brightness
    r += adjustBrightness;
    g += adjustBrightness;
    b += adjustBrightness;

    // Clamp values to stay within [0, 255]
    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
  }

  // Update canvas with enhanced data
  ctx.putImageData(imageData, 0, 0);
}

// Download the enhanced photo
document.getElementById('downloadBtn').addEventListener('click', () => {
  const canvasElement = document.createElement('canvas');
  const ctx = canvasElement.getContext('2d');

  // Set the canvas dimensions
  canvasElement.width = canvas.width;
  canvasElement.height = canvas.height;

  // Draw the current canvas onto the new canvas
  ctx.drawImage(canvas.lowerCanvasEl, 0, 0);

  // Apply photo enhancement
  enhancePhoto(ctx, canvas.width, canvas.height);

  // Create a download link for the enhanced image
  const link = document.createElement('a');
  link.download = 'enhanced-framed-photo.png';
  link.href = canvasElement.toDataURL('image/png');
  link.click();
});
