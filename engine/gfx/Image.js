import { NEXT_ORIENTATION, BoundingRect, Coord } from "../GameMath.js";

export default class Image {
  static MIRROR_FLIP = {
    normal: "mirrored",
    mirrored: "normal",
  }

  constructor(img, orientation = "right", flip = "normal", orientationMap = null) {
    this.img = img;
    this.width = img.width;
    this.height = img.height;
    this.orientation = orientation;
    this.flip = flip;
    this.orientationMap = orientationMap || { right: { normal: this } };
  }
  
  draw(ctx, a, b, c, d, e) {
    var x = null, y = null,
        w = null, h = null,
        coord = null, 
        rect = null, 
        options = null;
    
    if ( a instanceof BoundingRect ) {
      rect = a;
      options = b || {};
    } else if ( a instanceof Coord &&
      typeof b === "number" && typeof c === "number") {
        coord = a;
        w = b;
        h = c;
        options = d || {};
    } else if ( a instanceof Coord ) {
      coord = a;
      options = b || {};
    } else if ( typeof a === "number" && typeof b === "number" &&
                typeof c === "number" && typeof d === "number") {
      x = a;
      y = b;
      w = c;
      h = d;
      options = e || {};
    } else if ( typeof a === "number" && typeof b === "number" ) {
      x = a;
      y = b;
      options = c || {};
    } else {
      console.log("Unsupported Image.draw call");
      return;
    }

    ctx.save();
    if ( options.alpha ) {
      ctx.globalAlpha = options.alpha;
    }
    var center = options.center ?? false;
    
    var drawWidth = rect?.w || w || this.img.width;
    var drawHeight = rect?.h || h || this.img.height;

    ctx.drawImage(this.img, 
      (rect?.x || coord?.x || x) - (center ? drawWidth/2 : 0), 
      (rect?.y || coord?.y || y) - (center ? drawHeight/2 : 0),
      drawWidth, drawHeight, 
    );

    ctx.restore();
  }

  rotate(targetOrientation = null) {
    targetOrientation = targetOrientation || NEXT_ORIENTATION[this.orientation];
    if ( this.orientationMap[targetOrientation]?.[this.flip] ) {
      return this.orientationMap[targetOrientation][this.flip];
    }

    var currentImage = this;
    while ( currentImage.orientation !== targetOrientation ) {
      var newCanvas = currentImage._rotateImage();
      var newOrientation = NEXT_ORIENTATION[currentImage.orientation];
      currentImage = new Image(newCanvas, newOrientation, currentImage.flip, this.orientationMap);
      this.orientationMap[newOrientation] = this.orientationMap[newOrientation] || {};
      this.orientationMap[newOrientation][this.flip] = currentImage;
    }
    return currentImage;
  }

  mirror() {
    var flipTo = Image.MIRROR_FLIP[this.flip];
    if ( this.orientationMap[this.orientation][flipTo] ) {
      return this.orientationMap[this.orientation][flipTo];
    }

    var flippedImage = new Image(this._mirrorImage(), this.orientation, flipTo, this.orientationMap);
    this.orientationMap[this.orientation][flipTo] = flippedImage;
    return flippedImage;
  }

  _rotateImage() {
    var newCanvas = document.createElement("canvas");
    newCanvas.width = this.img.width;
    newCanvas.height = this.img.height;
    var newCtx = newCanvas.getContext("2d");

    newCtx.save();
    newCtx.fillStyle = "#fff";
    newCtx.clearRect(0, 0, newCanvas.width, newCanvas.height);
    newCtx.translate(newCanvas.width/2, newCanvas.height/2);
    newCtx.rotate(Math.PI/2);
    newCtx.drawImage(this.img, -(newCanvas.width/2), -(newCanvas.height/2));
    newCtx.restore();

    return newCanvas;
  }

  _mirrorImage() {
    var newCanvas = document.createElement("canvas");
    newCanvas.width = this.img.width;
    newCanvas.height = this.img.height;
    var newCtx = newCanvas.getContext("2d");

    newCtx.save();
    newCtx.fillStyle = "#fff";
    newCtx.clearRect(0, 0, newCanvas.width, newCanvas.height);
    if ( this.orientation === "up" || this.orientation === "down" ) {
      newCtx.translate(this.img.width, 0);
      newCtx.scale(-1, 1);
    } else {
      newCtx.translate(0, this.img.height);
      newCtx.scale(1, -1);
    }
    newCtx.drawImage(this.img, 0, 0);
    newCtx.restore();

    return newCanvas;
  }

}