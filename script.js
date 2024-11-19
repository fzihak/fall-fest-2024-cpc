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

// High-quality download function
document.getElementById('downloadBtn').addEventListener('click', () => {
  // Create a temporary high-resolution canvas
  const highResCanvas = new fabric.Canvas(null, {
    width: canvas.width * 2, // Increase resolution by 2x
    height: canvas.height * 2,
    backgroundColor: canvas.backgroundColor,
  });

  // Clone all objects from the main canvas
  canvas.getObjects().forEach((obj) => {
    obj.clone((clonedObj) => {
      clonedObj.scaleX *= 2; // Scale objects for high resolution
      clonedObj.scaleY *= 2;
      clonedObj.left *= 2;
      clonedObj.top *= 2;
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
