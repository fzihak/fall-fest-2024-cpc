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

function enhancePhoto(obj) {
  if (!obj) return;


  obj.filters = [
    new fabric.Image.filters.Brightness({ brightness: 0.1 }), 
    new fabric.Image.filters.Contrast({ contrast: 0.1 }), 
    new fabric.Image.filters.Saturation({ saturation: 0.2 }),
  ];

  obj.applyFilters();
  canvas.renderAll();
}

document.getElementById('downloadBtn').addEventListener('click', () => {
  const activeObjects = canvas.getObjects();

  activeObjects.forEach((obj) => {
    if (obj.type === 'image') enhancePhoto(obj);
  });

  const link = document.createElement('a');
  link.download = 'cpc-fall-fesr-2024.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
