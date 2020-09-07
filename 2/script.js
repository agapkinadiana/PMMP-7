let imgElement = document.getElementById('srcImage');
let imgElement1 = document.getElementById('srcImage1');
let imgElement2 = document.getElementById('srcImage2');
let imgElement3 = document.getElementById('srcImage3');
let imgElement4 = document.getElementById('srcImage4');
let inputElement = document.getElementById('fileInput');
let inputElement1 = document.getElementById('fileInput1');
let inputElement2 = document.getElementById('fileInput2');
let inputElement3 = document.getElementById('fileInput3');
let inputElement4 = document.getElementById('fileInput4');

inputElement.addEventListener("change", (e) => {
  imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);
inputElement1.addEventListener("change", (e) => {
  imgElement1.src = URL.createObjectURL(e.target.files[0]);
}, false);
inputElement2.addEventListener("change", (e) => {
  imgElement2.src = URL.createObjectURL(e.target.files[0]);
}, false);
inputElement3.addEventListener("change", (e) => {
  imgElement3.src = URL.createObjectURL(e.target.files[0]);
}, false);
inputElement4.addEventListener("change", (e) => {
  imgElement4.src = URL.createObjectURL(e.target.files[0]);
}, false);


imgElement.onload = function () {

  // 1.	cвертка изображения линейным фильтром с размером ядра 3х3 
  let mat = cv.imread(imgElement);
  let dst = new cv.Mat();
  let M = cv.Mat.eye(3, 3, cv.CV_32FC1);         // ядро свертки, одноканальная вещественная матрица.
  let anchor = new cv.Point(-1, -1);             // ведущая позиция ядра.
  cv.filter2D(mat, dst, cv.CV_8U, M, anchor, 0, cv.BORDER_DEFAULT);
  cv.imshow('convolution', dst);

  mat.delete(); 
  dst.delete(); 
  M.delete();

  // ядро свёртки — это матрица. якорь — это элемент матрицы (чаще всего — центр), который прикладывается к заданному пикселю изображения.
  // Работает свёртка очень просто:
  // При вычислении нового значения выбранного пикселя изображения, ядро свёртки прикладывается своим центром к этому пикселю. Соседние пиксели так же накрываются ядром.
  // Далее, вычисляется сумма произведений значений пикселей изображения на значения, накрывшего данный пиксель элемента ядра.
  // Полученная сумма и является новым значением выбранного пикселя.
  // Теперь, если применить свёртку к каждому пикселю изображения, то получится некий эффект, зависящий от выбранного ядра свертки.
}


imgElement1.onload = function () {
  //дро можно рассматривать как шаблон или маску.

  // 2.	сглаживание изображений  функциями
  let mat = cv.imread(imgElement1);
  let dst = new cv.Mat();
  let anchor = new cv.Point(-1, -1); 
  let ksize = new cv.Size(3, 3);

  // Функция blur выполняет размытие посредством вычисления свертки
  // исходного изображения с ядром :
  // В этом процессе центральный элемент изображения заменяется средним значением всех пикселей в области ядра.
  cv.blur(mat, dst, ksize, anchor, cv.BORDER_DEFAULT);
  cv.imshow('blur', dst);

  // Функция boxFilter использует ядро более общего вида
  // Параметр normalize по существу представляет флаг, который указывает, является ли ядро нормализованным или нет.
  // Операция Box Filter аналогична операции усреднения размытия; это применяет двустороннее изображение к фильтру.
  // Здесь вы можете выбрать, будет ли поле нормализовано или нет.
  cv.boxFilter(mat, dst, -1, ksize, anchor, true, cv.BORDER_DEFAULT)
  cv.imshow('boxFilter', dst);

  // Фильтр Гаусса представляет собой фильтр нижних частот, который удаляет высокочастотные составляющие.
  // осуществляет размытия с помощью вычисления свертки изображения с дискретным ядром Гаусса со стандартными
  // отклонениями, равными sigmaX и sigmaY по осям Ox и Oy соответственно
  cv.GaussianBlur(mat, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
  cv.imshow('gaussianBlur', dst);

  // Операция медианного размытия аналогична другим методам усреднения. Здесь центральный элемент изображения
  // заменяется медианой всех пикселей в области ядра. Эта операция обрабатывает края при удалении шума.
  cv.medianBlur(mat, dst, 5);
  cv.imshow('medianBlur', dst);


  //dst–свертка. Имеет такое же количество каналов и глубину, что и исходное изображение
  //ddepth–глубина результирующего изображения. Если на вход функции передано отрицательное значение, то глубина совпадает с глубиной входного изображения
  //kernel–ядро свертки, одноканальная вещественная матрица
  //anchor–ведущая  позиция  ядра.По  умолчанию  принимает значение  (-1,-1),  которое  означает,  что  ведущая  позиция расположена в центре ядра.
  mat.delete(); 
  dst.delete(); 
}






imgElement2.onload = function () {
  //3.	функций эрозии и дилатации, применительно к бинарному изображению 
  let mat = cv.imread(imgElement2);
  let dst = new cv.Mat();
  let anchor = new cv.Point(-1, -1);
  let M = cv.Mat.ones(5, 5, cv.CV_8U);

  // Но вычисленное здесь значение пикселя является минимальным, а не максимальным при расширении. Изображение заменяется под точкой привязки с этим минимальным значением пикселя.
  // При этой процедуре области темных областей увеличиваются в размерах, а яркие области уменьшаются. Например,
  // размер объекта в темном или черном оттенке увеличивается, в то время как уменьшается в белом или ярком оттенке.
  cv.erode(mat, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
  cv.imshow('erosion', dst);

  // Эта процедура следует за сверткой с некоторым ядром определенной формы, такой как квадрат или круг. Это ядро ​​имеет опорную точку, которая обозначает его центр.
  // Это ядро ​​накладывается на изображение, чтобы вычислить максимальное значение пикселя. После расчета картина заменяется на якорь в центре.
  // При этой процедуре области ярких областей увеличиваются в размере и, следовательно, увеличивается размер изображения.
  // Например, размер объекта в белом оттенке или ярком оттенке увеличивается, в то время как размер объекта в черном оттенке или темном оттенке уменьшается.
  cv.dilate(mat, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
  cv.imshow('dilation', dst);

  
  mat.delete(); 
  dst.delete(); 
  M.delete();
}






imgElement3.onload = function () {
  //4.	поиск границ на изображении с помощью детектора ребер Канни
  let mat = cv.imread(imgElement3);
  let dst = new cv.Mat();
  let dst1 = new cv.Mat();
  let anchor = new cv.Point(-1, -1);
  let ksize = new cv.Size(3, 3);

  // перед непосредственным применением детектора выполняется размытие изображения (blur) и преобразование в оттенки серого (cvtColor).
  cv.blur(mat, dst1, ksize, anchor, cv.BORDER_DEFAULT);
  cv.cvtColor(dst1, dst1, cv.COLOR_RGBA2GRAY);

  cv.Canny(dst1, dst, 50, 100, 3, false);
  cv.imshow('canny', dst);
  //edges–результирующая карта ребер, представляется матрицей, размер которой совпадает с размером исходного изображения
  //threshold1,threshold2–параметры  алгоритма,  пороговые значения для отсечения
  //apertureSize–размер  апертуры  для  применения  оператора Собеля
  //L2gradient–флаг, который указывает, по какой норме  будет вычисляться магнитуда градиента.

  // Алгоритм состоит из пяти отдельных шагов:
  // Сглаживание. Размытие изображения для удаления шума.
  // Поиск градиентов. Границы отмечаются там, где градиент изображения приобретает максимальное значение. Оператор Собеля часто
  // применяют в алгоритмах выделения границ. По сути, это дискретный дифференциальный оператор, вычисляющий приближенное значение
  // градиента яркости изображения. Результатом применения оператора Собеля в каждой точке изображения является либо вектор градиента
  // яркости в этой точке, либо его норма.
  // Подавление не-максимумов. Только локальные максимумы отмечаются как границы. Пикселями границ объявляются пиксели, в которых
  // достигается локальный максимум градиента в направлении вектора градиента. Значение направления должно быть кратно 45°.
  // Двойная пороговая фильтрация. Потенциальные границы определяются порогами.
  // Трассировка области неоднозначности. Итоговые границы определяются путём подавления всех краёв,
  // несвязанных с определенными (сильными) границами.
  mat.delete(); 
  dst.delete(); 
}




imgElement4.onload = function () {
  //5.	выравнивания гистограммы изображения

  // Гистограмма изображения показывает частоту значений интенсивности пикселей.
  // Выравнивание гистограммы улучшает контраст изображения, чтобы расширить диапазон интенсивности.

  let mat = cv.imread(imgElement4);
  let dst = new cv.Mat();
  cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY, 0);
  cv.equalizeHist(mat, dst);
  cv.imshow('hist', dst);

  mat.delete(); 
  dst.delete(); 
}

function opencvIsReady() {
  document.getElementById('status').innerHTML = 'OpenCV.js is ready.'
}
