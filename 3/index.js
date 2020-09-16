//const LZUTF8 = require("lzutf8");

const mediaSource = new MediaSource();

function onStart() {
  /**
   * Определяем наличие медийных данных пользователя
   * Переопределяем метод получения данных для разных браузеров
   */
  navigator.getUserMedia = ( navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia ||
                             navigator.msGetUserMedia);
  //
  let video;
  var canvas;
  var take_button;
  var save_button;
  var message;
  //
    /**
     * Определяем ссылки на элементы 
     * управления используемые в примере
     */
    video =  document.getElementById("video");
    canvas = document.getElementById('canvas');
    take_button = document.getElementById('take_button');
    save_button = document.getElementById('save_button');
    message = document.getElementById('message');
    /**
     * Если нет возможности получить медийные данные, 
     * показываем соответсвующее сообщение и прекратим работу
     */
    if(!navigator.getUserMedia) 
    {
      message.innerHTML = 'Your browser does not support using the camera!';
      take_button.disabled = true;
      return;
    }
    /**
     * Получаем данные от браузера
     * В первом параметре указываем требования для данных
     * В нашем случае, это видео с веб-камеры
     */
    navigator.getUserMedia({ video : true }, 
    /**
     * Обрабатываем событие успешного получения данных
     * Задаем полученый поток видео элементу
     */
    function (stream)
    {
      if ('srcObject' in video) {
        video.srcObject = stream;
      } else {
        // Avoid using this in new browsers, as it is going away.
        video.src = URL.createObjectURL(mediaSource);
      }
    }, 
    /**
     * Обрабатываем событие отказа при получении данных
     * Покажем соответсвующее сообщение
     */
    function ()
    {
      message.innerHTML = 'No access to the camera';
      take_button.disabled = true;
    });  
}

function onSobel(){
    
    // Одним из самых используемых методов выделения краев — оператор Собеля. Это дискретный дифференциальный оператор, вычисляющий приближенное значение градиента яркости изображения. Результатом применения оператора Собеля в каждой точке является вектор градиента яркости или его норма. Оператор Собеля основан на свёртке изображения небольшими целочисленными фильтрами в вертикальном и горизонтальном направлениях.

  let video =  document.getElementById("video");
  let height = 300;
  let width = 300;
  let canvasFrame = document.getElementById("canvas"); // canvas is the id of <canvas>
  let context = canvasFrame.getContext("2d");
  let src = new cv.Mat(height, width, cv.CV_8UC4);
  let dst = new cv.Mat(height, width, cv.CV_8UC4);
  const FPS = 30;
  function processVideo() {
      let begin = Date.now(context.getImageData(0, 0, width, height).data);
      context.drawImage(video, 0, 0, width, height);
      let img = context.getImageData(0, 0, width, height).data;
      src.data.set(img);
      cv.Sobel(src, dst, cv.CV_16S, 1, 0, 7);
      cv.imshow("canvas", dst); // canvas is the id of another <canvas>;
      // schedule next one.
      let delay = 1000/FPS - (Date.now() - begin);
      setTimeout(processVideo, delay);
  }
  // schedule first one.
  setTimeout(processVideo, 0);
}

function onCanny(){
  let video =  document.getElementById("video");
  let height = 300;
  let width = 300;
  let canvasFrame = document.getElementById("canvas"); // canvas is the id of <canvas>
  let context = canvasFrame.getContext("2d");
  let src = new cv.Mat(height, width, cv.CV_8UC4);
  let dst = new cv.Mat(height, width, cv.CV_8UC4);
  const FPS = 30;
  function processVideo() {
      let begin = Date.now(context.getImageData(0, 0, width, height).data);
      context.drawImage(video, 0, 0, width, height);
      let img = context.getImageData(0, 0, width, height).data;
      src.data.set(img);
      cv.Canny(src, dst, 50, 100, 3, false);
      cv.imshow("canvas", dst); // canvas is the id of another <canvas>;
      // schedule next one.
      let delay = 1000/FPS - (Date.now() - begin);
      setTimeout(processVideo, delay);
  }
  // schedule first one.
  setTimeout(processVideo, 0);
    
    // Первый шаг — сглаживание. Оно используется, когда во избежание появления ложных границ требуется уменьшить количество шумов на изображении. Для этого часто используется размытие фильтром Гаусса или каким-либо матричным фильтром размытия.

    // Следующие два шага это нахождение градиентов и подавление не-максимумов. Для начала находятся вся градиенты яркости, для этого можно использовать, например, описанный выше оператор Собеля, но для того чтобы граница была четкой и понятной, она должна быть представлена тонкой линией. Поэтому границей будут являться те пиксели, в которых достигается локальный максимум градиента в направлении вектора градиента. Допустим, что почти все пиксели в градиенте имеют ориентацию вверх. Тогда значение градиента в них будет сравнено с ниже- и вышерасположенными пикселями. Те пиксели, которые имеют наибольшее значение, останутся в результирующем изображении, остальные — будут подавлены.
    
    //И последние этапы — это двойная пороговая фильтрация и трассировка области неоднозначности. На данном шаге производится еще одна фильтрация ложных границ.
    // В детекторе границ Канни используется два порога: нижний и верхний. Пиксель, значение которого выше верхней границы, принимает максимальное значение, т. е. контур считается достоверным. Если значение пикселя не достигает нижнего порога — пиксель подавляется. Если его значение попадает в диапазон между порогами, то он принимает среднее значение, а решение о том, является ли он точкой границы, будет принято во время трассировки области неоднозначности.
    // Задача трассировки сводится к распределению пикселей, получивших среднее значение. Если такой пиксель соприкасается с достоверным контуром, то его значение приравнивается к максимальному значению и он становится частью границы, в противном случае он подавляется.


}

function onLaplac(){
    
    // В отличие от других операторов, Лапласиан не вынимал ребра в каком-либо конкретном направлении, но вынимал ребра в следующей классификации.
    // Внутренние края / Внешние края
  let video =  document.getElementById("video");
  let height = 300;
  let width = 300;
  let canvasFrame = document.getElementById("canvas"); // canvas is the id of <canvas>
  let context = canvasFrame.getContext("2d");
  let src = new cv.Mat(height, width, cv.CV_8UC4);
  let dst = new cv.Mat(height, width, cv.CV_8UC4);
  const FPS = 30;

  function processVideo() {
      let begin = Date.now(context.getImageData(0, 0, width, height).data);
      context.drawImage(video, 0, 0, width, height);
      let img = context.getImageData(0, 0, width, height).data;
      src.data.set(img);
      cv.Laplacian(src, dst, cv.CV_16S, 7, 1, 21);
      cv.imshow("canvas", dst); // canvas is the id of another <canvas>;
      // schedule next one.
      let delay = 1000/FPS - (Date.now() - begin);
      setTimeout(processVideo, delay);
  }
  // schedule first one.
  setTimeout(processVideo, 0);
}
