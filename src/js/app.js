import Backbone from 'backbone';
import * as joint from 'jointjs';
import _ from 'lodash';

import Factory from './factory';
import {Selection,SelectionView} from './selection';

var AppView = Backbone.View.extend({

    el: '#app',

    events: {
        'click #toolbar .add-issue': 'addIssue',
        'click #toolbar .add-argument': 'addArgument',
        'click #toolbar .add-statement': 'addStatement',
        'click #toolbar .preview-dialog': 'previewDialog',
        'click #toolbar .to-yaml': 'graphToYAML',
        'click #toolbar .carneades': 'runCarneades',
        'click #toolbar .clear': 'clear'
    },

    initialize: function() {
        this.initializePaper();
        this.initializeSelection();
    },

    initializeSelection: function() {

        document.body.addEventListener('keydown', _.bind(function(evt) {

            var code = evt.which || evt.keyCode;
            // Do not remove the element with backspace if we're in inline text editing.
            if ((code === 8 || code === 46) && !this.textEditor && this.selection.first()) {

                this.selection.first().remove();
                this.selection.reset();
                return false;
            }

        }, this), false);

        var selection = this.selection = new Selection;
        var selectionView = new SelectionView({ model: selection, paper: this.paper });

        this.paper.on('cell:pointerup', function(cellView) {

            if (!cellView.model.isLink()) {
                selection.reset([cellView.model]);
            }
        });
        this.paper.on('blank:pointerdown', function() { selection.reset([]) });

        selection.on('add reset', this.onSelectionChange, this);
    },

    initializePaper: function() {

        this.graph = new joint.dia.Graph;

        this.paper = new joint.dia.Paper({
            el: this.$('#paper'),
            model: this.graph,
            width: 800,
            height: 600,
            gridSize: 1,
            snapLinks: { radius: 75 },
            validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                // Prevent linking from input ports.
                if (magnetS && magnetS.getAttribute('port') === 'in') return false;
                // Prevent linking from output ports to input ports within one element.
                if (cellViewS === cellViewT) return false;
                // Prevent linking to input ports.
                return true;
                //return (magnetT && magnetT.getAttribute('type') === 'input') || (cellViewS.model.get('type') === 'qad.Question' && cellViewT.model.get('type') === 'qad.Answer');
            },
            validateMagnet: function(cellView, magnet) {
                // Note that this is the default behaviour. Just showing it here for reference.
                // Disable linking interaction for magnets marked as passive (see below `.inPorts circle`).
                return magnet.getAttribute('magnet') !== 'passive';
            },
            defaultLink: new joint.dia.Link({
                router: { name: 'manhattan' },
                connector: { name: 'rounded' },
                attrs: {
                '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z', fill: '#6a6c8a', stroke: '#6a6c8a' },
                    '.connection': {
                        stroke: '#6a6c8a', 'stroke-width': 2
                        //filter: { name: 'dropShadow', args: { dx: 1, dy: 1, blur: 2 } }
                    }
                }
            })
        });
    },

    onSelectionChange: function(collection) {

        var cell = collection.first();
        if (cell) {
            this.status('Selection: ' + cell.get('type'));
        } else {
            this.status('Selection emptied.');
        }
    },

    // Show a message in the statusbar.
    status: function(m) {
        this.$('#statusbar .message').text(m);
    },

    addIssue: function() {

        var q = Factory.createIssue('i3: PE');
        this.graph.addCell(q);
        this.status('Issue added.');
    },

    addArgument: function() {
        var a = Factory.createArgument('Argument.');
        this.graph.addCell(a);
        this.status('Argument added.');
    },

    addStatement: function() {
        let a = Factory.createStatement('Statement');
        this.graph.addCell(a);
        this.status('Statement added.');
    },

    graphToYAML: function() {
      console.dir(this.graph);
      let yaml = Factory.createYAML(this.graph);

      console.log(yaml);
    },

    runCarneades: function() {
      let yaml = Factory.createYAML(this.graph);

      const output =carneades.eval(yaml, 'yaml', 'yaml');
      if(!output.result) {
        console.dir(output);
        throw "carneades error :/";
      }


      Factory.applyYAML(this.graph, output.result);
    },

    clear: function() {

        this.graph.clear();
    }

});

export default AppView;
