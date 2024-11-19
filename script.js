const canvas = new fabric.Canvas('photoCanvas', {
  preserveObjectStacking: true,
  backgroundColor: '#fff',
});

let frame;
let uploadedImage;
let originalImageData;

const frameImage = './frames/frame1.png'; 
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

        originalImageData = img.toObject();

        canvas.add(img);
        canvas.setActiveObject(img);
        frame.moveTo(9999);
        updateImageFilters();
      });
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById('brightnessRange').addEventListener('input', updateImageFilters);
document.getElementById('contrastRange').addEventListener('input', updateImageFilters);
document.getElementById('resetEdits').addEventListener('click', resetEdits);
document.getElementById('previewBtn').addEventListener('click', previewEdits);
document.getElementById('downloadBtn').addEventListener('click', downloadHighResImage);

function updateImageFilters() {
  const brightnessValue = parseFloat(document.getElementById('brightnessRange').value);
  const contrastValue = parseFloat(document.getElementById('contrastRange').value);

  const image = canvas.getActiveObject();

  if (image && image.isType('image')) {
    image.filters = [];

    const brightnessFilter = new fabric.Image.filters.Brightness({
      brightness: brightnessValue,
    });

    const contrastFilter = new fabric.Image.filters.Contrast({
      contrast: contrastValue,
    });

    image.filters.push(brightnessFilter, contrastFilter);
    image.applyFilters();
    canvas.renderAll();
  }
}

function resetEdits() {
  const image = canvas.getActiveObject();
  if (image && image.isType('image') && originalImageData) {
    image.set(originalImageData);
    image.applyFilters();
    canvas.renderAll();
  }
}

function previewEdits() {
  const image = canvas.getActiveObject();
  if (image && image.isType('image')) {
    canvas.renderAll();
  }
}

function downloadHighResImage() {
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
}


const carouselSlide = document.querySelector('.carousel-slide');
const carouselItems = document.querySelectorAll('.carousel-item');

let counter = 0;
const size = carouselItems[0].clientWidth;

function slide() {
  if (counter >= carouselItems.length - 3) {
    counter = 0;
  } else {
    counter++;
  }
  carouselSlide.style.transform = `translateX(${-counter * size}px)`;
}

setInterval(slide, 3000);

const countdownDate = new Date("November 22, 2024 23:59:00").getTime();
const x = setInterval(function() {
  const now = new Date().getTime();
  const distance = countdownDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  document.getElementById("days").innerHTML = days;
  document.getElementById("hours").innerHTML = hours;
  document.getElementById("minutes").innerHTML = minutes;
  document.getElementById("seconds").innerHTML = seconds;
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("timer").innerHTML = "Registration Closed";
  }
}, 1000);


