const numberList = [1, 2, 3, 4, 5]
// [2, 3, 4, 5, 6]

const addOne = number => number + 1
const result = numberList.map(addOne)

console.log('result:', result)
