import {observable, action} from 'mobx';

class IndexStore {
  @observable scale = 1;

  @observable addVisible = false

  @observable.deep drawList = [];

  @observable left = -8000;

  @observable top = -8000;

  @observable parentW = 0;

  @observable parentH = 0;

  @action.bound setState(obj) {
    for (let i in obj) {
      if (obj.hasOwnProperty(i)) {
        this[i] = obj[i];
      }
    }
  }

  @action.bound onToBig() {
    this.scale += 0.2;
  }

  @action.bound onToSmall() {
    this.scale -= 0.2;
  }

  @action addDrawItem = (option) => {
    this.drawList = this.drawList.concat({
      ...option,
      left: option.left - this.left - this.parentW / 2,
      top: option.top - this.top - 100 - this.parentH / 2
    });
  }
}

export default new IndexStore();
