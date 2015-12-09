import * as joint from 'jointjs';

import './shapes';
import './shapes/statement';
import './shapes/issue';
import './shapes/argument';

var Factory = {

    createIssue: function(text) {
      let s = new joint.shapes.wellaged.Issue({
            position: { x: 400 - 50, y: 30 },
            size: { width: 100, height: 70 },
            issue: text
      });
      return s;
    },

    createStatement: function(text) {
      let s = new joint.shapes.wellaged.Statement({
            position: { x: 400 - 50, y: 30 },
            size: { width: 100, height: 70 },
            statement: text
      });
      return s;
    },

    createArgument: function(text) {
        let a = new joint.shapes.wellaged.Argument({
            position: { x: 400 - 50, y: 30 },
            size: { width: 100, height: 70 },
            argument: text
        });
        return a;
    },

    createLink: function(source, target) {

        return new joint.dia.Link({
            source: { id: source },
            target: { id: target },
            attrs: {
                '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z', fill: '#6a6c8a', stroke: '#6a6c8a' },
                '.connection': { stroke: '#6a6c8a', 'stroke-width': 2 }
            }
        });
    },

    // Example:
    /*
      {
         root: '1',
         nodes: [
            { id: '1', type: 'qad.Question', question: 'Are you sure?', options: [{ id: 'yes', text: 'Yes' }, { id: 'no', text: 'No' }] },
            { id: '2', type: 'qad.Answer', answer: 'That was good.' },
            { id: '3', type: 'qad.Answer', answer: 'That was bad.' }
         ],
         links: [
            { type: 'qad.Link', source: { id: '1', port: 'yes' }, target: { id: '2' } },
            { type: 'qad.Link', source: { id: '1', port: 'no' }, target: { id: '3' } }
         ]
      }
    */
    createDialogJSON: function(graph, rootCell) {

        var dialog = {
            root: undefined,
            nodes: [],
            links: []
        };

        _.each(graph.get('cells').models, function(cell) {

            var o = {
                id: cell.id,
                type: cell.get('type'),
            };

            switch (cell.get('type')) {
            case 'qad.Question':
                o.question = cell.get('question');
                o.options = cell.get('options');
                dialog.nodes.push(o);
                break;
            case 'qad.Answer':
                o.answer = cell.get('answer');
                dialog.nodes.push(o);
                break;
            default: // qad.Link
                o.source = cell.get('source');
                o.target = cell.get('target');
                dialog.links.push(o);
                break;
            }

            if (!cell.isLink() && !graph.getConnectedLinks(cell, { inbound: true }).length) {
                dialog.root = cell.id;
            }
        });

        if (rootCell) {
            dialog.root = rootCell.id;
        }

        return dialog;
    }
};

export default Factory;
