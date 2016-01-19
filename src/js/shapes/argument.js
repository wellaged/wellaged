import * as joint from 'jointjs';
import _ from 'lodash';
import {
  measureText
}
from '../util';

joint.shapes.wellaged = joint.shapes.wellaged || {};

joint.shapes.wellaged.Argument = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {

  markup: '<g class="rotatable"><g class="scalable"> <rect class="body" /></g><text/><g class="inPorts"/><g class="outPorts"/></g>',
  portMarkup: '<g class="port port-<%= port.id %>"><circle class="port-body"/><text class="port-label"/></g>',

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
        rx: 15,
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
      '.outPorts .port-body': { stroke: 'none', fill: '#7c68fc', r: 10 },
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
  }, joint.shapes.basic.Generic.prototype.defaults),

  initialize: function() {
    joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);

    this.on('change:text', function() {
      this.attr('text/text', this.get('text'));
    }, this);
    this.trigger('change:text');

    joint.shapes.basic.PortsModelInterface.initialize.apply(this, arguments);
  },

  getPortAttrs: function(port, index, total, selector, type) {
      var attrs = {};

      var portClass = 'port-' + port.id;
      var portSelector = selector + '>.' + portClass;
      var portTextSelector = portSelector + '>.port-label';
      var portCircleSelector = portSelector + '>.port-body';

      attrs[portTextSelector] = { text: port.label };
      attrs[portCircleSelector] = { port: { id: port.id, type: type, label: port.label } };
      attrs[portSelector] = { ref: '.body', 'ref-y': (index + 0.5) * (1 / total) };

      if (selector === '.inPorts') { attrs[portSelector]['ref-dx'] = 0; }

      return attrs;
  },
}));

joint.shapes.wellaged.ArgumentView = joint.shapes.wellaged.BasicView.extend({});
