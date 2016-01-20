import {EditorView} from './editor';
import 'klayjs';
import 'jointjs/joint.css!';
import '../carneades-js';

const API = {
  createEditor: (el) => new (EditorView.extend({
    el: el
  }))()
};

window.WellAgEd = API;
export default API;
