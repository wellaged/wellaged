import * as joint from 'jointjs';
import {measureText} from '../util';
import './basic';

joint.shapes.wellaged = joint.shapes.wellaged || {};

const ASSUMED_YES = 'rgb(114, 186, 23)';
const ASSUMED_NO = '#b43939';

joint.shapes.wellaged.Statement = joint.shapes.wellaged.Basic.extend({
    defaults: joint.util.deepSupplement({

        type: 'wellaged.Statement',
        size: { width: 100, height: 60 },
        attrs: {
            'rect': { stroke: 'black', width: 100, height: 60 },
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
            '.outPorts .port-body': { stroke: 'none', fill: '#7c68fc', r: 10 }
        },

        inPorts: [{ id: 'in', label: 'in' }],
        outPorts: [{ id: 'out', label: 'out' }]

    }, joint.shapes.basic.Generic.prototype.defaults),

    initialize: function() {
      joint.shapes.wellaged.Basic.prototype.initialize.apply(this, arguments);

        this.on('change:label', function() {
          let color = this.get('label') == "in" ? ASSUMED_YES : ASSUMED_NO;
          this.attr('rect/fill', color);
        }, this);

        this.on('change:assumed', function() {
            if(this.get('assumed'))
              this.attr('text/text-decoration', 'underline');
            else
              this.attr('text/text-decoration', 'none');
        }, this);

        this.trigger('change:assumed');

    },

});

joint.shapes.wellaged.StatementView = joint.shapes.wellaged.BasicView.extend({});
