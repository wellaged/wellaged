import Backbone from 'backbone';
import * as joint from 'jointjs';
import * as jsyaml from 'js-yaml';
import _ from 'lodash';

import Factory from './factory';
import {
    Selection, SelectionView
}
from './selection';

var EditorView = Backbone.View.extend({
    events: {
        'click .wellaged-toolbar .add-issue': 'addIssue',
        'click .wellaged-toolbar .add-argument': 'addArgument',
        'click .wellaged-toolbar .add-statement': 'addStatement',
        'click .wellaged-toolbar .preview-dialog': 'previewDialog',
        'click .wellaged-toolbar .to-yaml': 'graphToYAML',
        'click .wellaged-toolbar .from-yaml': 'graphFromYAML',
        'click .wellaged-toolbar .carneades': 'runCarneades',
        'click .wellaged-toolbar .clear': 'clear',
        'click .wellaged-toolbar .auto-layout': 'doAutoLayout'
    },

    initialize: function() {
        this.initializePaper();
        this.initializeSelection();
    },

    initializeSelection: function() {

        document.body.addEventListener('keydown', (evt) => {
            var code = evt.which || evt.keyCode;
            if (code === 8 || code === 46) {
                // backspace or delete

                return false;
            }
            return true;
        });

        var selection = this.selection = new Selection();
        var selectionView = new SelectionView({
            model: selection,
            paper: this.paper
        });

        this.paper.on('cell:pointerup', (cellView) => {

            if (!cellView.model.isLink()) {
                selection.reset([cellView.model]);
            }
        });
        this.paper.on('blank:pointerdown', function() {
            selection.reset([]);
        });

        selection.on('add reset', this.onSelectionChange, this);
    },

    initializePaper: function() {

        this.graph = new joint.dia.Graph();
      
        this.paper = new joint.dia.Paper({
            el: this.$('.wellaged-paper'),
            model: this.graph,
            width: this.$('.wellaged-paper').width(),
            height: this.$('.wellaged-paper').width(),
            gridSize: 1,
            snapLinks: {
                radius: 75
            },
            validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                // Prevent linking from input ports.
                if (magnetS && magnetS.getAttribute('port') === 'in') return false;
                // Prevent linking from output ports to input ports within one element.
                if (cellViewS === cellViewT) return false;

                let typeIsStatementCount = (cellViewS.model.get('type') === 'wellaged.Statement') + (cellViewT.model.get('type') === 'wellaged.Statement');
                return typeIsStatementCount == 1;
            },
            validateMagnet: (cellView, magnet) => magnet.getAttribute('magnet') !== 'passive',
            defaultLink: new joint.dia.Link({
                router: {
                    name: 'manhattan'
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
                        stroke: '#6a6c8a',
                        'stroke-width': 2
                            //filter: { name: 'dropShadow', args: { dx: 1, dy: 1, blur: 2 } }
                    }
                }
            })
        });
    },

    onSelectionChange: function(collection) {
        var cell = collection.first();
    },

    addIssue: function() {

        var q = Factory.createIssue('i3: PE');
        this.graph.addCell(q);
    },

    addArgument: function() {
        var a = Factory.createArgument('Argument.');
        this.graph.addCell(a);
    },

    addStatement: function() {
        let a = Factory.createStatement('Statement');
        this.graph.addCell(a);
    },

    graphToYAML: function() {
        console.dir(this.graph);
        let yaml = Factory.createYAML(this.graph);

        console.log(yaml);
    },

    graphFromYAML: function() {
        const helper = (source, target) =>
            new joint.shapes.devs.Link({
                source: {
                    id: source,
                    port: 'out'
                },
                target: {
                    id: target,
                    port: 'in'
                }
            });

        $.get("/porsche.yml", (yamlTxt) => {
            const yaml = jsyaml.load(yamlTxt);

            this.clear();

            _.each(yaml.statements, (stmt, id) => {
                const s = Factory.createStatement(stmt, id, _.includes(yaml.assumptions, id));
                this.graph.addCell(s);
            });

            _.each(yaml.arguments, (arg, id) => {
                const a = Factory.createArgument(id, id);
                this.graph.addCell(a);
                this.graph.addCell(helper(id, arg.conclusion));
                for (let premise of arg.premises) this.graph.addCell(helper(premise, id));
            });

            _.each(yaml.issues, (issue, id) => {
                const i = Factory.createIssue(id, id);

                this.graph.addCell(i);

                for (let pos of issue.positions) this.graph.addCell(helper(pos, id));

            });

            this.doAutoLayout();
        });


    },

    doAutoLayout: function() {
        const kgraph = Factory.toKGraph(this.graph);
        const thiz = this;
        $klay.layout({
            graph: kgraph,
            // options: {spacing: 50},
            success: function(layouted) {
                Factory.applyKGraph(thiz.graph, layouted);
            },
            error: function(error) {
                console.log(error);
            }
        });
    },

    runCarneades: function() {
        let yaml = Factory.createYAML(this.graph);

        const output = carneades.eval(yaml, 'yaml', 'yaml');
        if (!output.result) {
            console.dir(output);
            throw "carneades error :/";
        }

        Factory.applyYAML(this.graph, output.result);
    },

    clear: function() {
        this.graph.clear();
    }
});

export {EditorView};
