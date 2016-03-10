import * as joint from 'jointjs';
import {
    measureText
}
from '../util';

joint.shapes.wellaged = joint.shapes.wellaged || {};
joint.shapes.wellaged.DefaultLink = joint.dia.Link.extend({
    initialize: function() {
        joint.dia.Link.prototype.initialize.apply(this, arguments);
        this.on('change:target', () => {
            this.attr('.connection/stroke-dasharray', this.get('target').port === 'undercutter' ? '5 2' : '');
        });
    },
    defaults: joint.util.deepSupplement({
        router: {
            name: 'metro'
        },
        connector: {
            name: 'rounded'
        },
        attrs: {
            '.marker-target': {
                d: 'M 10 0 L 0 5 L 10 10 z',
                fill: '#6a6c8a',
                stroke: '#6a6c8a'
            },
            '.connection': {
                stroke: 'black',
                'stroke-width': 2
            }
        }
    }, joint.dia.Link.prototype.defaults)
});
