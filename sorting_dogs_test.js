const myDogs = [
    {
        'name' : 'Newfoundland',
        'size': 5,
        'barking': 1
    },
    {
        'name' : 'Labrador Retriever',
        'size': 4,
        'barking': 2
    },
    {
        'name' : 'Border Collie', 
        'size': 3, 
        'barking': 3},
    {
        'name' : 'Beagle',
        'size' : 2,
        'barking' : 4},
    {
        'name' : 'Chihuahua',
        'size' : 1,
        'barking' : 10
    }   
];

for (myDog of myDogs) {
    console.log(myDog.name + ': ' + myDog.size)
}

//sorting myDogs alphabetically
const myDogsAlphabetically = myDogs.sort((a, b) => (a.name > b.name)? 1 : (a.name < b.name)? -1 : 0);
console.log('These are my dogs in alphabetical order: ')
console.log(myDogsAlphabetically);

//sorting myDogs by size (small to large)
const myDogsSmallToLarge = myDogs.sort((a, b) => (a.size > b.size)? 1 : (a.size < b.size)? -1 : 0);
console.log('These are my dogs sorted from smallest to largest: ')
console.log(myDogsSmallToLarge);

//sorting myDogs by size (large to small)
const myDogsLargeToSmall = myDogs.sort((a, b) => (a.barking < b.barking)? 1 : (a.barking > b.barking)? -1 : 0);
console.log('These are my dogs sorted from most to least barking: ')
console.log(myDogsLargeToSmall);

//a function to sort the dogs that takes the array of objects, the name of the property to sort by and the order (increasing or decreasing) as parameters
function sortArrayBy(array, property, order){
    let sortedArray = [];
   // for (const [key] of Object.entries(array[0])) {
     //   if(key === property){
            console.log(property);   //TEST
            if (order === 'increasing'){
                sortedArray = array.sort((a, b) => (a[property] > b[property])? 1 : (a[property] < b[property])? -1 : 0);
            } else if (order === 'decreasing'){
                sortedArray = array.sort((a, b) => (a[property] < b[property])? 1 : (a[property] > b[property])? -1 : 0);
            } else {
                console.log ("sorry, couldn't sort array");
            }
            console.log('This is my new array sorted by ' + property + ' in '+ order + ' order:')
            console.log(sortedArray);
            return sortedArray;
       // }
   // }   
}

sortArrayBy(myDogs, 'size', 'increasing');

sortArrayBy(myDogs, 'size', 'decreasing');

sortArrayBy(myDogs, 'barking', 'decreasing');

sortArrayBy(myDogs, 'barking', 'increasing');


//a funciton that filters an array by a specific property's value and returns all the values that match the criteria
function filterArrayBy(array, property, value){
    const filteredArray = array.filter(element => element[property] === value);
    return filteredArray;
}

////a funciton that filters an array by a specific property's value and returns all the values that DON'Tmatch the criteria
function filterArrayReverse(array, property, value){
    const filteredArray = array.filter(element => element[property] !== value);
    return filteredArray;  
}

console.log(filterArrayBy(myDogs, 'size', 5));
console.log(filterArrayReverse(myDogs, 'size', 1));

console.log(filterArrayBy(myDogs, 'barking', 10));
console.log(myDogs);