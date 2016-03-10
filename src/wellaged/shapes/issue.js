import * as joint from 'jointjs';
import {
  measureText
}
from '../util';
import './basic';

joint.shapes.wellaged = joint.shapes.wellaged || {};

joint.shapes.wellaged.Issue = joint.shapes.wellaged.Basic.extend({
  defaults: joint.util.deepSupplement({
    markup: '<g class="rotatable"><g class="scalable"> <g class="body" transform="translate(-370.987, 215.46)"> <polygon points="475.013,-194 449.006,-215.46 396.994,-215.46 370.987,-194 396.994,-172.54 449.006,-172.54 475.013,-194" /></g></g><text/><g class="inPorts"/><g class="outPorts"/></g>',

    type: 'wellaged.Issue',
    size: {
      width: 100,
      height: 60
    },

    inPorts: [{
      id: 'in',
      label: 'position'
    }],

    outPorts: [/*{
      id: 'out',
      label: 'Out'
    }*/]
  }, joint.shapes.wellaged.Basic.prototype.defaults)

});

joint.shapes.wellaged.IssueView = joint.shapes.wellaged.BasicView.extend({});
