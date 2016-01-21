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
		declarations = [];
		params = _.clone(params);
		_.forEach(params, function(value, key) {
			if(key.substr(0,1) === '#') {
				declarations.push({
					property: key.substr(1),
					value: value,
				});
				delete params[key];
			}
		});
		if(declarations.length) {
			_.each(declarations, function(declaration) {
				self.add(_.assign({}, params, declaration));
			});
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
HarpyCssObject.prototype.addMap = function(params, map) {
	var self = this;
	_.each(map, function(value, name) {
		self.add(_.assign({}, params, {
			name: name,
			value: value,
		}));
	});
};
HarpyCssObject.prototype.prepare = function(paramsList) {
	return new HarpyCssWrappedParams(this, paramsList);
};

var HarpyCssWrappedParams = function(obj, paramsList) {
	this._obj = obj;
	if(_.isArray(paramsList)) {
		this._paramsList = paramsList;
	} else {
		this._paramsList = [paramsList || {}];
	}
};
HarpyCssWrappedParams.prototype.join = function(paramsList) {
	if(!_.isArray(paramsList)) {
		paramsList = [paramsList];
	}
	this._paramsList = _.flatMap(this._paramsList, function(params1) {
		return _.map(paramsList, function(params2) {
			return _.reduce(params2, function(result, value, key) {
				if(_.has(result, key)) {
					result[key] += value;
				} else {
					result[key] = value;
				}
				return result;
			}, _.clone(params1));
		});
	});
	return this;
};
HarpyCssWrappedParams.prototype.joinMap = function(keyKey, valueKey, map) {
	if(_.isObject(keyKey)) {
		map = keyKey;
		valueKey = 'value';
		keyKey = 'name';
	} else if(_.isObject(valueKey)) {
		map = valueKey;
		valueKey = keyKey;
		keyKey = 'name';
	}
	return this.join(_.map(map, function(value, key) {
		var result = {};
		result[keyKey] = key;
		result[valueKey] = value;
		return result;
	}));
};
HarpyCssWrappedParams.prototype.add = function() {
	var self = this;
	_.each(this._paramsList, function(params) {
		self._obj.add(params);
	});
	return this;
};
HarpyCssWrappedParams.prototype.tap = function(callback) {
	callback(this);
	return this;
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
