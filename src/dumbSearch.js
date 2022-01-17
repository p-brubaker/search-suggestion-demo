export default function dumbSearch(words, prefix) {
  return words.filter(word => word.includes(prefix));
}
