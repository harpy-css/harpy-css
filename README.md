# harpy-css
CSS generator for Harpy

## How to use
```js
var harpyCss = require('harpy-css').create();

harpyCSS.add({
	name: 'mtm',
	property: 'margin-top',
	value: '1rem',
});

harpyCSS.add({
	name: 'mvm',
}, {
	'marginTop': '1rem',
	'marginBottom': '1rem',
});

harpyCSS.add({
	name: 'mhm',
}, [
	{
		property: 'margin-right',
		value: '1rem',
	}, {
		property: 'margin-left',
		value: '1rem',
	}
]);

// Get the css rules as a string.
harpyCSS.stringify()
```

The result of `harpyCSS.stringify()` above:

```css
.mtn,.mvm{margin-top:1rem}.mvm{margin-bottom:1rem}.mhm{margin-right:1rem}.mhm{margin-left:1rem}
```

Unminified version:

```css
.mtn,
.mvm {
	margin-top: 1rem
}

.mvm {
	margin-bottom: 1rem
}

.mhm {
	margin-right: 1rem
}

.mhm {
	margin-left: 1rem
}
```
