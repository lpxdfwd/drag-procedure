import {observable, action} from 'mobx';

class IndexStore {
  @observable count = 0;

  @action setCont() {
    this.count += 1;
  }
}

export default new IndexStore();
