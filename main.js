for (dog of dogs) {
    //create one div with class card for every dog
    let resultsList = document.getElementById('resultsList');
    let colDiv = document.createElement('div');
    resultsList.appendChild(colDiv);
    let card = document.createElement('div');
    card.classList.add('card');
    card.style.width = '18rem';
    colDiv.appendChild(card);

    //put img of dog inside card and add card-img-top class + alt
    let newImg = document.createElement('img');
    newImg.src = dog.image_link;
    newImg.classList.add('card-img-top');
    newImg.alt = dog.name;
    card.appendChild(newImg);
    
    //put another div with class card-body inside card
    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    card.appendChild(cardBody);
    //cardBody.innerHTML = "doggy love";

    //put h5 with dog breed's name in cardBody
    let cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.innerText = dog.name;
    cardBody.appendChild(cardTitle);

    //put p with some text inside cardBody
    //since there is no description text in api data, let's put sth together
    let cardText = document.createElement('p');
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
    cardText.innerText = `The ${dog.name} is a ${size} dog with a life expectancy of ${dog.min_life_expectancy} - ${dog.max_life_expectancy} years.`;
    cardBody.appendChild(cardText);

    //create div container for button, make it flex + justify-content: center
    let buttonContainer = document.createElement('div');
    buttonContainer.style.display = "flex";
    buttonContainer.style.flexDirection = "row";
    buttonContainer.style.justifyContent = "center";
    cardBody.appendChild(buttonContainer);


    //INSERT SHOW MORE BUTTON HERE + append to button container
    let showMoreButton = document.createElement('button');
    showMoreButton.innerText = "Show More";
    showMoreButton.type = "button";
    showMoreButton.classList.add('btn', 'btn-primary');
    buttonContainer.appendChild(showMoreButton);

    //create second part of cardBody that can be accessed by clicking show more button
    let cardBodyOptional = document.createElement('div');
    card.appendChild(cardBodyOptional);


    //create eventHandlerFunction:
    function showMore() {

    if (showMoreButton.innerText === "Show More") {

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
              //listGroupItem.innerHTML = `${nicerText(key)}: ${value}/5`;
                //listGroupItem.innerHTML = `${nicerText(key)}: `;

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

    //change button text to "SHOW LESS" and change its color when clicked:
    showMoreButton.innerText = "Show Less";
    showMoreButton.setAttribute('class', 'btn btn-secondary');
    }
    } else {
        showMoreButton.innerText = "Show More";
        showMoreButton.setAttribute('class', 'btn btn-primary');
        cardBodyOptional.innerHTML = '';
    }
    }

    showMoreButton.addEventListener('click', showMore);
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
