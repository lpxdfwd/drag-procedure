import {observable, action} from 'mobx';

class IndexStore {
  @observable scale = 1;

  @observable positionTop = 0;

  @observable positionLeft = 0;

  @observable addVisible = false

  @observable.deep drawList = [];

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
    this.drawList = [].concat(this.drawList, option);
  }
}

export default new IndexStore();
