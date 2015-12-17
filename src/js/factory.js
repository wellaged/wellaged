import * as joint from 'jointjs';
import * as jsyaml from 'js-yaml';

import {guid} from './util.js';
import _ from 'lodash';

import './shapes';
import './shapes/statement';
import './shapes/issue';
import './shapes/argument';

var Factory = {

  createIssue: function(text) {
    let s = new joint.shapes.wellaged.Issue({
      position: {
        x: 400 - 50,
        y: 30
      },
      size: {
        width: 100,
        height: 70
      },
      text: text,
      id: guid()
    });
    return s;
  },

  createStatement: function(text) {
    const assumed = Math.trunc(Math.random() * 100) % 2 == 1;
    let s = new joint.shapes.wellaged.Statement({
      position: {
        x: 400 - 50,
        y: 30
      },
      size: {
        width: 100,
        height: 70
      },
      id: guid(),
      text: text,
      label: assumed ? "in" : "out",
      assumed: assumed
    });
    return s;
  },

  createArgument: function(text) {
    let a = new joint.shapes.wellaged.Argument({
      position: {
        x: 400 - 50,
        y: 30
      },
      size: {
        width: 100,
        height: 70
      },
      id: guid(),
      text: text
    });
    return a;
  },

  createLink: function(source, target) {

    return new joint.dia.Link({
      source: {
        id: source
      },
      target: {
        id: target
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
        }
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
  createYAML: function(graph) {
    let yaml = {
      meta: {
        title: "Sample WellAGEd YAML export."
      },
      statements: {},
      issues: {},
      arguments: {}
    };

    _.each(graph.getElements(), function(cell) {
      const id = cell.get('id');
      const text = cell.get('text');

      switch (cell.get('type')) {
        case 'wellaged.Argument':
          yaml.arguments[id] = {
            // FIXME fix carneades.
            //text: text,
            premises: [],
            conclusion: undefined,
            undercutter: undefined
          };
          break;
        case 'wellaged.Statement':
          yaml.statements[id] = {
            label: cell.get("label"),
            text: text,
            assumed: cell.get('assumed')
          };
          break;
        case 'wellaged.Issue':
          yaml.issues[id] = {
            positions: [],
            text: text
          };
          break;
      }
    });

    _.each(graph.getLinks(), function(cell) {
      const source = graph.getCell(cell.get('source').id);
      const sourceId = source.get('id');
      const sourceType = source.get('type');

      const target = graph.getCell(cell.get('target').id);
      const targetId = target.get('id');
      const targetType = target.get('type');

      if (sourceType == "wellaged.Statement") {
        yaml.statements[sourceId].label = 'out';
      }

      if (targetType == "wellaged.Issue") {
        yaml.issues[targetId].positions.push(sourceId);
      }

      if (sourceType == "wellaged.Argument") {
        yaml.arguments[sourceId].conclusion = targetId;
      }

      if (targetType == "wellaged.Argument") {
        if(cell.get('target').port == "undercutter")
          yaml.arguments[targetId].undercutter = sourceId;
        else yaml.arguments[targetId].premises.push(sourceId);
      }
    });

    return jsyaml.dump(yaml);
  },


  applyYAML: function(graph, str) {
    const yaml = jsyaml.load(str);

    _.each(yaml.statements, function(statement, key) {
      graph.getCell(key).set('label', statement.label);
    });


  }
};

export default Factory;
