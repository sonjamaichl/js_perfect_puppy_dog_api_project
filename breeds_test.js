activateTestButton();

let testFilterObject = createFilterObject(exampleDogs);
console.log(testFilterObject);

//giving the start test button functionality
function activateTestButton(){
    const testButton = document.getElementById('testButton');
    testButton.addEventListener('click', function(){
        runTest(questions, 0);
    });
}

//a function to hide and show elements
function displayElement(elementId, display){
    document.getElementById(elementId).style.display = display;
 }
 
//a function to add the close icon in the top right corner of the overlay and give it functionality
function addCloseIcon(){
    //adding a div (flex container) and a close button icon (x) inside on top right corner to go back to main test page
    const closeIconContainer = createElement('div', document.getElementById('overlay'), ['close-icon-container'], 'none'); 
    const closeIcon = createElement('img', closeIconContainer, ['close-btn', 'close-icon'], 'none', 'resources/img/icons8-close.svg', 'Close')
    closeIcon.ariaLabel = 'Close';
    //adding eventlistener + eventhandler function to closeButton
    closeIcon.addEventListener('click', function(){
          displayElement('overlay', 'none');    //makes overlay and everything on top invisible => back to resultsList view
       })
}

 //a function to display the questions
 function addQuestion(questions, i){
    const questionContainer = createElement('div', document.getElementById('overlay'), ['container', 'test-question-container'], 'none');
    const questionHeading = createElement('h4', questionContainer, 'none', `Question ${i+1}`);
    let text = questions[i].question;
    const question = createElement('h5', questionContainer, 'none', text);   
}  

function runTest(questions, i){
    //'open' overlay for test content
    displayElement('overlay', 'inline-block'); //'opens' overlay (makes it visible)
    //clear all content on test overlay first before displaying new question
    document.getElementById('overlay').innerText = '';
    //add close icon to overlay
    addCloseIcon();
    //add heading with number i+1 (first i = 0, first question is 1) and add questions[i].question as question text
    addQuestion(questions, i);
    //loop through questions[i].answers and display a checkbox/radio for every option
    addAnswers(questions, i);
    //add next/previous or previous and next button and give it functionality (should display previous or next question)
    addNavButton(questions, i);
    //update user progress and progress bar
    if(i === questions.length-1){
        const getResultButton = createElement('button', document.getElementById('overlay'), ['btn', 'btn-primary'], 'Get result');
        getResultButton.addEventListener('click', function(){
            document.getElementById('overlay').innerText = 'Test results:';
            addCloseIcon();
            showAll = true;
            offset = 0;
            
            //h1: Test result: These breeds are best for you
            //display some sort of search message?!
            //make a container for the results (with grid!!!)
            const testResults = createElement('div', document.getElementById('overlay'), ['row', 'g-3', 'row-cols-1', 'row-cols-sm-2', 'row-cols-md-3', 'row-cols-lg-4'], 'none');
            testResults.id = 'testResults';
            //add spinner???!!!

            //get all dogs from API (fetch)
            getResults(url, 'testResults');
            //use filterobject to calculate results
            //create cards for result dogs
        })
    }
}



 
function addAnswers(questions, i){
    console.log('testtesttest testfilterobject:');
    console.log(testFilterObject);
    
    //add a container for answer inputs and labels (and a picture)
    const outerContainer = createElement('div', document.getElementById('overlay'), ['container', 'd-flex', 'justify-content-between', 'align-items-center'], 'none');
    //add a container just for answer options
    const answerContainer = createElement('div', outerContainer, ['container'], 'none');
    //loop through questions[i].answers to get all possible answers
    for (let j = 0; j < questions[i].answers.length; j++){
        //console.log(questions[i].property);   //TEST
        //console.log(questions[i].answers[j]); //TEST
        const formCheck = createElement('div', answerContainer, ['form-check', 'container'], 'none');
        if(questions[i].property === 'size'){
            //console.log(questions[i].answers[j]); //TEST
            //create checkboxes (because user should be able to select multiple sizes)
            const formCheckInput = createElement('input', formCheck, ['form-check-input'], 'none');
            formCheckInput.type = 'checkbox';
            formCheckInput.value = questions[i].answers[j];     //size has no evalKey!
            formCheckInput.name = questions[i].property;
            formCheckInput.id = `size-${questions[i].answers[j]}`;  //necessary?
            const formCheckLabel = createElement('label', formCheck, ['form-check-label'], questions[i].answers[j]);
            formCheckLabel.for = formCheckInput.id;
            formCheckInput.addEventListener('change', function(event){
                getTestInput(event);
                //if checked... add value to testFitlerObjects property values array
                //else (unchecked)... remove value from testFilterObjects property values array
            })
        } else {
            //create radios (because all other questions are only one choice!)
            const radioInput = createElement('input', answerContainer, ['form-check-input'], 'none');
            radioInput.type = 'radio';
            radioInput.name = questions[i].property;
            radioInput.id = `${questions[i].property}-${questions[i].answers[j]}`;  //necessary? can use event to find out which radio was clicked...
            radioInput.value = questions[i].evalKey[j];
            const radioLabel = createElement('label', answerContainer, ['form-check-label'], questions[i].answers[j]);
            radioLabel.for = radioInput.id;
            radioInput.addEventListener('change', function(event){
                getTestInput(event);
               //if checked... add value to testFitlerObjects property values array, else remove all values 
            })
        }
    }
        //add an image for each question
        const img = createElement('img', outerContainer, 'none', 'none', `./resources/img/dogs/dog_${questions[i].property}.jpg`, `dog: ${questions[i].property}`);    
}

function getTestInput(event){
    if (event.target.name === 'size'){  //different logic for size because there ar checkboxes!
        if(event.target.checked){
            testFilterObject[event.target.name].push(event.target.value);
        } else {
            testFilterObject[event.target.name].filter(event.target.value);
        }    
    } else {
        if(event.target.checked){
            for (let v = 0; v < event.target.value.length; v++){
                testFilterObject[event.target.name].push(event.target.value[v]);
            }
        }
        else{
            testFilterObject[event.target.name] = [];
       //(event.target.checked)? event.target.value : [];  //something's wrong here => the values are not in an array anymore but are strings => change!!!
        console.log(testFilterObject[event.target.name]);
    }
    }
console.log(testFilterObject);
}


//a function to add a previous and/or next button to navigate between the pages (q1 only has next button, last q only has previous button, everything between both buttons)
function addNavButton(questions, i){
    if (i === 0){
        const nextButtonContainer = createElement('div', document.getElementById('overlay'), ['container', 'd-flex', 'justify-content-center'], 'none');
        const nextButton = createElement('button', nextButtonContainer, ['btn', 'btn-outline', 'btn-outline-primary', 'nav-btn'], 'Next >>');
        nextButton.addEventListener('click', function(){runTest(questions, 1)})
    } else if (i === questions.length-1){
        const previousButtonContainer = createElement('div', document.getElementById('overlay'), ['container', 'd-flex', 'justify-content-center'], 'none');
        const previousButton = createElement('button', previousButtonContainer, ['btn', 'btn-outline', 'btn-outline-primary', 'nav-btn'], '<< Previous');
        previousButton.addEventListener('click', function(){runTest(questions, questions.length-2)})
    } else if (i > 0 && i < questions.length){
        const buttonGroup = createElement('div', document.getElementById('overlay'), ['container', 'd-flex','justify-content-center'], 'none');       //does it need a role and aria-label? bootstrap uses those for button groups
        const previousButton = createElement ('button', buttonGroup, ['btn', 'btn-outline', 'btn-outline-primary', 'nav-btn'], '<< Previous');
        previousButton.type = 'button';
        previousButton.id = `nav-button-q${i+1}-previous`;
        previousButton.addEventListener('click', function(){runTest(questions, i-1)});
        const nextButton = createElement ('button', buttonGroup, ['btn', 'btn-outline', 'btn-outline-primary', 'nav-btn'], 'Next >>');
        nextButton.type = 'button';
        nextButton.addEventListener('click', function(){runTest(questions, i+1)});
    }
}


//a function to change the user progress to be displayed in progress bar
function changeUserProgress(operator){
    if (operator === 'plus'){
        userProgress += Math.round((1/questionsTotal)*100);
    } else if (operator === 'minus'){
        userProgress -= Math.round((1/questionsTotal)*100);   
    }
    return userProgress;

}

//a function to show the progress bar
function showProgress(userProgress){
    const progressContainer = createElement('div', testOverlay, ['container'], 'none');
    const progress = createElement('div', progressContainer, ['progress'], 'none');
    progress.role = 'progressbar';
    progress.ariaLabel = 'progress of test';
    progress.ariaValuenow = `${userProgress}`;       //slice(0,-1) removes last character (%) from user Progress, e.g. 25% => 25
    ariaValuemin = '0';
    ariaValuemax = '100';
    const progressBar = createElement('div', progress, ['progress-bar'], `${userProgress}%`);
    progressBar.style.width = `${userProgress}%`;
}

let url = "https://api.api-ninjas.com/v1/dogs?min_height=1&offset=0";
let resultDogs = [];

async function getResults(url, parent){
    let response = await fetch(url, {
        method: "GET",
        headers: {
          "X-API-Key": api_key,
        }
    })
    let newDogs = await response.json();
    for (newDog of newDogs) {
            newDog.favorite = false;
            newDog.matchesFilter = true;
            newDog.size = calculateSize(newDog); 
            newDog.wikiLink = '';
            resultDogs.push(newDog);
        }
    if (newDogs.length === 20) {
        offset +=20;
        getResults(url);  
    } else {
        offset = 0;
        //show a message to user to let them know if and how many search results were found
        //showSearchMessage(dogs);
        //display a select form (dropdown) to choose sorting options for the search results (only if there's more than 1 result!)???
        /*if (resultDogs.length > 1){
            showSortingOptions(dogs, 'sortOptions', 'results', 'resultsList');
            let filterObject = createFilterObject(dogs);
            showFilteringOptions(filterObject, dogs);
        }*/
        //check which dogs match with the testFilterObject!!!
        filterResults(testFilterObject, resultDogs);
        //create a card with image and info for each dog
        createCards(resultDogs, parent); 
        console.log('These are your matches:');
        console.log(resultDogs);
}
}



   


    


    
