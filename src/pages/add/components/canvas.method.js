import {eventEmit} from '../../../lib/event.lib';

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
    [].concat(this.cacheLines, this.currLine).filter(Boolean).forEach(item => {
      if (item.toL === item.formL && item.toT === item.formT) return;
      this.cxt.moveTo(item.formL, item.formT);
      if (item.toL - item.formL > 30) {
        this.cxt.quadraticCurveTo(item.toL - (item.toL - item.formL) / 2, item.toT, item.toL, item.toT);
      } else if (item.formL - item.toL <= 300) {
        if (item.toT > item.formT) {
          this.cxt.bezierCurveTo(item.formL + 200, item.formT + 150, item.toL - 200, item.toT - 100, item.toL, item.toT);
        } else {
          this.cxt.bezierCurveTo(item.formL + 100, item.formT - 100, item.toL - 200, item.toT, item.toL, item.toT);
        }
      } else {
        if (item.toT - item.formT > 150) {
          this.cxt.bezierCurveTo(item.formL + 200, item.formT - (item.formT - item.toT), item.toL - (item.formL - item.toL) / 2, item.toT - 200, item.toL, item.toT);
        } else if (item.formT - item.toT < 400) {
          this.cxt.bezierCurveTo(item.formL + 200, item.formT - 300, item.toL - (item.formL - item.toL) / 2, item.toT - 200, item.toL, item.toT);
        } else {
          this.cxt.bezierCurveTo(item.formL + 100, item.formT - 100, item.toL - 200, item.toT, item.toL, item.toT);
        }
        
      }
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
