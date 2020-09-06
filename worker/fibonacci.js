const fibonacci = (index, memo) => {
  memo = memo || {}

  if (memo[index]) return memo[index]
  if (index <= 1) return 1

  return memo[index] = fibonacci(index - 1) + fibonacci(index - 2)
}

module.exports = fibonacci
