import * as joint from 'jointjs';
import _ from 'lodash';
import {
    measureText
}
from '../util';

joint.shapes.wellaged = joint.shapes.wellaged || {};

joint.shapes.wellaged.Basic = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {

    markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text/><g class="inPorts"/><g class="outPorts"/></g>',
    portMarkup: '<g class="port port-<%= port.id %>"><circle class="port-body"/><text class="port-label"/></g>',

    initialize: function() {
        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
        joint.shapes.basic.PortsModelInterface.initialize.apply(this, arguments);

        this.on('change:text', function() {
            this.attr('text/text', this.get('text'));
        }, this);

        this.trigger('change:text');
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
        this.model.resize(dim.width + 50, dim.height + 50);
    }
}));
