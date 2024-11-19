const canvas = new fabric.Canvas('photoCanvas', {
  preserveObjectStacking: true,
  backgroundColor: '#fff',
});

const frameImage = './frames/frame1.png';
let frame;

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

document.getElementById('downloadBtn').addEventListener('click', () => {
  const highResCanvas = new fabric.Canvas(null, {
    width: canvas.width * 2, 
    height: canvas.height * 2,
    backgroundColor: canvas.backgroundColor,
  });

  canvas.getObjects().forEach((obj) => {
    obj.clone((clonedObj) => {
      clonedObj.scaleX *= 2; 
      clonedObj.scaleY *= 2;
      clonedObj.left *= 2;
      clonedObj.top *= 2;
      highResCanvas.add(clonedObj);
    });
  });

  setTimeout(() => {
    const link = document.createElement('a');
    link.download = 'CPC_fall-fest-2024.png';
    link.href = highResCanvas.toDataURL({
      format: 'png',
      quality: 1, 
    });
    link.click();
  }, 100);
});
