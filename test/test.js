var harpyCSS = require('../index.js');
var expect = require('chai').expect;

describe('harpyCSS.create', function() {
	it('creates a HarpyCssObject instance', function() {
		var obj = harpyCSS.create();
		expect(obj).to.be.an('object');
	});
});

describe('HarpyCssObject.add', function() {
	it('handles params with declaration', function() {
		var obj = harpyCSS.create();
		obj.add({
			name: 'mtm',
			property: 'margin-top',
			value: '1rem',
		});
		var result = obj.stringify();
		expect(result).to.equal('.mtm{margin-top:1rem}');
	});
	it('handles params and declarations object', function() {
		var obj = harpyCSS.create();
		obj.add({
			name: 'mtm',
		}, {
			marginTop: '1rem',
		});
		var result = obj.stringify();
		expect(result).to.equal('.mtm{margin-top:1rem}');
	});
	it('handles params and declarations array', function() {
		var obj = harpyCSS.create();
		obj.add({
			name: 'mtm',
		}, [{
			property: 'margin-top',
			value: '1rem',
		}]);
		var result = obj.stringify();
		expect(result).to.equal('.mtm{margin-top:1rem}');
	});
	it('handles prefixed declarations in params', function() {
		var obj = harpyCSS.create();
		obj.add({
			name: 'mtm',
			'#margin-top': '1rem',
		});
		var result = obj.stringify();
		expect(result).to.equal('.mtm{margin-top:1rem}');
	});
});

describe('HarpyCssObject.prepare', function() {
	it('handles missing argument', function() {
		var obj = harpyCSS.create();
		obj.prepare().join({
			name: 'mtm',
			property: 'margin-top',
			value: '1rem',
		}).add();
		var result = obj.stringify();
		expect(result).to.equal('.mtm{margin-top:1rem}');
	});
	it('handles params object', function() {
		var obj = harpyCSS.create();
		obj.prepare({
			name: 'mtm',
			property: 'margin-top',
			value: '1rem',
		}).add();
		var result = obj.stringify();
		expect(result).to.equal('.mtm{margin-top:1rem}');
	});
	it('handles params array', function() {
		var obj = harpyCSS.create();
		obj.prepare([
			{
				name: 'mtm',
				property: 'margin-top',
				value: '1rem',
			},
			{
				name: 'mbm',
				property: 'margin-bottom',
				value: '1rem',
			},
		]).add();
		var result = obj.stringify();
		expect(result).to.equal('.mtm{margin-top:1rem}.mbm{margin-bottom:1rem}');
	});
});

describe('HarpyCssWrappedParams.join', function() {
	it('handles params object', function() {
		var obj = harpyCSS.create();
		obj.prepare({
			name: 'mt',
			property: 'margin-top',
		}).join({
			name: 'm',
			value: '1rem',
		}).add();
		var result = obj.stringify();
		expect(result).to.equal('.mtm{margin-top:1rem}');
	});
	it('handles params array', function() {
		var obj = harpyCSS.create();
		obj.prepare({
			name: 'm',
		}).join([
			{
				name: 't',
				property: 'margin-top',
			},
			{
				name: 'b',
				property: 'margin-bottom',
			},
		]).join({
			name: 'm',
			value: '1rem',
		}).add();
		var result = obj.stringify();
		expect(result).to.equal('.mtm{margin-top:1rem}.mbm{margin-bottom:1rem}');
	});
});

describe('HarpyCssWrappedParams.joinMap', function() {
	it('handles param map', function() {
		var obj = harpyCSS.create();
		obj.prepare({
			name: 'm',
		}).joinMap('property', {
			't': 'margin-top',
			'b': 'margin-bottom',
		}).join({
			name: 'm',
			value: '1rem',
		}).add();
		var result = obj.stringify();
		expect(result).to.equal('.mtm{margin-top:1rem}.mbm{margin-bottom:1rem}');
	});
});

describe('HarpyCssWrappedParams.add', function() {
	it('works like HarpyCssObject.add', function() {
		var obj1 = harpyCSS.create();
		var obj2 = harpyCSS.create();
		obj1.prepare({
			name: 'bt',
			property: 'border-top-',
		}).joinMap('property', 'value', {
			'width': '1px',
			'color': 'currentColor',
			'style': 'solid',
		}).add();
		obj2.add({
			name: 'bt',
		}, {
			'border-top-width': '1px',
			'border-top-color': 'currentColor',
			'border-top-style': 'solid',
		});
		var result1 = obj1.stringify();
		var result2 = obj2.stringify();
		expect(result1).to.equal(result2);
	});
});

describe('HarpyCssObject.stringify', function() {
	it('returns a string', function() {
		var obj = harpyCSS.create();
		obj.add({
			name: 'mtm',
			property: 'margin-top',
			value: '1rem',
		});
		var result = obj.stringify();
		expect(result).to.be.a('string');
	});
	it('handles several calls to `add`', function() {
		var obj = harpyCSS.create();
		obj.add({
			name: 'mtm',
			property: 'margin-top',
			value: '1rem',
		});
		obj.add({
			name: 'mbm',
			property: 'margin-bottom',
			value: '1rem',
		});
		obj.add({
			name: 'mvm',
		}, {
			'marginTop': '1rem',
			'marginBottom': '1rem',
		});
		var result = obj.stringify();
		expect(result).to.equal('.mtm,.mvm{margin-top:1rem}.mbm,.mvm{margin-bottom:1rem}');
	});
	it('handles media queries', function() {
		var obj = harpyCSS.create();
		obj.add({
			name: 'mtm',
			property: 'margin-top',
			value: '1rem',
		});
		obj.add({
			name: 'mtm',
			property: 'margin-top',
			value: '1rem',
			media: '(min-width:40em)',
		});
		obj.add({
			name: 'mtm-md',
			property: 'margin-top',
			value: '1rem',
			media: '(min-width:40em)',
		});
		var result = obj.stringify();
		expect(result).to.equal('.mtm{margin-top:1rem}@media (min-width:40em){.mtm,.mtm-md{margin-top:1rem}}');
	});
	it('handles pseudo-classes', function() {
		var obj = harpyCSS.create();
		obj.add({
			name: 'blue',
			property: 'color',
			value: 'blue',
		});
		obj.add({
			name: 'blue',
			property: 'color',
			value: 'blue',
			state: 'hover',
		});
		obj.add({
			name: 'hover-blue',
			property: 'color',
			value: 'blue',
			state: 'hover',
		});
		var result = obj.stringify();
		expect(result).to.equal('.blue,.blue:hover,.hover-blue:hover{color:blue}');
	});
	it('handles pretty style', function() {
		var obj = harpyCSS.create();
		obj.add({
			name: 'mtm',
			property: 'margin-top',
			value: '1rem',
		});
		obj.add({
			name: 'mtm',
			property: 'margin-top',
			value: '1rem',
			media: '(min-width:40em)',
		});
		obj.add({
			name: 'mtm-md',
			property: 'margin-top',
			value: '1rem',
			media: '(min-width:40em)',
		});
		var result = obj.stringify({beautify: true});
		expect(result).to.equal('.mtm {\n\tmargin-top: 1rem;\n}\n@media (min-width:40em) {\n\t.mtm, .mtm-md {\n\t\tmargin-top: 1rem;\n\t}\n}\n');
	});
});

describe('harpyCSS.hash', function() {
	it('returns a canonical string of rule', function() {
		var result = harpyCSS.hash('margin-top', '1rem');
		expect(result).to.equal('margin-top:1rem');
	});
	it('handles media queries', function() {
		var result = harpyCSS.hash('margin-top', '1rem', '(min-width:40em)');
		expect(result).to.equal('margin-top:1rem;@media (min-width:40em)');
	});
});
