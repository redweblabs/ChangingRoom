self.port.emit('message', 'example of message');

var inputs = document.getElementsByTagName('input');

for(var x = 0; x < inputs.length; x += 1){

	inputs[x].addEventListener('click', function(){
		self.port.emit('sexchange', this.value);
	}, false);
	
}