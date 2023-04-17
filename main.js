//GLOBAL VARIABLES  ==> do they all need to be global? check and if not, put them somewhere else
let basicURL = "https://api.api-ninjas.com/v1/dogs?";
let offset = 0;
let dogs = [];
let showAll = false;

//function to get the input from search bar
function getSearchInput() {
    let searchInput = showAll? "1" : document.getElementById('searchInput').value;  //sets min_height to 1 (matches all dogs) if showAll is true
    return searchInput;
}
//function to create search URL according to user input
function getURL(func){
    let searchParameter = showAll? "min_height=" : "name=";
    return basicURL + searchParameter + func().toLowerCase() + "&offset=" + offset;
}
//adding event listeners to SEARCH & SHOW ALL button that triggers showResults() with different results depending on value of showAll(true/false)
let searchButton = document.getElementById('searchButton');
let showAllButton = document.getElementById('showAll');
let showResultsButtons = document.querySelectorAll(".showResults");
for (btn of showResultsButtons){
btn.addEventListener('click', function(event){
    if (event.target === showAllButton){
        showAll = true;
    } else {
        showAll = false;
    }
    showResults();
})
}
//adding functionality to ENTER key (same as clicking searchButton)
document.getElementById('searchInput').addEventListener('keydown', function(event){
    if (event.key === "Enter") {
        event.preventDefault();
        searchButton.click();  
    }
});
//function to show the search results
function showResults() {
    document.getElementById('spinner').style.display = 'inline-block';
    document.getElementById('resultsList').innerText = '';
    document.getElementById('searchMessage').style.display = 'none';
    dogs = [];
    getData(getURL(getSearchInput));
}

//function to get data from API and create cards for the search results
function getData(url) {
    fetch(url, {
        method: "GET",
        headers: {
          "X-API-Key": "qwIGzCw6xnboQDmPHxp2wQ==7CP90HowwDVCSr2d",
        }
     })
        .then(response => response.json())
        .then(async result => {
            let newDogs = result;
            for (newDog of newDogs) {
                dogs.push(newDog);
            }
            //console.log('newDogs: '+newDogs, 'newDogs-length: '+newDogs.length)     //TEST
            //console.log('dogs: '+dogs, 'dogs.length: '+dogs.length)     //TEST
            if (newDogs.length === 20) {
                //console.log('more than 20 results found, fetching again')
                offset +=20;
                getData(getURL(getSearchInput));           //making getData() recursive so we can get more than 20 results for each search (with multiple requests)
            } else {
                offset = 0;
                console.log(dogs);      //TEST

             //getting wikipedia link for each dog from rapid api (before creating cards!)
             for (dog of dogs) {
                console.log(dog.name);  //TEST
                const formattedDogName = dog.name.split("").map(char => (char === ' ')? '_' : char).join("");
                let wikiQuery =  `https://en.wikipedia.org/w/api.php?action=query&prop=info&format=json&titles=${formattedDogName}`;
                let endpoint = 'https://corsproxy.io/?' + encodeURIComponent(wikiQuery);            //corsproxy.io is a free proxy server, it's necessary to prevent cors errors when sending a request to wikipedia api from a frontend application like in this case
                //console.log(endpoint);   //TEST

                try {
                const response = await fetch(endpoint);
                //console.log(response);
                const result = await response.json();
                console.log(result);    //TEST
                dog.wikiLink = ('-1' in result.query.pages)? '' : `https://en.wikipedia.org/wiki/${formattedDogName}`;  //adding wikiLink property to each dog object to use later in createCards()-loop
                console.log(dog.name + ": " + dog.wikiLink); //TEST  
                }
                catch (error){
                    dog.wikiLink = '';
                    console.log('no wikiLink found for ' + dog.name);
                }
            }
        }
                //create a card with image and info for each dog
                createCards(dogs);      //THIS FUNCITON NEEDS TO WAIT UNTIL WIKILINKS ARE FETCHED => HOW? ==> so far only works for less than 20 results, for more the links are fetched but property dog.wikiLink is still undefined
                //make spinner invisible
                document.getElementById('spinner').style.display = 'none';
            })

        .catch(err => console.log("oopsies... couldn't fetch data from api"))
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
  //const newHeading = createElement('newHeading', 'h1', document.body, 'basic', 'Hello');  // this will create a new h1 Tag with a text of 'Hello, class of basic and append it to document.body and store it in the variable newHeading


//function to create and display one card for each dog in list of results (dogs)
function createCards(dogs){
      //displaying message to user to let them know if and how many results were found ===> should showMessage() be a separated function???
      let searchMessage = document.getElementById('searchMessage');
      searchMessage.style.display = 'block';    //change to inline-block to make green box around message smaller
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
          searchMessage.setAttribute('role', 'alert');  
      }
      
//START LOOP
for (dog of dogs) {
//create one div with classes 'col d-flex align-items-stretch' and another one inside it with class card for every dog + append to resultsList
    const resultsList = document.getElementById('resultsList');
    const colDiv = createElement('div', resultsList, ['col'], 'none'); //adding classes 'd-flex' (and 'align-items-stretch'?) makes all cards the same height, but then they all open, when you only want to open one with "show more"
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
    
//put h5 with dog breed's name in cardBody
    const cardTitle = createElement('h5', cardText, ['card-title'], dog.name);

//put p with some text inside cardBody (since there is no description text in api data, let's put sth together using the data they give us...)
    let cardDescription = document.createElement('p');
    
    //calculate average weight of dog and use this value to decide which size the dog is
    let size = '';
    function averageWeight(){
        return (dog.min_weight_female+dog.max_weight_female+dog.min_weight_male+dog.max_weight_male)/4
    }
    //console.log(averageWeight(dogs[i]));
    if(averageWeight() < 12) {
        size = 'miniature';
    } else if(averageWeight() < 25) {
        size = 'small';
    } else if (averageWeight() < 60) {
        size = 'medium';
    } else if (averageWeight() < 100) {
        size = 'large';
    } else if (averageWeight() >= 100) {
        size = 'giant';
    }
    
    //put description text together and append to cardText
    let textSnippet = (dog.min_life_expectancy === dog.max_life_expectancy)? `is a ${size} dog with a life expectancy of about ${dog.min_life_expectancy} years.` : `is a ${size} dog with a life expectancy of ${dog.min_life_expectancy} - ${dog.max_life_expectancy} years.`;
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
        if(key ===  "coat_length" || key ===  "wikiLink" || key ===  "image_link" || key === "min_life_expectancy" || key === "max_life_expectancy" || key === "max_height_male" || key === "max_height_female" || key === "max_weight_female" || key === "max_weight_male" || key === "min_height_male" || key === "min_height_male" || key === "min_height_female" || key === "min_weight_male" || key === "min_weight_female" || key === "name"){
            continue;
        } else {
    //create one li element for every key-value pair
        const listGroupItem = createElement('li', listGroup, 'none', 'none');

    //create a div tag inside the li and give it class "flex-container" + append to li
        const flexContainer = createElement('div', listGroupItem, ['flex-container'], 'none');

    //create a p-tag inside the flex-container div and append
        const characterTrait = createElement('p', flexContainer, 'none', `${nicerText(key)}: `)

    //create an img-tag inside the flex-container div and append
        const pawRating = createElement('img', flexContainer, ['paw-rating'], 'none', getPawRatingSrc(value), `${value} out of 5 paws`)
        function getPawRatingSrc(value) {
            return `./resources/img/paws/${value}_paws.svg`
        }
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





/*
Bootstrap Card:
<div class="card" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">An item</li>
    <li class="list-group-item">A second item</li>
    <li class="list-group-item">A third item</li>
  </ul>
  <div class="card-body">
    <a href="#" class="card-link">Card link</a>
    <a href="#" class="card-link">Another link</a>
  </div>
</div>
*/

//to do & ideas:
// 1) add a tooltip to let user know they will go to wikipedia if they click on the link in the description text
// 2) add pagination (for more than 20 results)?
// 3) add filters for character traits (+ sort functionality?)
// 4) add additional pictures from different api?!
// 5) clean up code!!! would be nice to have some sort of structure here...
// 6) add heart icon and like feature (use local storage to save the user's likes => red heart + display on favorites page?)
// 7) create functionality for favorites page
// 8) add filters for character traits (+ sort options?)
// 9) add puppy logo and maybe background image or color
// 10) add a fun easter egg (display random dog fact when clicking certain element or sth like that)
