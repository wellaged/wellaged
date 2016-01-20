import Backbone from 'backbone';
import * as joint from 'jointjs';
import * as jsyaml from 'js-yaml';
import _ from 'lodash';

import Factory from './factory';

var EditorView = Backbone.View.extend({
    initialize: function() {
        this.initializePaper();
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

    addIssue: function(label) {
        let i = Factory.createIssue(label);
        this.graph.addCell(i);
        return i;
    },

    addArgument: function(label) {
        let a = Factory.createArgument(label);
        this.graph.addCell(a);
        return a;
    },

    addStatement: function(label, assumed) {
        let s = Factory.createStatement(label, assumed);
        this.graph.addCell(s);
        return s;
    },

    graphToYAML: function() {
        let yaml = Factory.createYAML(this.graph);
        return yaml;
    },

    graphFromYAML: function(yamlTxt) {
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

export {
    EditorView
};
