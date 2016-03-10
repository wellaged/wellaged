import * as joint from 'jointjs';
import {
    measureText
}
from '../util';
import './basic';

joint.shapes.wellaged = joint.shapes.wellaged || {};

const ASSUMED_YES = 'rgb(114, 186, 23)';
const ASSUMED_NO = '#b43939';

joint.shapes.wellaged.Statement = joint.shapes.wellaged.Basic.extend({
    defaults: joint.util.deepSupplement({

        type: 'wellaged.Statement',
        attrs: {
            '.body': {
                rx: 15,
                ry: 15
            }
        },
        inPorts: [{
            id: 'in',
            label: 'in'
        }],
        outPorts: [{
            id: 'out',
            label: 'out'
        }]

    }, joint.shapes.wellaged.Basic.prototype.defaults),

    initialize: function() {
        joint.shapes.wellaged.Basic.prototype.initialize.apply(this, arguments);

        this.on('change:label', function() {
            let color = this.get('label') == "in" ? ASSUMED_YES : ASSUMED_NO;
            this.attr('rect/fill', color);
        }, this);

        this.on('change:assumed', function() {
            if (this.get('assumed'))
                this.attr('text/text-decoration', 'underline');
            else
                this.attr('text/text-decoration', 'none');
        }, this);

        this.trigger('change:assumed');

    },

});

joint.shapes.wellaged.StatementView = joint.shapes.wellaged.BasicView.extend({});
