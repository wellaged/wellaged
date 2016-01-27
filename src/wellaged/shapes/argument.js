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
    attrs: {
      '.body': {
        stroke: 'black',
        width: 100,
        height: 60,
        rx: 25
      },
      'text': {
        'font-size': 14,
        text: '',
        lineHeight: 20,
        'ref-x': .5,
        'ref-y': .5,
        ref: '.body',
        'y-alignment': 'middle',
        'x-alignment': 'middle',
        fill: 'black',
        'font-family': 'Arial, helvetica, sans-serif'
      },
      '.port-body': {
          magnet: true
      },
      '.port-label': {
          'pointer-events': 'none'
      },
      '.inPorts .port-label': { 'font-size': 10, fill: 'black', x: 0, dy: 0, 'text-anchor': 'middle', 'y-alignment': 'middle' },
      '.inPorts .port-body': { stroke: 'white', fill: '#feb663', r: 10 },
      '.outPorts .port-label': { 'font-size': 10, fill: 'black', x: 0, dy: 0, 'text-anchor': 'middle', 'y-alignment': 'middle' },
      '.outPorts .port-body': { stroke: 'none', fill: '#7c68fc', r: 10 }
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
  }, joint.shapes.basic.Generic.prototype.defaults)
});

joint.shapes.wellaged.ArgumentView = joint.shapes.wellaged.BasicView.extend({});
