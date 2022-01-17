/**
 * @param {string[]} products
 * @param {string} searchWord
 * @return {string[][]}
 */
export function makeTree(tags) {
    
  const myTrie = new BSTrieNode();
    for (let i = 0; i < tags.length; i++) {
      myTrie.insertWord(tags[i])
    }

    return myTrie;
    
};
function getNSmallest(treeNode, n, suffixLength) {
      const stack = [];
      const output = [];

      stack.push(treeNode);
      while (treeNode.left) {
        treeNode = treeNode.left;
        stack.push(treeNode);
      }

      while (stack.length) {
        let next = stack.pop();
        output.push({node: next, length: suffixLength});
        if (output.length === n) return output;
        if (next.right) output.push(...getNSmallest(next.right, n - output.length, suffixLength))
      }

      return output;

    }

function BSTrieNode(val, left, right, children) {
        this.val = val;
        this.left = left || null;
        this.right = right || null;
        this.children = children || null;
    }
    
    BSTrieNode.prototype.insert = function(node) {
        if (!this.val) {
            this.val = node.val;
            this.left = node.left;
            this.right = node.right;
            this.children = node.children;
        } else {
            if (node.val < this.val) {
            if (this.left) this.left.insert(node);
            else {
              this.left = node;
            }
        }
        if (node.val > this.val) {
            if (this.right) this.right.insert(node);
            else {
              this.right = node;
            }
        }    
        }
        
    }
    
    BSTrieNode.prototype.find = function(val) {
        if (this.val === val) return this;
        if (this.val > val) {
          if (this.left) {
            return this.left.find(val);
          }
          return null;
        } 
        if (this.val < val) {
          if (this.right) {
            return this.right.find(val);
          }
          return null;
        }
    }
    
    
    BSTrieNode.prototype.insertLinear = function(word) {
        let curr = this;
        for (let i = 0; i < word.length; i++) {
            curr.children = new BSTrieNode(word[i]);
            curr = curr.children;
        }
        curr.eow = true;
    }
    
    BSTrieNode.prototype.insertWord = function(word) {
      let curr = this;
      for (let i = 0; i < word.length; i++) {             
        const match = curr.find(word[i]);
        if (match) {
          if (i === word.length - 1) {
                  match.eow = true;
                  break
                }
                if (!match.children) {
                  const newNode = new BSTrieNode(word[i+1]);
                  newNode.insertLinear(word.slice(i+2));
                  match.children = newNode;
                  break;
                } else curr = match.children;
              } else {
                const newNode = new BSTrieNode(word[i]);
                newNode.insertLinear(word.slice(i+1));
                curr.insert(newNode);    
                break;
              }
            }
    }

function getSuggested(node, substr) {
        const suffix = [];
        const output = [];
        let leftMost = [];

        if (node.eow) output.push(substr);
        if (!node.children) return output;
        node = node.children;

        while (true) {

          let newLeftMost = getNSmallest(node, 10 - output.length, suffix.length);
          node = newLeftMost[0].node;
          if(newLeftMost.length > 1) {
            leftMost.unshift(...newLeftMost.slice(1))
            if (leftMost.length > 9) leftMost.length = 2;
          }
          suffix.push(node.val);
          if (node.eow) {
            output.push(substr + suffix.join(''));
            if (output.length === 10) return output;
          }
          while (!node.children) {
            let next = leftMost.shift();
            if (!next) return output;
            node = next.node;
            suffix.length = next.length;
            suffix.push(node.val);
            if (node.eow) {
              output.push(substr + suffix.join(''));
              if (output.length === 10) return output;
            }
          }
          node = node.children;
        }
    }
    


export function getResults(tree, prefix) {
  if (!prefix) return [];
  let curr = tree;
    let substr = '';
    for (let j = 0; j < prefix.length; j++) {
      substr += prefix[j];
      if (!curr) {
        return [];
      }
      curr = curr.find(prefix[j]);
      if (!curr) return [];
      if (j === prefix.length - 1) return getSuggested(curr, substr)
      curr = curr.children; 
    }
}
