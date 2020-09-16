
function Count(){
    let src = cv.imread('srcImage');
    let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    //src, dst, porog, max val of porog, type
    //замена на белые и чёрные пиксели в зависимости от порога
    cv.threshold(src, src, 177, 200, cv.THRESH_BINARY);

    cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    // draw contours with random Scalar
    for (let i = 0; i < contours.size(); ++i) {
        let color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
                                Math.round(Math.random() * 255));
        cv.drawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy);
    }
    cv.imshow('canvasOutput', dst);
    document.getElementById('contour').innerHTML = contours.size();    
    src.delete(); dst.delete(); contours.delete(); hierarchy.delete(); cnt.delete();
}

function LineCount(){
    let src = cv.imread('srcImage2');
    let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
let lines = new cv.Mat();
cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
cv.Canny(src, src, 50, 200, 3);
// You can try more different parameters
cv.HoughLines(src,
             lines,
             1, //расстояние иежду линиями
             Math.PI / 180, //угол тета
             30,//threshold
             0, 0, //используется классическое преобразование Хафа
             0, Math.PI //мин и мах тета
             );
// draw lines
for (let i = 0; i < lines.rows; ++i) {
    let rho = lines.data32F[i * 2];
    let theta = lines.data32F[i * 2 + 1];
    let a = Math.cos(theta);
    let b = Math.sin(theta);
    let x0 = a * rho;
    let y0 = b * rho;
    let startPoint = {x: x0 - 1000 * b, y: y0 + 1000 * a};
    let endPoint = {x: x0 + 1000 * b, y: y0 - 1000 * a};
    cv.line(dst, startPoint, endPoint, [255, 0, 0, 255]);
}
cv.imshow('canvasOutput2', dst);
src.delete(); dst.delete(); lines.delete();

// Берётся двоичное изображение (например, результат работы детектора границ Кенни).
// Перебираются все точки границ и делается предположение, что точка принадлежит линии искомого объекта — т.о.
// для каждой точки изображения рассчитывается нужное уравнение и получаются необходимые параметры, которые сохраняются в пространстве Хафа.
// Финальным шагом является обход пространства Хафа и выбор максимальных значений, за которые «проголосовало» больше всего пикселей картинки,
// что и даёт нам параметры для уравнений искомого объекта.
}

function findCircles(){
    let src = cv.imread('srcImage3');
    let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8U);
    let circles = new cv.Mat();
    let color = new cv.Scalar(255, 0, 0);
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    // You can try more different parameters
    cv.HoughCircles(src, circles, 
        cv.HOUGH_GRADIENT, //method
        1, //разрешение как у исходного изображения
        45, //минимальное растояние между найденными кругами
        75, //для Canny.
        40, //порог накопления для центров окружности на этапе обнаружения. Чем он меньше, тем больше ложных кругов может быть обнаружено. 
        0, 50 ///мин и мах радиус
        );
    // draw circles
    for (let i = 0; i < circles.cols; ++i) {
        let x = circles.data32F[i * 3];
        let y = circles.data32F[i * 3 + 1];
        let radius = circles.data32F[i * 3 + 2];
        let center = new cv.Point(x, y);
        cv.circle(dst, center, radius, color);
    }
    cv.imshow('canvasOutput3', dst);
    src.delete(); dst.delete(); circles.delete();

    // Нахождение кругов
    // 1. используется детектор границ Кенни для нахождения границ на изображении
    // 2. для ненулевых точек высчитывается градиент (через вычисление 1-й производной по X и Y через cvSobel())
    // 3. определяются центры кругов
    // 4. относительно центра определяются ненулевые точки, лежащие на одном расстоянии
}
