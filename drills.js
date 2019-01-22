"use strict";

class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class _AdvancedNode {
  constructor(value, next, previous) {
    this.value = value;
    this.next = next;
    this.previous = previous;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }

  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }

  //   insertBefore(item, ptr){
  //     let currNode = this.head;
  //     let prevNode = this.head;
  //     while(currNode.next !== ptr){
  //         prevNode = currNode;
  //         currNode = currNode.next;
  //     }
  //     // currNode.next = new _Node(item, ptr);
  //     prevNode.next = new _Node(item,ptr);
  //   }

  insertBefore(newItem, targetItem) {
    // similar stuff
    let tempNode = this.find(targetItem);
    let currNode = this.head;
    let prevNode = this.head;
    while (currNode.next !== tempNode) {
      prevNode = currNode;
      currNode = currNode.next;
    }
    // currNode.next = new _Node(item, ptr);
    currNode.next = new _Node(newItem, tempNode);
  }

  insertAfter(newItem, targetItem) {
    let tempNode = this.find(targetItem);
    let currNode = this.head;
    while (currNode !== tempNode) {
      currNode = currNode.next;
    }
    currNode.next = new _Node(newItem, tempNode.next);
  }

  insertHeadCycle(item) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, this.head);
    }
  }

  insertAt(newItem, index) {
    let count = 0;
    let currNode = this.head;
    while (count !== index) {
      currNode = currNode.next;
      count++;
    }
    this.insertBefore(newItem, currNode.value);
  }
  findValue(key) {
    let currNode = this.head;
    if (!this.head) {
      return null;
    }
    console.log("display the node: ", Object.keys(currNode.value));
    while (Object.keys(currNode.value)[0] !== key) {
      if (currNode.next === null) {
        return null;
      } else {
        //otherwise keep looking
        currNode = currNode.next;
      }
    }
    console.log("current node : ", currNode.value[key]);
    return currNode.value[key];
  }
  find(item) {
    //start at the head
    let currNode = this.head;
    //if the list is empty
    if (!this.head) {
      return null;
    }
    //Check for the item
    while (currNode.value !== item) {
      //return null if end of the list
      // and the item is not on the list
      if (currNode.next === null) {
        return null;
      } else {
        //otherwise keep looking
        currNode = currNode.next;
      }
    }
    //found it
    return currNode;
  }
  remove(item) {
    //if the list is empty
    if (!this.head) {
      return null;
    }
    //if the node to be removed is head, make the next node head
    if (this.head.value === item) {
      this.head = this.head.next;
      return;
    }
    //start at the head
    let currNode = this.head;
    //keep track of previous
    let previousNode = this.head;

    while (currNode !== null && currNode.value !== item) {
      //save the previous node
      previousNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      console.log("Item not found");
      return;
    }
    previousNode.next = currNode.next;
  }
}

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
      throw new Error("Key error");
    }
    return this._slots[index].value;
  }

  display() {
    let output = [];
    this._slots.forEach(item => {
      console.log("item: ", item);
      console.log(this._slots.length);
      if (item !== undefined) {
        // console.log(item.key);
        output.push({ [item.key]: item.value });
      }
    });
    return output;

    // display the keys and values
    // for (let i = 0; i < this._slots.length; i++) {
    //   if (this._slots[i] !== undefined) {
    //     console.log(`${this._slots[i].key}: `, this._slots[i].value);

    //   }
    // }
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }

    const index = this._findSlot(key);
    //added this for this.length
    if (!this._slots[index]) {
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
      throw new Error("Key error");
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

testMap.set("Hobbit", "Bilbo");
testMap.set("Hobbit", "Frodo");
testMap.set("Human", "Aragon");
testMap.set("Elf", "Legolas");
testMap.set("Wizard", "Gandolf");
testMap.set("Maiar", "The Necromancer");
testMap.set("Maiar", "Sauron");
testMap.set("RingBearer", "Gollum");

// console.log(testMap.get("Hobbit"));
// console.log(testMap);

//trim string and lower case it and get rid of punctuation?
function isPalindrome(str) {
  //go through the string and count how many times each character occurs by storing that information in a hash map.
  let hashmap = new HashMap();
  let uniqueCharArr = [];
  let count = 1;
  for (let i = 0; i < str.length; i++) {
    //first check if there's a value for this already in the hash map
    try {
      count = hashmap.get(str[i]);
      count++;
    } catch (err) {
      count = 1;
      uniqueCharArr.push(str[i]);
    }
    hashmap.set(str[i], count);
  }
  //iterate though hash map - if all the values in the hash map are even, or if one is odd (but only 1), then its a palindrome. otherwise it isnt
  let countOdds = 0;
  for (let i = 0; i < uniqueCharArr.length; i++) {
    if (hashmap.get(uniqueCharArr[i]) % 2 === 1) {
      countOdds++;
    }
  }
  //console.log("number of odds", countOdds);
  return countOdds > 1 ? false : true;
}

// A man, a plan, a canal. Panama
// a = 10 m = 2 n=4 p = 2 l = 2 c = 1
// dad
//dads
// d=2 a = 1

let str = "amanaplanacanalpanama";
// console.log(isPalindrome(str));

//Anagram grouping
//sort each word and if it matches something else currently in hash table, then join them together into an array and push that into the hash table. the key would be the sorted word, the value will be an array with the strings
//would it return a hash map or array?

function sortString(str) {
  return str
    .split("")
    .sort()
    .join("");
}

function groupAnagram(arrOfStr) {
  let hashMap = new HashMap();
  let resultArr = [];

  for (let i = 0; i < arrOfStr.length; i++) {
    let sortedStr = sortString(arrOfStr[i]);
    let groupedArr = [];

    try {
      groupedArr = hashMap.get(sortedStr);
      groupedArr.push(arrOfStr[i]);
    } catch (err) {
      groupedArr.push(arrOfStr[i]);
    }
    hashMap.set(sortedStr, groupedArr);
  }

  //convert hashMap to an array?
  const temp = hashMap.display();
  return temp;
}

// console.log(
//   groupAnagram(["east", "cars", "acre", "arcs", "teas", "eats", "race"])
// );

// Separate Chaining
/*
Write a hash map implementation like the one you have done above using separate chaining as collision resolution mechanism.
Test your hash map with the same value from before.
*/

class ChainHashMap {
  //initialize properties
  constructor(initialCapacity = 8) {
    this.length = 0;
    this._capacity = initialCapacity;
    this._slots = [];
    this.deleted = 0;
  }

  get(key) {
    const index = this._findSlot(key);
    if (this._slots[index] === undefined) {
      throw new Error("Key error");
    }
    console.log(" Inside the get :", this._slots[index]);
    return this._slots[index].findValue(key);
  }

  // go strait to start without iterating over the rest
  // if start taken make it a linked list
  // if already a list push

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }

    const index = this._findSlot(key);
    //added this for this.length
    if (!this._slots[index]) {
      this._slots[index] = new LinkedList();
      this.length++;
    }
    this._slots[index].insertFirst({ [key]: value });
  }

  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const start = hash % this._capacity;
    // | 2 | 5 | 15 | 10 |
    //slot where 5 should be hashed is 1
    //slot where 35 should be hashed is 3
    return start;
    // for (let i = start; i < start + this._capacity; i++) {
    //   // Why are we creating this index this way and not using the start variable
    //   const index = i % this._capacity; //3 brings it back to the beginning to see if earlier spots are available if you go past start (only important when there's a collision after i++)
    //   const slot = this._slots[index];
    //   //if its an empty slot or if this same value is already in there and its not deleted, then return the index
    //   if (slot === undefined || (slot.key == key && !slot.deleted)) {
    //     return index;
    //   }
    // }
  }
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
  // get(key) {
  //   const index = this._findSlot(key);
  //   if (this._slots[index] === undefined) {
  //     throw new Error("Key error");
  //   }
  //   return this._slots[index].value;
  // }
  //methods
}

const tempTestMap = new ChainHashMap();

tempTestMap.set("dog", "lab");
tempTestMap.set("dog 2", "poodle");
tempTestMap.set("martha", "cookbook");
tempTestMap.set("donny", "doglover");
tempTestMap.set("dog", "mastif");

console.log(tempTestMap.get("donny"));
// console.log(tempTestMap);
