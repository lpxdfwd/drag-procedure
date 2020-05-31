import {observable, action} from 'mobx';

class IndexStore {
  @observable scale = 1;

  @observable addVisible = false

  @observable.deep drawList = [];

  @observable left = -2500;

  @observable top = -2500;

  @observable parentW = 0;

  @observable parentH = 0;

  @observable lineing = false;

  @observable selectItem = null;

  @action.bound setState(obj) {
    for (let i in obj) {
      if (obj.hasOwnProperty(i)) {
        this[i] = obj[i];
      }
    }
  }

  @action.bound onChangeSize(type = 'big') {
    const oldBase = -2500 * this.scale;
    if (type === 'big') {
      this.scale += 0.2;
    } else {
      this.scale -= 0.2;
    }
    const base = -2500 * this.scale;
    const desL = oldBase - this.left;
    const desT = oldBase - this.top;
    const newLeft = base - desL;
    const newTop = base - desT;
    if (newLeft >= -50) {
      this.left = -50;
    } else if (newLeft - this.windowW  <= -7950 * this.scale) {
      this.left = -7950 * this.scale + this.windowW;
    } else {
      this.left = newLeft;
    }
    if (newTop >= -50) {
      this.top = -50;
    } else if (newTop - this.windowH + 100 <= -7950 * this.scale) {
      this.top = -7950 * this.scale + this.windowH - 100;
    } else {
      this.top = newTop;
    }
  }

  @action addDrawItem = (option) => {
    this.drawList = this.drawList.concat({
      ...option,
      left: option.left / this.scale - this.left / this.scale,
      top: option.top / this.scale - this.top / this.scale - 100
    });
  }
}

export default new IndexStore();
