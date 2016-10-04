import * as joint from 'jointjs';
import {
    measureText
}
from '../util';

joint.shapes.wellaged = joint.shapes.wellaged || {};

joint.shapes.wellaged.Basic = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {

    markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text/><g class="inPorts"/><g class="outPorts"/></g>',
    portMarkup: '<g class="port port-<%= port.id %>"><circle class="port-body"/><text class="port-label"/></g>',

    defaults: joint.util.deepSupplement({
        attrs: {
            '.body': {
                stroke: 'black',
                width: 100,
                height: 60,
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
                stroke: 'black',
                fill: 'black',
                'font-family': 'Arial, helvetica, sans-serif'
            },
            '.port-body': {
                magnet: true
            },
            '.port-label': {
                'pointer-events': 'none'
            },
            '.inPorts .port-label': {
                'font-size': 10,
                fill: 'black',
                x: 0,
                dy: 0,
                'text-anchor': 'middle',
                'y-alignment': 'middle'
            },
            '.inPorts .port-body': {
                stroke: 'white',
                fill: '#feb663',
                r: 10
            },
            '.outPorts .port-label': {
                'font-size': 10,
                fill: 'black',
                x: 0,
                dy: 0,
                'text-anchor': 'middle',
                'y-alignment': 'middle'
            },
            '.outPorts .port-body': {
                stroke: 'none',
                fill: '#7c68fc',
                r: 10
            }
        }
    }, joint.shapes.basic.Generic.prototype.defaults),

    initialize: function() {
        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
        joint.shapes.basic.PortsModelInterface.initialize.apply(this, arguments);



        this.on('change:text', function() {
            var wraptext = joint.util.breakText(this.get('text') ,{
              width: 250,
              height: 200
            });
            this.attr('text/text', wraptext);
        }, this);

        this.trigger('change:text');
    },

    showMagnets: function(doShow) {
        const visibility = doShow ? 'visible' : 'hidden';
        this.attr('.port-body/visibility', visibility);
        this.attr('.port-label/visibility', visibility);
    },

    getPortAttrs: function(port, index, total, selector, type) {
        var attrs = {};

        var portClass = 'port-' + port.id;
        var portSelector = selector + '>.' + portClass;
        var portTextSelector = portSelector + '>.port-label';
        var portCircleSelector = portSelector + '>.port-body';

        attrs[portTextSelector] = {
            text: port.label
        };
        attrs[portCircleSelector] = {
            port: {
                id: port.id,
                type: type,
                label: port.label
            }
        };
        attrs[portSelector] = {
            ref: '.body',
            'ref-y': (index + 0.5) * (1 / total)
        };

        if (selector === '.inPorts') {
            attrs[portSelector]['ref-dx'] = 0;
        }

        return attrs;
    }
}));

joint.shapes.wellaged.BasicView = joint.dia.ElementView.extend(_.extend({}, joint.shapes.basic.PortsViewInterface, {

    initialize: function() {
        joint.shapes.basic.PortsViewInterface.initialize.apply(this, arguments);
        this.autoresize();
        this.listenTo(this.model, 'change:text', this.autoresize, this);
    },

    autoresize: function() {
        var dim = measureText(this.model.get('text'), {
            fontSize: this.model.attr('text/font-size')
        });

      if((dim.width + 50) <= 250){
        this.model.resize(dim.width + 50, dim.height + 50);
      }else if((dim.width/6) + 0.1 <= 200){
        this.model.resize(250, 60 + (dim.width/12));
      }else{
        this.model.resize(250, 200);
      }
    }
}));
