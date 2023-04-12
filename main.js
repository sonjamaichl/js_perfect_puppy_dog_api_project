let basicURL = "https://api.api-ninjas.com/v1/dogs?";
let offset = 0;
let dogs = [];
let showAll = false;

//function to get the input from search bar
function getSearchInput() {
    let searchInput = showAll? "1" : document.getElementById('searchInput').value;
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


function getData(url) {
    fetch(url, {
        method: "GET",
        headers: {
          "X-API-Key": "qwIGzCw6xnboQDmPHxp2wQ==7CP90HowwDVCSr2d",
        }
     })
        .then(response => response.json())
        .then(result => {
            let newDogs = result;
            for (newDog of newDogs) {
                dogs.push(newDog);
            }
            console.log('newDogs: '+newDogs, 'newDogs-length: '+newDogs.length)
            console.log('dogs: '+dogs, 'dogs.length: '+dogs.length)
            if (newDogs.length === 20) {
                //console.log('more than 20 results found, fetching again')
                offset +=20;
                getData(getURL(getSearchInput));           //making getData() recursive so we can get more than 20 results for each search (with multiple requests)
            } else {
                offset = 0;
            createCards(dogs);
            document.getElementById('spinner').style.display = 'none';
        }
        })
        .catch(err => console.log("oopsies... couldn't fetch data from api"))
}

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
      

//start loop
for (dog of dogs) {
//create one div with classes 'col d-flex align-items-stretch' and another one inside it with class card for every dog + append to resultsList
    let resultsList = document.getElementById('resultsList');
    let colDiv = document.createElement('div');
    colDiv.classList.add('col');    //adding classes 'd-flex' (and 'align-items-stretch'?) makes all cards the same height, but then they all open, when you only want to open one with "show more"
    resultsList.appendChild(colDiv);
    let card = document.createElement('div');
    card.classList.add('card');
    colDiv.appendChild(card);

//put img of dog inside card and add card-img-top class + alt
    let newImg = document.createElement('img');
    newImg.src = dog.image_link;
    newImg.classList.add('card-img-top');
    newImg.alt = dog.name;
    card.appendChild(newImg);

    //adding event listener to newImg to create a larger modal when clicked
    newImg.addEventListener('click', function(event){
        let dogImg = event.target;
        console.log(dogImg.src);
        showModal(dogImg);
    });

    //a function to display a modal when picture is clicked
    
//put another div with class card-body inside card
    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body', 'd-flex', 'flex-column', 'justify-content-between');
    card.appendChild(cardBody);
    //cardBody.innerHTML = "doggy love";

//create div for h5 and card text (needed to adjust text & button with flex later)

    let cardText = document.createElement('div');
    cardText.style.height = '10rem';            //this makes all cardTexts the same height (since img and buttons are same height as well, all cards are now equal-sized, except when show more was clicked)
    cardBody.appendChild(cardText);
    
//put h5 with dog breed's name in cardBody
    let cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.innerText = dog.name;
    cardText.appendChild(cardTitle);

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
    cardDescription.innerText = (dog.min_life_expectancy === dog.max_life_expectancy)? `The ${dog.name} is a ${size} dog with a life expectancy of about ${dog.min_life_expectancy} years.` : `The ${dog.name} is a ${size} dog with a life expectancy of ${dog.min_life_expectancy} - ${dog.max_life_expectancy} years.`;
    cardText.appendChild(cardDescription);

//create div container for button, make it flex + justify-content: center
    let buttonContainer = document.createElement('div');
    buttonContainer.style.display = "flex";
    buttonContainer.style.flexDirection = "row";
    buttonContainer.style.justifyContent = "center";
    cardBody.appendChild(buttonContainer);


//INSERT SHOW MORE BUTTON + append to button container
    let showMoreButton = document.createElement('button');             
    showMoreButton.innerText = "Show More";
    showMoreButton.type = "button";
    showMoreButton.classList.add('btn', 'btn-primary');
    showMoreButton.addEventListener('click', showMore);
    buttonContainer.appendChild(showMoreButton);

//create second part of cardBody that can be accessed by clicking show more button
    let cardBodyOptional = document.createElement('div');
    card.appendChild(cardBodyOptional);
    cardBodyOptional.style.display = "none";

//create ul to list characteristics and append to card
let listGroup = document.createElement('ul');
listGroup.classList.add('list-group', 'list-group-flush')
cardBodyOptional.appendChild(listGroup);

//create li elements with class 'list-group-item' and append to listGroup (ul)
    //let's DRY & write another for loop for that ;-)

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
    }
 
    for (const [key, value] of Object.entries(dog)) {
        if(key ===  "image_link" || key === "min_life_expectancy" || key === "max_life_expectancy" || key === "max_height_male" || key === "max_height_female" || key === "max_weight_female" || key === "max_weight_male" || key === "min_height_male" || key === "min_height_male" || key === "min_height_female" || key === "min_weight_male" || key === "min_weight_female" || key === "name"){
            continue;
        } else {
    //create one li element for every key-value pair
        let listGroupItem = document.createElement('li');
        listGroup.appendChild(listGroupItem);

    //create a div tag inside the li and give it class "flex-container" + append to li
        let flexContainer = document.createElement('div');
        flexContainer.classList.add('flex-container');
        listGroupItem.appendChild(flexContainer);

    //create a p-tag inside the flex-container div and append
        let characterTrait = document.createElement('p');
        characterTrait.innerText = `${nicerText(key)}: `;
        flexContainer.appendChild(characterTrait);

    //create an img-tag inside the flex-container div and append
        let pawRating = document.createElement('img');
        function getPawRatingSrc(value) {
            return `./resources/img/paws/${value}_paws.svg`
        }
        pawRating.src = getPawRatingSrc(value);
        pawRating.alt = `${value} out of 5 paws`;
        pawRating.classList.add('paw-rating');
        flexContainer.appendChild(pawRating);
    }
}



    //create an eventHandlerFunction:       ==> could exist outside of the loop if event.target is used instead of showMoreButton (rewrite event listener to do that)

    function showMore() {

    if (showMoreButton.innerText === "Show More") {
   
    //change display property of cardBodyOptional to inline-block?
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
}
}

//a function to display a modal when clicking on the dog images
function showModal(img){
    //creating a black overlay to hide other content behind and put modal on top
    let overlay = document.createElement('div');
    overlay.classList.add('overlay', 'modal-content');
    document.body.appendChild(overlay);

    //adding a div (flex container) and a close button icon (x) inside on top right corner to go back to results (card view)
     let closeButtonContainer = document.createElement('div');
     closeButtonContainer.classList.add('close-btn-container'); //class is not working as intended?!
     overlay.appendChild(closeButtonContainer);
     let closeButton = document.createElement('img');
     closeButton.src = 'resources/img/icons8-close.svg';
     closeButton.alt = "Close";
     closeButton.ariaLabel = 'Close';
     closeButton.classList.add('close-btn');
     closeButtonContainer.appendChild(closeButton);

     //adding eventlistener + eventhandler function to closeIcon
     closeButton.addEventListener('click', function(){
        overlay.style.display = 'none';
     })

    //putting new img inside it:
    let modalImg = document.createElement('img');
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modalImg.style.maxWidth = '100%';
    overlay.appendChild(modalImg);

    //adding text that displays the name of the dog (in case user forgets what they clicked on)
    let modalText = document.createElement('p');
    modalText.innerText = img.alt;
    modalText.style.margin = '1rem';
    overlay.appendChild(modalText);


}







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

//to do:

// 1) add spinner while waiting for results!!!
// 2) add pagination (for more than 20 results)?
// 2) add filters for character traits (+ sort functionality?)
// 3) clean up code!!! would be nice to have some sort of structure here...
// 4) add heart icon and like feature (use local storage to save the user's likes => red heart + display on favorites page?)
// 5) add navbar and more pages (one to save favorites would be nice)
// 6) add filters for character traits (+ sort options?)
// 7) add puppy logo and maybe background image or color
// 8) add a fun easter egg (display random dog fact when clicking certain element or sth like that)