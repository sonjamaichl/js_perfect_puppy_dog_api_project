//GLOBAL VARIABLES  ==> do they all need to be global? check and if not, put them somewhere else
let offset = 0;
let dogs = [];
let filteredDogs = [];  //necessary???
let sortedDogs = [];    //necessary?
let showAll = false;

//activate searchBar but only for home page (index.html)
if (window.location.pathname === '/index.html'){
    activateSearchBar();    
}

//adding event listeners to SEARCH & SHOW ALL button that triggers showResults() with different results depending on value of showAll(true/false)
function activateSearchBar(){
    const searchButton = document.getElementById('searchButton');
    const showAllButton = document.getElementById('showAll');
    const showResultsButtons = document.querySelectorAll(".showResults"); //returns an array of the two buttons
    for (btn of showResultsButtons){
    btn.addEventListener('click', function(event){
        showAll = (event.target === showAllButton)? true : false;
        showResults();
    })
    }
    activateEnterKey();
}

//adding functionality to ENTER key (same as clicking searchButton)     ==> THIS PRODUCES AN ERROR FOR THE OTHER PAGES (FAVORITES & BREEDS_TEST.HTML, BUT SCRIPT IST STILL RUNNING)
function activateEnterKey(){
    document.getElementById('searchInput').addEventListener('keydown', function(event){
        if (event.key === "Enter") {
            event.preventDefault();
            searchButton.click();  
        }
    });
}

//function to get the input from search bar
function getSearchInput() {
    return showAll? "1" : document.getElementById('searchInput').value;  //sets min_height to 1 (matches all dogs) if showAll is true
}

//function to create search URL according to user input
function getURL(func){
    let basicURL = "https://api.api-ninjas.com/v1/dogs?";
    let searchParameter = showAll? "min_height=" : "name=";
    return basicURL + searchParameter + func().toLowerCase() + "&offset=" + offset;
}

//function to make spinner visible/invisible
function displaySpinner(display){
    document.getElementById('spinner').style.display = display;
}

function clearAll(){
    let elementsToClear = [];
    if (window.location.pathname === '/index.html') {
        elementsToClear = ['resultsList', 'sortOptions', 'filterOptions'];
    } else if (window.location.pathname === '/favorites.html') {
        elementsToClear = ['favoritesList'];        //+ sortOptions if these are added to the favoritesList as well!
    }
    elementsToClear.forEach(element => document.getElementById(element).innerText = '');
}

//function to show the search results
function showResults() {
    displaySpinner('inline-block');
    clearAll();
    document.getElementById('searchMessage').style.display = 'none';
    dogs = [];  //empty old dogs list, if there was one...
    getData(getURL(getSearchInput));
}

//function to get data from API and create cards for the search results 
async function getData(url) {
    let response = await fetch(url, {
        method: "GET",
        headers: {
          "X-API-Key": "qwIGzCw6xnboQDmPHxp2wQ==7CP90HowwDVCSr2d",
        }
     });
     let newDogs = await response.json();
        for (newDog of newDogs) {
        //console.log(dog.name);  //TEST
        //adding favorite property (to use later) and setting it to false
            newDog.favorite = false;
        //getting wikipedia link for each dog from rapid api (before creating cards!)       ==> USE PROMISE ALL FOR THE WIKILINKS TO MAKE CODE FASTER!!!
            const formattedDogName = newDog.name.split("").map(char => (char === ' ')? '_' : char).join("");
            let wikiQuery =  `https://en.wikipedia.org/w/api.php?action=query&prop=info&format=json&titles=${formattedDogName}`;
            let endpoint = 'https://corsproxy.io/?' + encodeURIComponent(wikiQuery);            //corsproxy.io is a free proxy server, it's necessary to prevent cors errors when sending a request to wikipedia api from a frontend application like in this case
            //console.log(endpoint);   //TEST
            let response = await fetch(endpoint);
                    //console.log(response);
            let result = await response.json();
                    //console.log(result);    //TEST
            newDog.wikiLink = ('-1' in result.query.pages)? '' : `https://en.wikipedia.org/wiki/${formattedDogName}`;  //adding wikiLink property to each dog object to use later in createCards()-loop
            //console.log(newDog.name + ": " + newDog.wikiLink); //TEST  
            dogs.push(newDog);
        }

        if (newDogs.length === 20) {
                //console.log('more than 20 results found, fetching again')
                offset +=20;
                getData(getURL(getSearchInput));           //making getData() recursive so we can get more than 20 results for each search (with multiple requests)
        } else {
                offset = 0;
                //console.log(dogs);      //TEST
                //show a message to user to let them know if and how many search results were found
                showSearchMessage(dogs);
                 //display a select form (dropdown) to choose sorting options for the search results (only if there's more than 1 result!)
                if (dogs.length > 1){
                    showSortingOptions(dogs);
                    //showFilteringOptions(dogs);
                }
                //create a card with image and info for each dog
                createCards(dogs, 'resultsList'); //==> no loop needed here it's inside the function (could also be here, does it make a difference?)
                //make spinner invisible
                displaySpinner('none');  
            }
        }
    
//a function to create new elements in the DOM
function createElement(htmlTag, parentEl, classesOfEl, innerTextOfEl, source, altText){
    let newEl = document.createElement(htmlTag);
    if (classesOfEl !== 'none'){
        for (classOfEl of classesOfEl){
        newEl.classList.add(classOfEl);
    }
    }
    if (innerTextOfEl !== 'none'){
        newEl.innerText = innerTextOfEl;
    }
    if (htmlTag === 'img') {
        newEl.src = source;
        newEl.alt = altText;
    }
    parentEl.appendChild(newEl);
    return newEl;
  }

//a function displaying a message to user to let them know if and how many results were found
function showSearchMessage(dogs){
    const searchMessage = document.getElementById('searchMessage');
    searchMessage.style.display = 'block';    //change to inline-block to make green box around message smaller
    searchMessage.setAttribute('role', 'alert');
    if (dogs.length === 0) {
        searchMessage.innerText = `Sorry, no results found for "${getSearchInput()}".`
        searchMessage.setAttribute('class', 'alert alert-secondary');  
       
    } else {
          if(showAll) {
              searchMessage.innerText = `${dogs.length} breeds found`;
          }
          else {
        searchMessage.innerText = (dogs.length === 1)? `${dogs.length} result found for "${getSearchInput()}":` : `${dogs.length} results found for "${getSearchInput()}":`;
      }
      searchMessage.setAttribute('class', 'alert alert-success');
    }
  }

//function to create and display one card for each dog in list of results (dogs)
function createCards(dogs, parent){
    //getting current version of favoriteDogs array from localStorage 
    let favoriteDogs = (typeof(localStorage.getItem('favoriteDogs'))=='undefined')? [] : JSON.parse(localStorage.getItem('favoriteDogs'));
    console.log(favoriteDogs);  //TEST
    //START LOOP
    let count = 0; //change to for-loop now that we actually need a counter???
    
    for (dog of dogs) {

    //checking if dog is in favorites list and setting property accordingly
    dog.favorite = (favoriteDogs.length === 0)? false : (favoriteDogs.filter(e => e.name === dog.name).length > 0)? true : false;
    //console.log(dog.name, dog.favorite);  //TEST

    //create one div with classes 'col d-flex align-items-stretch' and another one inside it with class card for every dog + append to resultsList
        const resultsList = document.getElementById(parent);
        const colDiv = createElement('div', resultsList, ['col'], 'none'); //adding classes 'd-flex' (and 'align-items-stretch'?) makes all cards the same height, but then they all open, when you only want to open one with "show more"
        colDiv.id = dog.name;   //so we can access it later when filtering results to make cards disappear from resultsList
        const card = createElement('div', colDiv, ['card'], 'none');
    
    //put img of dog inside card and add card-img-top class + alt
        const newImg = createElement('img', card, ['card-img-top'], 'none', dog.image_link, dog.name);

        //adding event listener to newImg to show a larger modal when clicked
        newImg.addEventListener('click', function(event){
            const dogImg = event.target;
            showModal(dogImg);
        });

    //put another div with class card-body inside card
        const cardBody = createElement('div', card, ['card-body', 'd-flex', 'flex-column', 'justify-content-between'], 'none');
  
    //create div for h5 and card text (needed to adjust text & button with flex later)
        const cardText = createElement('div', cardBody, 'none', 'none');
        cardText.style.height = '10rem';            //this makes all cardTexts the same height (since img and buttons are same height as well, all cards are now equal-sized, except when show more was clicked)
     
    //create a div with classes container d-flex and justify-content-between to contain card title and heart icon
        const titleContainer = createElement('div', cardText, ['container', 'd-flex', 'justify-content-between', 'title-container'], 'none');    

    //put h5 with dog breed's name in cardText inside titleContainer
        const cardTitle = createElement('h5', titleContainer, ['card-title'], dog.name);

    //put a heart icon next to title
        const heartIconSrc = (dog.favorite)? `./resources/img/heart/heart_icon_like.svg` : `./resources/img/heart/heart_icon_default.svg`;
        const heartIconAlt = (dog.favorite)? 'heart icon clicked' : 'heart icon unclicked';
        const heartIcon = createElement('img', titleContainer, ['icon'], 'none', heartIconSrc, heartIconAlt);
        //add id to heart icon so we can use it later to know which dog the user liked
        heartIcon.id = count;
        //and add eventlistener + eventhandler to it
        
        heartIcon.addEventListener('click', function(event){
            if(!dogs[heartIcon.id].favorite) {
                event.target.src = './resources/img/heart/heart_icon_like.svg';  
                console.log('you like the '+ dogs[heartIcon.id].name);      //TEST
                favoriteDogs = (favoriteDogs.length === 0)? favoriteDogs : JSON.parse(localStorage.getItem('favoriteDogs'));    //getting current version of favoriteDogs from local storage (if there is one, else just use the empty array)
                favoriteDogs.push(dogs[heartIcon.id]);  //adding this dog to favoriteDogs
                localStorage.setItem('favoriteDogs', JSON.stringify(favoriteDogs)); //adding favoriteDogs array to Local Storage

            } else { 
                console.log("you don't like the "+ dogs[heartIcon.id].name + " anymore");      //TEST  
                for (let i = 0; i < favoriteDogs.length; i++){
                    if (favoriteDogs[i].name === dogs[heartIcon.id].name){
                        favoriteDogs = JSON.parse(localStorage.getItem('favoriteDogs'));    //getting current version of favoriteDogs from localStorage (no checking if empty, we know there's at least on object!)
                        favoriteDogs.splice(i, 1);      //removing this dog from the array of favorite dogs  (array.splice.(i, 1) => removes 1 element at index i)
                        localStorage.setItem('favoriteDogs', JSON.stringify(favoriteDogs)); //adding favoriteDogs array to Local Storage
                    }
                }
                if(parent === 'resultsList'){
                    event.target.src = './resources/img/heart/heart_icon_default.svg' 
                } else if(parent === 'favoritesList'){
                colDiv.style.display = 'none';
            }
            }
            dogs[heartIcon.id].favorite = (dogs[heartIcon.id].favorite)? false : true;
            console.log('These are your current favorites: ')//TEST
            console.log(favoriteDogs); //TEST
            
        });

    //put p with some text inside cardBody (since there is no description text in api data, let's put sth together using the data they give us...)
        let cardDescription = document.createElement('p');
        
        //calculate average weight of dog and use this value to decide which size the dog is
        dog.size = calculateSize(dog);   
        
        //put description text together and append to cardText
        let textSnippet = (dog.min_life_expectancy === dog.max_life_expectancy)? `is a ${dog.size} dog with a life expectancy of about ${dog.min_life_expectancy} years.` : `is a ${dog.size} dog with a life expectancy of ${dog.min_life_expectancy} - ${dog.max_life_expectancy} years.`;
        let descriptionText = (dog.wikiLink === '')? `The ${dog.name} ${textSnippet}` : `<span>The <a class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" target="_blank" href="${dog.wikiLink}">${dog.name}</a> ${textSnippet}</span>`;
        cardDescription.innerHTML = descriptionText;
        cardText.appendChild(cardDescription);
   
        //create div container for button, make it flex + justify-content: center
            const buttonContainer = createElement('div', cardBody, ['button-container'], 'none');
            
        //INSERT SHOW MORE BUTTON + append to button container
            const showMoreButton = createElement('button', buttonContainer, ['btn', 'btn-primary'], 'Show More');
            showMoreButton.type = "button";
            showMoreButton.addEventListener('click', showMore);

        //create second part of cardBody that can be accessed by clicking show more button
            const cardBodyOptional = createElement('div', card, 'none', 'none');    
            cardBodyOptional.style.display = "none";

        //create ul to list characteristics and append to card
            const listGroup = createElement('ul', cardBodyOptional, ['list-group', 'list-group-flush'], 'none');

        //create a li element for some properties of dog with class 'list-group-item' and append to listGroup (ul)
            for (const [key, value] of Object.entries(dog)) {
                if (typeof value === 'number'  && value >= 0 && value <= 5 && key !== 'coat_length') { //coat length were all either 1 or 2 (doesn't make sense!)
                //create one li element for every key-value pair
                    const listGroupItem = createElement('li', listGroup, 'none', 'none');
                //create a div tag inside the li and give it class "flex-container" + append to li
                    const flexContainer = createElement('div', listGroupItem, ['flex-container'], 'none');
                //create a p-tag inside the flex-container div and append
                    const characterTrait = createElement('p', flexContainer, 'none', `${nicerText(key)}: `);
                //create an img-tag inside the flex-container div and append
                    const pawRating = createElement('img', flexContainer, ['paw-rating'], 'none', `./resources/img/paws/${value}_paws.svg`, `${value} out of 5 paws`);
            }
        }

        //create an eventHandlerFunction:       ==> could exist outside of the loop if event.target is used instead of showMoreButton (rewrite event listener to do that) ==>> REWRITE TO STRUCTURE CODe BETTER!!!
        function showMore() {
        if (showMoreButton.innerText === "Show More") {
        //change display property of cardBodyOptional to inline-block to make it visible
        cardBodyOptional.style.display = "inline-block";
        //change button text to "SHOW LESS" and change its color when clicked:
        showMoreButton.innerText = "Show Less";
        showMoreButton.setAttribute('class', 'btn btn-secondary');
        } else {
            showMoreButton.innerText = "Show More";
            showMoreButton.setAttribute('class', 'btn btn-primary');
            cardBodyOptional.style.display = "none";
        }
        }
        //console.log (dog.name + count);   //TESTING COUNTER
        count ++;
    }  //END Of FOR LOOP
 }  //END OF CREATE CARDS FUNCTION


 //a function to display a modal when clicking on the dog images
 function showModal(img){
    //creating a white overlay to hide other content behind and put modal on top
    const overlay = createElement('div', document.body, ['overlay', 'modal-content'], 'none');

    //adding a div (flex container) and a close button icon (x) inside on top right corner to go back to results (card view)
    const closeButtonContainer = createElement('div', overlay, ['close-btn-container'], 'none'); 
    const closeButton = createElement('img', closeButtonContainer, ['close-btn'], 'none', 'resources/img/icons8-close.svg', 'Close')
    closeButton.ariaLabel = 'Close';
 
    //adding eventlistener + eventhandler function to closeButton
    closeButton.addEventListener('click', function(){
         overlay.style.display = 'none';    //makes overlay and everything on top invisible => back to resultsList view
      })

    //putting new img inside it:
    const modalImg = createElement('img', overlay, 'none', 'none', img.src, img.alt);
    modalImg.style.maxWidth = '100%';

    //adding text that displays the name of the dog (in case user forgets what they clicked on)
    const modalText = createElement('p', overlay, 'none', img.alt);
    modalText.style.margin = '1rem';
}

//a function to format dog-objects' properties nicely (no underscores, first letter uppercase) to display in paw-rating
function nicerText(string) {
    let newString = "";
    for (let i = 0; i < string.length; i++) {
        if (string[i] === "_") {
            newString += " ";
    } else if (i === 0) {
        newString += string[i].toUpperCase();
    } else {
        newString += string[i];
    }   
}
return newString;
}               //could use .map() here for shorter code?


//a function to create an object that contains all the chosen filtering options
function createFilterObject(array) {
    let chosenFilters = {};
    const filterOptions = ['size'];
    //pushing all properties shown in the paw rating to the array of filterOptionProperties
    for (const [key, value] of Object.entries(array[0])) {
        if (typeof value === 'number'  && value >= 0 && value <= 5 && key !== 'coat_length'){
            filterOptions.push(key);
        }
    }
    console.log('These are all the filtering options:')
    console.log(filterOptions);    //TEST
    //making each value in the filterOptionProperties array a property of the chosenFilters Object
    for (let i = 0; i < filterOptions.length; i++){
        chosenFilters[filterOptions[i]] = [];   //default value is an empty array = no options chosen (should have same behavior as all options chosen!) 
    }
    //filterOptionProperties.forEach(chosenFilters => {chosenFilters.filterOption = filterOption});
    console.log(chosenFilters);     //TEST
    return chosenFilters;
}






//a function to show the sorting options when results are displayed
function showSortingOptions(dogs){
    const sortOptions = document.getElementById('sortOptions');
    sortOptions.innerText = '';
    const sortResultsButton = createElement('button', sortOptions, ['btn', 'btn-secondary', 'dropdown-toggle'], 'Sort results by');
    sortResultsButton.type = 'button';
    sortResultsButton.setAttribute('data-bs-toggle', 'dropdown');
    sortResultsButton.setAttribute('aria-expanded', 'false');
    //creating an ul for the sorting options
    const sortOptionsList = createElement('ul', sortOptions, ['dropdown-menu'], 'none');
    //creating a li element that contains a formcheck, input type radio and label for radio for each property to sort by
    for (const [key] of Object.entries(dogs[0])) {
        const noSortOptions = ['favorite','image_link', 'coat_length', 'wikiLink', 'min_height_female', 'max_height_female', 'min_height_male', 'min_weight_female', 'max_weight_female', 'min_weight_male', 'min_life_expectancy'];
        if(noSortOptions.includes(key)){
            continue
        } else {
            for (let i=0; i<2; i++){
            let sortOrder = (i === 0)? 'increasing' : 'decreasing';
            let orderText = (sortOrder === 'increasing')? 'lowest to highest' : 'highest to lowest';
            const sortOptionsListElement = createElement('li', sortOptionsList, ['sort-option-li'], 'none')
            const sortOptionsFormCheck = createElement('div', sortOptionsListElement, ['form-check'], 'none');
            const sortOptionInput = createElement('input', sortOptionsFormCheck, ['form-check-input'], 'none');
            sortOptionInput.type = 'radio';
            sortOptionInput.name = 'sort-options';
            sortOptionInput.value = `${key} ${sortOrder}`;
            sortOptionInput.id = `${key} ${sortOrder}`;
            let sortOptionLabelText = (key === 'name')? 'Alphabet Z-A' : `${nicerText(key)}: ${orderText}`;
            const sortOptionLabel = createElement('label', sortOptionsFormCheck, ['form-check-label'], sortOptionLabelText);
            sortOptionLabel.for = `${key} ${sortOrder}`;

            //add eventlistener + eventhandler function to each radio buttin so that it actually sorts results
            sortOptionInput.addEventListener('change', function(event){
                getSelectedValueAndSort(event.target);
            });


        }
        }
    }
}

function getSelectedValueAndSort(target){
    let property = target.value.split(' ')[0]; //split the value in two and store first as property and second as order 
    console.log(property);
    let order = target.value.split(' ')[1];
    console.log(order);

//clear previous results before sorting and displaying in new order
document.getElementById('resultsList').innerText = '';
document.getElementById('searchMessage').style.display = 'none';

//showResults(sortResults(dogs, property, order));
if (filteredDogs.length === 0){
    createCards(sortResults(dogs, property, order), 'resultsList')      // sort all results if there are no filters
} else{
    createCards(sortResults(filteredDogs, property, order), 'resultsList')  // only sort filtered results 
}
}

    
//a function to sort an array by a specific property's values in increasing or decreasing order
function sortResults(array, property, order){
    sortedDogs = [];
        if (order === 'increasing'){
            sortedDogs = array.sort((a, b) => (a[property] > b[property])? 1 : -1);
        } else if (order === 'decreasing'){
            sortedDogs = array.sort((a, b) => (a[property] < b[property])? 1 : -1);
        } else {
            console.log ("sorry, couldn't sort array");
        }
        //console.log('This is my new array sorted by ' + property + ' in '+ order + ' order:')
        //console.log(sortedDogs);
        return sortedDogs;
} 

function calcAverageWeight(dog){
    return (dog.min_weight_female+dog.max_weight_female+dog.min_weight_male+dog.max_weight_male)/4
}

function calculateSize(dog){
    let averageWeight = calcAverageWeight(dog);
    if(averageWeight < 12) {
        return 'miniature';
    } else if(averageWeight < 25) {
        return 'small';
    } else if (averageWeight < 60) {
        return 'medium';
    } else if (averageWeight < 100) {
        return 'large';
    } else if (averageWeight >= 100) {
        return 'giant';
    }
}


//SORTING & FILTERING TEST
//just sorting or just filtering work both fine
//sorting then filtering works, even with multiple boxes checked (checking and unchecking makes dogs disappear and reappear like it should)
//filtering then sorting works
//sorting then filtering then sorting works
//sorting then filtering then sorting then filtering AGAIN doesn't work => TYPE ERROR (cannot read properties of null reading style => lines 380/354) => FIX!!!

//to do & ideas:

// 1) add a try/catch block to the async functions fetching data from the API!!!
// 2) add a tooltip to let user know they will go to wikipedia if they click on the link in the description text
// 2) add pagination (for more than 20 results)?
// 3) add filters for character traits
// 4) add additional pictures from different api?!
// 5) clean up code!!! would be nice to have some sort of structure here...
// 6) add heart icon and like feature (use local storage to save the user's likes => red heart + display on favorites page?)
// 7) add puppy logo and maybe background image or color
// 8) add a fun easter egg (display random dog fact when clicking certain element or sth like that)
