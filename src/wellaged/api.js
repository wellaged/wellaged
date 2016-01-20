import {AppView} from './app';
import 'klayjs';
import 'jointjs/joint.css!';

const API = {
  createEditor: (el) => new (AppView.extend({
    el: el
  }))()
};

window.WellAgEd = API;
export default API;
