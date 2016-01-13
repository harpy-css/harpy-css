var harpyGenerator = require('../index.js');
var expect = require('chai').expect;

describe('harpyGenerator.selector', function() {
	it('handles pseudo-classes', function() {
		var result = harpyGenerator.selector('hover-blue', {
			state: 'hover'
		});
		expect(result).to.equal('.hover-blue:hover');
	});
});
describe('harpyGenerator.rule', function() {
	it('returns a string', function() {
		var result = harpyGenerator.rule('mtm', {
			'margin-top': '1rem'
		});
		expect(result).to.be.a('string');
	});
	it('returns a css rule', function() {
		var result = harpyGenerator.rule('mtm', {
			'margin-top': '1rem'
		});
		expect(result).to.equal('.mtm{margin-top:1rem}');
	});
	it('handles pseudo-classes', function() {
		var result = harpyGenerator.rule('hover-blue', {
			'color': 'blue'
		}, {
			state: 'hover'
		});
		expect(result).to.equal('.hover-blue:hover{color:blue}');
	});
	it('handles media', function() {
		var result = harpyGenerator.rule('col3-md', {
			'width': '25%'
		}, {
			media: '(min-width:40em)'
		});
		expect(result).to.equal('@media (min-width:40em){.col3-md{width:25%}}');
	});
});
