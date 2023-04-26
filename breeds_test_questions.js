let questions = [

q1 = {                                                              //use checkboxes so multiple answers are possible
    property : 'size',
    question : 'Which size(s) of dog do you prefer?',
    answers : ['miniature', 'small', 'medium', 'large', 'giant'],    //doesn't need evaluation key since answer options match with possible property values
},

q2 = {                                                              // use radios for q2-12: user has to choose one answer option
    property : 'good_with_children',
    question : 'How important is it to you that your dog is good with children?',
    answers: ["It doesn't matter at all to me.", "Somehow important, but not so much, since I don't have any children living with me.", 'Quite important, because the dog will have to get along with children from friends and family.', 'Extremely important, since there are children living in my household.' ],
    evalKey: {
        '0' : [],
        '1' : [3, 4, 5],
        '2' : [4, 5],
        '3' : [5]
    }
},

q3 = {
    property : 'good_with_other_dogs',
    question: 'How important is it to you that your dog gets along well with other dogs?',
    answers: ['Not so much.', "Quite important, because I don't want to get in trouble when encountering other dogs on the street or in the park.", 'Extremely important, because I either already have another(other dog(s) or often meet with friends or family who also have dogs.'],
    evalKey: {
        '0' : [],
        '1' : [3, 4, 5],
        '2' : [4, 5],
    }
},

q4 = {
    property : 'good_with_strangers',
    question: 'How important is it to you that your dog is friendly to strangers?',
    answers: ["Not so much, since there won't be much contact with strangers.", "Quite important, because I don't want to face any problems with my dog when meeting people on the street or with friends visiting me at home.", "Very important. I'd like to be able to have a lot of visitors at home or take my dog with me to the office, so it would be great if the dog would be very friendly towards strangers."],
    evalKey: {
        '0' : [],
        '1' : [3, 4, 5],
        '2' : [4, 5],
    }
},

q5 = {
    property : 'protectiveness',
    question: 'Would you prefer a dog that is protective and likes to guard you and/or your property?',
    answers: ["Absolutely, I'd like to have a real guard dog that alerts me whenever someone comes close to my property.", "Not really, I'd actually prefer a dog that is not very protective.","I don't really care. I'm fine with all levels of protectiveness."],
    evalKey: {
        '0' : [4, 5],
        '1' : [0, 1, 2, 3],
        '2' : [],
    }
},

q6 = {
    property : 'trainability',
    question: 'Would you like to have a dog that is very trainable?',
    answers: ["Not really, I'd be fine if my dogs knows the basic commands. More is really not necessary.", "Yes, I'd like to do regular obedience training with my dog and teach him to do some fun tricks.", 'Absolutely, I want to train my dog for a special purpose (like rescue dog or for hunting...).', "I don't mind, but I'd be willing to do more training if I get a breed that needs a lot of brain exercise."],
    evalKey: {
        '0' : [0, 1, 2, 3],
        '1' : [4, 5],
        '2' : [5],
        '3' : []
    }
},

q7 = {
    property : 'energy',
    question : 'How much energy should your perfect dog have to fit your lifestyle best?',
    answers: ["I'm aware that most dogs need a lot of physical exercise, but I'd prefer one that is on the lower end of the range.", "I'm an outdoor sports person and would like to have an energetic dog that I can with me when I go running, biking, hiking, swimming...", "I'm not full of energy myself, so I don't need a high energy dog, but I have a garden where my dog could run around and play all day, so a little bit more energy would be ok."],
    evalKey: {
        '0' : [0, 1, 2, 3],
        '1' : [4, 5],
        '2' : [0, 1, 2, 3, 4]
    }

},

q8 = {
    property : 'barking',
    question : 'How do you feel about dogs that bark a lot?',
    answers : ['Definitely not the right dog for me.', "I don't mind some barking, but please not all day every day.", "I love it when my dog barks a lot. This way he can communicate his needs to me and/or warn me about potential intruders on my property.", "I don't understand this question. Dogs bark, some more, some less. And I love dogs, so I'm fine with it."],
    evalKey: {
        '0' : [0, 1, 2],
        '1' : [0, 1, 2, 3],
        '2' : [4, 5],
        '3' : []
    }
},

q9 = {
    property : 'playfulness',
    question : 'Would you like to spend a lot of time playing with your dog?',
    answers : ["Of course, I have a lot of time and could throw sticks and balls all day.", "I'd prefer a dog that needs a little less playtime, because I'm very busy and don't always have time for that.", "Whatever my furry friend likes. I'm sure I'd be able to find enough time for playing if my dog loves it."],
    evalKey: {
        '0' : [4, 5],
        '1' : [0, 1, 2, 3],
        '2' : [],
    }
},

q10 = {
    property : 'grooming',
    question: 'Would you be ok with a dog that needs a lot of grooming?',
    answers : ["Absolutely, I'd love to brush my dog every day and go to the dog groomer a lot.", "I'd be ok with doing some grooming from time to time but not on a daily basis.", "Not really, I'd prefer a dog with a low maintenance coat.", "I don't mind, whatever my dog needs will be done."],
    evalKey: {
        '0' : [3, 4, 5],
        '1' : [0, 1, 2, 3],
        '2' : [0, 1],
        '3' : []
    }
},

q11 = {
    property : 'shedding',
    question :  'How much shedding would you be willing to accept?',
    answers : ["As little as possible! I just hate it when there's hair everywhere and/or some of my friends/family/colleagues are allergic.", "I'd be willing to vacuum more often, if necessary, but to be honest, I'd not be very happy about a lot of shedding.", "All of it, I really don't mind being covered in dog hair all the time and/or I'm already used to it because I have other pets that also shed a lot."],
    evalKey: {
        '0' : [0,1],
        '1' : [0, 1, 2, 3],
        '2' : [],
    }
},

q12 = {
    property : 'drooling',
    question : 'Would you mind if your dog drools a lot?',
    answers : ["Not at all, my dog can drool as much as he wants.", "I'd be ok with an average amount of dog saliva, but less would definitely be better.", "Ugh, disgusting... I'd prefer a dog that doesn't drool much at all."],
    evalKey: {
        '0' : [],
        '1' : [0, 1, 2],
        '2' : [0, 1],
    }
}
];

//console.log(questions.length);

let exampleDogs =[
    {
        "image_link": "https://api-ninjas.com/images/dogs/affenpinscher.jpg",
        "good_with_children": 3,
        "good_with_other_dogs": 3,
        "shedding": 3,
        "grooming": 3,
        "drooling": 1,
        "coat_length": 2,
        "good_with_strangers": 5,
        "playfulness": 3,
        "protectiveness": 3,
        "trainability": 3,
        "energy": 3,
        "barking": 3,
        "min_life_expectancy": 12.0,
        "max_life_expectancy": 15.0,
        "max_height_male": 11.5,
        "max_height_female": 11.5,
        "max_weight_male": 10.0,
        "max_weight_female": 10.0,
        "min_height_male": 9.0,
        "min_height_female": 9.0,
        "min_weight_male": 7.0,
        "min_weight_female": 7.0,
        "name": "Affenpinscher"
    }
]
