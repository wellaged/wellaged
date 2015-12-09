import {V,g} from 'jointjs';
import Backbone from 'backbone';
import _ from 'lodash';

var Selection = Backbone.Collection.extend();

var SelectionView = Backbone.View.extend({

    initialize: function(options) {

        this.options = options;

        _.bindAll(this, 'render');

        this.listenTo(this.model, 'add reset change', this.render);
        this.listenTo(this.model, 'remove', this.remove);
    },

    render: function() {

        var paper = this.options.paper;

        var boxTemplate = V('rect', { fill: 'none', 'stroke': '#C6C7E2', 'stroke-width': 1, 'pointer-events': 'none' });
        _.invoke(this.boxes, 'remove');
        this.boxes = [];

        this.model.each(function(element) {

            var box = boxTemplate.clone();
            var p = 3; // Box padding.
            box.attr(g.rect(_.extend({}, element.get('position'), element.get('size'))).moveAndExpand({
                x: -p, y: -p, width: 2*p, height: 2*p
            }));
            V(paper.viewport).append(box);
            this.boxes.push(box);

        }, this);

        return this;
    }
});

export {Selection, SelectionView};
