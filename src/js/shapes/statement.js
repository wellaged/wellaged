import * as joint from 'jointjs';
import {measureText} from '../util';

joint.shapes.wellaged = joint.shapes.wellaged || {};

joint.shapes.wellaged.Statement = joint.shapes.basic.Generic.extend({

    markup: '<g class="rotatable"><g class="scalable"><rect/></g><text/></g>',

    defaults: joint.util.deepSupplement({

        type: 'wellaged.Statement',
        size: { width: 100, height: 60 },
        attrs: {
            'rect': { fill: '#b43939', stroke: 'none', width: 100, height: 60, rx: 3, ry: 3 },
            'text': { 'font-size': 14, text: '', lineHeight: 20, 'ref-x': .5, 'ref-y': .5, ref: 'rect', 'y-alignment': 'middle', 'x-alignment': 'middle', fill: '#f6f6f6', 'font-family': 'Arial, helvetica, sans-serif' }
        },

        inPorts: [{ id: 'in', label: 'In' }],
        outPorts: [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }]

    }, joint.shapes.basic.Generic.prototype.defaults),

    initialize: function() {

        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);

        this.attr('text/text', this.get('statement'));

        this.on('change:statement', function() {

            this.attr('text/text', this.get('statement'));

        }, this);
    }
});

joint.shapes.wellaged.StatementView = joint.dia.ElementView.extend({

    initialize: function() {

        joint.dia.ElementView.prototype.initialize.apply(this, arguments);
        this.autoresize();
        this.listenTo(this.model, 'change:statement', this.autoresize, this);
    },

    autoresize: function() {

        var dim = measureText(this.model.get('statement'), {
            fontSize: this.model.attr('text/font-size')
        });
        this.model.resize(dim.width + 50, dim.height + 50);
    }
});
