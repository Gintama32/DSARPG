export interface Chapter {
  title: string;
  description: string;
  imagePath: string;
  details: string;
  lessons: Lesson[];
}

export interface Lesson {
  name: string;
  description: string;
  icon: string;
  stages: Stage[];
}

export interface Stage {
  type: 'text' | 'coding';
  title: string;
  description?: string;
  content?: string;
  starterCode?: string;
  solution?: string;
  hints?: string[];
  testCases?: TestCase[];
}

export interface TestCase {
  input: any[];
  expectedOutput: any;
  description: string;
}

// Helper functions for stage numbering
export function getStageNumber(chapterIndex: number, lessonIndex: number, stageIndex: number): number {
  let stageNumber = 1;
  
  // Add stages from previous chapters
  for (let c = 0; c < chapterIndex; c++) {
    for (const lesson of chapters[c].lessons) {
      stageNumber += lesson.stages.length;
    }
  }
  
  // Add stages from previous lessons in current chapter
  for (let l = 0; l < lessonIndex; l++) {
    stageNumber += chapters[chapterIndex].lessons[l].stages.length;
  }
  
  // Add current stage index
  stageNumber += stageIndex;
  
  return stageNumber;
}

export function getTotalStagesInChapter(chapterIndex: number): number {
  return chapters[chapterIndex].lessons.reduce((total, lesson) => total + lesson.stages.length, 0);
}

// Helper function to get the global coding stage number for a given chapter, lesson, and stage index
export function getGlobalCodingStageNumber(chapterIndex: number, lessonIndex: number, stageIndex: number): number | undefined {
  let stageNumber = 1;
  // Count all coding stages before this chapter
  for (let c = 0; c < chapterIndex; c++) {
    for (const lesson of chapters[c].lessons) {
      for (const stage of lesson.stages) {
        if (stage.type === 'coding') stageNumber++;
      }
    }
  }
  // Count all coding stages before this lesson in the current chapter
  for (let l = 0; l < lessonIndex; l++) {
    for (const stage of chapters[chapterIndex].lessons[l].stages) {
      if (stage.type === 'coding') stageNumber++;
    }
  }
  // Count coding stages before the current stage in the current lesson
  for (let s = 0; s < stageIndex; s++) {
    if (chapters[chapterIndex].lessons[lessonIndex].stages[s].type === 'coding') stageNumber++;
  }
  // Only return a stage number if the current stage is coding, otherwise return undefined
  if (chapters[chapterIndex].lessons[lessonIndex].stages[stageIndex].type !== 'coding') return undefined;
  return stageNumber;
}

// Helper function to get total coding stages in a chapter
export function getTotalCodingStagesInChapter(chapterIndex: number): number {
  let count = 0;
  for (const lesson of chapters[chapterIndex].lessons) {
    for (const stage of lesson.stages) {
      if (stage.type === 'coding') count++;
    }
  }
  return count;
}

// Helper function to get total coding stages in a lesson
export function getTotalCodingStagesInLesson(chapterIndex: number, lessonIndex: number): number {
  let count = 0;
  for (const stage of chapters[chapterIndex].lessons[lessonIndex].stages) {
    if (stage.type === 'coding') count++;
  }
  return count;
}

export const chapters: Chapter[] = [
  {
    title: "The Awakening of the Foundation",
    description: "Begin your journey in Arrayville",
    imagePath: "/Chapter1/arrayvilla.png",
    details: "Master arrays in Arrayville. Navigate linked lists in Linkwood. Explore tree structures in Treeland. Build your foundation.",
    lessons: [
      {
        name: "Arrayville: The Ordered Grids",
        description: "Master the foundational arts of array manipulation",
        icon: "🏘️",
        stages: [
          {
            type: 'text',
            title: "Welcome to Arrayville, Chosen One",
            content: `You stand at the gates of Arrayville, where the ancient art of array manipulation was first discovered. The village elders speak of a time when data flowed in perfect order, each element knowing its place in the grand sequence.

But the Bug Blight has corrupted even these fundamental structures. Arrays that once held their elements in pristine order now suffer from chaos and confusion. As the Chosen One, you must master the sacred techniques of array manipulation to restore balance.

The village elder approaches you with weathered hands and knowing eyes: "Young one, the arrays are the foundation of all data structures. Master them, and you master the very essence of organized information. Fail, and the Blight will consume all order in our realm."

Your first trial awaits...`
          },
          {
            type: 'coding',
            title: "The Guardian's First Test: Retrieve the Sacred Element",
            description: `The village guardian blocks your path with a mystical array barrier. "Prove your worth, Chosen One," she declares. "This sacred array holds the essence of our village's power. Show me you can retrieve the first element - the cornerstone of all array knowledge."

The barrier shimmers with ancient energy, waiting for your command. The fate of Arrayville's first lesson rests in your ability to access the most fundamental array operation.`,
            starterCode: `function retrieveFirstElement(sacredArray) {
  /**
   * The Guardian's Challenge: Extract the first element from the sacred array.
   * 
   * In the ancient texts, it is written that the first element holds
   * the key to understanding all that follows. Retrieve it, and prove
   * your worthiness to learn the deeper mysteries of Arrayville.
   * 
   * @param {Array} sacredArray - A list containing the village's sacred elements
   * @returns {*} The first element of the array, or null if the array is empty
   */
  // Your code here - retrieve the first element
}`,
            solution: `function retrieveFirstElement(sacredArray) {
  /**
   * The Guardian's Challenge: Extract the first element from the sacred array.
   */
  if (sacredArray.length === 0) {
    return null;
  }
  return sacredArray[0];
}`,
            hints: [
              "Arrays in JavaScript are accessed using square brackets []",
              "The first element is at index 0",
              "Check if the array is empty before accessing elements",
              "Use .length to check the array's length"
            ],
            testCases: [
              {
                input: [[1, 2, 3, 4, 5]],
                expectedOutput: 1,
                description: "Retrieve the first element from a numeric array"
              },
              {
                input: [["magic", "crystal", "power"]],
                expectedOutput: "magic",
                description: "Retrieve the first element from a string array"
              },
              {
                input: [[42]],
                expectedOutput: 42,
                description: "Retrieve the only element from a single-element array"
              },
              {
                input: [[]],
                expectedOutput: null,
                description: "Handle an empty array gracefully"
              },
              {
                input: [[true, false, true]],
                expectedOutput: true,
                description: "Retrieve the first element from a boolean array"
              }
            ]
          },
          {
            type: 'coding',
            title: "The Merchant's Dilemma: Find the Last Treasure",
            description: `A desperate merchant approaches you in the village square. "Chosen One! The Blight has scrambled my inventory array, and I cannot find my most precious treasure - the last item I stored! My livelihood depends on retrieving it. Please, use your newfound array mastery to help me!"

The merchant's eyes glisten with hope as he hands you his inventory array. The last element contains his most valuable possession, but the array's length keeps changing due to the Blight's influence.`,
            starterCode: `function findLastTreasure(inventory) {
  /**
   * The Merchant's Plea: Find the last item in the inventory array.
   * 
   * The merchant's most precious treasure is always stored as the last
   * element in his inventory. Help him retrieve it, no matter how the
   * Blight has affected the array's size.
   * 
   * @param {Array} inventory - A list representing the merchant's inventory
   * @returns {*} The last element of the array, or null if the inventory is empty
   */
  // Your code here - find the last treasure
}`,
            solution: `function findLastTreasure(inventory) {
  /**
   * The Merchant's Plea: Find the last item in the inventory array.
   */
  if (inventory.length === 0) {
    return null;
  }
  return inventory[inventory.length - 1];
}`,
            hints: [
              "The last element can be accessed using index array.length - 1",
              "Alternatively, use array[array.length - 1]",
              "Always check if the array is empty first",
              "JavaScript arrays are zero-indexed"
            ],
            testCases: [
              {
                input: [["sword", "shield", "golden_crown"]],
                expectedOutput: "golden_crown",
                description: "Find the merchant's most precious treasure"
              },
              {
                input: [[10, 20, 30, 40, 50]],
                expectedOutput: 50,
                description: "Retrieve the last number from a numeric inventory"
              },
              {
                input: [["single_gem"]],
                expectedOutput: "single_gem",
                description: "Handle an inventory with only one item"
              },
              {
                input: [[]],
                expectedOutput: null,
                description: "Handle an empty inventory"
              },
              {
                input: [[true, false, false, true]],
                expectedOutput: true,
                description: "Find the last boolean value in a magical array"
              }
            ]
          },
          {
            type: 'coding',
            title: "The Librarian's Quest: Count the Ancient Scrolls",
            description: `The village librarian, keeper of ancient knowledge, seeks your aid. "Chosen One, the Blight has made me forget how many scrolls remain in our sacred collection. These scrolls contain the wisdom of ages past, and I must know their exact count to maintain the library's mystical balance."

She gestures toward a shimmering array of scrolls. "Each scroll is precious, and the total count determines the strength of our protective wards. Help me count them all!"`,
            starterCode: `function countAncientScrolls(scrollCollection) {
  /**
   * The Librarian's Request: Count all scrolls in the collection.
   * 
   * The mystical library's protective wards depend on knowing the exact
   * number of scrolls. Count them all to help maintain the magical balance
   * that keeps the Blight at bay.
   * 
   * @param {Array} scrollCollection - A list containing the ancient scrolls
   * @returns {number} The total number of scrolls in the collection
   */
  // Your code here - count the scrolls
}`,
            solution: `function countAncientScrolls(scrollCollection) {
  /**
   * The Librarian's Request: Count all scrolls in the collection.
   */
  return scrollCollection.length;
}`,
            hints: [
              "Use the .length property to get the length of an array",
              "The length represents the total number of elements",
              ".length works with any type of array",
              "An empty array has a length of 0"
            ],
            testCases: [
              {
                input: [["Fire Magic", "Water Magic", "Earth Magic", "Air Magic"]],
                expectedOutput: 4,
                description: "Count the elemental magic scrolls"
              },
              {
                input: [["Ancient Wisdom"]],
                expectedOutput: 1,
                description: "Count a single precious scroll"
              },
              {
                input: [[]],
                expectedOutput: 0,
                description: "Count scrolls in an empty collection"
              },
              {
                input: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
                expectedOutput: 10,
                description: "Count a large collection of numbered scrolls"
              },
              {
                input: [["Healing", "Protection", "Strength"]],
                expectedOutput: 3,
                description: "Count the blessing scrolls"
              }
            ]
          },
          {
            type: 'coding',
            title: "The Blacksmith's Challenge: Forge the Middle Element",
            description: `The village blacksmith, master of balance and precision, presents you with a unique challenge. "Chosen One, to forge the perfect weapon against the Blight, I need the middle element from this array of mystical metals. The center holds the greatest power - it balances all elements around it."

He points to his collection with calloused hands. "Find the middle element, and I shall forge you a weapon worthy of your quest. But beware - if the collection has an even number of elements, choose the first of the two middle elements."`,
            starterCode: `function forgeMiddleElement(mysticalMetals) {
  /**
   * The Blacksmith's Challenge: Find the middle element for forging.
   * 
   * The middle element of an array holds special power in the mystical arts.
   * For arrays with odd length, return the exact middle element.
   * For arrays with even length, return the first of the two middle elements.
   * 
   * @param {Array} mysticalMetals - A list of metals for forging
   * @returns {*} The middle element, or null if the array is empty
   */
  // Your code here - find the middle element
}`,
            solution: `function forgeMiddleElement(mysticalMetals) {
  /**
   * The Blacksmith's Challenge: Find the middle element for forging.
   */
  if (mysticalMetals.length === 0) {
    return null;
  }
  
  const middleIndex = Math.floor(mysticalMetals.length / 2);
  
  // For even length arrays, we want the first of the two middle elements
  // For odd length arrays, this gives us the exact middle
  if (mysticalMetals.length % 2 === 0) {
    // Even length: return the first of the two middle elements
    return mysticalMetals[middleIndex - 1];
  } else {
    // Odd length: return the exact middle element
    return mysticalMetals[middleIndex];
  }
}`,
            hints: [
              "Use Math.floor(array.length / 2) to find the middle index",
              "For odd-length arrays: middleIndex = Math.floor(array.length / 2)",
              "For even-length arrays: use middleIndex - 1 for the first middle element",
              "Use the modulo operator (%) to check if length is even or odd",
              "Remember to handle empty arrays"
            ],
            testCases: [
              {
                input: [["iron", "silver", "gold", "platinum", "mithril"]],
                expectedOutput: "gold",
                description: "Find the middle metal in an odd-length collection"
              },
              {
                input: [["copper", "bronze", "steel", "adamant"]],
                expectedOutput: "bronze",
                description: "Find the first middle metal in an even-length collection"
              },
              {
                input: [["legendary_metal"]],
                expectedOutput: "legendary_metal",
                description: "Handle a single metal"
              },
              {
                input: [[]],
                expectedOutput: null,
                description: "Handle an empty collection"
              },
              {
                input: [[1, 2]],
                expectedOutput: 1,
                description: "Find the first middle element in a two-element array"
              }
            ]
          },
          {
            type: 'coding',
            title: "The Elder's Final Test: Reverse the Ancient Prophecy",
            description: `The village elder, keeper of the ancient prophecies, presents you with the final test of Arrayville. "Chosen One, the prophecy speaks of a great reversal - when the last shall be first, and the first shall be last. The Blight has corrupted the sacred text, and only by reversing the array can we restore its true meaning."

Her ancient eyes gleam with wisdom. "Reverse this array, and you shall have mastered the fundamental arts of Arrayville. The path to Linkwood will then be open to you, but first, prove your mastery over the ordered grids."`,
            starterCode: `function reverseAncientProphecy(prophecyArray) {
  /**
   * The Elder's Final Test: Reverse the array to restore the prophecy.
   * 
   * The ancient prophecy has been corrupted by the Blight. To restore
   * its true meaning, you must reverse the order of all elements.
   * The last element should become first, and the first should become last.
   * 
   * @param {Array} prophecyArray - A list containing the corrupted prophecy elements
   * @returns {Array} A new list with all elements in reverse order
   */
  // Your code here - reverse the prophecy
}`,
            solution: `function reverseAncientProphecy(prophecyArray) {
  /**
   * The Elder's Final Test: Reverse the array to restore the prophecy.
   */
  return prophecyArray.slice().reverse();
}`,
            hints: [
              "Use .slice() to create a copy, then .reverse() to reverse it",
              "Alternatively, use spread operator [...array].reverse()",
              "You can also manually iterate from the end to the beginning",
              "The .reverse() method modifies the original array, so make a copy first"
            ],
            testCases: [
              {
                input: [["darkness", "will", "fall", "light", "will", "rise"]],
                expectedOutput: ["rise", "will", "light", "fall", "will", "darkness"],
                description: "Reverse the prophecy of light conquering darkness"
              },
              {
                input: [[1, 2, 3, 4, 5]],
                expectedOutput: [5, 4, 3, 2, 1],
                description: "Reverse a numeric sequence"
              },
              {
                input: [["single_word"]],
                expectedOutput: ["single_word"],
                description: "Reverse a single-element prophecy"
              },
              {
                input: [[]],
                expectedOutput: [],
                description: "Reverse an empty prophecy"
              },
              {
                input: [[true, false, true, false]],
                expectedOutput: [false, true, false, true],
                description: "Reverse a boolean pattern"
              }
            ]
          }
        ]
      },
      {
        name: "Linkwood: The Tangled Paths",
        description: "Navigate the ethereal connections of linked data",
        icon: "🌲",
        stages: [
          {
            type: 'text',
            title: "Entering the Mystical Linkwood",
            content: `You leave Arrayville behind and enter the mystical Linkwood, where ancient trees are connected not by roots, but by ethereal links that pulse with data. Here, the Bug Blight has tangled the once-graceful connections, creating chaotic webs where information flows in circles and dead ends.

The Forest Guardian, a wise spirit who has tended these linked paths for millennia, materializes before you: "Welcome, Chosen One. You have mastered the ordered sequences of Arrayville, but here you must learn the fluid art of linked structures. Unlike arrays, our data flows from node to node, each element pointing to the next in an endless chain."

"The Blight has corrupted our pointers, creating broken links and infinite loops. You must learn to traverse, repair, and rebuild these connections. Master the linked list, and you master the art of dynamic data flow."

Your journey through the tangled paths begins...`
          },
          {
            type: 'coding',
            title: "The Chain Keeper's Test: Traverse the Sacred Links",
            description: `The Chain Keeper, guardian of the linked paths, presents you with a mystical chain of connected nodes. "Chosen One, before you can repair our broken links, you must first learn to traverse them. This sacred chain holds the essence of our forest's wisdom - follow each link and collect all the values."

The chain glows with ancient energy, each node pointing to the next. Your task is to walk the entire length and gather all the treasures contained within.`,
            starterCode: `function traverseSacredChain(headNode) {
  /**
   * The Chain Keeper's Challenge: Traverse a linked list and collect all values.
   * 
   * A linked list node has the structure: { value: any, next: Node | null }
   * Starting from the head node, follow the 'next' pointers to visit
   * each node and collect all values in order.
   * 
   * @param {Object|null} headNode - The first node of the linked list
   * @returns {Array} An array containing all values from the linked list
   */
  // Your code here - traverse the linked list
}`,
            solution: `function traverseSacredChain(headNode) {
  /**
   * Traverse linked list and collect values
   */
  const values = [];
  let currentNode = headNode;
  
  while (currentNode !== null) {
    values.push(currentNode.value);
    currentNode = currentNode.next;
  }
  
  return values;
}`,
            hints: [
              "Start with the head node and use a while loop",
              "Check if currentNode is not null before accessing its properties",
              "Push the current node's value to your result array",
              "Move to the next node using currentNode.next"
            ],
            testCases: [
              {
                input: [{ value: 1, next: { value: 2, next: { value: 3, next: null } } }],
                expectedOutput: [1, 2, 3],
                description: "Traverse a simple three-node chain"
              },
              {
                input: [{ value: "magic", next: { value: "forest", next: null } }],
                expectedOutput: ["magic", "forest"],
                description: "Traverse a chain with string values"
              },
              {
                input: [{ value: 42, next: null }],
                expectedOutput: [42],
                description: "Traverse a single-node chain"
              },
              {
                input: [null],
                expectedOutput: [],
                description: "Handle an empty chain (null head)"
              },
              {
                input: [{ value: true, next: { value: false, next: { value: true, next: { value: false, next: null } } } }],
                expectedOutput: [true, false, true, false],
                description: "Traverse a chain with boolean values"
              }
            ]
          },
          {
            type: 'coding',
            title: "The Link Forger's Challenge: Create New Connections",
            description: `The Link Forger, master of creating new connections, approaches you with urgency. "Chosen One, the Blight has severed many of our chains. You must learn to forge new links - to add nodes to our sacred chains. This is the art of insertion, fundamental to maintaining our forest's data flow."

She hands you the tools of creation. "Add a new node with the given value to the beginning of the chain. This new node shall become the head, pointing to what was once the first."`,
            starterCode: `function forgeNewLink(headNode, newValue) {
  /**
   * The Link Forger's Challenge: Add a new node to the beginning of the chain.
   * 
   * Create a new node with the given value and make it the new head
   * of the linked list. The new node should point to the current head.
   * 
   * @param {Object|null} headNode - The current head of the linked list
   * @param {*} newValue - The value for the new node
   * @returns {Object} The new head node of the linked list
   */
  // Your code here - create and insert a new node
}`,
            solution: `function forgeNewLink(headNode, newValue) {
  /**
   * Create new node and insert at beginning
   */
  const newNode = {
    value: newValue,
    next: headNode
  };
  
  return newNode;
}`,
            hints: [
              "Create a new node object with 'value' and 'next' properties",
              "Set the new node's 'next' to point to the current head",
              "Return the new node as it becomes the new head",
              "The structure is: { value: newValue, next: headNode }"
            ],
            testCases: [
              {
                input: [{ value: 2, next: { value: 3, next: null } }, 1],
                expectedOutput: { value: 1, next: { value: 2, next: { value: 3, next: null } } },
                description: "Add node to beginning of existing chain"
              },
              {
                input: [null, "first"],
                expectedOutput: { value: "first", next: null },
                description: "Add node to empty chain"
              },
              {
                input: [{ value: "second", next: null }, "first"],
                expectedOutput: { value: "first", next: { value: "second", next: null } },
                description: "Add string value to single-node chain"
              },
              {
                input: [{ value: false, next: null }, true],
                expectedOutput: { value: true, next: { value: false, next: null } },
                description: "Add boolean value to chain"
              }
            ]
          }
        ]
      },
      {
        name: "Treeland: The Branching Structures",
        description: "Explore the hierarchical wisdom of tree structures",
        icon: "🌳",
        stages: [
          {
            type: 'text',
            title: "Ascending to the Great Tree of Treeland",
            content: `You emerge from Linkwood's tangled paths and find yourself at the base of the Great Tree of Treeland, a massive structure that reaches toward the digital heavens. Here, data doesn't flow in simple chains but branches out in hierarchical patterns, each node potentially having multiple children.

The Tree Sage, an ancient being whose wisdom spans the entire canopy, speaks from the rustling leaves above: "Welcome, Chosen One. You have learned the linear flow of arrays and the connected paths of linked lists. Now you must understand the branching nature of trees - the most fundamental hierarchical structure in all of computing."

"The Bug Blight has corrupted our branches, creating unbalanced growth and broken connections between parent and child nodes. You must learn to traverse our heights and depths, to search through our branches, and to restore the natural balance that keeps our data organized."

Your ascent through the branching wisdom begins...`
          },
          {
            type: 'coding',
            title: "The Branch Walker's Trial: Traverse the Sacred Tree",
            description: `The Branch Walker, guardian of the tree's pathways, challenges you from high in the canopy. "Chosen One, before you can heal our corrupted branches, you must first learn to walk among them. This sacred tree holds ancient knowledge in its nodes - traverse it in order and collect all the wisdom it contains."

The tree's structure glows with mystical energy. Each node contains a value and may have left and right children. Your task is to perform an in-order traversal, visiting left subtree, then root, then right subtree.`,
            starterCode: `function walkSacredBranches(rootNode) {
  /**
   * The Branch Walker's Challenge: Perform in-order traversal of a binary tree.
   * 
   * A tree node has the structure: { value: any, left: Node | null, right: Node | null }
   * In-order traversal visits nodes in this order: left subtree, root, right subtree
   * This produces values in sorted order for a binary search tree.
   * 
   * @param {Object|null} rootNode - The root node of the binary tree
   * @returns {Array} An array containing all values in in-order sequence
   */
  // Your code here - perform in-order traversal
}`,
            solution: `function walkSacredBranches(rootNode) {
  /**
   * In-order traversal of binary tree
   */
  const result = [];
  
  function inOrderTraversal(node) {
    if (node === null) {
      return;
    }
    
    // Visit left subtree
    inOrderTraversal(node.left);
    
    // Visit root
    result.push(node.value);
    
    // Visit right subtree
    inOrderTraversal(node.right);
  }
  
  inOrderTraversal(rootNode);
  return result;
}`,
            hints: [
              "Use recursion to traverse the tree",
              "In-order means: left subtree, root, right subtree",
              "Check if node is null before processing",
              "Use a helper function for the recursive traversal"
            ],
            testCases: [
              {
                input: [{
                  value: 2,
                  left: { value: 1, left: null, right: null },
                  right: { value: 3, left: null, right: null }
                }],
                expectedOutput: [1, 2, 3],
                description: "Traverse a simple binary search tree"
              },
              {
                input: [{
                  value: "root",
                  left: { value: "left", left: null, right: null },
                  right: { value: "right", left: null, right: null }
                }],
                expectedOutput: ["left", "root", "right"],
                description: "Traverse a tree with string values"
              },
              {
                input: [{ value: 42, left: null, right: null }],
                expectedOutput: [42],
                description: "Traverse a single-node tree"
              },
              {
                input: [null],
                expectedOutput: [],
                description: "Handle an empty tree"
              },
              {
                input: [{
                  value: 4,
                  left: {
                    value: 2,
                    left: { value: 1, left: null, right: null },
                    right: { value: 3, left: null, right: null }
                  },
                  right: {
                    value: 6,
                    left: { value: 5, left: null, right: null },
                    right: { value: 7, left: null, right: null }
                  }
                }],
                expectedOutput: [1, 2, 3, 4, 5, 6, 7],
                description: "Traverse a larger balanced tree"
              }
            ]
          },
          {
            type: 'coding',
            title: "The Depth Seeker's Quest: Find the Tree's Maximum Depth",
            description: `The Depth Seeker, explorer of the tree's deepest mysteries, descends from the highest branches. "Chosen One, the Blight has caused unnatural growth in our tree, creating imbalanced branches that threaten our stability. You must measure the maximum depth of our sacred tree to understand the extent of the corruption."

The tree sways gently as you prepare for your task. "Find the longest path from root to leaf - this will tell us how deep the Blight's influence has spread and help us plan our restoration efforts."`,
            starterCode: `function measureTreeDepth(rootNode) {
  /**
   * The Depth Seeker's Challenge: Find the maximum depth of a binary tree.
   * 
   * The depth (or height) of a tree is the length of the longest path
   * from the root to any leaf node. A single node has depth 1,
   * an empty tree has depth 0.
   * 
   * @param {Object|null} rootNode - The root node of the binary tree
   * @returns {number} The maximum depth of the tree
   */
  // Your code here - calculate maximum depth
}`,
            solution: `function measureTreeDepth(rootNode) {
  /**
   * Calculate maximum depth using recursion
   */
  if (rootNode === null) {
    return 0;
  }
  
  const leftDepth = measureTreeDepth(rootNode.left);
  const rightDepth = measureTreeDepth(rootNode.right);
  
  return Math.max(leftDepth, rightDepth) + 1;
}`,
            hints: [
              "Use recursion to calculate depth of left and right subtrees",
              "Base case: null node has depth 0",
              "Depth of a node = 1 + max(left depth, right depth)",
              "Use Math.max() to find the larger of two depths"
            ],
            testCases: [
              {
                input: [{
                  value: 1,
                  left: { value: 2, left: null, right: null },
                  right: { value: 3, left: null, right: null }
                }],
                expectedOutput: 2,
                description: "Measure depth of a balanced tree with 3 nodes"
              },
              {
                input: [{
                  value: 1,
                  left: {
                    value: 2,
                    left: { value: 3, left: null, right: null },
                    right: null
                  },
                  right: null
                }],
                expectedOutput: 3,
                description: "Measure depth of an unbalanced tree"
              },
              {
                input: [{ value: 1, left: null, right: null }],
                expectedOutput: 1,
                description: "Measure depth of a single-node tree"
              },
              {
                input: [null],
                expectedOutput: 0,
                description: "Measure depth of an empty tree"
              },
              {
                input: [{
                  value: 1,
                  left: {
                    value: 2,
                    left: { value: 4, left: null, right: null },
                    right: { value: 5, left: null, right: null }
                  },
                  right: {
                    value: 3,
                    left: null,
                    right: { value: 6, left: null, right: null }
                  }
                }],
                expectedOutput: 3,
                description: "Measure depth of a more complex tree"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: "The Labyrinth of Logic",
    description: "Navigate the complex networks of Graph Grotto",
    imagePath: "/chapter2_f.png",
    details: "Traverse Graph Grotto's interconnected networks. Conquer Sort Peaks' chaotic data. Master Search Sands' hidden information. Unlock the deeper mysteries.",
    lessons: [
      {
        name: "Graph Grotto: The Connected Caverns",
        description: "Master the art of graph traversal and pathfinding",
        icon: "🕳️",
        stages: [
          {
            type: 'text',
            title: "Welcome to Graph Grotto, Brave Adventurer",
            content: `You descend into the depths of Graph Grotto, where the very walls pulse with interconnected energy. Here, the Bug Blight has created a maze of corrupted connections, turning what was once a beautiful network of crystal formations into a chaotic labyrinth.

The Grotto Guardian, an ancient being of pure logic, materializes before you: "Chosen One, you have mastered the linear paths of Arrayville, but here you must learn to navigate the complex webs of connection. Graphs are the foundation of all relationships in our digital realm - master them, and you master the art of finding paths through any maze."

The blight has tangled the crystal networks, but with your growing power, you can restore their proper connections and find the shortest paths through the corruption.

Your trials in the interconnected depths begin now...`
          },
          {
            type: 'coding',
            title: "The Crystal Network: Find Connected Components",
            description: `The Grotto Guardian presents you with a shattered crystal network. "The Blight has broken our communication crystals into isolated groups," she explains. "You must identify how many separate networks remain. Each crystal can only communicate with its directly connected neighbors."

The fate of the Grotto's communication system depends on your ability to count the disconnected components in this graph of crystals.`,
            starterCode: `function countCrystalNetworks(crystalConnections) {
  /**
   * The Guardian's Challenge: Count the number of disconnected crystal networks.
   * 
   * Given a list of crystal connections, determine how many separate
   * networks exist. Each network is a group of crystals that can
   * communicate with each other through direct or indirect connections.
   * 
   * @param {Array} crystalConnections - Array of [crystal1, crystal2] pairs representing connections
   * @returns {number} The number of separate crystal networks
   */
  // Your code here - count the connected components
}`,
            solution: `function countCrystalNetworks(crystalConnections) {
  /**
   * Count connected components using DFS
   */
  if (crystalConnections.length === 0) return 0;
  
  // Build adjacency list
  const graph = {};
  const visited = new Set();
  
  for (const [crystal1, crystal2] of crystalConnections) {
    if (!graph[crystal1]) graph[crystal1] = [];
    if (!graph[crystal2]) graph[crystal2] = [];
    graph[crystal1].push(crystal2);
    graph[crystal2].push(crystal1);
  }
  
  // DFS to explore connected component
  function dfs(crystal) {
    visited.add(crystal);
    for (const neighbor of graph[crystal] || []) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
  }
  
  let components = 0;
  for (const crystal in graph) {
    if (!visited.has(crystal)) {
      dfs(crystal);
      components++;
    }
  }
  
  return components;
}`,
            hints: [
              "Build an adjacency list representation of the graph",
              "Use DFS or BFS to explore each connected component",
              "Keep track of visited crystals to avoid counting twice",
              "Each unvisited crystal starts a new component"
            ],
            testCases: [
              {
                input: [[["A", "B"], ["B", "C"], ["D", "E"]]],
                expectedOutput: 2,
                description: "Two separate networks: A-B-C and D-E"
              },
              {
                input: [[["A", "B"], ["B", "C"], ["C", "D"]]],
                expectedOutput: 1,
                description: "One connected network: A-B-C-D"
              },
              {
                input: [[]],
                expectedOutput: 0,
                description: "No connections means no networks"
              },
              {
                input: [[["A", "B"], ["C", "D"], ["E", "F"]]],
                expectedOutput: 3,
                description: "Three separate pairs"
              }
            ]
          }
        ]
      },
      {
        name: "Sort Peaks: The Chaotic Mountains",
        description: "Bring order to the disordered data of the peaks",
        icon: "⛰️",
        stages: [
          {
            type: 'text',
            title: "Ascending the Sort Peaks",
            content: `You emerge from Graph Grotto and face the towering Sort Peaks, where data avalanches have left information scattered in complete disarray. The mountain winds carry whispers of ancient sorting algorithms, techniques that can bring order to any chaos.

The Peak Master, a wise sage who has spent centuries organizing the mountain's knowledge, greets you: "Welcome, Chosen One. Here, the Blight has created chaos from order. You must learn the sacred arts of sorting - the ability to arrange any collection of data into perfect sequence. Master these techniques, and you will be able to organize any information, no matter how corrupted."

The peaks stretch before you, each one representing a different sorting challenge. Your journey to master order begins here.`
          },
          {
            type: 'coding',
            title: "The Bubble Chamber: Basic Sorting Mastery",
            description: `The Peak Master leads you to the Bubble Chamber, where the lightest elements naturally rise to the top. "This is where novices learn the fundamental art of sorting," he explains. "Implement the bubble sort algorithm - simple, but effective for understanding how elements can be moved into their proper positions."

The chamber's mystical properties will help you visualize how elements bubble up to their correct positions through repeated comparisons and swaps.`,
            starterCode: `function bubbleSortMountainData(mountainData) {
  /**
   * The Peak Master's First Test: Implement bubble sort.
   * 
   * Bubble sort works by repeatedly stepping through the list,
   * comparing adjacent elements and swapping them if they're in
   * the wrong order. The pass through the list is repeated until
   * the list is sorted.
   * 
   * @param {Array} mountainData - Array of numbers to sort
   * @returns {Array} A new array with elements sorted in ascending order
   */
  // Your code here - implement bubble sort
}`,
            solution: `function bubbleSortMountainData(mountainData) {
  /**
   * Bubble sort implementation
   */
  const arr = [...mountainData]; // Create a copy
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
}`,
            hints: [
              "Use nested loops - outer loop for passes, inner for comparisons",
              "Compare adjacent elements and swap if they're in wrong order",
              "After each pass, the largest element 'bubbles' to the end",
              "Create a copy of the array to avoid modifying the original"
            ],
            testCases: [
              {
                input: [[64, 34, 25, 12, 22, 11, 90]],
                expectedOutput: [11, 12, 22, 25, 34, 64, 90],
                description: "Sort a mixed array of numbers"
              },
              {
                input: [[5, 2, 8, 1, 9]],
                expectedOutput: [1, 2, 5, 8, 9],
                description: "Sort a small array"
              },
              {
                input: [[1]],
                expectedOutput: [1],
                description: "Sort a single element"
              },
              {
                input: [[]],
                expectedOutput: [],
                description: "Sort an empty array"
              },
              {
                input: [[3, 3, 3, 3]],
                expectedOutput: [3, 3, 3, 3],
                description: "Sort an array with duplicate elements"
              }
            ]
          }
        ]
      },
      {
        name: "Search Sands: The Shifting Desert",
        description: "Master the art of finding hidden information",
        icon: "🏜️",
        stages: [
          {
            type: 'text',
            title: "Crossing the Search Sands",
            content: `You leave the ordered peaks behind and enter the vast Search Sands, where information shifts like dunes in an endless desert. Here, the Bug Blight has scattered crucial data across infinite expanses, making it nearly impossible to find specific pieces of information through simple traversal.

The Desert Oracle, a mysterious figure who appears and disappears like a mirage, speaks to you through the swirling sands: "Welcome, Chosen One. You have learned to organize data, but now you must learn to find it efficiently. In these sands, brute force searching will leave you lost forever - you must master the ancient arts of efficient search algorithms."

"The Blight has hidden treasures throughout these shifting dunes. Learn to search with wisdom rather than wandering, and you will find what you seek in the shortest time possible."

Your quest for efficient discovery begins in the endless sands...`
          },
          {
            type: 'coding',
            title: "The Binary Search Oasis: Divide and Conquer",
            description: `The Desert Oracle leads you to a mystical oasis where the water is perfectly ordered by purity levels. "Chosen One, this is where you learn the most powerful search technique - binary search. When data is sorted, you can find any element by repeatedly dividing your search space in half."

The oasis shimmers with organized data. "Find the target value using binary search. Each comparison eliminates half of the remaining possibilities - this is the essence of logarithmic efficiency."`,
            starterCode: `function searchOasisWaters(sortedPurityLevels, targetPurity) {
  /**
   * The Oracle's Challenge: Implement binary search to find a target value.
   * 
   * Binary search works on sorted arrays by repeatedly dividing the search
   * space in half. Compare the target with the middle element and eliminate
   * half of the remaining elements based on the comparison.
   * 
   * @param {Array} sortedPurityLevels - Sorted array of numbers to search
   * @param {number} targetPurity - The value to find
   * @returns {number} The index of the target value, or -1 if not found
   */
  // Your code here - implement binary search
}`,
            solution: `function searchOasisWaters(sortedPurityLevels, targetPurity) {
  /**
   * Binary search implementation
   */
  let left = 0;
  let right = sortedPurityLevels.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (sortedPurityLevels[mid] === targetPurity) {
      return mid;
    } else if (sortedPurityLevels[mid] < targetPurity) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // Target not found
}`,
            hints: [
              "Use two pointers: left and right to define search boundaries",
              "Calculate middle index: Math.floor((left + right) / 2)",
              "If middle element equals target, return the index",
              "If middle < target, search right half; if middle > target, search left half"
            ],
            testCases: [
              {
                input: [[1, 3, 5, 7, 9, 11, 13], 7],
                expectedOutput: 3,
                description: "Find target in the middle of sorted array"
              },
              {
                input: [[1, 3, 5, 7, 9, 11, 13], 1],
                expectedOutput: 0,
                description: "Find target at the beginning"
              },
              {
                input: [[1, 3, 5, 7, 9, 11, 13], 13],
                expectedOutput: 6,
                description: "Find target at the end"
              },
              {
                input: [[1, 3, 5, 7, 9, 11, 13], 6],
                expectedOutput: -1,
                description: "Target not found in array"
              },
              {
                input: [[42], 42],
                expectedOutput: 0,
                description: "Find target in single-element array"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: "The Nexus of Wisdom",
    description: "Face the ultimate algorithmic challenges",
    imagePath: "/Chapter3.png",
    details: "Master Dynamic Programming in the Dynamic Domain. Navigate Greedy Algorithms in Greedy Gorge. Explore Backtracking in Backtrack Bastion. Become the ultimate Code Master.",
    lessons: [
      {
        name: "Dynamic Domain: The Adaptive Realm",
        description: "Master the art of breaking down complex problems",
        icon: "🔄",
        stages: [
          {
            type: 'text',
            title: "Entering the Dynamic Domain",
            content: `You stand at the threshold of the Dynamic Domain, where reality itself shifts and adapts. Here, the Bug Blight has created problems so complex that they seem impossible to solve through brute force alone. The very air shimmers with overlapping subproblems and optimal substructures.

The Domain Oracle, a being of pure computational wisdom, appears before you: "Welcome to the final frontier, Chosen One. Here, you must learn the most powerful technique in all of algorithmic arts - Dynamic Programming. The ability to break down impossible problems into manageable pieces, to remember solutions and build upon them."

"The Blight's final form adapts and evolves, but with dynamic programming, you can solve any problem by understanding its recursive nature and avoiding redundant calculations. Master this, and you master the very essence of efficient problem-solving."

Your ultimate test begins now...`
          },
          {
            type: 'coding',
            title: "The Fibonacci Prophecy: Understanding Overlapping Subproblems",
            description: `The Domain Oracle presents you with an ancient prophecy written in the language of numbers. "This is the Fibonacci sequence," she explains, "where each number is the sum of the two preceding ones. But calculating large Fibonacci numbers through simple recursion would take eons due to repeated calculations."

"You must implement an efficient solution using dynamic programming. Store your calculations and reuse them - this is the key to conquering the Domain's challenges."`,
            starterCode: `function calculateFibonacci(n) {
  /**
   * The Oracle's Challenge: Calculate the nth Fibonacci number efficiently.
   * 
   * The Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...
   * Where F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2) for n > 1
   * 
   * Use dynamic programming to avoid recalculating the same values.
   * 
   * @param {number} n - The position in the Fibonacci sequence
   * @returns {number} The nth Fibonacci number
   */
  // Your code here - implement efficient Fibonacci calculation
}`,
            solution: `function calculateFibonacci(n) {
  /**
   * Dynamic programming solution for Fibonacci
   */
  if (n <= 1) return n;
  
  // Use bottom-up approach with memoization
  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}`,
            hints: [
              "Use an array to store previously calculated values",
              "Start with base cases: F(0) = 0, F(1) = 1",
              "Build up from smaller subproblems to larger ones",
              "Each F(i) = F(i-1) + F(i-2)"
            ],
            testCases: [
              {
                input: [0],
                expectedOutput: 0,
                description: "The 0th Fibonacci number"
              },
              {
                input: [1],
                expectedOutput: 1,
                description: "The 1st Fibonacci number"
              },
              {
                input: [10],
                expectedOutput: 55,
                description: "The 10th Fibonacci number"
              },
              {
                input: [15],
                expectedOutput: 610,
                description: "The 15th Fibonacci number"
              },
              {
                input: [20],
                expectedOutput: 6765,
                description: "The 20th Fibonacci number"
              }
            ]
          }
        ]
      },
      {
        name: "Greedy Gorge: The Tempting Canyon",
        description: "Learn to make optimal local choices for global solutions",
        icon: "💰",
        stages: [
          {
            type: 'text',
            title: "Descending into Greedy Gorge",
            content: `You descend into the treacherous Greedy Gorge, where every step presents a choice between immediate gain and long-term strategy. The canyon walls echo with the whispers of failed adventurers who chose poorly, seduced by the Blight's false promises of easy solutions.

The Gorge Keeper, a weathered guardian who has seen countless seekers fall to temptation, warns you: "Here, Chosen One, you must learn the art of greedy algorithms. Sometimes, the locally optimal choice leads to the globally optimal solution. But beware - greed can also lead to ruin if applied incorrectly."

"The Blight thrives on poor decisions and short-sighted thinking. Master the wisdom of when to be greedy and when to look ahead, and you will navigate any challenge with optimal efficiency."

Your test of judgment begins in the depths of the gorge...`
          },
          {
            type: 'coding',
            title: "The Coin Collector's Dilemma: Making Change Optimally",
            description: `The Gorge Keeper presents you with a collection of mystical coins of different denominations. "A merchant needs exact change," he explains, "and you must give him the minimum number of coins possible. This is the classic change-making problem - a perfect example of when greedy algorithms work optimally."

"Always choose the largest denomination that doesn't exceed the remaining amount. This greedy approach will give you the optimal solution for standard coin systems."`,
            starterCode: `function makeOptimalChange(amount, coinDenominations) {
  /**
   * The Keeper's Challenge: Make change using the minimum number of coins.
   * 
   * Given an amount and available coin denominations, return the minimum
   * number of coins needed to make exact change. Use the greedy approach:
   * always choose the largest coin that doesn't exceed the remaining amount.
   * 
   * @param {number} amount - The amount to make change for
   * @param {Array} coinDenominations - Available coin values (sorted in descending order)
   * @returns {number} The minimum number of coins needed
   */
  // Your code here - implement greedy change making
}`,
            solution: `function makeOptimalChange(amount, coinDenominations) {
  /**
   * Greedy algorithm for making change
   */
  let remaining = amount;
  let coinCount = 0;
  
  // Sort denominations in descending order to ensure greedy approach
  const sortedCoins = [...coinDenominations].sort((a, b) => b - a);
  
  for (const coin of sortedCoins) {
    if (remaining >= coin) {
      const coinsUsed = Math.floor(remaining / coin);
      coinCount += coinsUsed;
      remaining -= coinsUsed * coin;
    }
  }
  
  // If we can't make exact change, return -1
  return remaining === 0 ? coinCount : -1;
}`,
            hints: [
              "Sort coins in descending order for the greedy approach",
              "For each coin, use as many as possible without exceeding the remaining amount",
              "Use Math.floor(remaining / coin) to find how many coins to use",
              "Keep track of the total number of coins used"
            ],
            testCases: [
              {
                input: [67, [25, 10, 5, 1]],
                expectedOutput: 6,
                description: "Make change for 67 cents (2×25 + 1×10 + 1×5 + 2×1)"
              },
              {
                input: [30, [25, 10, 5, 1]],
                expectedOutput: 2,
                description: "Make change for 30 cents (1×25 + 1×5)"
              },
              {
                input: [0, [25, 10, 5, 1]],
                expectedOutput: 0,
                description: "No change needed for 0 amount"
              },
              {
                input: [1, [25, 10, 5, 1]],
                expectedOutput: 1,
                description: "Make change for 1 cent"
              },
              {
                input: [43, [25, 10, 5, 1]],
                expectedOutput: 6,
                description: "Make change for 43 cents (1×25 + 1×10 + 1×5 + 3×1)"
              }
            ]
          }
        ]
      },
      {
        name: "Backtrack Bastion: The Ancient Fortress",
        description: "Explore all possibilities through systematic backtracking",
        icon: "🏰",
        stages: [
          {
            type: 'text',
            title: "Approaching the Backtrack Bastion",
            content: `You stand before the imposing Backtrack Bastion, an ancient fortress where the Bug Blight has hidden its deepest secrets. The fortress is a maze of possibilities, where every path might lead to treasure or dead ends. Here, brute force and clever shortcuts have failed countless adventurers.

The Bastion Commander, a strategic mastermind who has mapped every possible route through the fortress, addresses you: "Welcome to the final challenge, Chosen One. Here, you must learn the art of backtracking - the systematic exploration of all possibilities. When you encounter a dead end, you must have the wisdom to retreat and try another path."

"The Blight's ultimate defense lies in complexity - problems with exponential possibilities that seem impossible to solve. But with backtracking, you can explore every option systematically, finding solutions that exist and proving when none do."

Your final algorithmic trial begins at the fortress gates...`
          },
          {
            type: 'coding',
            title: "The Maze Navigator: Find All Paths to Victory",
            description: `The Bastion Commander presents you with a mystical maze that shifts and changes. "This maze represents the essence of backtracking," she explains. "You must find all possible paths from the entrance to the treasure chamber. When you hit a wall or dead end, backtrack and try a different route."

The maze glows with ancient runes, each cell either open (1) or blocked (0). Your task is to find all paths from the top-left corner to the bottom-right corner, moving only right or down.`,
            starterCode: `function findAllMazePaths(maze) {
  /**
   * The Commander's Challenge: Find all paths through the maze using backtracking.
   * 
   * Given a 2D maze where 1 represents open paths and 0 represents walls,
   * find all possible paths from top-left (0,0) to bottom-right corner.
   * You can only move right or down, and must backtrack when hitting walls.
   * 
   * @param {Array} maze - 2D array representing the maze (1 = open, 0 = wall)
   * @returns {Array} Array of all valid paths, where each path is an array of [row, col] coordinates
   */
  // Your code here - implement backtracking to find all paths
}`,
            solution: `function findAllMazePaths(maze) {
  /**
   * Backtracking solution to find all paths
   */
  if (!maze || maze.length === 0 || maze[0].length === 0) return [];
  
  const rows = maze.length;
  const cols = maze[0].length;
  const allPaths = [];
  const currentPath = [];
  
  function backtrack(row, col) {
    // Check bounds and if current cell is blocked
    if (row >= rows || col >= cols || maze[row][col] === 0) {
      return;
    }
    
    // Add current position to path
    currentPath.push([row, col]);
    
    // Check if we reached the destination
    if (row === rows - 1 && col === cols - 1) {
      // Found a valid path, add copy to results
      allPaths.push([...currentPath]);
    } else {
      // Try moving right
      backtrack(row, col + 1);
      
      // Try moving down
      backtrack(row + 1, col);
    }
    
    // Backtrack: remove current position from path
    currentPath.pop();
  }
  
  // Start from top-left corner
  backtrack(0, 0);
  return allPaths;
}`,
            hints: [
              "Use recursion with a current path array to track the route",
              "Check bounds and walls before making a move",
              "When you reach the destination, save a copy of the current path",
              "Always backtrack by removing the current position after exploring"
            ],
            testCases: [
              {
                input: [[[1, 1], [1, 1]]],
                expectedOutput: [[[0, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [1, 1]]],
                description: "Find all paths in a 2x2 open maze"
              },
              {
                input: [[[1, 0], [1, 1]]],
                expectedOutput: [[[0, 0], [1, 0], [1, 1]]],
                description: "Find path in maze with one blocked cell"
              },
              {
                input: [[[1]]],
                expectedOutput: [[[0, 0]]],
                description: "Single cell maze"
              },
              {
                input: [[[0]]],
                expectedOutput: [],
                description: "Blocked single cell maze"
              },
              {
                input: [[[1, 1, 1], [0, 1, 0], [0, 1, 1]]],
                expectedOutput: [[[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]]],
                description: "Find path in maze with multiple walls"
              }
            ]
          }
        ]
      }
    ]
  }
];