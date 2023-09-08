const handlerClickBtn = function() {checkInput(getImages)};
const button = document.querySelector('button');
button.addEventListener('click', handlerClickBtn);

function checkInput(func) {
	const inputWidth = Number(document.querySelector('#inputWidth').value);
	const inputHeight = Number(document.querySelector('#inputHeight').value);
	inpunLess = inputWidth < 100 || inputHeight < 100;
	inputGreat = inputWidth > 300 || inputHeight > 300;
	inputNaN = isNaN(inputWidth) || isNaN(inputHeight);
	if (inputNaN || inpunLess || inputGreat) {
		handlerErrors('Число вне диапазона от 100 до 300!');
	} else {
		const elmDiv = document.querySelector('.message');
		elmDiv.textContent = '';
		button.disabled = true;
		func(inputWidth, inputHeight);
	}
}

function getImages(width, height) {
	const url = new Request(`https://picsum.photos/${width}/${height}`);
	fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`'Статус ответа: ' = ${response.status}`);
		}
			return response.blob();
		})
		.then((imgBlob) => {
			const objURL = URL.createObjectURL(imgBlob);
			viewImage(objURL);
		})
		.catch((error) => {
			handlerErrors(error.message);
		});
}

function viewImage(url) {
	const elmImg = document.createElement('img');
	const elmDiv = document.querySelector('.images');
	elmDiv.appendChild(elmImg);
	const options =  {once: true};
	elmImg.addEventListener('load', () => button.disabled = false, options);
	elmImg.src = url;
}

function handlerErrors (error) {
	const elmP = document.createElement('p');
	elmP.appendChild(document.createTextNode(`Ошибка:  ${error}`));
	const elmDiv = document.querySelector('.message');
	elmDiv.textContent = '';
	elmDiv.appendChild(elmP);
}
