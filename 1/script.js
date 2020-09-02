let imgElement = document.getElementById('srcImage');
let imgLoad = document.getElementById('srcLoad');
let inputElement = document.getElementById('fileInput');

inputElement.addEventListener("change", (e) => {
  imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);

imgElement.onload = function() {
  let src = cv.imread(imgElement);
  //для хранения значений изображения
  let dst = new cv.Mat();
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
  //показываем картинку
  cv.imshow('outputCanvas', src);
  // You can try more different parameters
  //2 картинка
  cv.threshold(src, dst, 150, 255, cv.THRESH_BINARY);
  cv.imshow('outputCanvas1', dst);
  src.delete(); dst.delete();
}

function opencvIsReady() {
  document.getElementById('status').innerHTML = 'Библиотека OpenCV загружена';
  imgLoad.src=""; 
}

//Функция threshold возвращает изображение, в котором все пиксели, которые темнее (меньше) 127 заменены на 0,
// а все, которые ярче (больше) 127, — на 255.

// Этот метод принимает следующие параметры —
//
// src — Объект класса Mat, представляющий исходное (входное) изображение.
// dst — Объект класса Mat, представляющий целевое (выходное) изображение.
// thresh — переменная типа double, представляющая пороговое значение.
// maxval — переменная типа double, представляющая значение, которое должно быть задано, если значение пикселя превышает пороговое значение.
// тип — переменная целочисленного типа, представляющая тип порога, который будет использоваться.
