import {eventEmit} from '../../../lib/event.lib';

class CanvasBase {
  constructor(canvas) {
    this.canvas = canvas;
    this.cxt = this.canvas.getContext('2d');
    this.currLine = null;
  }

  setCurrLine(line) {
    this.currLine = line;
  };

  clear () {
    this.canvas.height = this.canvas.height;
  }
  
  drawItem = (item, scale = 1) => {
    if (item.toL === item.formL && item.toT === item.formT) return;
    this.cxt.moveTo(item.formL, item.formT);
    if (item.toL - item.formL > 30 * scale) {
      this.cxt.quadraticCurveTo(item.toL - (item.toL - item.formL) / 2, item.toT, item.toL, item.toT);
    } else if (item.formL - item.toL <= 300 * scale) {
      if (item.toT > item.formT) {
        this.cxt.bezierCurveTo(item.formL + 200 * scale, item.formT + 150 * scale, item.toL - 200 * scale, item.toT - 100 * scale, item.toL, item.toT);
      } else {
        this.cxt.bezierCurveTo(item.formL + 100 * scale, item.formT - 100 * scale, item.toL - 200 * scale, item.toT, item.toL, item.toT);
      }
    } else {
      if (item.toT - item.formT > 150 * scale) {
        this.cxt.bezierCurveTo(item.formL + 200 * scale, item.formT - (item.formT - item.toT), item.toL - (item.formL - item.toL) / 2, item.toT - 200 * scale, item.toL, item.toT);
      } else if (item.formT - item.toT < 400 * scale) {
        this.cxt.bezierCurveTo(item.formL + 200 * scale, item.formT - 300 * scale, item.toL - (item.formL - item.toL) / 2, item.toT - 200 * scale, item.toL, item.toT);
      } else {
        this.cxt.bezierCurveTo(item.formL + 100 * scale, item.formT - 100 * scale, item.toL - 200 * scale, item.toT, item.toL, item.toT);
      }
    }
  }
}


export class CanvasMethod extends CanvasBase {
  constructor(canvas) {
    super(canvas);
    this.updateSize();
    this.cacheLines = [];
    this.cxt.fillStyle = 'rgba(255, 255, 255, 0)';
  }

  static baseW = 8000;

  static baseH = 8000; 

  setCurrLine = line => {
    super.setCurrLine(line);
    // this.darw();
  };

  update(lines) {
    if (!lines && !this.cacheLines) return;
    this.cacheLines.push(lines);
    this.darw();
    this.currLine = null;
  }

  delectCacheItem(id) {
    this.cacheLines = this.cacheLines.filter(({toId, formId}) => toId !== id && formId !== id);
    this.darw();
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
    eventEmit('setLineArrow');
    [].concat(this.cacheLines, this.currLine).filter(Boolean).forEach(item => this.drawItem(item));
    this.cxt.lineWidth = 2;
    this.cxt.lineCap = "butt";
    this.cxt.strokeStyle = '#666';
    this.cxt.stroke();
  }

  updateSize(scale = 1) {
    this.canvas.setAttribute('width', CanvasMethod.baseW * scale + 'px');
    this.canvas.setAttribute('height', CanvasMethod.baseH * scale + 'px');
  }
}


 export class CanvasTowMethod extends CanvasBase {
  constructor(canvas) {
    super(canvas);
    this.canvas.setAttribute('width', document.body.clientWidth + 'px');
    this.canvas.setAttribute('height', document.body.clientHeight - 100 + 'px');
  }

  darw(item, scale) {
    this.clear();
    this.drawItem(item, scale);
    this.cxt.lineWidth = 2 * scale;
    this.cxt.lineCap = "butt";
    this.cxt.strokeStyle = '#666';
    this.cxt.stroke();
  }
}

