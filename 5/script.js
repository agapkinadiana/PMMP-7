function harrisCornerDetection() {
    var src = cv.imread('srcImage');
    var dst = cv.Mat.zeros(src.cols, src.rows, cv.CV_32FC1);
    /// Detector parameters
    var thresh = 200;
    var blockSize = 2;
    var apertureSize = 3; //for Sobel
    var k = 0.04; //Harris parameter

    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    /// Detecting corners
    cv.cornerHarris(src, dst, blockSize, apertureSize, k, cv.BORDER_DEFAULT);
    /// Normalizing
    var dst_norm = new cv.Mat();
    var dst_norm_scaled = new cv.Mat();
    cv.normalize(dst, dst_norm, 0, 255, 32, cv.CV_32FC1, new cv.Mat());
    cv.convertScaleAbs(dst_norm, dst_norm_scaled, 1, 0);
    /// Drawing a circle around corners
    for(var j = 0; j < dst_norm.rows ; j++ )
    { for(var i = 0; i < dst_norm.cols; i++ )
      {
        if( dst_norm.data[j][i] > thresh )
          {
            var color = new cv.Scalar(0);
            cv.circle(dst_norm_scaled, [i, j], 5,  color, 2, 8, 0);
            color.delete();
          }
      }
    }
    /// Showing the result
    cv.imshow('canvasOutput1', dst_norm_scaled);
    dst.delete();
    dst_norm.delete();
    dst_norm_scaled.delete();
}

function shiThomasCornerDetection() {
    var src = cv.imread('srcImage');
    var corners = new cv.Mat();
    var qualityLevel = 0.01;
    var minDistance = 10;
    var blockSize = 2;
    var useHarrisDetector = false;
    var k = 0.04;
    var maxCorners = 25;
    var copy = new cv.Mat();
    
    cv.cvtColor(src, src, cv.COLOR_BGR2GRAY, 0);
    copy = src.clone();
    /// Apply corner detection
    cv.goodFeaturesToTrack(src, corners, maxCorners, qualityLevel, minDistance);//, new cv.Mat(), blockSize, useHarrisDetector, k);
    /// Draw corners detected
    var r = 5;
    var color =  new cv.Scalar(0, 255, 0);
    let x, y, center;

    console.log(corners);
    for(let j = 0; j < corners.size(); j++){
      x = corners.data[j][0];
      y = corners.data[j][1];
      center = new cv.Point(x, y);

      cv.circle(copy, center, r, color, -1, 8, 0);
    };
        
    /// Show what you got
    cv.imshow('canvasOutput2', copy);
    copy.delete();
    corners.delete();
}

function AffineTransform(){
    let src = cv.imread('srcImage2');
    let dst = new cv.Mat();
    // (data32F[0], data32F[1]) is the first point
    // (data32F[2], data32F[3]) is the sescond point
    // (data32F[4], data32F[5]) is the third point
    let srcTri = cv.matFromArray(3, 1, cv.CV_32FC2, [0, 0, 1, 1, 1, 0]);
    let dstTri = cv.matFromArray(3, 1, cv.CV_32FC2, [0, -0.7, 0.7, 4.5, 1.5, -0.1]);
    let dsize = new cv.Size(src.rows, src.cols);
    let M = cv.getAffineTransform(srcTri, dstTri);
    // You can try more different parameters
    cv.warpAffine(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
    cv.imshow('tranform1', dst);
    src.delete(); dst.delete(); M.delete(); srcTri.delete(); dstTri.delete();

}

function PerspectiveTransform(){
    let src = cv.imread('srcImage2');
    let dst = new cv.Mat();
    let dsize = new cv.Size(src.rows, src.cols);
    // (data32F[0], data32F[1]) is the first point
    // (data32F[2], data32F[3]) is the sescond point
    // (data32F[4], data32F[5]) is the third point
    // (data32F[6], data32F[7]) is the fourth point
    let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [56, 65, 368, 52, 28, 387, 389, 390]);
    let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, 300, 0, 0, 200, 300, 300]);
    let M = cv.getPerspectiveTransform(srcTri, dstTri);
    // You can try more different parameters
    cv.warpPerspective(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
    cv.imshow('tranform2', dst)
    src.delete(); dst.delete(); M.delete(); srcTri.delete(); dstTri.delete();
}
