import {observable, action} from 'mobx';

class IndexStore {
  @observable scale = 1;

  @observable positionTop = 0;

  @observable positionLeft = 0;

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
}

export default new IndexStore();
