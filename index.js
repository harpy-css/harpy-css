var FreeStyle = require('free-style');
var _ = require('lodash');

var HarpyCssObject = function() {
	this._rules = {};
	this._rulesByMedia = {};
};
HarpyCssObject.prototype.add = function(params, declarations) {
	var self = this;
	var name = params.name;
	var property;
	var value;
	if(_.isArray(declarations)) {
		_.each(declarations, function(declaration) {
			self.add(_.assign({}, params, declaration));
		});
	} else if(_.isObject(declarations)) {
		self.add(params, _.map(declarations, function(value, property) {
			return {
				property: _.kebabCase(property),
				value: value,
			};
		}));
	} else {
		property = params.property;
		value = params.value;
		media = params.media;
		var hash = harpyCssHash(property, value, media);
		if(!this._rules[hash]) {
			this._rules[hash] = new HarpyCssRule(hash, property, value, media);
			if(!this._rulesByMedia[media || 'all']) {
				this._rulesByMedia[media || 'all'] = [this._rules[hash]];
			} else {
				this._rulesByMedia[media || 'all'].push(this._rules[hash]);
			}
		}
		var selector = '.'+name;
		if(params.state) {
			selector += ':'+params.state;
		}
		this._rules[hash].addSelector(selector);
	}
};
HarpyCssObject.prototype.stringify = function() {
	var self = this;
	return _(self._rulesByMedia).map(function(rules) {
		var result = '';
		result += _(rules).map(function(rule) {
			return _(rule.selectors).sort().join(',')+'{'+rule.property+':'+rule.value+'}';
		}).join('');
		if(rules[0].media) {
			result = '@media '+rules[0].media+'{'+result+'}';
		}
		return result;
	}).join('');
};

var HarpyCssRule = function(hash, property, value, media) {
	this.hash = hash;
	this.property = property;
	this.value = value;
	this.media = media;
	this.selectors = [];
};
HarpyCssRule.prototype.addSelector = function(selector) {
	this.selectors.push(selector);
};

function harpyCssHash(property, value, media) {
	if(media) {
		return property + ':' + value + ';@media '+media;
	} else {
		return property + ':' + value;
	}
}
function harpyCssCreate() {
	return new HarpyCssObject();
}


module.exports = {
	create: harpyCssCreate,
	hash: harpyCssHash,
};
