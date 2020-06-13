import {observable, action} from 'mobx';

const BASE_LEFT = -2500;

const BASE_TOP = -2500;

class IndexStore {
  @observable scale = 1;

  @observable addVisible = false

  @observable.deep drawList = [
    {key: 'start', left: 100 - BASE_LEFT, top: 200 - BASE_TOP},
    {key: 'end', left: 100 - BASE_LEFT, top: 350 - BASE_TOP},
  ];

  @observable left = BASE_LEFT;

  @observable top = BASE_TOP;

  @observable parentW = 0;

  @observable parentH = 0;

  @observable lineing = false;

  @observable selectItem = null;

  @action.bound reset() {
    this.scale = 1;
    this.addVisible = false;
    this.drawList = [];
    this.left = BASE_LEFT;
    this.top = BASE_TOP;
    this.parentW = 0;
    this.parentH = 0;
    this.lineing = false;
    this.selectItem = null;
  }

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

  @action updateDrawItem = ({key, left, top}) => {
    this.drawList = this.drawList.map(item => item.key === key ? {...item, left, top} : item);
  }
}

export default new IndexStore();
