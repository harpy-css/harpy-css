var FreeStyle = require('free-style');

function selector(name, options) {
	return (options || {}).state ? ('.' + name + ':' + options.state) : ('.' + name);
}
function rule(name, declarations, options) {
	options = options || {};
	var Style = FreeStyle.create();
	if(options.media) {
		Style.registerRule('@media '+options.media, {
			[selector(name, options)]: declarations
		});
	} else {
		Style.registerRule(selector(name, options), declarations);
	}
	return Style.getStyles();
}

module.exports = {
	selector: selector,
	rule: rule,
};
