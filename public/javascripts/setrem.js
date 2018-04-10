function setRem() {
	var oHtml = document.querySelector('html');
	var width = oHtml.getBoundingClientRect().width;
	if(width > 680) width = 680;
	oHtml.style.fontSize = width / 16 + 'px';
}
window.onload = function() {
		setRem();
	}
	//23.4375px等于1rem;