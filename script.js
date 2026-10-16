// ========================================
const BACKEND_URL = 'https://cpp-backend-ahmadnawaz66113.replit.app';
// PROBLEMS DATA - 1200 Problems (12 sections × 100)
// ========================================

const problems = [];

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

// 1. INPUT & OUTPUT
generateProblems('io', 'Input & Output', 100, 1, [
  { title: 'Hello World', difficulty: 'Easy', statement: 'Write a C++ program that prints "Hello, World!" to the console.', input: 'None', output: 'Hello, World!' },
  { title: 'Add Two Numbers', difficulty: 'Easy', statement: 'Read two integers and print their sum.', input: '5 3', output: '8' },
  { title: 'Area of a Circle {n}', difficulty: 'Easy', statement: 'Read radius and print area (PI = 3.14159).', input: '5', output: '78.53975' },
  { title: 'Simple Interest {n}', difficulty: 'Easy', statement: 'Read P, R, T. Print simple interest.', input: '1000 5 2', output: '100' },
  { title: 'Swap Two Numbers {n}', difficulty: 'Easy', statement: 'Read two integers and swap them.', input: '10 20', output: '20 10' },
  { title: 'ASCII Value {n}', difficulty: 'Easy', statement: 'Read a character and print its ASCII value.', input: 'A', output: '65' },
  { title: 'Celsius to Fahrenheit {n}', difficulty: 'Easy', statement: 'Convert Celsius to Fahrenheit.', input: '0', output: '32' },
  { title: 'Even or Odd {n}', difficulty: 'Easy', statement: 'Read integer and print Even or Odd.', input: '7', output: 'Odd' },
  { title: 'Calculate Percentage {n}', difficulty: 'Easy', statement: 'Read marks out of 100 and print percentage.', input: '85', output: '85' },
  { title: 'Size of Data Types {n}', difficulty: 'Easy', statement: 'Print sizes of int, char, float, double.', input: 'None', output: 'int: 4\nchar: 1\nfloat: 4\ndouble: 8' },
  { title: 'Multiply Two Numbers {n}', difficulty: 'Easy', statement: 'Read two integers and print product.', input: '6 7', output: '42' },
  { title: 'Divide Two Numbers {n}', difficulty: 'Easy', statement: 'Read two integers and print quotient/remainder.', input: '17 5', output: '3 2' },
  { title: 'Average of Three Numbers {n}', difficulty: 'Easy', statement: 'Read three numbers and print average.', input: '10 20 30', output: '20' },
  { title: 'Convert Days to Years {n}', difficulty: 'Easy', statement: 'Read total days and convert to years/weeks/days.', input: '400', output: '1 year, 1 week, 3 days' },
  { title: 'Read and Print String {n}', difficulty: 'Easy', statement: 'Read a string with spaces and print it back.', input: 'Hello C++', output: 'Hello C++' },
  { title: 'Character Input Output {n}', difficulty: 'Easy', statement: 'Read char using cin.get() and print.', input: 'Z', output: 'Z' },
  { title: 'Formatted Output {n}', difficulty: 'Easy', statement: 'Print float with 2 decimal places.', input: '3.14159', output: '3.14' },
  { title: 'Multiple Inputs {n}', difficulty: 'Easy', statement: 'Read int, float, char in one line.', input: '5 3.14 A', output: '5 3.14 A' },
  { title: 'Boolean Input Output {n}', difficulty: 'Easy', statement: 'Read boolean and print true/false.', input: '1', output: 'true' },
  { title: 'Input Validation {n}', difficulty: 'Medium', statement: 'Read integer until positive entered.', input: '-5\n10', output: '10' },
]);

// 2. VARIABLES & DATA TYPES
generateProblems('variables', 'Variables & Data Types', 100, 101, [
  { title: 'Declare Variables {n}', difficulty: 'Easy', statement: 'Declare int, float, double, char, bool, string and print.', input: 'None', output: 'Values printed' },
  { title: 'Variable Naming Rules {n}', difficulty: 'Easy', statement: 'Demonstrate valid/invalid variable names.', input: 'None', output: 'Valid names shown' },
  { title: 'Constants in C++ {n}', difficulty: 'Easy', statement: 'Use const and try to modify.', input: 'None', output: 'Compile error' },
  { title: 'Integer Types {n}', difficulty: 'Easy', statement: 'Use short, int, long, long long.', input: 'None', output: 'Ranges printed' },
  { title: 'Floating Point Types {n}', difficulty: 'Easy', statement: 'Compare float and double.', input: 'None', output: 'Precision compared' },
  { title: 'Char Type {n}', difficulty: 'Easy', statement: 'Store char and print ASCII.', input: 'B', output: '66' },
  { title: 'Boolean Type {n}', difficulty: 'Easy', statement: 'Store true/false in bool.', input: 'true', output: '1' },
  { title: 'String Type {n}', difficulty: 'Easy', statement: 'Use std::string and print length.', input: 'Hello World', output: '11' },
  { title: 'Type Conversion {n}', difficulty: 'Medium', statement: 'Convert int to double.', input: '5', output: '5.0' },
  { title: 'Type Casting {n}', difficulty: 'Medium', statement: 'Use static_cast.', input: '10', output: '10.0' },
  { title: 'Auto Keyword {n}', difficulty: 'Medium', statement: 'Use auto type deduction.', input: 'None', output: 'Type deduced' },
  { title: 'Enumeration {n}', difficulty: 'Medium', statement: 'Create enum for days.', input: 'None', output: 'Days printed' },
  { title: 'Struct Basics {n}', difficulty: 'Medium', statement: 'Create Student struct.', input: 'None', output: 'Student data' },
  { title: 'Union Basics {n}', difficulty: 'Medium', statement: 'Demonstrate union.', input: 'None', output: 'Shared memory' },
  { title: 'Typedef {n}', difficulty: 'Medium', statement: 'Create alias for unsigned int.', input: 'None', output: 'Alias created' },
]);

// 3. OPERATORS & EXPRESSIONS
generateProblems('operators', 'Operators & Expressions', 100, 201, [
  { title: 'Arithmetic Operators {n}', difficulty: 'Easy', statement: 'Demonstrate +, -, *, /, %.', input: '10 3', output: '13 7 30 3 1' },
  { title: 'Relational Operators {n}', difficulty: 'Easy', statement: 'Compare using ==, !=, <, >, <=, >=.', input: '5 10', output: '0 1 1 0 1 0' },
  { title: 'Logical Operators {n}', difficulty: 'Easy', statement: 'Demonstrate &&, ||, !.', input: '1 0', output: '0 1 0' },
  { title: 'Assignment Operators {n}', difficulty: 'Easy', statement: 'Use =, +=, -=, *=, /.', input: '5', output: '5 10 5 50 10' },
  { title: 'Increment Decrement {n}', difficulty: 'Easy', statement: 'Pre/post increment.', input: '5', output: '6 5' },
  { title: 'Bitwise Operators {n}', difficulty: 'Medium', statement: 'Demonstrate &, |, ^, ~, <<, >>.', input: '5 3', output: '1 7 6 -6 40 1' },
  { title: 'Ternary Operator {n}', difficulty: 'Easy', statement: 'Find larger of two numbers.', input: '7 12', output: '12' },
  { title: 'Operator Precedence {n}', difficulty: 'Medium', statement: 'Show precedence rules.', input: 'None', output: 'Based on precedence' },
  { title: 'Comma Operator {n}', difficulty: 'Medium', statement: 'Demonstrate comma in loop.', input: 'None', output: 'Final value' },
  { title: 'sizeof Operator {n}', difficulty: 'Easy', statement: 'Print sizes using sizeof.', input: 'None', output: 'int: 4\nchar: 1' },
]);

// 4. CONDITIONS
generateProblems('conditionals', 'Conditions & Decision Making', 100, 301, [
  { title: 'If Statement {n}', difficulty: 'Easy', statement: 'Check if number is positive.', input: '5', output: 'Positive' },
  { title: 'If Else Statement {n}', difficulty: 'Easy', statement: 'Check even or odd.', input: '4', output: 'Even' },
  { title: 'Else If Ladder {n}', difficulty: 'Easy', statement: 'Grade score (A-F).', input: '85', output: 'A' },
  { title: 'Nested If {n}', difficulty: 'Medium', statement: 'Check divisible by 5 and 7.', input: '35', output: 'Divisible by both' },
  { title: 'Switch Statement {n}', difficulty: 'Easy', statement: 'Print day name 1-7.', input: '3', output: 'Wednesday' },
  { title: 'Switch Default {n}', difficulty: 'Easy', statement: 'Switch with default case.', input: '9', output: 'Invalid day' },
  { title: 'Leap Year {n}', difficulty: 'Medium', statement: 'Check leap year.', input: '2024', output: 'Leap Year' },
  { title: 'Range Check {n}', difficulty: 'Easy', statement: 'Check between 10 and 100.', input: '50', output: 'In range' },
  { title: 'Menu Driven {n}', difficulty: 'Medium', statement: 'Menu-driven calculator.', input: '1\n5 3', output: '8' },
  { title: 'Vowel or Consonant {n}', difficulty: 'Easy', statement: 'Check vowel or consonant.', input: 'a', output: 'Vowel' },
]);

// 5. LOOPS
generateProblems('loops', 'Loops & Repetition', 100, 401, [
  { title: 'For Loop 1 to N {n}', difficulty: 'Easy', statement: 'Print 1 to N.', input: '5', output: '1 2 3 4 5' },
  { title: 'While Loop {n}', difficulty: 'Easy', statement: 'Print N to 1.', input: '5', output: '5 4 3 2 1' },
  { title: 'Do While Loop {n}', difficulty: 'Easy', statement: 'Menu until exit.', input: 'None', output: 'Menu printed' },
  { title: 'Nested Loops {n}', difficulty: 'Medium', statement: 'Multiplication table.', input: '5', output: '5x1=5\n5x2=10...' },
  { title: 'Break Statement {n}', difficulty: 'Easy', statement: 'Exit loop on condition.', input: 'None', output: 'Loop exited' },
  { title: 'Continue Statement {n}', difficulty: 'Easy', statement: 'Skip even numbers.', input: 'None', output: 'Odd numbers only' },
  { title: 'Sum of Digits {n}', difficulty: 'Easy', statement: 'Sum digits using loop.', input: '123', output: '6' },
  { title: 'Reverse Number {n}', difficulty: 'Easy', statement: 'Reverse digits.', input: '1234', output: '4321' },
  { title: 'Prime Check {n}', difficulty: 'Medium', statement: 'Check prime.', input: '17', output: 'Prime' },
  { title: 'Fibonacci Series {n}', difficulty: 'Medium', statement: 'First N Fibonacci.', input: '6', output: '0 1 1 2 3 5' },
  { title: 'Factorial {n}', difficulty: 'Easy', statement: 'Calculate factorial.', input: '5', output: '120' },
  { title: 'Armstrong Number {n}', difficulty: 'Medium', statement: 'Check Armstrong.', input: '153', output: 'Armstrong' },
  { title: 'Palindrome Number {n}', difficulty: 'Medium', statement: 'Check palindrome.', input: '121', output: 'Palindrome' },
  { title: 'Right Triangle Star {n}', difficulty: 'Medium', statement: 'Right triangle stars.', input: '4', output: '*\n**\n***\n****' },
  { title: 'Pyramid Star {n}', difficulty: 'Medium', statement: 'Pyramid stars.', input: '3', output: '  *\n ***\n*****' },
  { title: 'Diamond Star {n}', difficulty: 'Medium', statement: 'Diamond stars.', input: '3', output: '  *\n ***\n*****\n ***\n  *' },
  { title: 'Number Pattern {n}', difficulty: 'Medium', statement: 'Number pattern.', input: '4', output: '1\n12\n123\n1234' },
  { title: 'Hollow Square {n}', difficulty: 'Medium', statement: 'Hollow square.', input: '4', output: '****\n*  *\n*  *\n****' },
  { title: 'GCD {n}', difficulty: 'Medium', statement: 'GCD using loop.', input: '12 18', output: '6' },
  { title: 'LCM {n}', difficulty: 'Medium', statement: 'LCM using loop.', input: '4 6', output: '12' },
]);

// 6. FUNCTIONS
generateProblems('functions', 'Functions', 100, 501, [
  { title: 'Function Declaration {n}', difficulty: 'Easy', statement: 'Declare and define function.', input: 'None', output: 'Message printed' },
  { title: 'Function with Parameters {n}', difficulty: 'Easy', statement: 'Function with two ints.', input: '5 3', output: '8' },
  { title: 'Return Value {n}', difficulty: 'Easy', statement: 'Return max of two numbers.', input: '7 12', output: '12' },
  { title: 'Pass by Value {n}', difficulty: 'Easy', statement: 'Pass by value swap.', input: '5 10', output: 'Original unchanged' },
  { title: 'Pass by Reference {n}', difficulty: 'Medium', statement: 'Pass by reference swap.', input: '5 10', output: '10 5' },
  { title: 'Default Arguments {n}', difficulty: 'Medium', statement: 'Function with defaults.', input: '5', output: 'Result with default' },
  { title: 'Function Overloading {n}', difficulty: 'Medium', statement: 'Overload area calculation.', input: 'None', output: 'Areas printed' },
  { title: 'Inline Function {n}', difficulty: 'Medium', statement: 'Inline function.', input: 'None', output: 'Result printed' },
  { title: 'Recursive Function {n}', difficulty: 'Hard', statement: 'Recursive factorial.', input: '5', output: '120' },
  { title: 'Recursive Fibonacci {n}', difficulty: 'Hard', statement: 'Recursive Fibonacci.', input: '6', output: '8' },
  { title: 'Scope of Variables {n}', difficulty: 'Medium', statement: 'Local and global scope.', input: 'None', output: 'Scope shown' },
  { title: 'Static Variables {n}', difficulty: 'Medium', statement: 'Static variable.', input: 'None', output: 'Value persists' },
  { title: 'Function Pointers {n}', difficulty: 'Hard', statement: 'Function pointer call.', input: 'None', output: 'Function called' },
]);

// 7. ARRAYS
generateProblems('arrays', 'Arrays', 100, 601, [
  { title: 'Array Declaration {n}', difficulty: 'Easy', statement: 'Declare array of 5 integers.', input: 'None', output: 'Array declared' },
  { title: 'Array Input Output {n}', difficulty: 'Easy', statement: 'Read N integers and print.', input: '3\n1 2 3', output: '1 2 3' },
  { title: 'Array Traversal {n}', difficulty: 'Easy', statement: 'Traverse and print.', input: 'None', output: 'Elements printed' },
  { title: 'Find Maximum {n}', difficulty: 'Easy', statement: 'Find max value.', input: '5\n3 7 2 9 1', output: '9' },
  { title: 'Find Minimum {n}', difficulty: 'Easy', statement: 'Find min value.', input: '5\n3 7 2 9 1', output: '1' },
  { title: 'Array Sum {n}', difficulty: 'Easy', statement: 'Sum array elements.', input: '3\n1 2 3', output: '6' },
  { title: 'Array Average {n}', difficulty: 'Easy', statement: 'Array average.', input: '3\n1 2 3', output: '2' },
  { title: 'Linear Search {n}', difficulty: 'Easy', statement: 'Search element index.', input: '5\n10 20 30 40 50\n30', output: '2' },
  { title: 'Reverse Array {n}', difficulty: 'Easy', statement: 'Reverse array.', input: '4\n1 2 3 4', output: '4 3 2 1' },
  { title: 'Count Even Odd {n}', difficulty: 'Easy', statement: 'Count even/odd.', input: '5\n1 2 3 4 5', output: 'Even: 2, Odd: 3' },
  { title: 'Remove Duplicates {n}', difficulty: 'Medium', statement: 'Remove duplicates.', input: '5\n1 2 2 3 3', output: '1 2 3' },
  { title: 'Rotate Array {n}', difficulty: 'Medium', statement: 'Rotate by K positions.', input: '5\n1 2 3 4 5\n2', output: '3 4 5 1 2' },
  { title: 'Second Largest {n}', difficulty: 'Medium', statement: 'Second largest element.', input: '5\n10 20 30 40 50', output: '40' },
  { title: 'Pair Sum {n}', difficulty: 'Medium', statement: 'Pairs summing to target.', input: '5\n1 2 3 4 5\n5', output: '(1,4) (2,3)' },
  { title: 'Bubble Sort {n}', difficulty: 'Medium', statement: 'Bubble sort.', input: '4\n4 3 2 1', output: '1 2 3 4' },
  { title: 'Selection Sort {n}', difficulty: 'Medium', statement: 'Selection sort.', input: '4\n4 3 2 1', output: '1 2 3 4' },
  { title: 'Insertion Sort {n}', difficulty: 'Medium', statement: 'Insertion sort.', input: '4\n4 3 2 1', output: '1 2 3 4' },
  { title: '2D Array Input Output {n}', difficulty: 'Medium', statement: 'Read/print 2D array.', input: '2 2\n1 2\n3 4', output: '1 2\n3 4' },
  { title: 'Matrix Addition {n}', difficulty: 'Medium', statement: 'Matrix addition.', input: '2 2\n1 2\n3 4\n5 6\n7 8', output: '6 8\n10 12' },
  { title: 'Matrix Multiplication {n}', difficulty: 'Hard', statement: 'Matrix multiplication.', input: '2 2\n1 2\n3 4\n5 6\n7 8', output: '19 22\n43 50' },
  { title: 'Matrix Transpose {n}', difficulty: 'Medium', statement: 'Matrix transpose.', input: '2 2\n1 2\n3 4', output: '1 3\n2 4' },
]);

// 8. STRINGS
generateProblems('strings', 'Strings', 100, 701, [
  { title: 'String Declaration {n}', difficulty: 'Easy', statement: 'Declare std::string.', input: 'None', output: 'String printed' },
  { title: 'String Input with Spaces {n}', difficulty: 'Easy', statement: 'Read full line with getline.', input: 'Hello C++', output: 'Hello C++' },
  { title: 'String Length {n}', difficulty: 'Easy', statement: 'Length without built-in.', input: 'hello', output: '5' },
  { title: 'String Reverse {n}', difficulty: 'Easy', statement: 'Reverse string.', input: 'hello', output: 'olleh' },
  { title: 'String Palindrome {n}', difficulty: 'Easy', statement: 'Check palindrome.', input: 'madam', output: 'Palindrome' },
  { title: 'String Concatenation {n}', difficulty: 'Easy', statement: 'Concatenate with +.', input: 'Hello World', output: 'HelloWorld' },
  { title: 'String Comparison {n}', difficulty: 'Easy', statement: 'Compare lexicographically.', input: 'abc abd', output: 'abc < abd' },
  { title: 'Count Vowels {n}', difficulty: 'Easy', statement: 'Count vowels.', input: 'hello', output: '2' },
  { title: 'Count Words {n}', difficulty: 'Easy', statement: 'Count words.', input: 'Hello World C++', output: '3' },
  { title: 'Substring {n}', difficulty: 'Medium', statement: 'Extract substring.', input: 'Hello World 0 5', output: 'Hello' },
  { title: 'String to Uppercase {n}', difficulty: 'Easy', statement: 'Convert to uppercase.', input: 'hello', output: 'HELLO' },
  { title: 'String to Lowercase {n}', difficulty: 'Easy', statement: 'Convert to lowercase.', input: 'HELLO', output: 'hello' },
  { title: 'Anagram Check {n}', difficulty: 'Medium', statement: 'Check anagrams.', input: 'listen silent', output: 'Anagram' },
  { title: 'Remove Spaces {n}', difficulty: 'Medium', statement: 'Remove spaces.', input: 'Hello World', output: 'HelloWorld' },
  { title: 'Frequency of Characters {n}', difficulty: 'Medium', statement: 'Character frequency.', input: 'hello', output: 'h:1 e:1 l:2 o:1' },
]);

// 9. POINTERS & MEMORY
generateProblems('pointers', 'Pointers & Memory', 100, 801, [
  { title: 'Pointer Declaration {n}', difficulty: 'Easy', statement: 'Declare pointer and print address.', input: 'None', output: 'Address printed' },
  { title: 'Pointer Dereferencing {n}', difficulty: 'Easy', statement: 'Access/modify via pointer.', input: '10', output: '10' },
  { title: 'Pointer to Pointer {n}', difficulty: 'Medium', statement: 'Pointer to pointer.', input: 'None', output: 'Value via double pointer' },
  { title: 'Null Pointer {n}', difficulty: 'Easy', statement: 'Null pointer check.', input: 'None', output: 'Null check passed' },
  { title: 'Pointer Arithmetic {n}', difficulty: 'Medium', statement: 'Pointer arithmetic on array.', input: 'None', output: 'Address incremented' },
  { title: 'Pointer and Array {n}', difficulty: 'Medium', statement: 'Traverse array with pointer.', input: 'None', output: 'Elements via pointer' },
  { title: 'Pointer to Function {n}', difficulty: 'Hard', statement: 'Pointer to function.', input: 'None', output: 'Value modified' },
  { title: 'Dynamic Memory Allocation {n}', difficulty: 'Medium', statement: 'Use new for integer.', input: 'None', output: 'Memory allocated' },
  { title: 'Delete Memory {n}', difficulty: 'Medium', statement: 'Use delete.', input: 'None', output: 'Memory freed' },
  { title: 'Dynamic Array {n}', difficulty: 'Medium', statement: 'Dynamic array with new[].', input: 'None', output: 'Dynamic array created' },
  { title: 'Dangling Pointer {n}', difficulty: 'Hard', statement: 'Dangling pointer.', input: 'None', output: 'Dangling pointer shown' },
  { title: 'Smart Pointers {n}', difficulty: 'Hard', statement: 'unique_ptr and shared_ptr.', input: 'None', output: 'Smart pointers used' },
  { title: 'Reference vs Pointer {n}', difficulty: 'Medium', statement: 'Compare references/pointers.', input: 'None', output: 'Comparison shown' },
]);

// 10. OOP
generateProblems('oop', 'Object-Oriented Programming', 100, 901, [
  { title: 'Class and Object {n}', difficulty: 'Easy', statement: 'Create class with attributes.', input: 'None', output: 'Object created' },
  { title: 'Constructor {n}', difficulty: 'Easy', statement: 'Constructor initialization.', input: 'None', output: 'Constructor called' },
  { title: 'Destructor {n}', difficulty: 'Easy', statement: 'Destructor called.', input: 'None', output: 'Destructor called' },
  { title: 'Encapsulation {n}', difficulty: 'Medium', statement: 'Encapsulation with getters/setters.', input: 'None', output: 'Data encapsulated' },
  { title: 'Inheritance {n}', difficulty: 'Medium', statement: 'Base and derived class.', input: 'None', output: 'Inheritance shown' },
  { title: 'Multiple Inheritance {n}', difficulty: 'Hard', statement: 'Multiple inheritance.', input: 'None', output: 'Multiple inheritance' },
  { title: 'Multilevel Inheritance {n}', difficulty: 'Medium', statement: 'Multilevel inheritance.', input: 'None', output: 'Multilevel inheritance' },
  { title: 'Polymorphism {n}', difficulty: 'Medium', statement: 'Function overloading.', input: 'None', output: 'Overloaded functions' },
  { title: 'Virtual Functions {n}', difficulty: 'Hard', statement: 'Runtime polymorphism.', input: 'None', output: 'Runtime polymorphism' },
  { title: 'Abstract Class {n}', difficulty: 'Hard', statement: 'Abstract class.', input: 'None', output: 'Abstract class created' },
  { title: 'Operator Overloading {n}', difficulty: 'Hard', statement: 'Overload + operator.', input: 'None', output: 'Operator overloaded' },
  { title: 'Friend Function {n}', difficulty: 'Medium', statement: 'Friend function access.', input: 'None', output: 'Private accessed' },
  { title: 'Static Members {n}', difficulty: 'Medium', statement: 'Static members.', input: 'None', output: 'Static members used' },
  { title: 'This Pointer {n}', difficulty: 'Medium', statement: 'Use this pointer.', input: 'None', output: 'This pointer used' },
  { title: 'Composition {n}', difficulty: 'Medium', statement: 'Composition.', input: 'None', output: 'Composition shown' },
]);

// 11. STL
generateProblems('stl', 'Standard Template Library', 100, 1001, [
  { title: 'Vector Basics {n}', difficulty: 'Easy', statement: 'Use std::vector.', input: 'None', output: 'Vector printed' },
  { title: 'Vector Push Pop {n}', difficulty: 'Easy', statement: 'push_back and pop_back.', input: 'None', output: 'Push/pop done' },
  { title: 'Vector Size Capacity {n}', difficulty: 'Easy', statement: 'Size and capacity.', input: 'None', output: 'Size and capacity' },
  { title: 'List Basics {n}', difficulty: 'Medium', statement: 'Use std::list.', input: 'None', output: 'List traversed' },
  { title: 'Stack Basics {n}', difficulty: 'Medium', statement: 'Use std::stack.', input: 'None', output: 'Stack operations' },
  { title: 'Queue Basics {n}', difficulty: 'Medium', statement: 'Use std::queue.', input: 'None', output: 'Queue operations' },
  { title: 'Priority Queue {n}', difficulty: 'Medium', statement: 'Use std::priority_queue.', input: 'None', output: 'Largest element' },
  { title: 'Set Basics {n}', difficulty: 'Medium', statement: 'Use std::set.', input: 'None', output: 'Unique elements' },
  { title: 'Map Basics {n}', difficulty: 'Medium', statement: 'Use std::map.', input: 'None', output: 'Key-value pairs' },
  { title: 'Unordered Map {n}', difficulty: 'Medium', statement: 'Use std::unordered_map.', input: 'None', output: 'Fast lookup' },
  { title: 'Sort Algorithm {n}', difficulty: 'Medium', statement: 'Use std::sort.', input: 'None', output: 'Sorted vector' },
  { title: 'Binary Search {n}', difficulty: 'Medium', statement: 'Use std::binary_search.', input: 'None', output: 'Found/Not found' },
  { title: 'Reverse Algorithm {n}', difficulty: 'Easy', statement: 'Use std::reverse.', input: 'None', output: 'Reversed vector' },
  { title: 'Copy Algorithm {n}', difficulty: 'Easy', statement: 'Use std::copy.', input: 'None', output: 'Elements copied' },
  { title: 'Lambda Function {n}', difficulty: 'Medium', statement: 'Lambda with sort.', input: 'None', output: 'Custom sort done' },
]);

// 12. DSA
generateProblems('dsa', 'Data Structures & Algorithms', 100, 1101, [
  { title: 'Big O Notation {n}', difficulty: 'Easy', statement: 'Analyze time complexity.', input: 'None', output: 'O(n)' },
  { title: 'Linear Search {n}', difficulty: 'Easy', statement: 'Linear search.', input: '5\n1 2 3 4 5\n3', output: 'Found at index 2' },
  { title: 'Binary Search {n}', difficulty: 'Medium', statement: 'Binary search.', input: '5\n1 2 3 4 5\n3', output: 'Found at index 2' },
  { title: 'Linked List {n}', difficulty: 'Medium', statement: 'Singly linked list.', input: 'None', output: 'List created' },
  { title: 'Doubly Linked List {n}', difficulty: 'Medium', statement: 'Doubly linked list.', input: 'None', output: 'Doubly list created' },
  { title: 'Stack Using Array {n}', difficulty: 'Easy', statement: 'Stack using array.', input: 'None', output: 'Stack operations' },
  { title: 'Queue Using Array {n}', difficulty: 'Easy', statement: 'Queue using array.', input: 'None', output: 'Queue operations' },
  { title: 'Bubble Sort {n}', difficulty: 'Medium', statement: 'Bubble sort.', input: '4\n4 3 2 1', output: '1 2 3 4' },
  { title: 'Merge Sort {n}', difficulty: 'Hard', statement: 'Merge sort.', input: '4\n4 3 2 1', output: '1 2 3 4' },
  { title: 'Quick Sort {n}', difficulty: 'Hard', statement: 'Quick sort.', input: '4\n4 3 2 1', output: '1 2 3 4' },
  { title: 'Recursion Basics {n}', difficulty: 'Easy', statement: 'Recursive N to 1.', input: '5', output: '5 4 3 2 1' },
  { title: 'Tower of Hanoi {n}', difficulty: 'Hard', statement: 'Tower of Hanoi.', input: '3', output: 'Moves printed' },
  { title: 'BFS Graph {n}', difficulty: 'Hard', statement: 'BFS on graph.', input: 'None', output: 'BFS traversal' },
  { title: 'DFS Graph {n}', difficulty: 'Hard', statement: 'DFS on graph.', input: 'None', output: 'DFS traversal' },
  { title: 'Dijkstra Algorithm {n}', difficulty: 'Hard', statement: 'Dijkstra shortest path.', input: 'None', output: 'Shortest path' },
  { title: 'Dynamic Programming {n}', difficulty: 'Hard', statement: 'DP memoization.', input: 'None', output: 'DP result' },
  { title: 'Knapsack Problem {n}', difficulty: 'Hard', statement: '0/1 knapsack DP.', input: 'None', output: 'Max value' },
]);

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

function getDifficultyBadge(difficulty) {
  const map = { Easy: "badge-easy", Medium: "badge-medium", Hard: "badge-hard" };
  return map[difficulty] || "badge-easy";
}

function getSolvedProblems() {
  const saved = localStorage.getItem('cpp-solved-problems');
  return saved ? JSON.parse(saved) : [];
}

function isProblemSolved(id) {
  return getSolvedProblems().includes(id);
}

function toggleSolved(id) {
  const solved = getSolvedProblems();
  if (solved.includes(id)) solved.splice(solved.indexOf(id), 1);
  else solved.push(id);
  localStorage.setItem('cpp-solved-problems', JSON.stringify(solved));
  updateProgress();
  renderProblems(currentCategory);
}

let currentCategory = 'all';
let currentSearch = '';
let currentDifficulty = 'all';
let editor = null;
let monacoLoaded = false;

// Initialize Monaco Editor
function initMonaco() {
  if (monacoLoaded) return;
  monacoLoaded = true;
  require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.46.0/min/vs' } });
  require(['vs/editor/editor.main'], function (monaco) {
    editor = monaco.editor.create(document.getElementById('editor'), {
      value: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}',
      language: 'cpp',
      theme: 'vs-dark',
      automaticLayout: true,
      fontSize: 14,
      lineNumbers: true,
      minimap: { enabled: true },
      wordWrap: 'on',
    });
  });
}

// Render problems
function renderProblems(category = 'all') {
  currentCategory = category;
  const grid = document.getElementById("problemsGrid");
  const countEl = document.getElementById("problemsCount");
  grid.innerHTML = "";

  const solved = getSolvedProblems();
  const filtered = problems.filter(p => {
    const matchCat = category === 'all' || p.category === category;
    const matchSearch = p.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
                       p.statement.toLowerCase().includes(currentSearch.toLowerCase()) ||
                       p.id.toString().includes(currentSearch);
    const matchDiff = currentDifficulty === 'all' || p.difficulty === currentDifficulty;
    return matchCat && matchSearch && matchDiff;
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
    if (btn.dataset.category === category) btn.classList.add("active");
  });
  updateProgress();
}

function updateProgress() {
  const solved = getSolvedProblems();
  const total = problems.length;
  const pct = total ? Math.round((solved.length / total) * 100) : 0;
  document.getElementById('overallProgress').textContent = pct + '%';
  document.getElementById('solvedCount').textContent = solved.length;
  const easySolved = solved.filter(id => { const p = problems.find(x => x.id === id); return p && p.difficulty === 'Easy'; }).length;
  const mediumSolved = solved.filter(id => { const p = problems.find(x => x.id === id); return p && p.difficulty === 'Medium'; }).length;
  const hardSolved = solved.filter(id => { const p = problems.find(x => x.id === id); return p && p.difficulty === 'Hard'; }).length;
  document.getElementById('easyCount').textContent = easySolved;
  document.getElementById('mediumCount').textContent = mediumSolved;
  document.getElementById('hardCount').textContent = hardSolved;
  const fill = document.getElementById('progressFill');
  const circumference = 2 * Math.PI * 60;
  const offset = circumference - (pct / 100) * circumference;
  fill.style.strokeDasharray = circumference;
  fill.style.strokeDashoffset = offset;
}

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

  // Initialize Monaco editor on first modal open
  if (!editor) {
    initMonaco();
  }

  // Reset editor output
  document.getElementById("outputText").textContent = "";
  document.getElementById("editorOutput").style.display = "none";

  const modal = document.getElementById("problemModal");
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("problemModal").classList.remove("open");
  document.body.style.overflow = "";
}

// Run code via Judge0 API with fallback
async function runCode() {
  if (!editor) {
    alert("Editor still loading, please wait...");
    return;
  }

  const code = editor.getValue();
  const outputEl = document.getElementById("outputText");
  const outputContainer = document.getElementById("editorOutput");

  // Show loading
  outputEl.textContent = "Compiling & Running...";
  outputContainer.style.display = "block";
  outputEl.style.color = "#10b981";

  try {
    // Try Judge0 API (free C++ compiler)
    const response = await fetch('https://ce-api.judge0.com/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: code,
        language_id: 54, // C++ (G++)
        stdin: "", // No input for now
      }),
    });

    if (!response.ok) throw new Error("API error");

    const data = await response.json();
    const token = data.token;

    // Wait for result
    let result = null;
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const res = await fetch(`https://ce-api.judge0.com/submissions/${token}?base64_encoded=false`);
      result = await res.json();
      if (result.status.id !== 1 && result.status.id !== 2) break; // 1=In Queue, 2=Processing
    }

    if (result.status.id === 3) { // Accepted
      outputEl.textContent = result.stdout || "Code executed successfully (no output).";
      outputEl.style.color = "#10b981";
    } else if (result.status.id === 4) { // Wrong Answer
      outputEl.textContent = result.stdout || "Code ran but output may be incorrect.";
      outputEl.style.color = "#f59e0b";
    } else if (result.status.id === 5 || result.status.id === 6 || result.status.id === 7) { // Time Limit, etc.
      outputEl.textContent = result.stderr || "Execution error or time limit exceeded.";
      outputEl.style.color = "#ef4444";
    } else if (result.status.id === 8 || result.status.id === 9 || result.status.id === 10 || result.status.id === 11 || result.status.id === 12 || result.status.id === 13) { // Compilation errors
      outputEl.textContent = result.stderr || "Compilation error.";
      outputEl.style.color = "#ef4444";
    } else {
      outputEl.textContent = result.stderr || result.stdout || "Unknown status.";
      outputEl.style.color = "#ef4444";
    }
  } catch (err) {
    console.error(err);
    // Fallback: Show message to use local IDE
    outputEl.textContent = `
⚠️ Online compiler is temporarily unavailable.
Please copy your code to your local IDE (VS Code, Code::Blocks, etc.) and run there.
Code copied to clipboard - paste it into your IDE.
    `;
    outputEl.style.color = "#f59e0b";

    // Auto-copy code to clipboard
    try {
      await navigator.clipboard.writeText(code);
      outputEl.textContent += "\n\n✅ Code copied to clipboard!";
    } catch (e) {
      console.log("Clipboard not available");
    }
  }
}

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => renderProblems(btn.dataset.category));
});

document.getElementById("problemSearch").addEventListener("input", (e) => {
  currentSearch = e.target.value;
  renderProblems(currentCategory);
});

document.getElementById("difficultyFilter").addEventListener("change", (e) => {
  currentDifficulty = e.target.value;
  renderProblems(currentCategory);
});

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  const icon = document.querySelector(".theme-icon");
  icon.textContent = newTheme === "dark" ? "🌙" : "☀️";
}

const savedTheme = localStorage.getItem("theme");
const isDark = savedTheme ? savedTheme === "dark" : true;
document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
localStorage.setItem("theme", isDark ? "dark" : "light");
const icon = document.querySelector(".theme-icon");
if (icon) icon.textContent = isDark ? "🌙" : "☀️";

const dailyDate = document.getElementById("dailyDate");
if (dailyDate) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  dailyDate.textContent = new Date().toLocaleDateString('en-US', options);
}

document.addEventListener("DOMContentLoaded", () => {
  renderProblems("all");
  updateProgress();
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("problemModal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("problemModal")) closeModal();
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
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  // Run button
  document.getElementById("btnRun").addEventListener("click", runCode);

  // Copy to local IDE button
  document.getElementById("btnCopyLocal").addEventListener("click", async () => {
    if (!editor) return;
    const code = editor.getValue();
    try {
      await navigator.clipboard.writeText(code);
      const btn = document.getElementById("btnCopyLocal");
      const original = btn.textContent;
      btn.textContent = "Copied to Clipboard!";
      setTimeout(() => btn.textContent = original, 2000);
    } catch (e) {
      alert("Copy not supported. Please copy manually from editor.");
    }
  });

  // Clear editor
  document.getElementById("btnClearEditor").addEventListener("click", () => {
    if (editor) {
      editor.setValue('#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}');
      document.getElementById("outputText").textContent = "";
      document.getElementById("editorOutput").style.display = "none";
    }
  });
});

function startDailyChallenge() {
  const dailyProblem = problems.find(p => p.title === 'Reverse a Number');
  if (dailyProblem) openProblemModal(dailyProblem);
}
