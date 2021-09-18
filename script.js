const resultsNav = document.getElementById('results-nav');
const favoritesNav = document.getElementById('favorites-nav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

let resultsArray = [];
let favorites = {};

//* Nasa API
const count = 10;
const apiKey = 'ehhGdbHvQdnunz0nZKk4u9XfSR8aQ9iaN2rlKWko';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;
//* Get 10 images from Nasa API
const getNasaPictures = async function () {
    try {

        //*Show Loader
        loader.classList.remove('hidden');
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDom('results');
    }
    catch (err) {
        alert(err);
    }
}

const showContent=function(page)
{
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    })
    if(page==='results'){
    resultsNav.classList.remove('hidden');
    favoritesNav.classList.add('hidden');
    }
    else{
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }

    loader.classList.add('hidden');
}

//* Add result to Favorites
const saveFavorite = function (itemUrl) {
    //* Loop through Results array to select favorite
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            //*Show Save Confirmation for 2 seconds
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            //*Set favorites in localStorage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    });
}
//* Remove item from favorites
const removeFavorite = function (itemUrl) {
    if (favorites[itemUrl])
        delete favorites[itemUrl];
    localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    updateDom('favorites');
}
//*Create Dom Nodes
const createDomNodes = function (page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    currentArray.forEach((result) => {
        //*Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        //*Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        //*Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA picture of the day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        //*Card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('body');
        //*Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        //*Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results') {
            saveText.textContent = 'Add to Favorites';
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
        }
        else {
            saveText.textContent = 'Remove Favorite';
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }
        //*Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        //*Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        //*Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        //*CopyRight
        const copyrightResult = result.copyright === undefined ? ' ' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = `    ${copyrightResult}`;
        //*Append
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody, footer);
        imagesContainer.appendChild(card);
    });
}

//* Populate DOM
const updateDom = function (page) {
    //* Get Favorites from localStorage
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    imagesContainer.textContent = ' ';
    createDomNodes(page);
     showContent(page);
}
getNasaPictures();