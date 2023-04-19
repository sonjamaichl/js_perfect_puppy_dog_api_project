const myDogs = [
    {'name' : 'Newfoundland', 'size': 5, 'barking': 1},
    {'name' : 'Labrador Retriever', 'size': 4, 'barking':2},
    {'name' : 'Border Collie', 'size': 3, 'barking': 3},
    {'name' : 'Beagle', 'size' : 2, 'barking:' : 3},
    {'name' : 'Chihuahua', 'size' : 1, 'barking' :5}   
];

for (myDog of myDogs) {
    console.log(myDog.name + ': ' + myDog.size)
}

//sorting myDogs alphabetically
const myDogsAlphabetically = myDogs.sort((a, b) => (a.name > b.name)? 1 : -1);
console.log('These are my dogs in alphabetical order: ')
console.log(myDogsAlphabetically);

//sorting myDogs by size (small to large)
const myDogsSmallToLarge = myDogs.sort((a, b) => (a.size > b.size)? 1 : -1);
console.log('These are my dogs sorted from smallest to largest: ')
console.log(myDogsSmallToLarge);

//sorting myDogs by size (large to small)
const myDogsLargeToSmall = myDogs.sort((a, b) => (a.size < b.size)? 1 : -1);
console.log('These are my dogs sorted from largest to smallest: ')
console.log(myDogsLargeToSmall);

//a function to sort the dogs that takes the array of objects, the name of the property to sort by and the order (increasing or decreasing) as parameters
function sortArrayBy(array, property, order){
    let sortedArray = [];
    for (const [key] of Object.entries(array[0])) {
        if(key === property){
            if (order === 'increasing'){
                sortedArray = array.sort((a, b) => (a.key > b.key)? 1 : -1);
            } else if (order === 'decreasing'){
                sortedArray = array.sort((a, b) => (a.key < b.key)? 1 : -1);
            } else {
                console.log ("sorry, couldn't sort array");
            }
            console.log('This is my new array sorted by ' + key + ' in '+ order + ' order:')
            console.log(sortedArray);
            return sortedArray;
        }
    }   
}

sortArrayBy(myDogs, 'size', 'increasing');

sortArrayBy(myDogs, 'size', 'decreasing');

sortArrayBy(myDogs, 'barking', 'decreasing');

sortArrayBy(myDogs, 'barking', 'increasing');