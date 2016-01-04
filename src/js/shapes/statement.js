import * as joint from 'jointjs';
import _ from 'lodash';
import {measureText} from '../util';

joint.shapes.wellaged = joint.shapes.wellaged || {};

const ASSUMED_YES = 'rgb(114, 186, 23)';
const ASSUMED_NO = '#b43939';

joint.shapes.wellaged.Statement = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {

    markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text/><g class="inPorts"/><g class="outPorts"/></g>',
    portMarkup: '<g class="port port-<%= port.id %>"><circle class="port-body"/><text class="port-label"/></g>',

    defaults: joint.util.deepSupplement({

        type: 'wellaged.Statement',
        size: { width: 100, height: 60 },
        attrs: {
            'rect': { stroke: 'black', width: 100, height: 60, rx: 3, ry: 3 },
            'text': { 'font-size': 14, text: '', lineHeight: 20, 'ref-x': .5, 'ref-y': .5, 
            ref: 'rect', 'y-alignment': 'middle', 'x-alignment': 'middle', fill: 'black', 'font-family': 'Arial, helvetica, sans-serif' },

            '.port-body': {
                magnet: true
            },
            '.port-label': {
                'pointer-events': 'none'
            },
            '.inPorts .port-label': { 'font-size': 10, fill: 'white', x: 0, dy: 0, 'text-anchor': 'middle', 'y-alignment': 'middle' },
            '.inPorts .port-body': { stroke: 'none', fill: '#feb663', r: 10 },
            '.outPorts .port-label': { 'font-size': 10, fill: 'black', x: 0, dy: 0, 'text-anchor': 'middle', 'y-alignment': 'middle' },
            '.outPorts .port-body': { stroke: 'none', fill: '#7c68fc', r: 10 },
        },

        inPorts: [{ id: 'in', label: 'in' }],
        outPorts: [{ id: 'out', label: 'out' }]

    }, joint.shapes.basic.Generic.prototype.defaults),

    initialize: function() {
        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);

        this.on('change:label', function() {
          let color = this.get('label') == "in" ? ASSUMED_YES : ASSUMED_NO;
          this.attr('rect/fill', color);
        }, this);

        this.on('change:text', function() {
            this.attr('text/text', this.get('text'));
        }, this);

        this.on('change:assumed', function() {
            if(this.get('assumed'))
              this.attr('text/text-decoration', 'underline');
            else
              this.attr('text/text-decoration', 'none');
        }, this);

        this.trigger('change:assumed');
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
      attrs[portSelector] = { ref: '.body', 'ref-x': (index + 0.5) * (1 / total) };

      if (selector === '.outPorts') { attrs[portSelector]['ref-dy'] = 0; }

      return attrs;
  },
}));

joint.shapes.wellaged.StatementView = joint.dia.ElementView.extend(_.extend({}, joint.shapes.basic.PortsViewInterface, {

    initialize: function() {
        joint.shapes.basic.PortsViewInterface.initialize.apply(this, arguments);
        this.autoresize();
        this.listenTo(this.model, 'change:text', this.autoresize, this);
    },

    autoresize: function() {
        var dim = measureText(this.model.get('text'), {
            fontSize: this.model.attr('text/font-size')
        });
        this.model.resize(dim.width + 50, dim.height + 50);
    }
}));
