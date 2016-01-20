import * as joint from 'jointjs';
import * as jsyaml from 'js-yaml';

import {guid} from './util.js';

import './shapes/basic';
import './shapes/statement';
import './shapes/issue';
import './shapes/argument';

var Factory = {

  createIssue: function(text, id) {
    return new joint.shapes.wellaged.Issue({
      position: {
        x: 400 - 50,
        y: 30
      },
      size: {
        width: 100,
        height: 70
      },
      text: text,
      id: (id !== null) ? id : guid()
    });
  },

  createStatement: function(text, id, assumed) {
    return new joint.shapes.wellaged.Statement({
      position: {
        x: 400 - 50,
        y: 30
      },
      size: {
        width: 100,
        height: 70
      },
      id: (id !== null) ? id : guid(),
      text: text,
      assumed: (assumed !== null) ? assumed : (Math.trunc(Math.random() * 100) % 2 == 1)
    });
  },

  createArgument: function(text, id) {
    return new joint.shapes.wellaged.Argument({
      position: {
        x: 400 - 50,
        y: 30
      },
      size: {
        width: 100,
        height: 70
      },
      id: (id !== null) ? id : guid(),
      text: text
    });
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

  toKGraph: function(graph) {
    let kg = {
      id: "root",
      properties: {
        direction: "LEFT",
        spacing: 40
      },
      children: [],
      edges: []
    };

    window.gg = graph;

    for(let cell of graph.getElements()) {
      const id = cell.get('id');
      const bbox = cell.getBBox();

      window.cc = cell;

      kg.children.push({
        id: id,
        width: bbox.width,
        height: bbox.height,
        properties: {
          portConstraints: "FIXED_SIDE"
        },
        ports: [{
          id: "in",
          properties: {portSide: "EAST"}
        }, {
          id: "out",
          properties: {portSide: "WEST"}
        }]
      });

      /*if(cell.get("type") === "wellaged.Argument") {
        kg.children[kg.children.length - 1].ports.push({
          id: "undercutter",
          properties: {portSide: "EAST"}
        });
      }*/
    }

    for(let link of graph.getLinks()) {
      const id = link.get('id');
      window.ll = link;
      const source = graph.getCell(link.get('source').id);
      const sourceId = source.get('id');
      const sourcePort = link.get("source").port;// === "out") ? "out": "in";

      const target = graph.getCell(link.get('target').id);
      const targetId = target.get('id');
      const targetPort = link.get("target").port;

      kg.edges.push({
        id: id,
        source: sourceId,
        sourcePort: sourceId+"-"+sourcePort,
        target: targetId,
        targetPort: targetId+"-"+targetPort
      });
    }

    return kg;
  },

  applyKGraph: function(graph, layouted) {
    for(let child of layouted.children) {
      const cell = graph.getCell(child.id);
      cell.position(child.x, child.y);
    }
  },

  createYAML: function(graph) {
    let yaml = {
      meta: {
        title: "Sample WellAGEd YAML export."
      },
      statements: {},
      issues: {},
      arguments: {}
    };

    for(let cell of graph.getElements()) {
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
    }

    for(let cell of graph.getLinks()) {
      const source = graph.getCell(cell.get('source').id);
      const sourceId = source.get('id');
      const sourceType = source.get('type');

      const target = graph.getCell(cell.get('target').id);
      const targetId = target.get('id');
      const targetType = target.get('type');

      if (sourceType == "wellaged.Statement") {
        //yaml.statements[sourceId].label = 'out';

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
    }

    return jsyaml.dump(yaml);
  },


  applyYAML: function(graph, str) {
    const yaml = jsyaml.load(str);

    _.each(yaml.statements, (statement, key) => {
      graph.getCell(key).set('label', statement.label);
    });
  }
};

export default Factory;
