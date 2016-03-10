import * as joint from 'jointjs';
import {
  measureText
}
from '../util';
import './basic';

joint.shapes.wellaged = joint.shapes.wellaged || {};

joint.shapes.wellaged.Argument = joint.shapes.wellaged.Basic.extend({
  defaults: joint.util.deepSupplement({

    type: 'wellaged.Argument',
    size: {
      width: 100,
      height: 60
    },

    inPorts: [{
      id: 'in',
      label: 'In'
    }, {
      id: 'undercutter',
      label: 'undercutter'
    }],
    outPorts: [{
      id: 'out',
      label: 'Out'
    }]
  }, joint.shapes.wellaged.Basic.prototype.defaults)
});

joint.shapes.wellaged.ArgumentView = joint.shapes.wellaged.BasicView.extend({});
