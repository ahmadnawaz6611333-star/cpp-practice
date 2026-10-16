// ========================================
// PROBLEMS DATA - 1200 Problems (12 sections × 100)
// ========================================

const problems = [];

// Helper to generate problems quickly
function generateProblems(category, categoryLabel, count, baseId, templates) {
  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    problems.push({
      id: baseId + i,
      category: category,
      title: template.title.replace('{n}', i + 1),
      difficulty: template.difficulty,
      statement: template.statement.replace('{n}', i + 1),
      input: template.input || 'Enter the required input values as described.',
      output: template.output || 'Print the required output as described.'
    });
  }
}

// ========================================
// 1. INPUT & OUTPUT (100 problems) - IDs 1-100
// ========================================
generateProblems('io', 'Input & Output', 100, 1, [
  { title: 'Hello World', difficulty: 'Easy', statement: 'Write a C++ program that prints "Hello, World!" to the console.', input: 'None', output: 'Hello, World!' },
  { title: 'Add Two Numbers', difficulty: 'Easy', statement: 'Read two integers from the user and print their sum.', input: '5 3', output: '8' },
  { title: 'Area of a Circle {n}', difficulty: 'Easy', statement: 'Read the radius of a circle and print its area. Use PI = 3.14159.', input: '5', output: '78.53975' },
  { title: 'Simple Interest {n}', difficulty: 'Easy', statement: 'Read principal P, rate R, and time T. Print simple interest = (P * R * T) / 100.', input: '1000 5 2', output: '100' },
  { title: 'Swap Two Numbers {n}', difficulty: 'Easy', statement: 'Read two integers and swap their values, then print both after swapping.', input: '10 20', output: '20 10' },
  { title: 'ASCII Value of a Character {n}', difficulty: 'Easy', statement: 'Read a single character and print its ASCII value.', input: 'A', output: '65' },
  { title: 'Celsius to Fahrenheit {n}', difficulty: 'Easy', statement: 'Read temperature in Celsius and convert it to Fahrenheit: F = (C * 9/5) + 32.', input: '0', output: '32' },
  { title: 'Check Even or Odd {n}', difficulty: 'Easy', statement: 'Read an integer and print whether it is "Even" or "Odd".', input: '7', output: 'Odd' },
  { title: 'Calculate Percentage {n}', difficulty: 'Easy', statement: 'Read marks obtained out of 100 and print the percentage.', input: '85', output: '85' },
  { title: 'Size of Data Types {n}', difficulty: 'Easy', statement: 'Print the size (in bytes) of common C++ data types: int, char, float, double.', input: 'None', output: 'int: 4\nchar: 1\nfloat: 4\ndouble: 8' },
  { title: 'Multiply Two Numbers {n}', difficulty: 'Easy', statement: 'Read two integers and print their product.', input: '6 7', output: '42' },
  { title: 'Divide Two Numbers {n}', difficulty: 'Easy', statement: 'Read two integers and print the quotient and remainder.', input: '17 5', output: '3 2' },
  { title: 'Average of Three Numbers {n}', difficulty: 'Easy', statement: 'Read three numbers and print their average.', input: '10 20 30', output: '20' },
  { title: 'Convert Days to Years {n}', difficulty: 'Easy', statement: 'Read total days and convert into years, weeks, and days.', input: '400', output: '1 year, 1 week, 3 days' },
  { title: 'Read and Print String {n}', difficulty: 'Easy', statement: 'Read a string with spaces and print it back.', input: 'Hello C++', output: 'Hello C++' },
  { title: 'Character Input Output {n}', difficulty: 'Easy', statement: 'Read a character using cin.get() and print it.', input: 'Z', output: 'Z' },
  { title: 'Formatted Output {n}', difficulty: 'Easy', statement: 'Print a floating-point number with exactly 2 decimal places.', input: '3.14159', output: '3.14' },
  { title: 'Multiple Inputs {n}', difficulty: 'Easy', statement: 'Read an integer, a float, and a character in one line and print all.', input: '5 3.14 A', output: '5 3.14 A' },
  { title: 'Boolean Input Output {n}', difficulty: 'Easy', statement: 'Read a boolean value and print "true" or "false".', input: '1', output: 'true' },
  { title: 'Input Validation {n}', difficulty: 'Medium', statement: 'Read an integer and keep asking until a positive number is entered.', input: '-5\n10', output: '10' },
]);

// ========================================
// 2. VARIABLES & DATA TYPES (100 problems) - IDs 101-200
// ========================================
generateProblems('variables', 'Variables & Data Types', 100, 101, [
  { title: 'Declare Variables {n}', difficulty: 'Easy', statement: 'Declare variables of type int, float, double, char, bool, and string and print their values.', input: 'None', output: 'Depends on values' },
  { title: 'Variable Naming Rules {n}', difficulty: 'Easy', statement: 'Write a program demonstrating valid and invalid variable names.', input: 'None', output: 'Valid names shown' },
  { title: 'Constants in C++ {n}', difficulty: 'Easy', statement: 'Use const to declare a constant and try to modify it.', input: 'None', output: 'Compile error if modified' },
  { title: 'Integer Types {n}', difficulty: 'Easy', statement: 'Use short, int, long, long long and print their ranges.', input: 'None', output: 'Ranges printed' },
  { title: 'Floating Point Types {n}', difficulty: 'Easy', statement: 'Compare float and double precision with a large decimal number.', input: 'None', output: 'Precision compared' },
  { title: 'Char Type {n}', difficulty: 'Easy', statement: 'Store a character in char and print its ASCII value.', input: 'B', output: '66' },
  { title: 'Boolean Type {n}', difficulty: 'Easy', statement: 'Store true/false in bool and print the result.', input: 'true', output: '1' },
  { title: 'String Type {n}', difficulty: 'Easy', statement: 'Use std::string to store a sentence and print its length.', input: 'Hello World', output: '11' },
  { title: 'Type Conversion {n}', difficulty: 'Medium', statement: 'Convert an int to double and print the result.', input: '5', output: '5.0' },
  { title: 'Type Casting {n}', difficulty: 'Medium', statement: 'Use static_cast to convert between types safely.', input: '10', output: '10.0' },
  { title: 'Auto Keyword {n}', difficulty: 'Medium', statement: 'Use auto to let the compiler deduce the type.', input: 'None', output: 'Type deduced' },
  { title: 'Enumeration {n}', difficulty: 'Medium', statement: 'Create an enum for days of the week and print values.', input: 'None', output: 'Days printed' },
  { title: 'Struct Basics {n}', difficulty: 'Medium', statement: 'Create a struct for a Student with name, age, and grade.', input: 'None', output: 'Student data' },
  { title: 'Union Basics {n}', difficulty: 'Medium', statement: 'Demonstrate a union sharing memory between types.', input: 'None', output: 'Shared memory' },
  { title: 'Typedef {n}', difficulty: 'Medium', statement: 'Use typedef to create an alias for unsigned int.', input: 'None', output: 'Alias created' },
]);

// ========================================
// 3. OPERATORS & EXPRESSIONS (100 problems) - IDs 201-300
// ========================================
generateProblems('operators', 'Operators & Expressions', 100, 201, [
  { title: 'Arithmetic Operators {n}', difficulty: 'Easy', statement: 'Demonstrate +, -, *, /, % operators with two numbers.', input: '10 3', output: '13 7 30 3 1' },
  { title: 'Relational Operators {n}', difficulty: 'Easy', statement: 'Compare two numbers using ==, !=, <, >, <=, >=.', input: '5 10', output: '0 1 1 0 1 0' },
  { title: 'Logical Operators {n}', difficulty: 'Easy', statement: 'Demonstrate &&, ||, ! with boolean conditions.', input: '1 0', output: '0 1 0' },
  { title: 'Assignment Operators {n}', difficulty: 'Easy', statement: 'Use =, +=, -=, *=, /= on a variable.', input: '5', output: '5 10 5 50 10' },
  { title: 'Increment Decrement {n}', difficulty: 'Easy', statement: 'Demonstrate pre-increment and post-increment.', input: '5', output: '6 5' },
  { title: 'Bitwise Operators {n}', difficulty: 'Medium', statement: 'Demonstrate &, |, ^, ~, <<, >> on integers.', input: '5 3', output: '1 7 6 -6 40 1' },
  { title: 'Ternary Operator {n}', difficulty: 'Easy', statement: 'Use the ternary operator to find the larger of two numbers.', input: '7 12', output: '12' },
  { title: 'Operator Precedence {n}', difficulty: 'Medium', statement: 'Write an expression showing operator precedence rules.', input: 'None', output: 'Result based on precedence' },
  { title: 'Comma Operator {n}', difficulty: 'Medium', statement: 'Demonstrate the comma operator in a loop.', input: 'None', output: 'Final value' },
  { title: 'sizeof Operator {n}', difficulty: 'Easy', statement: 'Print the size of various data types using sizeof.', input: 'None', output: 'int: 4\nchar: 1\nfloat: 4\ndouble: 8' },
]);

// ========================================
// 4. CONDITIONS & DECISION MAKING (100 problems) - IDs 301-400
// ========================================
generateProblems('conditionals', 'Conditions & Decision Making', 100, 301, [
  { title: 'If Statement {n}', difficulty: 'Easy', statement: 'Use if to check if a number is positive.', input: '5', output: 'Positive' },
  { title: 'If Else Statement {n}', difficulty: 'Easy', statement: 'Use if-else to check if a number is even or odd.', input: '4', output: 'Even' },
  { title: 'Else If Ladder {n}', difficulty: 'Easy', statement: 'Use else-if to grade a score (A, B, C, D, F).', input: '85', output: 'A' },
  { title: 'Nested If {n}', difficulty: 'Medium', statement: 'Use nested if to check if a number is divisible by 5 and 7.', input: '35', output: 'Divisible by both' },
  { title: 'Switch Statement {n}', difficulty: 'Easy', statement: 'Use switch to print day name from a number 1-7.', input: '3', output: 'Wednesday' },
  { title: 'Switch with Default {n}', difficulty: 'Easy', statement: 'Use switch with a default case for invalid input.', input: '9', output: 'Invalid day' },
  { title: 'Logical Conditions {n}', difficulty: 'Medium', statement: 'Check if a year is a leap year using logical operators.', input: '2024', output: 'Leap Year' },
  { title: 'Range Check {n}', difficulty: 'Easy', statement: 'Check if a number lies between 10 and 100.', input: '50', output: 'In range' },
  { title: 'Menu Driven Program {n}', difficulty: 'Medium', statement: 'Create a menu-driven calculator using switch.', input: '1\n5 3', output: '8' },
  { title: 'Vowel or Consonant {n}', difficulty: 'Easy', statement: 'Read a character and check if it is a vowel or consonant.', input: 'a', output: 'Vowel' },
]);

// ========================================
// 5. LOOPS & REPETITION (100 problems) - IDs 401-500
// ========================================
generateProblems('loops', 'Loops & Repetition', 100, 401, [
  { title: 'For Loop 1 to N {n}', difficulty: 'Easy', statement: 'Use a for loop to print numbers from 1 to N.', input: '5', output: '1 2 3 4 5' },
  { title: 'While Loop {n}', difficulty: 'Easy', statement: 'Use a while loop to print numbers from N down to 1.', input: '5', output: '5 4 3 2 1' },
  { title: 'Do While Loop {n}', difficulty: 'Easy', statement: 'Use a do-while loop to print a menu until user exits.', input: 'None', output: 'Menu printed' },
  { title: 'Nested Loops {n}', difficulty: 'Medium', statement: 'Use nested for loops to print a multiplication table.', input: '5', output: '5x1=5\n5x2=10...' },
  { title: 'Break Statement {n}', difficulty: 'Easy', statement: 'Use break to exit a loop when a condition is met.', input: 'None', output: 'Loop exited' },
  { title: 'Continue Statement {n}', difficulty: 'Easy', statement: 'Use continue to skip even numbers in a loop.', input: 'None', output: 'Odd numbers only' },
  { title: 'Sum of Digits {n}', difficulty: 'Easy', statement: 'Read a number and print the sum of its digits using a loop.', input: '123', output: '6' },
  { title: 'Reverse Number {n}', difficulty: 'Easy', statement: 'Reverse the digits of a number using a loop.', input: '1234', output: '4321' },
  { title: 'Prime Check {n}', difficulty: 'Medium', statement: 'Check if a number is prime using a loop.', input: '17', output: 'Prime' },
  { title: 'Fibonacci Series {n}', difficulty: 'Medium', statement: 'Print the first N Fibonacci numbers using a loop.', input: '6', output: '0 1 1 2 3 5' },
  { title: 'Factorial {n}', difficulty: 'Easy', statement: 'Calculate factorial of N using a loop.', input: '5', output: '120' },
  { title: 'Armstrong Number {n}', difficulty: 'Medium', statement: 'Check if a number is an Armstrong number.', input: '153', output: 'Armstrong' },
  { title: 'Palindrome Number {n}', difficulty: 'Medium', statement: 'Check if a number is a palindrome using a loop.', input: '121', output: 'Palindrome' },
  { title: 'Star Pattern Right Triangle {n}', difficulty: 'Medium', statement: 'Print a right triangle star pattern with N rows.', input: '4', output: '*\n**\n***\n****' },
  { title: 'Star Pattern Pyramid {n}', difficulty: 'Medium', statement: 'Print a pyramid star pattern with N rows.', input: '3', output: '  *\n ***\n*****' },
  { title: 'Star Pattern Diamond {n}', difficulty: 'Medium', statement: 'Print a diamond star pattern with N rows.', input: '3', output: '  *\n ***\n*****\n ***\n  *' },
  { title: 'Number Pattern {n}', difficulty: 'Medium', statement: 'Print a number pattern using nested loops.', input: '4', output: '1\n12\n123\n1234' },
  { title: 'Hollow Square Pattern {n}', difficulty: 'Medium', statement: 'Print a hollow square pattern using nested loops.', input: '4', output: '****\n*  *\n*  *\n****' },
  { title: 'GCD of Two Numbers {n}', difficulty: 'Medium', statement: 'Find GCD of two numbers using a loop.', input: '12 18', output: '6' },
  { title: 'LCM of Two Numbers {n}', difficulty: 'Medium', statement: 'Find LCM of two numbers using a loop.', input: '4 6', output: '12' },
]);

// ========================================
// 6. FUNCTIONS (100 problems) - IDs 501-600
// ========================================
generateProblems('functions', 'Functions', 100, 501, [
  { title: 'Function Declaration {n}', difficulty: 'Easy', statement: 'Declare and define a function that prints a message.', input: 'None', output: 'Message printed' },
  { title: 'Function with Parameters {n}', difficulty: 'Easy', statement: 'Write a function that takes two integers and prints their sum.', input: '5 3', output: '8' },
  { title: 'Return Value {n}', difficulty: 'Easy', statement: 'Write a function that returns the maximum of two numbers.', input: '7 12', output: '12' },
  { title: 'Pass by Value {n}', difficulty: 'Easy', statement: 'Demonstrate pass by value with a swap function.', input: '5 10', output: 'Original unchanged' },
  { title: 'Pass by Reference {n}', difficulty: 'Medium', statement: 'Demonstrate pass by reference with a swap function.', input: '5 10', output: '10 5' },
  { title: 'Default Arguments {n}', difficulty: 'Medium', statement: 'Write a function with default argument values.', input: '5', output: 'Result with default' },
  { title: 'Function Overloading {n}', difficulty: 'Medium', statement: 'Overload a function to calculate area of circle and rectangle.', input: 'None', output: 'Areas printed' },
  { title: 'Inline Function {n}', difficulty: 'Medium', statement: 'Demonstrate an inline function for small calculations.', input: 'None', output: 'Result printed' },
  { title: 'Recursive Function {n}', difficulty: 'Hard', statement: 'Write a recursive function to calculate factorial.', input: '5', output: '120' },
  { title: 'Recursive Fibonacci {n}', difficulty: 'Hard', statement: 'Write a recursive function to print nth Fibonacci number.', input: '6', output: '8' },
  { title: 'Scope of Variables {n}', difficulty: 'Medium', statement: 'Demonstrate local and global variable scope.', input: 'None', output: 'Scope shown' },
  { title: 'Static Variables {n}', difficulty: 'Medium', statement: 'Demonstrate a static variable inside a function.', input: 'None', output: 'Value persists' },
  { title: 'Function Pointers {n}', difficulty: 'Hard', statement: 'Declare and use a function pointer to call a function.', input: 'None', output: 'Function called' },
]);

// ========================================
// 7. ARRAYS (100 problems) - IDs 601-700
// ========================================
generateProblems('arrays', 'Arrays', 100, 601, [
  { title: 'Array Declaration {n}', difficulty: 'Easy', statement: 'Declare an array of 5 integers and initialize it.', input: 'None', output: 'Array declared' },
  { title: 'Array Input Output {n}', difficulty: 'Easy', statement: 'Read N integers into an array and print them.', input: '3\n1 2 3', output: '1 2 3' },
  { title: 'Array Traversal {n}', difficulty: 'Easy', statement: 'Traverse an array using a for loop and print each element.', input: 'None', output: 'Elements printed' },
  { title: 'Find Maximum {n}', difficulty: 'Easy', statement: 'Read N integers and print the maximum value.', input: '5\n3 7 2 9 1', output: '9' },
  { title: 'Find Minimum {n}', difficulty: 'Easy', statement: 'Read N integers and print the minimum value.', input: '5\n3 7 2 9 1', output: '1' },
  { title: 'Array Sum {n}', difficulty: 'Easy', statement: 'Read N integers and print their sum.', input: '3\n1 2 3', output: '6' },
  { title: 'Array Average {n}', difficulty: 'Easy', statement: 'Read N integers and print their average.', input: '3\n1 2 3', output: '2' },
  { title: 'Linear Search {n}', difficulty: 'Easy', statement: 'Search for an element in an array and print its index.', input: '5\n10 20 30 40 50\n30', output: '2' },
  { title: 'Reverse Array {n}', difficulty: 'Easy', statement: 'Reverse an array in place and print it.', input: '4\n1 2 3 4', output: '4 3 2 1' },
  { title: 'Count Even Odd {n}', difficulty: 'Easy', statement: 'Count even and odd numbers in an array.', input: '5\n1 2 3 4 5', output: 'Even: 2, Odd: 3' },
  { title: 'Remove Duplicates {n}', difficulty: 'Medium', statement: 'Remove duplicate elements from an array.', input: '5\n1 2 2 3 3', output: '1 2 3' },
  { title: 'Rotate Array {n}', difficulty: 'Medium', statement: 'Rotate an array by K positions.', input: '5\n1 2 3 4 5\n2', output: '3 4 5 1 2' },
  { title: 'Second Largest {n}', difficulty: 'Medium', statement: 'Find the second largest element in an array.', input: '5\n10 20 30 40 50', output: '40' },
  { title: 'Pair Sum {n}', difficulty: 'Medium', statement: 'Find all pairs in an array that sum to a target.', input: '5\n1 2 3 4 5\n5', output: '(1,4) (2,3)' },
  { title: 'Bubble Sort {n}', difficulty: 'Medium', statement: 'Sort an array using bubble sort.', input: '4\n4 3 2 1', output: '1 2 3 4' },
  { title: 'Selection Sort {n}', difficulty: 'Medium', statement: 'Sort an array using selection sort.', input: '4\n4 3 2 1', output: '1 2 3 4' },
  { title: 'Insertion Sort {n}', difficulty: 'Medium', statement: 'Sort an array using insertion sort.', input: '4\n4 3 2 1', output: '1 2 3 4' },
  { title: '2D Array Input Output {n}', difficulty: 'Medium', statement: 'Read and print a 2D array (matrix).', input: '2 2\n1 2\n3 4', output: '1 2\n3 4' },
  { title: 'Matrix Addition {n}', difficulty: 'Medium', statement: 'Add two matrices and print the result.', input: '2 2\n1 2\n3 4\n5 6\n7 8', output: '6 8\n10 12' },
  { title: 'Matrix Multiplication {n}', difficulty: 'Hard', statement: 'Multiply two matrices and print the result.', input: '2 2\n1 2\n3 4\n5 6\n7 8', output: '19 22\n43 50' },
  { title: 'Matrix Transpose {n}', difficulty: 'Medium', statement: 'Print the transpose of a matrix.', input: '2 2\n1 2\n3 4', output: '1 3\n2 4' },
]);

// ========================================
// 8. STRINGS (100 problems) - IDs 701-800
// ========================================
generateProblems('strings', 'Strings', 100, 701, [
  { title: 'String Declaration {n}', difficulty: 'Easy', statement: 'Declare a std::string and print it.', input: 'None', output: 'String printed' },
  { title: 'String Input with Spaces {n}', difficulty: 'Easy', statement: 'Read a full line with spaces using getline().', input: 'Hello C++', output: 'Hello C++' },
  { title: 'String Length {n}', difficulty: 'Easy', statement: 'Find the length of a string without using built-in functions.', input: 'hello', output: '5' },
  { title: 'String Reverse {n}', difficulty: 'Easy', statement: 'Reverse a string and print it.', input: 'hello', output: 'olleh' },
  { title: 'String Palindrome {n}', difficulty: 'Easy', statement: 'Check if a string is a palindrome.', input: 'madam', output: 'Palindrome' },
  { title: 'String Concatenation {n}', difficulty: 'Easy', statement: 'Concatenate two strings using + operator.', input: 'Hello World', output: 'HelloWorld' },
  { title: 'String Comparison {n}', difficulty: 'Easy', statement: 'Compare two strings lexicographically.', input: 'abc abd', output: 'abc < abd' },
  { title: 'Count Vowels {n}', difficulty: 'Easy', statement: 'Count the number of vowels in a string.', input: 'hello', output: '2' },
  { title: 'Count Words {n}', difficulty: 'Easy', statement: 'Count the number of words in a string.', input: 'Hello World C++', output: '3' },
  { title: 'Substring {n}', difficulty: 'Medium', statement: 'Extract a substring from a given string.', input: 'Hello World 0 5', output: 'Hello' },
  { title: 'String to Uppercase {n}', difficulty: 'Easy', statement: 'Convert a string to uppercase.', input: 'hello', output: 'HELLO' },
  { title: 'String to Lowercase {n}', difficulty: 'Easy', statement: 'Convert a string to lowercase.', input: 'HELLO', output: 'hello' },
  { title: 'Anagram Check {n}', difficulty: 'Medium', statement: 'Check if two strings are anagrams.', input: 'listen silent', output: 'Anagram' },
  { title: 'Remove Spaces {n}', difficulty: 'Medium', statement: 'Remove all spaces from a string.', input: 'Hello World', output: 'HelloWorld' },
  { title: 'Frequency of Characters {n}', difficulty: 'Medium', statement: 'Print frequency of each character in a string.', input: 'hello', output: 'h:1 e:1 l:2 o:1' },
]);

// ========================================
// 9. POINTERS & MEMORY (100 problems) - IDs 801-900
// ========================================
generateProblems('pointers', 'Pointers & Memory', 100, 801, [
  { title: 'Pointer Declaration {n}', difficulty: 'Easy', statement: 'Declare a pointer and print the address of a variable.', input: 'None', output: 'Address printed' },
  { title: 'Pointer Dereferencing {n}', difficulty: 'Easy', statement: 'Use a pointer to access and modify a value.', input: '10', output: '10' },
  { title: 'Pointer to Pointer {n}', difficulty: 'Medium', statement: 'Demonstrate a pointer to a pointer.', input: 'None', output: 'Value via double pointer' },
  { title: 'Null Pointer {n}', difficulty: 'Easy', statement: 'Demonstrate a null pointer and check before use.', input: 'None', output: 'Null check passed' },
  { title: 'Pointer Arithmetic {n}', difficulty: 'Medium', statement: 'Perform arithmetic on pointers with an array.', input: 'None', output: 'Address incremented' },
  { title: 'Pointer and Array {n}', difficulty: 'Medium', statement: 'Use a pointer to traverse an array.', input: 'None', output: 'Elements via pointer' },
  { title: 'Pointer to Function {n}', difficulty: 'Hard', statement: 'Pass a pointer to a function and modify the value.', input: 'None', output: 'Value modified' },
  { title: 'Dynamic Memory Allocation {n}', difficulty: 'Medium', statement: 'Use new to allocate memory for an integer.', input: 'None', output: 'Memory allocated' },
  { title: 'Delete Memory {n}', difficulty: 'Medium', statement: 'Use delete to free dynamically allocated memory.', input: 'None', output: 'Memory freed' },
  { title: 'Dynamic Array {n}', difficulty: 'Medium', statement: 'Allocate a dynamic array using new[] and delete[].', input: 'None', output: 'Dynamic array created' },
  { title: 'Dangling Pointer {n}', difficulty: 'Hard', statement: 'Demonstrate a dangling pointer after delete.', input: 'None', output: 'Dangling pointer shown' },
  { title: 'Smart Pointers {n}', difficulty: 'Hard', statement: 'Demonstrate unique_ptr and shared_ptr.', input: 'None', output: 'Smart pointers used' },
  { title: 'Reference vs Pointer {n}', difficulty: 'Medium', statement: 'Compare references and pointers in C++.', input: 'None', output: 'Comparison shown' },
]);

// ========================================
// 10. OBJECT-ORIENTED PROGRAMMING (100 problems) - IDs 901-1000
// ========================================
generateProblems('oop', 'Object-Oriented Programming', 100, 901, [
  { title: 'Class and Object {n}', difficulty: 'Easy', statement: 'Create a class with attributes and member functions.', input: 'None', output: 'Object created' },
  { title: 'Constructor {n}', difficulty: 'Easy', statement: 'Create a class with a constructor that initializes attributes.', input: 'None', output: 'Constructor called' },
  { title: 'Destructor {n}', difficulty: 'Easy', statement: 'Create a class with a destructor and print when it is called.', input: 'None', output: 'Destructor called' },
  { title: 'Encapsulation {n}', difficulty: 'Medium', statement: 'Demonstrate encapsulation using private attributes and public getters/setters.', input: 'None', output: 'Data encapsulated' },
  { title: 'Inheritance {n}', difficulty: 'Medium', statement: 'Create a base class and a derived class showing inheritance.', input: 'None', output: 'Inheritance shown' },
  { title: 'Multiple Inheritance {n}', difficulty: 'Hard', statement: 'Demonstrate multiple inheritance in C++.', input: 'None', output: 'Multiple inheritance' },
  { title: 'Multilevel Inheritance {n}', difficulty: 'Medium', statement: 'Demonstrate multilevel inheritance with three classes.', input: 'None', output: 'Multilevel inheritance' },
  { title: 'Polymorphism {n}', difficulty: 'Medium', statement: 'Demonstrate compile-time polymorphism using function overloading.', input: 'None', output: 'Overloaded functions' },
  { title: 'Virtual Functions {n}', difficulty: 'Hard', statement: 'Demonstrate runtime polymorphism using virtual functions.', input: 'None', output: 'Runtime polymorphism' },
  { title: 'Abstract Class {n}', difficulty: 'Hard', statement: 'Create an abstract class with a pure virtual function.', input: 'None', output: 'Abstract class created' },
  { title: 'Operator Overloading {n}', difficulty: 'Hard', statement: 'Overload the + operator for a custom class.', input: 'None', output: 'Operator overloaded' },
  { title: 'Friend Function {n}', difficulty: 'Medium', statement: 'Use a friend function to access private members.', input: 'None', output: 'Private accessed' },
  { title: 'Static Members {n}', difficulty: 'Medium', statement: 'Demonstrate static data members and member functions.', input: 'None', output: 'Static members used' },
  { title: 'This Pointer {n}', difficulty: 'Medium', statement: 'Use the this pointer to disambiguate member variables.', input: 'None', output: 'This pointer used' },
  { title: 'Composition {n}', difficulty: 'Medium', statement: 'Demonstrate composition by having a class contain another class object.', input: 'None', output: 'Composition shown' },
]);

// ========================================
// 11. STANDARD TEMPLATE LIBRARY (100 problems) - IDs 1001-1100
// ========================================
generateProblems('stl', 'Standard Template Library', 100, 1001, [
  { title: 'Vector Basics {n}', difficulty: 'Easy', statement: 'Use std::vector to store and print integers.', input: 'None', output: 'Vector printed' },
  { title: 'Vector Push Pop {n}', difficulty: 'Easy', statement: 'Use push_back and pop_back on a vector.', input: 'None', output: 'Push/pop done' },
  { title: 'Vector Size Capacity {n}', difficulty: 'Easy', statement: 'Print size and capacity of a vector.', input: 'None', output: 'Size and capacity' },
  { title: 'List Basics {n}', difficulty: 'Medium', statement: 'Use std::list to store and traverse elements.', input: 'None', output: 'List traversed' },
  { title: 'Stack Basics {n}', difficulty: 'Medium', statement: 'Use std::stack to push and pop elements.', input: 'None', output: 'Stack operations' },
  { title: 'Queue Basics {n}', difficulty: 'Medium', statement: 'Use std::queue to push and pop elements.', input: 'None', output: 'Queue operations' },
  { title: 'Priority Queue {n}', difficulty: 'Medium', statement: 'Use std::priority_queue to get the largest element.', input: 'None', output: 'Largest element' },
  { title: 'Set Basics {n}', difficulty: 'Medium', statement: 'Use std::set to store unique elements.', input: 'None', output: 'Unique elements' },
  { title: 'Map Basics {n}', difficulty: 'Medium', statement: 'Use std::map to store key-value pairs.', input: 'None', output: 'Key-value pairs' },
  { title: 'Unordered Map {n}', difficulty: 'Medium', statement: 'Use std::unordered_map for fast lookups.', input: 'None', output: 'Fast lookup' },
  { title: 'Sort Algorithm {n}', difficulty: 'Medium', statement: 'Use std::sort to sort a vector.', input: 'None', output: 'Sorted vector' },
  { title: 'Binary Search {n}', difficulty: 'Medium', statement: 'Use std::binary_search on a sorted vector.', input: 'None', output: 'Found/Not found' },
  { title: 'Reverse Algorithm {n}', difficulty: 'Easy', statement: 'Use std::reverse to reverse a vector.', input: 'None', output: 'Reversed vector' },
  { title: 'Copy Algorithm {n}', difficulty: 'Easy', statement: 'Use std::copy to copy elements between vectors.', input: 'None', output: 'Elements copied' },
  { title: 'Lambda Function {n}', difficulty: 'Medium', statement: 'Use a lambda function with std::sort for custom sorting.', input: 'None', output: 'Custom sort done' },
]);

// ========================================
// 12. DATA STRUCTURES & ALGORITHMS (100 problems) - IDs 1101-1200
// ========================================
generateProblems('dsa', 'Data Structures & Algorithms', 100, 1101, [
  { title: 'Big O Notation {n}', difficulty: 'Easy', statement: 'Analyze the time complexity of a simple loop.', input: 'None', output: 'O(n)' },
  { title: 'Linear Search {n}', difficulty: 'Easy', statement: 'Implement linear search on an array.', input: '5\n1 2 3 4 5\n3', output: 'Found at index 2' },
  { title: 'Binary Search {n}', difficulty: 'Medium', statement: 'Implement binary search on a sorted array.', input: '5\n1 2 3 4 5\n3', output: 'Found at index 2' },
  { title: 'Linked List {n}', difficulty: 'Medium', statement: 'Implement a singly linked list with insert and delete.', input: 'None', output: 'List created' },
  { title: 'Doubly Linked List {n}', difficulty: 'Medium', statement: 'Implement a doubly linked list.', input: 'None', output: 'Doubly list created' },
  { title: 'Stack Using Array {n}', difficulty: 'Easy', statement: 'Implement a stack using an array.', input: 'None', output: 'Stack operations' },
  { title: 'Queue Using Array {n}', difficulty: 'Easy', statement: 'Implement a queue using an array.', input: 'None', output: 'Queue operations' },
  { title: 'Bubble Sort {n}', difficulty: 'Medium', statement: 'Implement bubble sort and count swaps.', input: '4\n4 3 2 1', output: '1 2 3 4' },
  { title: 'Merge Sort {n}', difficulty: 'Hard', statement: 'Implement merge sort algorithm.', input: '4\n4 3 2 1', output: '1 2 3 4' },
  { title: 'Quick Sort {n}', difficulty: 'Hard', statement: 'Implement quick sort algorithm.', input: '4\n4 3 2 1', output: '1 2 3 4' },
  { title: 'Recursion Basics {n}', difficulty: 'Easy', statement: 'Write a recursive function to print numbers from N to 1.', input: '5', output: '5 4 3 2 1' },
  { title: 'Tower of Hanoi {n}', difficulty: 'Hard', statement: 'Solve Tower of Hanoi using recursion.', input: '3', output: 'Moves printed' },
  { title: 'BFS Graph {n}', difficulty: 'Hard', statement: 'Implement Breadth-First Search on a graph.', input: 'None', output: 'BFS traversal' },
  { title: 'DFS Graph {n}', difficulty: 'Hard', statement: 'Implement Depth-First Search on a graph.', input: 'None', output: 'DFS traversal' },
  { title: 'Dijkstra Algorithm {n}', difficulty: 'Hard', statement: 'Implement Dijkstra shortest path algorithm.', input: 'None', output: 'Shortest path' },
  { title: 'Dynamic Programming {n}', difficulty: 'Hard', statement: 'Solve a problem using memoization (top-down DP).', input: 'None', output: 'DP result' },
  { title: 'Knapsack Problem {n}', difficulty: 'Hard', statement: 'Solve the 0/1 knapsack problem using DP.', input: 'None', output: 'Max value' },
]);

// Category labels
const categoryLabels = {
  all: "All Problems",
  io: "Input & Output",
  variables: "Variables & Data Types",
  operators: "Operators & Expressions",
  conditionals: "Conditions & Decision Making",
  loops: "Loops & Repetition",
  functions: "Functions",
  arrays: "Arrays",
  strings: "Strings",
  pointers: "Pointers & Memory",
  oop: "Object-Oriented Programming",
  stl: "Standard Template Library",
  dsa: "Data Structures & Algorithms"
};

// Difficulty badge class
function getDifficultyBadge(difficulty) {
  const map = {
    Easy: "badge-easy",
    Medium: "badge-medium",
    Hard: "badge-hard"
  };
  return map[difficulty] || "badge-easy";
}

// Get solved problems from localStorage
function getSolvedProblems() {
  const saved = localStorage.getItem('cpp-solved-problems');
  return saved ? JSON.parse(saved) : [];
}

function isProblemSolved(id) {
  return getSolvedProblems().includes(id);
}

function toggleSolved(id) {
  const solved = getSolvedProblems();
  if (solved.includes(id)) {
    solved.splice(solved.indexOf(id), 1);
  } else {
    solved.push(id);
  }
  localStorage.setItem('cpp-solved-problems', JSON.stringify(solved));
  updateProgress();
  renderProblems(currentCategory);
}

// Render problems
let currentCategory = 'all';
let currentSearch = '';
let currentDifficulty = 'all';

function renderProblems(category = 'all') {
  currentCategory = category;
  const grid = document.getElementById("problemsGrid");
  const countEl = document.getElementById("problemsCount");
  grid.innerHTML = "";

  const solved = getSolvedProblems();
  const filtered = problems.filter(p => {
    const matchCategory = category === 'all' || p.category === category;
    const matchSearch = p.title.toLowerCase().includes(currentSearch.toLowerCase()) || 
                       p.statement.toLowerCase().includes(currentSearch.toLowerCase()) ||
                       p.id.toString().includes(currentSearch);
    const matchDiff = currentDifficulty === 'all' || p.difficulty === currentDifficulty;
    return matchCategory && matchSearch && matchDiff;
  });

  filtered.forEach(problem => {
    const card = document.createElement("div");
    card.className = `problem-card ${isProblemSolved(problem.id) ? 'solved' : ''}`;
    card.innerHTML = `
      <div class="problem-id">#${problem.id}</div>
      <h3>${problem.title}</h3>
      <p>${problem.statement}</p>
      <div class="problem-meta">
        <span class="badge ${getDifficultyBadge(problem.difficulty)}">${problem.difficulty}</span>
        <span>${categoryLabels[problem.category] || problem.category}</span>
      </div>
    `;
    
    card.onclick = () => openProblemModal(problem);
    grid.appendChild(card);
  });

  countEl.textContent = `Showing ${filtered.length} of ${problems.length} problems`;

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.category === category) {
      btn.classList.add("active");
    }
  });

  updateProgress();
}

// Update progress ring and stats
function updateProgress() {
  const solved = getSolvedProblems();
  const total = problems.length;
  const pct = total ? Math.round((solved.length / total) * 100) : 0;

  document.getElementById('overallProgress').textContent = pct + '%';
  document.getElementById('solvedCount').textContent = solved.length;

  const easySolved = solved.filter(id => {
    const p = problems.find(x => x.id === id);
    return p && p.difficulty === 'Easy';
  }).length;
  const mediumSolved = solved.filter(id => {
    const p = problems.find(x => x.id === id);
    return p && p.difficulty === 'Medium';
  }).length;
  const hardSolved = solved.filter(id => {
    const p = problems.find(x => x.id === id);
    return p && p.difficulty === 'Hard';
  }).length;

  document.getElementById('easyCount').textContent = easySolved;
  document.getElementById('mediumCount').textContent = mediumSolved;
  document.getElementById('hardCount').textContent = hardSolved;

  // Progress ring animation
  const fill = document.getElementById('progressFill');
  const circumference = 2 * Math.PI * 60;
  const offset = circumference - (pct / 100) * circumference;
  fill.style.strokeDasharray = circumference;
  fill.style.strokeDashoffset = offset;
}

// Open problem modal
let currentProblemId = null;

function openProblemModal(problem) {
  currentProblemId = problem.id;

  document.getElementById("modalId").textContent = `#${problem.id}`;
  document.getElementById("modalTitle").textContent = problem.title;
  document.getElementById("modalCategory").textContent = categoryLabels[problem.category] || problem.category;
  document.getElementById("modalDifficulty").textContent = problem.difficulty;
  document.getElementById("modalProblemId").textContent = problem.id;
  document.getElementById("modalStatement").textContent = problem.statement;
  document.getElementById("modalExampleInput").textContent = problem.input || "None";
  document.getElementById("modalExampleOutput").textContent = problem.output || "None";

  const badge = document.getElementById("modalBadge");
  badge.className = "modal-badge " + getDifficultyBadge(problem.difficulty);

  const solvedBtn = document.getElementById("modalMarkSolved");
  const alreadySolved = isProblemSolved(problem.id);
  solvedBtn.textContent = alreadySolved ? "Mark as Unsolved ↻" : "Mark as Solved ✓";
  solvedBtn.className = alreadySolved ? "btn btn-outline" : "btn btn-primary";

  const modal = document.getElementById("problemModal");
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("problemModal");
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

// Tab button click handlers
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category;
    renderProblems(category);
  });
});

// Search and filter
document.getElementById("problemSearch").addEventListener("input", (e) => {
  currentSearch = e.target.value;
  renderProblems(currentCategory);
});

document.getElementById("difficultyFilter").addEventListener("change", (e) => {
  currentDifficulty = e.target.value;
  renderProblems(currentCategory);
});

// Theme toggle
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  const icon = document.querySelector(".theme-icon");
  icon.textContent = newTheme === "dark" ? "🌙" : "☀️";
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
  const icon = document.querySelector(".theme-icon");
  if (icon) icon.textContent = savedTheme === "dark" ? "🌙" : "☀️";
}

// Daily challenge date
const dailyDate = document.getElementById("dailyDate");
if (dailyDate) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  dailyDate.textContent = new Date().toLocaleDateString('en-US', options);
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderProblems("all");
  updateProgress();

  document.getElementById("modalClose").addEventListener("click", closeModal);

  document.getElementById("problemModal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("problemModal")) {
      closeModal();
    }
  });

  document.getElementById("modalCopyStatement").addEventListener("click", () => {
    const statement = document.getElementById("modalStatement").textContent;
    navigator.clipboard.writeText(statement).then(() => {
      const btn = document.getElementById("modalCopyStatement");
      const original = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => btn.textContent = original, 1500);
    });
  });

  document.getElementById("modalMarkSolved").addEventListener("click", () => {
    toggleSolved(currentProblemId);
    const solvedBtn = document.getElementById("modalMarkSolved");
    const alreadySolved = isProblemSolved(currentProblemId);
    solvedBtn.textContent = alreadySolved ? "Mark as Unsolved ↻" : "Mark as Solved ✓";
    solvedBtn.className = alreadySolved ? "btn btn-outline" : "btn btn-primary";
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });
});

function startDailyChallenge() {
  const dailyProblem = problems.find(p => p.title === 'Reverse a Number');
  if (dailyProblem) {
    openProblemModal(dailyProblem);
  }
}
