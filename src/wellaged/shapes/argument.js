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
    attrs: {
        '.body': {
            rx: 15,
            ry: 15
        }
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
