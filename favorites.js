let myFavoriteDogs = (typeof(localStorage.getItem('favoriteDogs'))=='undefined')? [] : JSON.parse(localStorage.getItem('favoriteDogs'));

//document.getElementById('favoritesList').innerText = (myFavoriteDogs.length === 0)? 'You have no favorites saved yet.' : ''; // OR: `You have ${myFavoriteDogs.length} favorites:`';

if (myFavoriteDogs.length > 0) {
    showSortingOptions(myFavoriteDogs, 'sortOptionsFavorites', 'favorites', 'favoritesList');
    createCards(myFavoriteDogs, 'favoritesList');
} else {
    document.getElementById('favoritesList').innerText = 'You have no favorites saved yet.' //changed that to a div with alert class (like searchMessage)???
}