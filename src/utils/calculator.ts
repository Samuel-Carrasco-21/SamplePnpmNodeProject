export const operateNumbers = (
  numOne: number,
  numTwo: number,
  operation: string
): number => {
  switch (operation) {
    case '+':
      return numOne + numTwo;
    case '-':
      return numOne - numTwo;
    case '*':
      return numOne * numTwo;
    case '/':
      return numOne / numTwo;
    default:
      throw new Error('Invalid operation');
  }
};
