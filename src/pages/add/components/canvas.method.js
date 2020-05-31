class CanvasMathod {
  constructor(canvas) {
    this.canvas = canvas;
    this.updateSize();
    this.cacheLines = [];

    this.cxt = this.canvas.getContext('2d');

    this.currLine = null;
  }

  static baseW = 8000;

  static baseH = 8000; 

  clear () {
    this.canvas.height = this.canvas.height;
  }

  setCurrLine = line => {
    this.currLine = line;
    this.darw();
  };

  update(lines) {
    if (!lines && !this.cacheLines) return;
    this.cacheLines.push(lines);
    this.darw();
    this.currLine = null;
  }

  updatePosition(id, pl, pt) {
    this.cacheLines = this.cacheLines.map(item => {
      if (id === item.formId) {
        item.formL += pl;
        item.formT += pt;
      } else if (id === item.toId) {
        item.toL += pl;
        item.toT += pt;
      }
      return item;
    });
    this.darw();
  }

  darw() {
    this.clear();
    [].concat(this.cacheLines, this.currLine).filter(Boolean).forEach(item => {
      this.cxt.moveTo(item.formL, item.formT);
      this.cxt.lineTo(item.toL, item.toT);
    });
    this.cxt.lineWidth = 2;
    this.cxt.lineCap = "butt";
    this.cxt.strokeStyle = '#666';
    this.cxt.stroke();
  }

  updateSize(scale = 1) {
    this.canvas.setAttribute('width', CanvasMathod.baseW * scale + 'px');
    this.canvas.setAttribute('height', CanvasMathod.baseH * scale + 'px');
    this.update();
  }
}

export default CanvasMathod;
