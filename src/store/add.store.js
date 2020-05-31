import {observable, action} from 'mobx';

class IndexStore {
  @observable scale = 1;

  @observable addVisible = false

  @observable.deep drawList = [];

  @observable left = -2500;

  @observable top = -2500;

  @observable parentW = 0;

  @observable parentH = 0;

  @observable lineing = false

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
    this.left = base - desL;
    this.top = base - desT;
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
