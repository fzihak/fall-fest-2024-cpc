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

document.getElementById('brightnessRange').addEventListener('input', (e) => {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.filters = [new fabric.Image.filters.Brightness({ brightness: parseFloat(e.target.value) })];
    obj.applyFilters();
    canvas.renderAll();
  }
});

document.getElementById('contrastRange').addEventListener('input', (e) => {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.filters = [new fabric.Image.filters.Contrast({ contrast: parseFloat(e.target.value) })];
    obj.applyFilters();
    canvas.renderAll();
  }
});

// Additional Brightness and Contrast Enhancement Function
function enhancePhoto(obj, brightnessValue, contrastValue) {
  obj.filters = [
    new fabric.Image.filters.Brightness({ brightness: brightnessValue }),
    new fabric.Image.filters.Contrast({ contrast: contrastValue })
  ];
  obj.applyFilters();
}

// Reset edits to default state
document.getElementById('resetEdits').addEventListener('click', () => {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.filters = [];
    obj.applyFilters();
    canvas.renderAll();
  }
});

document.getElementById('previewBtn').addEventListener('click', () => {
  const previewWindow = window.open('', '_blank');
  previewWindow.document.write(`<img src="${canvas.toDataURL('image/png')}" alt="Preview" style="width:100%;"/>`);
});

document.getElementById('downloadBtn').addEventListener('click', () => {
  const obj = canvas.getActiveObject();
  const canvasCopy = new fabric.Canvas('photoCanvas');
  const enhancedCanvas = canvasCopy.toDataURL('image/png');

  // Enhance the downloaded image
  const newCanvas = document.createElement('canvas');
  const ctx = newCanvas.getContext('2d');
  const img = new Image();
  img.onload = () => {
    newCanvas.width = frame.width;
    newCanvas.height = frame.height;

    ctx.drawImage(img, 0, 0, newCanvas.width, newCanvas.height);

    // Apply enhancement
    enhancePhoto(canvasCopy.getActiveObject(), 1.2, 1.1);

    // Create a link to download the enhanced photo
    const link = document.createElement('a');
    link.download = 'enhanced-framed-photo.png';
    link.href = newCanvas.toDataURL('image/png');
    link.click();
  };
  img.src = enhancedCanvas;
});
