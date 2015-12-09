import AppView from './app';
import 'jointjs/joint.css!';

// Polyfill for removed Chrome function
SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(toElement) {
    return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
};

$(function() {

    var appView = window.appView = new AppView;
});
