const canvas = new fabric.Canvas('photoCanvas', {
  preserveObjectStacking: true,
  backgroundColor: '#fff',
});

const frameImage = './frames/frame1.png';
let frame, uploadedPhoto;

// Load and set the frame image
fabric.Image.fromURL(frameImage, (img) => {
  frame = img.set({
    selectable: false,
    evented: false,
  });

  // Add frame to the canvas (dimensions are adjusted dynamically)
  canvas.add(frame);
  frame.moveTo(9999);
});

document.getElementById('photoUpload').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      fabric.Image.fromURL(reader.result, (img) => {
        uploadedPhoto = img;

        // Resize canvas to match the original photo's dimensions
        canvas.setWidth(img.width);
        canvas.setHeight(img.height);

        // Scale frame to match the uploaded image
        frame.scaleToWidth(img.width);
        frame.scaleToHeight(img.height);

        // Add the uploaded photo to the canvas
        canvas.add(img);
        canvas.setActiveObject(img);
        frame.moveTo(9999); // Ensure frame is always on top
      });
    };
    reader.readAsDataURL(file);
  }
});

// High-quality download function
document.getElementById('downloadBtn').addEventListener('click', () => {
  if (!uploadedPhoto) {
    alert('Please upload a photo first!');
    return;
  }

  // Create a temporary canvas to match the original photo's resolution
  const highResCanvas = new fabric.Canvas(null, {
    width: uploadedPhoto.width,
    height: uploadedPhoto.height,
    backgroundColor: canvas.backgroundColor,
  });

  // Clone all objects from the main canvas
  canvas.getObjects().forEach((obj) => {
    obj.clone((clonedObj) => {
      highResCanvas.add(clonedObj);
    });
  });

  // Render high-resolution canvas and download the image
  setTimeout(() => {
    const link = document.createElement('a');
    link.download = 'high-quality-framed-photo.png';
    link.href = highResCanvas.toDataURL({
      format: 'png',
      quality: 1, // Maximum quality
    });
    link.click();
  }, 100);
});
