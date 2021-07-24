const textEditor = document.querySelector("#textEditor");
const form = document.querySelector("#navForm");
const text_align = form.querySelector('.align-options');
const selectedFontSize = form.querySelector('#selectedFontSize');


function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

document.querySelectorAll('nav a').forEach(btn => {
	btn.addEventListener('click', () => {
		formatTheText(btn.dataset.value);
	});
});

form.addEventListener('change', (e) => {
	e.preventDefault();
	onChange(e);
});

form.querySelector('.align-options').addEventListener('click', (e) => {
	onChange(e);
});


function onChange(e) {
	const selected = window.getSelection().anchorNode.parentElement;
	if (selected != null) {
		if (e.target.name == "fontSelect") {
			formatTheText('fontSize', e.target.value)
		}
		else if (e.target.name == "text-align") {
			formatTheText(e.target.value);
		}
	}
}



function formatTheText(commmand, value = null) {
	console.log(value)
	document.execCommand(commmand, false, value);
}
