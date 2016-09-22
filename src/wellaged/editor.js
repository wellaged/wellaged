import Backbone from 'backbone';
import * as joint from 'jointjs';
import * as jsyaml from 'js-yaml';

import Factory from './factory';

Backbone.$ = window.$;

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
            height: this.$('.wellaged-paper').height(),
            gridSize: 1,
            snapLinks: {
                radius: 75
            },
            validateConnection: (cellViewS, magnetS, cellViewT, magnetT, end, linkView) => {
                // Prevent linking from input ports.
                if (!magnetT || magnetT.getAttribute('port') === 'out') return false;
                if (magnetS && magnetS.getAttribute('port') === 'in') return false;
                // Prevent linking from output ports to input ports within one element.
                if (cellViewS === cellViewT) return false;

                // Only allow for 1:1 connections to undercutter.
                if (magnetT && magnetT.getAttribute('port') === 'undercutter') {
                    const links = this.graph.getConnectedLinks(cellViewT.model, {
                        inbound: true
                    });

                    if (links.filter((o) => o.attributes.target.port === 'undercutter' && (o != linkView.model)).length > 0) return false;
                }

                let typeIsStatementCount = (cellViewS.model.get('type') === 'wellaged.Statement') + (cellViewT.model.get('type') === 'wellaged.Statement');
                return typeIsStatementCount == 1;
            },
            validateMagnet: (cellView, magnet) => {
                return magnet.getAttribute('magnet') !== 'passive' && magnet.getAttribute('port') === 'out';
            },

            defaultLink: (cellView, magnet) =>
                new joint.shapes.wellaged.DefaultLink()
        });


        this.paper.on('cell:pointerclick', (cellView, evt, x, y) => {
            this.trigger('node:pointerclick', cellView, evt, x, y);
        });

        this.paper.on('blank:pointerclick', (evt, x, y) => {
            this.trigger('node:pointerclick', undefined, evt, x, y);
        });


        return;
        this.paper.on('cell:pointerdown', (cellView, evt, x, y) => {
            if (cellView.model.attributes.type === 'link') {
                const shapes = ['wellaged.Issue', 'wellaged.Statement', 'wellaged.Argument'];
                for (let e of this.graph.getElements()) {
                    if (shapes.indexOf(e.attributes.type) != -1) {
                        e.showMagnets(true);
                    }
                }
            }
        });
        this.paper.on('cell:pointerup', (cellView, evt, x, y) => {
            if (cellView.model.attributes.type === 'link') {
                const shapes = ['wellaged.Issue', 'wellaged.Statement', 'wellaged.Argument'];
                for (let e of this.graph.getElements()) {
                    if (shapes.indexOf(e.attributes.type) != -1) {
                        e.showMagnets(false);
                    }
                }
            }
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

    deleteNode: function(node) {
        this.graph.removeLinks(node.model);
        for(var i=0; i<this.graph.getElements().length; i++){
          if(this.graph.getElements()[i].id == node.model.id){
            this.graph.getElements()[i].remove();
          }
        }
    },

    graphToYAML: function() {
      var length = this.graph.getElements().length;
        for(var i=0; i<length; i++){
          if(this.graph.getElements()[i].get('type') == 'wellaged.Argument'){
            if(this.graph.getConnectedLinks(this.graph.getElements()[i]).length == 0){
              this.graph.removeLinks(this.graph.getElements()[i]);
              this.graph.getElements()[i].remove();
            }
          }
        }
        let yaml = Factory.createYAML(this.graph);
        return yaml;
    },

    graphFromYAML: function(yamlTxt) {
        const helper = (source, target, port) =>
            new joint.shapes.wellaged.DefaultLink({
                source: {
                    id: source,
                    port: 'out'
                },
                target: {
                    id: target,
                    port: port || 'in'
                }
            });

        const yaml = jsyaml.load(yamlTxt);

        this.clear();

        _.each(yaml.statements, (stmt, id) => {
          const s = Factory.createStatement(stmt.meta ? stmt.meta.text : stmt.text, id, stmt.assumed);
            this.graph.addCell(s);
        });

        _.each(yaml.arguments, (arg, id) => {
          const a = Factory.createArgument(arg.meta ? arg.meta.text : arg.text, id, arg.scheme);
            this.graph.addCell(a);
            this.graph.addCell(helper(id, arg.conclusion));
            for (let premise of arg.premises) this.graph.addCell(helper(premise, id));
            if (arg.undercutter)
                this.graph.addCell(helper(arg.undercutter, id, 'undercutter'));

        });

        _.each(yaml.issues, (issue, id) => {
          const i = Factory.createIssue(issue.meta ? issue.meta.text : issue.text, id);

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

        //console.log("result " + output.result);

        Factory.applyYAML(this.graph, output.result);
    },

    clear: function() {
        this.graph.clear();
    }
});

export {
    EditorView
};
