'use strict';

class HashMap {
  // Why is there a length and a capacity. Length indicates slots that are taken, but capacity indicates all slots both taken and empty
  constructor(initialCapacity = 8) {
    this.length = 0;
    this._slots = [];
    this._capacity = initialCapacity;
    this._deleted = 0;
  }

  get(key) {
    const index = this._findSlot(key);
    if (this._slots[index] === undefined) {
      throw new Error('Key error');
    }
    return this._slots[index].value;
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }

    const index = this._findSlot(key);
    //added this for this.length
    if (!this._slots[index]){
      this.length++;
    }
    this._slots[index] = {
      key,
      value,
      deleted: false
    };
    // this.length++; //sometimes it adds when it shouldn't
  }

  remove(key) {
    const index = this._findSlot(key);
    const slot = this._slots[index];
    if (slot === undefined) {
      throw new Error('Key error');
    }
    slot.deleted = true;
    this.length--;
    this._deleted++;
  }

  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const start = hash % this._capacity;
    // | 2 | 5 | 15 | 10 |
    //slot where 5 should be hashed is 1
    //slot where 35 should be hashed is 3
    for (let i = start; i < start + this._capacity; i++) {
      // Why are we creating this index this way and not using the start variable
      const index = i % this._capacity; //3 brings it back to the beginning to see if earlier spots are available if you go past start (only important when there's a collision after i++)
      const slot = this._slots[index];
      //if its an empty slot or if this same value is already in there and its not deleted, then return the index
      if (slot === undefined || (slot.key == key && !slot.deleted)) {
        return index;
      }
    }
  }

  // go over this a bit
  _resize(size) {
    const oldSlots = this._slots;
    this._capacity = size;
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this._deleted = 0;
    this._slots = [];

    for (const slot of oldSlots) {
      if (slot !== undefined && !slot.deleted) {
        this.set(slot.key, slot.value);
      }
    }
  }

  static _hashString(string) {
    let hash = 5381;
    for (let i = 0; i < string.length; i++) {
      // shift operator - check it out,  bitwise
      hash = (hash << 5) + hash + string.charCodeAt(i);
      hash = hash & hash;
    }
    return hash >>> 0;
  }
}

HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;

const testMap = new HashMap();

testMap.set('Hobbit', 'Bilbo');
testMap.set('Hobbit', 'Frodo');
testMap.set('Human', 'Aragon');
testMap.set('Elf', 'Legolas');
testMap.set('Wizard', 'Gandolf');
testMap.set('Maiar', 'The Necromancer');
testMap.set('Maiar', 'Sauron');
testMap.set('RingBearer', 'Gollum');

console.log(testMap.get('Hobbit'));
console.log(testMap);


//trim string and lower case it and get rid of punctuation?
function isPalindrome(str) {
  //go through the string and count how many times each character occurs by storing that information in a hash map.
  let hashmap = new HashMap();
  let uniqueCharArr = [];
  let count = 1;
  for(let i =0; i < str.length; i++){
    //first check if there's a value for this already in the hash map
    try{
      count = hashmap.get(str[i]);
      count++;
    }
    catch(err){
      count=1;
      uniqueCharArr.push(str[i]);
    }
    hashmap.set(str[i],count);
  }
  //iterate though hash map - if all the values in the hash map are even, or if one is odd (but only 1), then its a palindrome. otherwise it isnt
  let countOdds = 0;
  for(let i =0; i < uniqueCharArr.length; i++){
    if(hashmap.get(uniqueCharArr[i])%2===1){
      countOdds++;
    }
  }
  console.log('number of odds', countOdds);
  return countOdds>1 ? false : true;
}


// A man, a plan, a canal. Panama
// a = 10 m = 2 n=4 p = 2 l = 2 c = 1
// dad
//dads
// d=2 a = 1

let str = 'amanaplanacanalpanama';
// console.log(isPalindrome(str));



//Anagram grouping
//sort each word and if it matches something else currently in hash table, then join them together into an array and push that into the hash table. the key would be the sorted word, the value will be an array with the strings
//would it return a hash map or array?

function sortString(str){
  return str.split('').sort().join('');
}

function groupAnagram(arrOfStr){
  let hashMap = new HashMap();

  for(let i=0; i < arrOfStr.length; i++){
    let sortedStr = sortString(arrOfStr[i]);
    let groupedArr = [];

    try{
      groupedArr = hashMap.get(sortedStr);
      groupedArr.push(arrOfStr[i]);
    }
    catch(err){
      groupedArr.push(arrOfStr[i]);
    }
    hashMap.set(sortedStr,groupedArr);
  }

  //convert hashMap to an array?
  return hashMap;
}

console.log(groupAnagram(['east', 'cars', 'acre', 'arcs', 'teas', 'eats', 'race']));