const xhrRequest = new XMLHttpRequest();
xhrRequest.onload = handlerOnload;
xhrRequest.onprogress = handlerProgress;
xhrRequest.onerror = handlerError;

const handlerClickBtn = () => checkInput(getImages);
const button = document.querySelector('button');
button.addEventListener('click', handlerClickBtn);

function checkInput(func) {
	const inputValue = Number(document.querySelector('input').value);
	const elmDiv = document.querySelector('.message');
	if (isNaN(inputValue) || inputValue < 1 || inputValue > 10) {
		const elmP = document.createElement('p');
		elmP.appendChild(document.createTextNode('Число вне диапазона от 1 до 10!'));
		const elmDiv = document.querySelector('.message');
		elmDiv.textContent = '';
		elmDiv.appendChild(elmP);		
	} else {
		elmDiv.textContent = '';
		button.disabled = true;
		func(inputValue);
	}
}

function getImages(val) {
	if (xhrRequest.readyState === 4 || xhrRequest.readyState === 0) {
		xhrRequest.open('GET', `https://picsum.photos/v2/list/?limit=${val}`);
		xhrRequest.send();
		console.log('Запрос отправлен.');
	}
}

function handlerOnload() {
	if (xhrRequest.status != 200) {
		console.log('Статус ответа: ', xhrRequest.status);
	} else {
		const images = JSON.parse(xhrRequest.response);
		for (let img of images) {
			viewImage(img);
			if (Number(img.id) === images.length - 1) {
				const elmImg = document.querySelector(`#id${img.id}`);
				const options =  {once: true};
				elmImg.addEventListener('load', () => button.disabled = false, options);
			}
		}
	console.log('Ответ обработан.');
	}
}

function viewImage(objImg) {
	const elmImg = document.createElement('img');
	elmImg.style.padding = '5px';
	elmImg.id = 'id' + objImg.id;
	elmImg.alt = objImg.author;
	
	// Полноразмерные фотографии
	// elmImg.width = Math.floor(objImg.width);
	// elmImg.height = Math.floor(objImg.height);
	elmImg.width = Math.floor(objImg.width / 10);
	elmImg.height = Math.floor(objImg.height / 10);
	elmImg.src = objImg.download_url;
	
	// В 10 раз уменьшенные фотографии
	// const w100p = objImg.width;
	// const w10p = Math.floor(objImg.width / 10);
	// elmImg.width = w10p;
	// const h100p = objImg.height;
	// const h10p = Math.floor(objImg.height / 10)
	// elmImg.height = h10p;
	// elmImg.src = objImg.download_url.replace(`${w100p}/${h100p}`,`${w10p}/${h10p}`);
	
	const elmDiv = document.querySelector('.images');
	elmDiv.appendChild(elmImg);
}

function handlerProgress(event) {
	console.log(`Загружено (байт): ${event.loaded}`);
}

function handlerError() {
	console.log('Ошибка\nСтатус ответа: ', xhrRequest.status);
}
