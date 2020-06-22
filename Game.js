import GameEngine from "./engine/GameEngine.js";
import Rectangle from "./engine/gfx/shapes/Rectangle.js";

export default class Game {
  constructor() {
    this.engine = new GameEngine();

    // Debug
    window.engine = this.engine;
    // this.engine.setProd();
  }

  play() {
    this.engine.load().then(() => {
      
      this.grid = [];
      for ( var x = 0; x < 50; x++ ) {
        this.grid[x] = [];
        for ( var y = 0; y < 50; y++ ) {
          this.grid[x][y] = new Rectangle(x*25, y*25, 25, 25, "#bbb");
          this.grid[x][y].color = null;
          this.grid[x][y].onMouseMove(this.engine, (button, rect) => {
            if ( !this.computed ) {
              if ( button === "left" ) {
                rect.color = "w";
                rect.c = "#fff";
              } else if ( button === "right" ) {
                rect.color = "b";
                rect.c = "#000";
              }
            }
          });
          this.grid[x][y].onClick(this.engine, rect => {
            if ( this.computed ) {
              console.log(this.zones[rect.color]);
            }
          });
          this.engine.register(this.grid[x][y]);
        }
      }

      var button = new Rectangle(1300, 100, 200, 50, "#0f0");
      button.onClick(this.engine, (rect) => {
        if ( !this.computed ) {
          this.computeAreas()
          this.computed = true;
          this.engine.unregister(rect);
        }
      });
      this.engine.register(button);
    });

  }
  
  computeAreas() {
    this.zones = {};
    for ( var x = 0; x < 50; x++ ) {
      for ( var y = 0; y < 50; y++ ) {
        if ( this.grid[x][y].color === null ) {
          var r = Math.floor(Math.random()*255);
          var g = Math.floor(Math.random()*255);
          var b = Math.floor(Math.random()*255);
          this.colorZone(x, y, r, g, b);
        }
      }
    }
  }

  colorZone(x, y, r, g, b) {
    var colName = r + "-" + g + "-" + b;
    if (
      x < 0 || x >= this.grid.length ||
      y < 0 || y >= this.grid[0].length
    ) {
      return;
    }
    var rect = this.grid[x][y];
    this.zones[colName] = this.zones[colName] || {size: 0, wBorder: 0, bBorder: 0};
    if ( rect.color === null ) {
      rect.color = colName;
      rect.c = "rgb("+r+","+g+","+b+")";
      this.zones[colName].size++;
    } else {
      if ( rect.color === "w" ) {
        this.zones[colName].wBorder++;
      }
      if ( rect.color === "b" ) {
        this.zones[colName].bBorder++;
      }
      return;
    }
    [[1, 0], [0, 1], [-1, 0], [0, -1]].forEach(dir => {
      this.colorZone(x + dir[0], y + dir[1], r, g, b);
    });
  }

}