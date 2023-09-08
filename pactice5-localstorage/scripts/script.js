const queryStorage = window.localStorage;

const handlerClickBtn = function() {checkInput(getImages)};
const button = document.querySelector('button');
button.addEventListener('click', handlerClickBtn);

const sesionId = queryStorage.getItem('responseOK')
recoverySession(sesionId, getImages);

function recoverySession(id, func) {
	if (!id) {
		return false;
	}
	const inputPage = Number(queryStorage.getItem('inputPage'));
	const inputLimit = Number(queryStorage.getItem('inputLimit'));
	document.querySelector('#inputPage').value = inputPage;
	document.querySelector('#inputLimit').value = inputLimit;
	func(inputPage, inputLimit);
}

function checkInput(func) {
	const inputPage = Number(document.querySelector('#inputPage').value);
	const inputLimit = Number(document.querySelector('#inputLimit').value);
	switch (outRange(1, 10, inputPage, inputLimit)) {
	 	case 1:
	 		handlerErrors('Номер страницы вне диапазона от 1 до 10');
	 		break;
	 	case 2:
	 		handlerErrors('Лимит вне диапазона от 1 до 10');
	 		break;
	 	case 3:
	 		handlerErrors('Номер страницы и лимит вне диапазона от 1 до 10');
	 		break;
	 	default:
			queryStorage.setItem('inputPage', inputPage);
			queryStorage.setItem('inputLimit', inputLimit);
			const elmDiv = document.querySelector('.message');
			elmDiv.textContent = '';
			func(inputPage, inputLimit);
	 		break;
	 }
}

function getImages(page, limit) {
	button.disabled = true;
	const url = new Request(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`);
	fetch(url)
		.then((response) => {
		if (!response.ok) {
			throw new Error(`'Статус ответа: ' = ${response.status}`);
		}
		return response.json();
		})
		.then((imgJSOM) => {
			const lastId = imgJSOM[imgJSOM.length - 1].id;
			for (let img of imgJSOM) {
				viewImage(img, lastId);
				queryStorage.setItem('responseOK', '1');
			}
		})
		.catch((error) => {
		handlerErrors(error.message);
		});
}

function outRange(start, end, page, limit) {
	let fOutOfRange = 0;
	if (isNaN(page) || page < start || page > end) {
		fOutOfRange = 1;
	}
	if (isNaN(limit) || limit < start || limit > end) {
		fOutOfRange += 2;
	}
	return fOutOfRange;
}

function viewImage(objImg, lastId) {
	const elmImg = document.createElement('img');
	elmImg.style.padding = '5px';
	elmImg.id = 'id' + objImg.id;
	elmImg.alt = objImg.author;
	
	// Полноразмерные фотографии
	// elmImg.width = Math.floor(objImg.width);
	// elmImg.height = Math.floor(objImg.height);
	// elmImg.src = objImg.download_url;

	// В 10 раз уменьшенные размеры фотографии в тэге
	elmImg.width = Math.floor(objImg.width / 10);
	elmImg.height = Math.floor(objImg.height / 10);
	elmImg.src = objImg.download_url;
	
	// В 10 раз уменьшенные фотографии в url
	// const w100p = objImg.width;
	// const w10p = Math.floor(objImg.width / 10);
	// elmImg.width = w10p;
	// const h100p = objImg.height;
	// const h10p = Math.floor(objImg.height / 10)
	// elmImg.height = h10p;
	// elmImg.src = objImg.download_url.replace(`${w100p}/${h100p}`,`${w10p}/${h10p}`);

	const elmDiv = document.querySelector('.images');
	elmDiv.appendChild(elmImg);
	if (objImg.id === lastId) {
		const elmLastImg = document.querySelector(`#id${objImg.id}`);
		const options =  {once: true};
		elmLastImg.addEventListener('load', () => button.disabled = false, options);
	}
}

function handlerErrors (error) {
	const elmP = document.createElement('p');
	elmP.appendChild(document.createTextNode(`Ошибка:  ${error}`));
	const elmDiv = document.querySelector('.message');
	elmDiv.textContent = '';
	elmDiv.appendChild(elmP);
	// queryStorage.setItem('responseOK', '');
	button.disabled = false;
}
