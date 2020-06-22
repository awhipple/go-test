export default class Rectangle {
  fill = 1;

  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
  }

  onMouseMove(engine, callback) {
    engine.onMouseMove(event => {
      if (
        event.pos.x > this.x && event.pos.x < this.x + this.w &&
        event.pos.y > this.y && event.pos.y < this.y + this.h
      ) {
        if ( engine.mouse.left ) {
          callback("left", this);
        } else if ( engine.mouse.right ) {
          callback("right", this);
        }
      }
    });
  }

  onClick(engine, callback) {
    engine.onMouseDown(event => {
      if (
        event.pos.x > this.x && event.pos.x < this.x + this.w &&
        event.pos.y > this.y && event.pos.y < this.y + this.h
      ) {
        callback(this);
      }
    })
  }

  set rect(rect) {
    this.x = rect.x;
    this.y = rect.y;
    this.w = rect.w;
    this.h = rect.h;
  }

  draw(ctx) {
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w * this.fill, this.h);
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.w, this.h);
  }
}