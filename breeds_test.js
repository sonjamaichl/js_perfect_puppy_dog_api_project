const testButton = document.getElementById('testButton');
testButton.addEventListener('click', question1);

 //adding an overlay to display test questions on
 const testOverlay = createElement('div', document.body, ['overlay', 'test-overlay', 'modal-content'], 'none'); 
 testOverlay.style.display = 'none';

let questionsTotal = 5;
let numOfCurrentQuestion = 1;
let userProgress = 0; //==> calculate based in number of questions and number of this question

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

//a function to add the close icon in the top right corner of the overlay
function addCloseIcon(){
     //adding a div (flex container) and a close button icon (x) inside on top right corner to go back to main test page
     const closeIconContainer = createElement('div', testOverlay, ['close-icon-container'], 'none'); 
     const closeIcon = createElement('img', closeIconContainer, ['close-btn', 'close-icon'], 'none', 'resources/img/icons8-close.svg', 'Close')
     closeIcon.ariaLabel = 'Close';
     //adding eventlistener + eventhandler function to closeButton
     closeIcon.addEventListener('click', function(){
           testOverlay.style.display = 'none';    //makes overlay and everything on top invisible => back to resultsList view
        })
}

//a function to display the questions
function addQuestion(num, text){
    const questionContainer = createElement('div', testOverlay, ['container', 'test-question-container'], 'none');
    const questionHeading = createElement('h5', questionContainer, 'none', `Question ${num}`);
    const question = createElement('p', questionContainer, 'none', text);   
}  

//a function to add a previous and/or next button to navigate between the pages (q1 only has next button, last q only has previous button, everything between both buttons)
function addNavButton(num){
    if (num === 1 || num === questionsTotal){
        const buttonText = (num === 1)? 'Next >>' : '<< Previous';
        const onlyButtonContainer = createElement('div', testOverlay, ['container', 'd-flex', 'justify-content-center'], 'none');
        const onlyButton = createElement('button', onlyButtonContainer, ['btn', 'btn-outline', 'btn-outline-primary'], buttonText);
        const eventHandler = (num === 1)? question2 : question4;    //hard-coded => can we change that depending on the value of questionsTotal?
        onlyButton.addEventListener('click', eventHandler);
    } else if (num > 1 && num < questionsTotal){
        const buttonGroup = createElement('div', testOverlay, ['container', 'd-flex','justify-content-center'], 'none');       //does it need a role and aria-label? bootstrap uses those for button groups
        const previousButton = createElement ('button', buttonGroup, ['btn', 'btn-outline', 'btn-outline-primary'], '<< Previous');
        previousButton.type = 'button';
        const nextButton = createElement ('button', buttonGroup, ['btn', 'btn-outline', 'btn-outline-primary'], 'Next >>');
        nextButton.type = 'button';
        //how do we decide which eventhandler we assign?
    }
}


//function to run when user click Start Test (display overlay, first question...)
function question1(){
    //adding an overlay to display test questions on
    testOverlay.style.display = 'inline-block';
   //adding close icon & progress bar
    addCloseIcon();
    showProgress(userProgress);

    //adding first question
    addQuestion(1, 'Which size(s) of dog do you prefer?');
    
    //adding answer options (checkboxes)
    const dogSizes = ['miniature', 'small', 'medium', 'large', 'giant'];
    for (dogSize of dogSizes) {
        //create a checkbox & label for each dog-size and give it an id so we can access it's value later
        const formCheck = createElement('div', testOverlay, ['form-check', 'container'], 'none');
        const formCheckInput = createElement('input', formCheck, ['form-check-input'], 'none');
        formCheckInput.type = 'checkbox';
        formCheckInput.value = '';
        formCheckInput.name = 'dog-sizes-checkbox'
        formCheckInput.id = `size-${dogSize}`;
        const formCheckLabel = createElement('label', formCheck, ['form-check-label'], dogSize);
        formCheckLabel.for = formCheckInput.id;
    }

    addNavButton(1);
}

function question2(){
    //clearing innerText of test overlay to get rid of question 1
    testOverlay.innerText = '';
    addCloseIcon();
    showProgress(changeUserProgress('plus'));
    addQuestion(2, 'How much energy should your dog have?')

    //add some options to select here!!!
    //values from 1-5 => select the max energy?

    addNavButton(2);

}

function question3(){
    console.log('coming soon...')
}

function question4(){
    console.log('coming soon...');
}

   


    


    
