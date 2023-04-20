let myFavoriteDogs = (typeof(localStorage.getItem('favoriteDogs'))=='undefined')? [] : JSON.parse(localStorage.getItem('favoriteDogs'));

//document.getElementById('favoritesList').innerText = (myFavoriteDogs.length === 0)? 'You have no favorites saved yet.' : ''; // OR: `You have ${myFavoriteDogs.length} favorites:`';

if (myFavoriteDogs.length > 0) {
    createCards(myFavoriteDogs, 'favoritesList');
} else {
    document.getElementById('favoritesList').innerText = 'You have no favorites saved yet.'
}