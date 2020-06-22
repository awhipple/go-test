export default class Circle {
  arc = 1;
  
  constructor(pos, radius, options = {}) {
    this.pos = pos;
    this.radius = radius;
    
    this.color = options.color ?? "#000";
    this.alpha = options.alpha ?? 1;
    this.border = options.border ?? true;
  }

  draw(ctx) {
    ctx.save();

    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    if ( this.arc < 1 ) {
      ctx.moveTo(this.pos.x, this.pos.y);
      ctx.arc(this.pos.x, this.pos.y, this.radius, 0, this.arc * Math.PI * 2, false);
      ctx.lineTo(this.pos.x, this.pos.y);
      ctx.lineWidth = 0;
      ctx.fillStyle = this.color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
      ctx.lineWidth = 1;
    } else {
      ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
      ctx.lineWidth = 1;
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    if ( this.border ) {
      ctx.strokeStyle = "#000";
      ctx.stroke();
    }

    ctx.restore();
  }
}