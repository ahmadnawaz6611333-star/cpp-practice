// ========================================
// BACKEND CONFIGURATION
// ========================================
const BACKEND_URL = 'http://localhost:3001';

// ========================================
// PROBLEMS DATA - 2000+ Problems (12 sections)
// Logical reasoning + Hard 1D Array problems included
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
      output: template.output || 'Print the required output as described.',
      hint: template.hint || 'Think step by step. Break the problem into smaller parts.'
    });
  }
}

// 1. INPUT & OUTPUT (170 problems)
generateProblems('io', 'Input & Output', 170, 1, [
  { title: 'Hello World', difficulty: 'Easy', statement: 'Write a C++ program that prints "Hello, World!" to the console.', input: 'None', output: 'Hello, World!', hint: 'Use #include <iostream> and std::cout to print text. Remember to add endl or \\n for a new line.' },
  { title: 'Add Two Numbers', difficulty: 'Easy', statement: 'Read two integers and print their sum.', input: '5 3', output: '8', hint: 'Declare two int variables, read them using cin, add them with +, and print the result using cout.' },
  { title: 'Area of a Circle {n}', difficulty: 'Easy', statement: 'Read radius and print area (PI = 3.14159).', input: '5', output: '78.53975', hint: 'Formula: Area = π × r². Use double for radius and area.' },
  { title: 'Simple Interest {n}', difficulty: 'Easy', statement: 'Read P, R, T. Print simple interest.', input: '1000 5 2', output: '100', hint: 'Formula: Simple Interest = (P × R × T) / 100.' },
  { title: 'Swap Two Numbers {n}', difficulty: 'Easy', statement: 'Read two integers and swap them.', input: '10 20', output: '20 10', hint: 'Use a temporary variable: temp = a; a = b; b = temp.' },
  { title: 'ASCII Value {n}', difficulty: 'Easy', statement: 'Read a character and print its ASCII value.', input: 'A', output: '65', hint: 'Read a char and cast it to int using static_cast<int>(ch).' },
  { title: 'Celsius to Fahrenheit {n}', difficulty: 'Easy', statement: 'Convert Celsius to Fahrenheit.', input: '0', output: '32', hint: 'Formula: F = (C × 9/5) + 32.' },
  { title: 'Even or Odd {n}', difficulty: 'Easy', statement: 'Read integer and print Even or Odd.', input: '7', output: 'Odd', hint: 'Use modulus operator %. If number % 2 == 0, it is Even; otherwise Odd.' },
  { title: 'Calculate Percentage {n}', difficulty: 'Easy', statement: 'Read marks out of 100 and print percentage.', input: '85', output: '85', hint: 'Percentage = (marks / total) × 100.' },
  { title: 'Size of Data Types {n}', difficulty: 'Easy', statement: 'Print sizes of int, char, float, double.', input: 'None', output: 'int: 4\\nchar: 1\\nfloat: 4\\ndouble: 8', hint: 'Use sizeof() operator on each data type.' },
  { title: 'Multiply Two Numbers {n}', difficulty: 'Easy', statement: 'Read two integers and print product.', input: '6 7', output: '42', hint: 'Use * operator to multiply two integers.' },
  { title: 'Divide Two Numbers {n}', difficulty: 'Easy', statement: 'Read two integers and print quotient/remainder.', input: '17 5', output: '3 2', hint: 'Use / for quotient and % for remainder.' },
  { title: 'Average of Three Numbers {n}', difficulty: 'Easy', statement: 'Read three numbers and print average.', input: '10 20 30', output: '20', hint: 'Average = (a + b + c) / 3.' },
  { title: 'Convert Days to Years {n}', difficulty: 'Easy', statement: 'Read total days and convert to years/weeks/days.', input: '400', output: '1 year, 1 week, 3 days', hint: 'Years = days / 365. Remaining = days % 365. Weeks = remaining / 7.' },
  { title: 'Read and Print String {n}', difficulty: 'Easy', statement: 'Read a string with spaces and print it back.', input: 'Hello C++', output: 'Hello C++', hint: 'Use std::string and getline(cin, str) to read full line.' },
  { title: 'Character Input Output {n}', difficulty: 'Easy', statement: 'Read char using cin.get() and print.', input: 'Z', output: 'Z', hint: 'Use char variable and cin.get() to read single character.' },
  { title: 'Formatted Output {n}', difficulty: 'Easy', statement: 'Print float with 2 decimal places.', input: '3.14159', output: '3.14', hint: 'Use #include <iomanip> and std::fixed with std::setprecision(2).' },
  { title: 'Multiple Inputs {n}', difficulty: 'Easy', statement: 'Read int, float, char in one line.', input: '5 3.14 A', output: '5 3.14 A', hint: 'Use cin >> intVar >> floatVar >> charVar.' },
  { title: 'Boolean Input Output {n}', difficulty: 'Easy', statement: 'Read boolean and print true/false.', input: '1', output: 'true', hint: 'Use bool variable. cin reads 0 as false and 1 as true.' },
  { title: 'Input Validation {n}', difficulty: 'Medium', statement: 'Read integer until positive entered.', input: '-5\\n10', output: '10', hint: 'Use while loop that continues as long as number <= 0.' },
  { title: 'Logical Reasoning - Number Pattern I/O {n}', difficulty: 'Medium', statement: 'Read N and print first N natural numbers with their squares.', input: '3', output: '1 1\\n2 4\\n3 9', hint: 'Loop from 1 to N. For each i, print i and i*i.' },
  { title: 'Logical Reasoning - Digit Sum {n}', difficulty: 'Medium', statement: 'Read a number and print sum of its digits.', input: '123', output: '6', hint: 'Use while loop: sum += n % 10; n /= 10;.' },
  { title: 'Logical Reasoning - Reverse Digits {n}', difficulty: 'Medium', statement: 'Read a number and print its digits in reverse.', input: '1234', output: '4321', hint: 'In loop: rev = rev * 10 + (n % 10); n /= 10;.' },
  { title: 'Logical Reasoning - Palindrome Check {n}', difficulty: 'Medium', statement: 'Check if number is palindrome.', input: '121', output: 'Palindrome', hint: 'Reverse the number and compare with original.' },
]);

// 2. VARIABLES & DATA TYPES (170 problems)
generateProblems('variables', 'Variables & Data Types', 170, 181, [
  { title: 'Declare Variables {n}', difficulty: 'Easy', statement: 'Declare int, float, double, char, bool, string and print.', input: 'None', output: 'Values printed', hint: 'Declare one variable of each type, assign values, and print with cout.' },
  { title: 'Variable Naming Rules {n}', difficulty: 'Easy', statement: 'Demonstrate valid/invalid variable names.', input: 'None', output: 'Valid names shown', hint: 'Valid names start with letter or underscore, contain alphanumeric/underscore.' },
  { title: 'Constants in C++ {n}', difficulty: 'Easy', statement: 'Use const and try to modify.', input: 'None', output: 'Compile error', hint: 'Use const before type to make read-only. Changing causes compile error.' },
  { title: 'Integer Types {n}', difficulty: 'Easy', statement: 'Use short, int, long, long long.', input: 'None', output: 'Ranges printed', hint: 'Declare variables of each type and print their values.' },
  { title: 'Floating Point Types {n}', difficulty: 'Easy', statement: 'Compare float and double.', input: 'None', output: 'Precision compared', hint: 'float ~6 digits, double ~15 digits. Store same value and print.' },
  { title: 'Char Type {n}', difficulty: 'Easy', statement: 'Store char and print ASCII.', input: 'B', output: '66', hint: 'Store char and cast to int for ASCII value.' },
  { title: 'Boolean Type {n}', difficulty: 'Easy', statement: 'Store true/false in bool.', input: 'true', output: '1', hint: 'bool prints 1 for true, 0 for false.' },
  { title: 'String Type {n}', difficulty: 'Easy', statement: 'Use std::string and print length.', input: 'Hello World', output: '11', hint: 'Use std::string and .length() member function.' },
  { title: 'Type Conversion {n}', difficulty: 'Medium', statement: 'Convert int to double.', input: '5', output: '5.0', hint: 'Assign int to double or use static_cast<double>().' },
  { title: 'Type Casting {n}', difficulty: 'Medium', statement: 'Use static_cast.', input: '10', output: '10.0', hint: 'Use static_cast<double>(intVar) for explicit conversion.' },
  { title: 'Auto Keyword {n}', difficulty: 'Medium', statement: 'Use auto type deduction.', input: 'None', output: 'Type deduced', hint: 'Use auto x = value; compiler deduces type.' },
  { title: 'Enumeration {n}', difficulty: 'Medium', statement: 'Create enum for days.', input: 'None', output: 'Days printed', hint: 'Use enum Day { Mon, Tue, ... }; print enum values.' },
  { title: 'Struct Basics {n}', difficulty: 'Medium', statement: 'Create Student struct.', input: 'None', output: 'Student data', hint: 'struct Student { string name; int roll; }; use dot operator.' },
  { title: 'Union Basics {n}', difficulty: 'Medium', statement: 'Demonstrate union.', input: 'None', output: 'Shared memory', hint: 'Union stores different types in same memory location.' },
  { title: 'Typedef {n}', difficulty: 'Medium', statement: 'Create alias for unsigned int.', input: 'None', output: 'Alias created', hint: 'typedef unsigned int uint; or using uint = unsigned int;.' },
  { title: 'Logical Reasoning - Type Sizes {n}', difficulty: 'Medium', statement: 'Print sizes of all fundamental types.', input: 'None', output: 'Sizes printed', hint: 'Use sizeof() for char, short, int, long, float, double, bool.' },
  { title: 'Logical Reasoning - Char Arithmetic {n}', difficulty: 'Medium', statement: 'Add two characters and print result as integer.', input: 'A B', output: '131', hint: 'Cast chars to int before adding: (int)ch1 + (int)ch2.' },
]);

// 3. OPERATORS & EXPRESSIONS (170 problems)
generateProblems('operators', 'Operators & Expressions', 170, 351, [
  { title: 'Arithmetic Operators {n}', difficulty: 'Easy', statement: 'Demonstrate +, -, *, /, %.', input: '10 3', output: '13 7 30 3 1', hint: 'Read two integers and print results of all arithmetic operators.' },
  { title: 'Relational Operators {n}', difficulty: 'Easy', statement: 'Compare using ==, !=, <, >, <=, >=.', input: '5 10', output: '0 1 1 0 1 0', hint: 'Print results of relational comparisons (1 for true, 0 for false).' },
  { title: 'Logical Operators {n}', difficulty: 'Easy', statement: 'Demonstrate &&, ||, !.', input: '1 0', output: '0 1 0', hint: 'Use logical AND, OR, NOT on boolean conditions.' },
  { title: 'Assignment Operators {n}', difficulty: 'Easy', statement: 'Use =, +=, -=, *=, /.', input: '5', output: '5 10 5 50 10', hint: 'Start with x=5, apply operators and print after each step.' },
  { title: 'Increment Decrement {n}', difficulty: 'Easy', statement: 'Pre/post increment.', input: '5', output: '6 5', hint: 'Show difference between ++x (pre) and x++ (post).' },
  { title: 'Bitwise Operators {n}', difficulty: 'Medium', statement: 'Demonstrate &, |, ^, ~, <<, >>.', input: '5 3', output: '1 7 6 -6 40 1', hint: 'Print results of bitwise AND, OR, XOR, NOT, shifts.' },
  { title: 'Ternary Operator {n}', difficulty: 'Easy', statement: 'Find larger of two numbers.', input: '7 12', output: '12', hint: 'Use condition ? val1 : val2 to pick larger.' },
  { title: 'Operator Precedence {n}', difficulty: 'Medium', statement: 'Show precedence rules.', input: 'None', output: 'Based on precedence', hint: 'Parentheses first, then */%, then +-, then relational, then logical.' },
  { title: 'Comma Operator {n}', difficulty: 'Medium', statement: 'Demonstrate comma in loop.', input: 'None', output: 'Final value', hint: 'Comma evaluates left to right, returns rightmost value.' },
  { title: 'sizeof Operator {n}', difficulty: 'Easy', statement: 'Print sizes using sizeof.', input: 'None', output: 'int: 4\\nchar: 1', hint: 'Use sizeof(variable) or sizeof(type) for bytes.' },
  { title: 'Logical Reasoning - Operator Mix {n}', difficulty: 'Medium', statement: 'Evaluate: a + b * c - d / e with given values.', input: '2 3 4 8 2', output: '12', hint: 'Follow precedence: multiplication/division before addition/subtraction.' },
  { title: 'Logical Reasoning - Bitwise Check {n}', difficulty: 'Medium', statement: 'Check if a number is power of 2 using bitwise.', input: '8', output: 'Yes', hint: 'Number n is power of 2 if (n & (n-1)) == 0 and n > 0.' },
]);

// 4. CONDITIONS & DECISION MAKING (170 problems)
generateProblems('conditionals', 'Conditions & Decision Making', 170, 521, [
  { title: 'If Statement {n}', difficulty: 'Easy', statement: 'Check if number is positive.', input: '5', output: 'Positive', hint: 'Use if (n > 0) to check and print.' },
  { title: 'If Else Statement {n}', difficulty: 'Easy', statement: 'Check even or odd.', input: '4', output: 'Even', hint: 'if (n % 2 == 0) print Even else print Odd.' },
  { title: 'Else If Ladder {n}', difficulty: 'Easy', statement: 'Grade score (A-F).', input: '85', output: 'A', hint: 'else-if ladder: >=90 A, >=80 B, >=70 C, >=60 D, else F.' },
  { title: 'Nested If {n}', difficulty: 'Medium', statement: 'Check divisible by 5 and 7.', input: '35', output: 'Divisible by both', hint: 'Outer if checks % 5, inner checks % 7.' },
  { title: 'Switch Statement {n}', difficulty: 'Easy', statement: 'Print day name 1-7.', input: '3', output: 'Wednesday', hint: 'switch on day number with cases 1-7.' },
  { title: 'Switch Default {n}', difficulty: 'Easy', statement: 'Switch with default case.', input: '9', output: 'Invalid day', hint: 'Include default case for invalid inputs.' },
  { title: 'Leap Year {n}', difficulty: 'Medium', statement: 'Check leap year.', input: '2024', output: 'Leap Year', hint: 'Divisible by 4 AND (not by 100 OR by 400).' },
  { title: 'Range Check {n}', difficulty: 'Easy', statement: 'Check between 10 and 100.', input: '50', output: 'In range', hint: 'if (n >= 10 && n <= 100).' },
  { title: 'Menu Driven {n}', difficulty: 'Medium', statement: 'Menu-driven calculator.', input: '1\\n5 3', output: '8', hint: 'switch on user choice inside loop.' },
  { title: 'Vowel or Consonant {n}', difficulty: 'Easy', statement: 'Check vowel or consonant.', input: 'a', output: 'Vowel', hint: 'Check if char is a,e,i,o,u (case insensitive).' },
  { title: 'Logical Reasoning - Max of Three {n}', difficulty: 'Medium', statement: 'Find maximum of three numbers.', input: '5 12 8', output: '12', hint: 'Use nested if or if-else-if to compare three values.' },
  { title: 'Logical Reasoning - Triangle Type {n}', difficulty: 'Medium', statement: 'Classify triangle: equilateral, isosceles, scalene.', input: '3 3 3', output: 'Equilateral', hint: 'Compare all three sides for equality.' },
  { title: 'Logical Reasoning - Quadratic Roots {n}', difficulty: 'Medium', statement: 'Find nature of roots using discriminant.', input: '1 -3 2', output: 'Real and distinct', hint: 'Discriminant D = b²-4ac. D>0 real distinct, D=0 equal, D<0 complex.' },
]);

// 5. LOOPS & REPETITION (170 problems)
generateProblems('loops', 'Loops & Repetition', 170, 691, [
  { title: 'For Loop 1 to N {n}', difficulty: 'Easy', statement: 'Print 1 to N.', input: '5', output: '1 2 3 4 5', hint: 'for (int i = 1; i <= n; i++) print i.' },
  { title: 'While Loop {n}', difficulty: 'Easy', statement: 'Print N to 1.', input: '5', output: '5 4 3 2 1', hint: 'while (n > 0) { print n; n--; }.' },
  { title: 'Do While Loop {n}', difficulty: 'Easy', statement: 'Menu until exit.', input: 'None', output: 'Menu printed', hint: 'do { ... } while (choice != exit).' },
  { title: 'Nested Loops {n}', difficulty: 'Medium', statement: 'Multiplication table.', input: '5', output: '5x1=5\\n5x2=10...', hint: 'Outer loop for table, inner for multiplier 1 to 10.' },
  { title: 'Break Statement {n}', difficulty: 'Easy', statement: 'Exit loop on condition.', input: 'None', output: 'Loop exited', hint: 'Use break inside loop when condition met.' },
  { title: 'Continue Statement {n}', difficulty: 'Easy', statement: 'Skip even numbers.', input: 'None', output: 'Odd numbers only', hint: 'Use continue when number is even.' },
  { title: 'Sum of Digits {n}', difficulty: 'Easy', statement: 'Sum digits using loop.', input: '123', output: '6', hint: 'while (n > 0): sum += n % 10; n /= 10;.' },
  { title: 'Reverse Number {n}', difficulty: 'Easy', statement: 'Reverse digits.', input: '1234', output: '4321', hint: 'rev = rev * 10 + (n % 10); n /= 10;.' },
  { title: 'Prime Check {n}', difficulty: 'Medium', statement: 'Check prime.', input: '17', output: 'Prime', hint: 'Check divisibility from 2 to sqrt(n).' },
  { title: 'Fibonacci Series {n}', difficulty: 'Medium', statement: 'First N Fibonacci.', input: '6', output: '0 1 1 2 3 5', hint: 'F(n) = F(n-1) + F(n-2), F(0)=0, F(1)=1. Use loop.' },
  { title: 'Factorial {n}', difficulty: 'Easy', statement: 'Calculate factorial.', input: '5', output: '120', hint: 'n! = 1 × 2 × ... × n. Loop from 1 to n.' },
  { title: 'Armstrong Number {n}', difficulty: 'Medium', statement: 'Check Armstrong.', input: '153', output: 'Armstrong', hint: 'Sum of digits^count equals number.' },
  { title: 'Palindrome Number {n}', difficulty: 'Medium', statement: 'Check palindrome.', input: '121', output: 'Palindrome', hint: 'Reverse and compare with original.' },
  { title: 'Right Triangle Star {n}', difficulty: 'Medium', statement: 'Right triangle stars.', input: '4', output: '*\\n**\\n***\\n****', hint: 'Outer loop rows 1 to n, inner prints i stars.' },
  { title: 'Pyramid Star {n}', difficulty: 'Medium', statement: 'Pyramid stars.', input: '3', output: '  *\\n ***\\n*****', hint: 'Spaces = n-i, stars = 2*i-1 for row i.' },
  { title: 'Diamond Star {n}', difficulty: 'Medium', statement: 'Diamond stars.', input: '3', output: '  *\\n ***\\n*****\\n ***\\n  *', hint: 'Upper pyramid + lower inverted pyramid.' },
  { title: 'Number Pattern {n}', difficulty: 'Medium', statement: 'Number pattern.', input: '4', output: '1\\n12\\n123\\n1234', hint: 'Outer loop rows, inner prints 1 to i.' },
  { title: 'Hollow Square {n}', difficulty: 'Medium', statement: 'Hollow square.', input: '4', output: '****\\n*  *\\n*  *\\n****', hint: 'Print * for border, space for inside.' },
  { title: 'GCD {n}', difficulty: 'Medium', statement: 'GCD using loop.', input: '12 18', output: '6', hint: 'Euclidean: while(b!=0){temp=b;b=a%b;a=temp;}' },
  { title: 'LCM {n}', difficulty: 'Medium', statement: 'LCM using loop.', input: '4 6', output: '12', hint: 'LCM = (a×b)/GCD(a,b).' },
  // HARD 1D ARRAY PROBLEMS IN LOOPS SECTION
  { title: 'Hard 1D Array - Max Subarray Sum {n}', difficulty: 'Hard', statement: 'Find maximum sum of contiguous subarray (Kadane).', input: '5\\n-2 1 -3 4 -1', output: '4', hint: 'Kadane: current = max(arr[i], current+arr[i]); best = max(best, current).' },
  { title: 'Hard 1D Array - Move Zeros {n}', difficulty: 'Hard', statement: 'Move all zeros to end maintaining order.', input: '5\\n0 1 0 3 12', output: '1 3 12 0 0', hint: 'Two pointers: place non-zero at index, fill rest with zeros.' },
  { title: 'Hard 1D Array - Product Except Self {n}', difficulty: 'Hard', statement: 'Product of array except self without division.', input: '4\\n1 2 3 4', output: '24 12 8 6', hint: 'Left product array and right product array, multiply them.' },
  { title: 'Hard 1D Array - Container With Water {n}', difficulty: 'Hard', statement: 'Max water container between lines.', input: '6\\n1 8 6 2 5 4', output: '49', hint: 'Two pointers: area = min(h[l],h[r]) × (r-l). Move smaller height.' },
  { title: 'Hard 1D Array - Trapping Rain Water {n}', difficulty: 'Hard', statement: 'Calculate trapped rain water.', input: '12\\n0 1 0 2 1 0 1 3 2 1 2 1', output: '6', hint: 'Precompute left max and right max, water += min(left,right)-height[i].' },
  { title: 'Hard 1D Array - Merge Intervals {n}', difficulty: 'Hard', statement: 'Merge overlapping intervals.', input: '4\\n1 3\\n2 6\\n8 10\\n15 18', output: '1 6\\n8 10\\n15 18', hint: 'Sort by start, merge if current.start <= last.end.' },
  { title: 'Hard 1D Array - Find Duplicate {n}', difficulty: 'Hard', statement: 'Find duplicate in array 1 to N.', input: '5\\n1 3 4 2 2', output: '2', hint: 'Floyd cycle detection or sum - expected sum.' },
  { title: 'Hard 1D Array - Missing Number {n}', difficulty: 'Hard', statement: 'Find missing number 0 to N.', input: '4\\n3 0 1', output: '2', hint: 'Expected sum - actual sum, or XOR all indices and values.' },
  { title: 'Hard 1D Array - Majority Element {n}', difficulty: 'Hard', statement: 'Element appearing > N/2 times.', input: '7\\n2 2 1 1 1 2 2', output: '2', hint: 'Boyer-Moore Voting Algorithm.' },
  { title: 'Hard 1D Array - Rotate Array {n}', difficulty: 'Hard', statement: 'Rotate array by K positions in-place.', input: '7\\n1 2 3 4 5 6 7\\n3', output: '5 6 7 1 2 3 4', hint: 'Reverse whole, reverse first K, reverse rest.' },
  { title: 'Hard 1D Array - Subarray Sum Equals K {n}', difficulty: 'Hard', statement: 'Count subarrays with sum K.', input: '5\\n1 1 1\\n2', output: '2', hint: 'Prefix sum with hash map counting occurrences.' },
  { title: 'Hard 1D Array - Longest Substring Without Repeat {n}', difficulty: 'Hard', statement: 'Longest substring without repeating chars.', input: 'None\\nabcabcbb', output: '3', hint: 'Sliding window with last seen index map.' },
  { title: 'Hard 1D Array - Two Sum {n}', difficulty: 'Hard', statement: 'Indices of two numbers adding to target.', input: '4\\n2 7 11 15\\n9', output: '0 1', hint: 'Hash map: store value->index, check complement.' },
  { title: 'Hard 1D Array - Three Sum {n}', difficulty: 'Hard', statement: 'Find all triplets summing to zero.', input: '6\\n-1 0 1 2 -1 -4', output: '-1 -1 2\\n-1 0 1', hint: 'Sort array, fix one element, two-pointer for rest.' },
  { title: 'Hard 1D Array - Next Permutation {n}', difficulty: 'Hard', statement: 'Next lexicographic permutation.', input: '4\\n1 2 3\\n', output: '1 3 2', hint: 'Find pivot, swap with next greater, reverse suffix.' },
  { title: 'Hard 1D Array - Candy Distribution {n}', difficulty: 'Hard', statement: 'Distribute candies by rating rules.', input: '5\\n1 0 2', output: '5', hint: 'Left-to-right then right-to-left pass, take max.' },
]);

// 6. FUNCTIONS (170 problems)
generateProblems('functions', 'Functions', 170, 861, [
  { title: 'Function Declaration {n}', difficulty: 'Easy', statement: 'Declare and define function.', input: 'None', output: 'Message printed', hint: 'Declare before main, define, call from main.' },
  { title: 'Function with Parameters {n}', difficulty: 'Easy', statement: 'Function with two ints.', input: '5 3', output: '8', hint: 'Function taking two parameters, add them.' },
  { title: 'Return Value {n}', difficulty: 'Easy', statement: 'Return max of two numbers.', input: '7 12', output: '12', hint: 'Use if inside function to return larger.' },
  { title: 'Pass by Value {n}', difficulty: 'Easy', statement: 'Pass by value swap.', input: '5 10', output: 'Original unchanged', hint: 'Pass by value does not affect originals.' },
  { title: 'Pass by Reference {n}', difficulty: 'Medium', statement: 'Pass by reference swap.', input: '5 10', output: '10 5', hint: 'Use int &a in parameters.' },
  { title: 'Default Arguments {n}', difficulty: 'Medium', statement: 'Function with defaults.', input: '5', output: 'Result with default', hint: 'int f(int x, int y = 10).' },
  { title: 'Function Overloading {n}', difficulty: 'Medium', statement: 'Overload area calculation.', input: 'None', output: 'Areas printed', hint: 'Same name, different parameters.' },
  { title: 'Inline Function {n}', difficulty: 'Medium', statement: 'Inline function.', input: 'None', output: 'Result printed', hint: 'Use inline keyword.' },
  { title: 'Recursive Function {n}', difficulty: 'Hard', statement: 'Recursive factorial.', input: '5', output: '120', hint: 'Base case n<=1 return 1, else n*fact(n-1).' },
  { title: 'Recursive Fibonacci {n}', difficulty: 'Hard', statement: 'Recursive Fibonacci.', input: '6', output: '8', hint: 'F(0)=0, F(1)=1, else fib(n-1)+fib(n-2).' },
  { title: 'Scope of Variables {n}', difficulty: 'Medium', statement: 'Local and global scope.', input: 'None', output: 'Scope shown', hint: 'Global accessible everywhere, local only in block.' },
  { title: 'Static Variables {n}', difficulty: 'Medium', statement: 'Static variable.', input: 'None', output: 'Value persists', hint: 'static inside function persists across calls.' },
  { title: 'Function Pointers {n}', difficulty: 'Hard', statement: 'Function pointer call.', input: 'None', output: 'Function called', hint: 'int (*fp)(int); assign and call.' },
  { title: 'Logical Reasoning - Recursive Sum {n}', difficulty: 'Medium', statement: 'Sum of 1 to N using recursion.', input: '5', output: '15', hint: 'Base case n==0 return 0, else n + sum(n-1).' },
  { title: 'Logical Reasoning - Power Using Recursion {n}', difficulty: 'Medium', statement: 'Calculate power using recursion.', input: '2 10', output: '1024', hint: 'Base case exp==0 return 1, else base * power(base, exp-1).' },
]);

// 7. ARRAYS (170 problems)
generateProblems('arrays', 'Arrays', 170, 1031, [
  { title: 'Array Declaration {n}', difficulty: 'Easy', statement: 'Declare array of 5 integers.', input: 'None', output: 'Array declared', hint: 'int arr[5];' },
  { title: 'Array Input Output {n}', difficulty: 'Easy', statement: 'Read N integers and print.', input: '3\\n1 2 3', output: '1 2 3', hint: 'Loop to read, loop to print.' },
  { title: 'Array Traversal {n}', difficulty: 'Easy', statement: 'Traverse and print.', input: 'None', output: 'Elements printed', hint: 'for (int i=0; i<n; i++) access arr[i].' },
  { title: 'Find Maximum {n}', difficulty: 'Easy', statement: 'Find max value.', input: '5\\n3 7 2 9 1', output: '9', hint: 'max = arr[0], update if arr[i] > max.' },
  { title: 'Find Minimum {n}', difficulty: 'Easy', statement: 'Find min value.', input: '5\\n3 7 2 9 1', output: '1', hint: 'min = arr[0], update if arr[i] < min.' },
  { title: 'Array Sum {n}', difficulty: 'Easy', statement: 'Sum array elements.', input: '3\\n1 2 3', output: '6', hint: 'sum = 0, add arr[i] in loop.' },
  { title: 'Array Average {n}', difficulty: 'Easy', statement: 'Array average.', input: '3\\n1 2 3', output: '2', hint: 'Sum / n. Use float for result.' },
  { title: 'Linear Search {n}', difficulty: 'Easy', statement: 'Search element index.', input: '5\\n10 20 30 40 50\\n30', output: '2', hint: 'Loop, if arr[i]==target return i.' },
  { title: 'Reverse Array {n}', difficulty: 'Easy', statement: 'Reverse array.', input: '4\\n1 2 3 4', output: '4 3 2 1', hint: 'Swap arr[i] with arr[n-1-i].' },
  { title: 'Count Even Odd {n}', difficulty: 'Easy', statement: 'Count even/odd.', input: '5\\n1 2 3 4 5', output: 'Even: 2, Odd: 3', hint: 'Check arr[i] % 2 == 0.' },
  { title: 'Remove Duplicates {n}', difficulty: 'Medium', statement: 'Remove duplicates.', input: '5\\n1 2 2 3 3', output: '1 2 3', hint: 'Nested loop or second array.' },
  { title: 'Rotate Array {n}', difficulty: 'Medium', statement: 'Rotate by K positions.', input: '5\\n1 2 3 4 5\\n2', output: '3 4 5 1 2', hint: 'Store first k, shift left, append.' },
  { title: 'Second Largest {n}', difficulty: 'Medium', statement: 'Second largest element.', input: '5\\n10 20 30 40 50', output: '40', hint: 'Track largest and second largest.' },
  { title: 'Pair Sum {n}', difficulty: 'Medium', statement: 'Pairs summing to target.', input: '5\\n1 2 3 4 5\\n5', output: '(1,4) (2,3)', hint: 'Nested loops for pairs i<j.' },
  { title: 'Bubble Sort {n}', difficulty: 'Medium', statement: 'Bubble sort.', input: '4\\n4 3 2 1', output: '1 2 3 4', hint: 'Swap adjacent if wrong order.' },
  { title: 'Selection Sort {n}', difficulty: 'Medium', statement: 'Selection sort.', input: '4\\n4 3 2 1', output: '1 2 3 4', hint: 'Find min, swap with first unsorted.' },
  { title: 'Insertion Sort {n}', difficulty: 'Medium', statement: 'Insertion sort.', input: '4\\n4 3 2 1', output: '1 2 3 4', hint: 'Insert each element in sorted left part.' },
  { title: '2D Array Input Output {n}', difficulty: 'Medium', statement: 'Read/print 2D array.', input: '2 2\\n1 2\\n3 4', output: '1 2\\n3 4', hint: 'Nested loops rows and columns.' },
  { title: 'Matrix Addition {n}', difficulty: 'Medium', statement: 'Matrix addition.', input: '2 2\\n1 2\\n3 4\\n5 6\\n7 8', output: '6 8\\n10 12', hint: 'result[i][j] = mat1[i][j] + mat2[i][j].' },
  { title: 'Matrix Multiplication {n}', difficulty: 'Hard', statement: 'Matrix multiplication.', input: '2 2\\n1 2\\n3 4\\n5 6\\n7 8', output: '19 22\\n43 50', hint: 'Three nested loops for multiplication.' },
  { title: 'Matrix Transpose {n}', difficulty: 'Medium', statement: 'Matrix transpose.', input: '2 2\\n1 2\\n3 4', output: '1 3\\n2 4', hint: 'transpose[j][i] = mat[i][j].' },
  { title: 'Logical Reasoning - Array Leader {n}', difficulty: 'Medium', statement: 'Print leaders (greater than all right).', input: '6\\n16 17 4 3 5 2', output: '17 5 2', hint: 'Traverse from right, track max from right.' },
  { title: 'Logical Reasoning - Equilibrium Index {n}', difficulty: 'Medium', statement: 'Index where left sum equals right sum.', input: '7\\n-7 1 5 2 -4 3 0', output: '3', hint: 'Total sum - left sum = right sum at index.' },
]);

// 8. STRINGS (170 problems)
generateProblems('strings', 'Strings', 170, 1201, [
  { title: 'String Declaration {n}', difficulty: 'Easy', statement: 'Declare std::string.', input: 'None', output: 'String printed', hint: '#include <string>, std::string name = "value".' },
  { title: 'String Input with Spaces {n}', difficulty: 'Easy', statement: 'Read full line with getline.', input: 'Hello C++', output: 'Hello C++', hint: 'std::getline(cin, str).' },
  { title: 'String Length {n}', difficulty: 'Easy', statement: 'Length without built-in.', input: 'hello', output: '5', hint: 'Loop until null terminator or use .size().' },
  { title: 'String Reverse {n}', difficulty: 'Easy', statement: 'Reverse string.', input: 'hello', output: 'olleh', hint: 'Swap str[i] with str[n-1-i].' },
  { title: 'String Palindrome {n}', difficulty: 'Easy', statement: 'Check palindrome.', input: 'madam', output: 'Palindrome', hint: 'Compare start and end characters.' },
  { title: 'String Concatenation {n}', difficulty: 'Easy', statement: 'Concatenate with +.', input: 'Hello World', output: 'HelloWorld', hint: 'str1 + str2 with std::string.' },
  { title: 'String Comparison {n}', difficulty: 'Easy', statement: 'Compare lexicographically.', input: 'abc abd', output: 'abc < abd', hint: 'strcmp() or == / < for std::string.' },
  { title: 'Count Vowels {n}', difficulty: 'Easy', statement: 'Count vowels.', input: 'hello', output: '2', hint: 'Check each char if a/e/i/o/u.' },
  { title: 'Count Words {n}', difficulty: 'Easy', statement: 'Count words.', input: 'Hello World C++', output: '3', hint: 'Count spaces + 1.' },
  { title: 'Substring {n}', difficulty: 'Medium', statement: 'Extract substring.', input: 'Hello World 0 5', output: 'Hello', hint: 'str.substr(start, length).' },
  { title: 'String to Uppercase {n}', difficulty: 'Easy', statement: 'Convert to uppercase.', input: 'hello', output: 'HELLO', hint: 'std::toupper() from <cctype>.' },
  { title: 'String to Lowercase {n}', difficulty: 'Easy', statement: 'Convert to lowercase.', input: 'HELLO', output: 'hello', hint: 'std::tolower() from <cctype>.' },
  { title: 'Anagram Check {n}', difficulty: 'Medium', statement: 'Check anagrams.', input: 'listen silent', output: 'Anagram', hint: 'Sort both strings or count frequency.' },
  { title: 'Remove Spaces {n}', difficulty: 'Medium', statement: 'Remove spaces.', input: 'Hello World', output: 'HelloWorld', hint: 'Copy non-space characters.' },
  { title: 'Frequency of Characters {n}', difficulty: 'Medium', statement: 'Character frequency.', input: 'hello', output: 'h:1 e:1 l:2 o:1', hint: 'Array of size 256 for ASCII count.' },
  { title: 'Logical Reasoning - Longest Palindrome {n}', difficulty: 'Medium', statement: 'Longest palindromic substring.', input: 'None\\nbabad', output: 'bab', hint: 'Expand around center for each character.' },
  { title: 'Logical Reasoning - String Compression {n}', difficulty: 'Medium', statement: 'Compress string with counts.', input: 'None\\naabcccccaaa', output: 'a2b1c5a3', hint: 'Count consecutive chars, append char+count.' },
]);

// 9. POINTERS & MEMORY (170 problems)
generateProblems('pointers', 'Pointers & Memory', 170, 1371, [
  { title: 'Pointer Declaration {n}', difficulty: 'Easy', statement: 'Declare pointer and print address.', input: 'None', output: 'Address printed', hint: 'int *ptr = &var; print ptr.' },
  { title: 'Pointer Dereferencing {n}', difficulty: 'Easy', statement: 'Access/modify via pointer.', input: '10', output: '10', hint: '*ptr accesses value at address.' },
  { title: 'Pointer to Pointer {n}', difficulty: 'Medium', statement: 'Pointer to pointer.', input: 'None', output: 'Value via double pointer', hint: 'int **ptr2 = &ptr; **ptr2 gives value.' },
  { title: 'Null Pointer {n}', difficulty: 'Easy', statement: 'Null pointer check.', input: 'None', output: 'Null check passed', hint: 'int *ptr = nullptr; check if (ptr == nullptr).' },
  { title: 'Pointer Arithmetic {n}', difficulty: 'Medium', statement: 'Pointer arithmetic on array.', input: 'None', output: 'Address incremented', hint: 'ptr++ moves by sizeof(type).' },
  { title: 'Pointer and Array {n}', difficulty: 'Medium', statement: 'Traverse array with pointer.', input: 'None', output: 'Elements via pointer', hint: 'ptr = arr; *(ptr + i).' },
  { title: 'Pointer to Function {n}', difficulty: 'Hard', statement: 'Pointer to function.', input: 'None', output: 'Value modified', hint: 'int (*fp)(int); assign and call.' },
  { title: 'Dynamic Memory Allocation {n}', difficulty: 'Medium', statement: 'Use new for integer.', input: 'None', output: 'Memory allocated', hint: 'int *ptr = new int; delete ptr;' },
  { title: 'Delete Memory {n}', difficulty: 'Medium', statement: 'Use delete.', input: 'None', output: 'Memory freed', hint: 'Pair new with delete.' },
  { title: 'Dynamic Array {n}', difficulty: 'Medium', statement: 'Dynamic array with new[].', input: 'None', output: 'Dynamic array created', hint: 'int *arr = new int[n]; delete[] arr;' },
  { title: 'Dangling Pointer {n}', difficulty: 'Hard', statement: 'Dangling pointer.', input: 'None', output: 'Dangling pointer shown', hint: 'Set pointer to nullptr after delete.' },
  { title: 'Smart Pointers {n}', difficulty: 'Hard', statement: 'unique_ptr and shared_ptr.', input: 'None', output: 'Smart pointers used', hint: '#include <memory>.' },
  { title: 'Reference vs Pointer {n}', difficulty: 'Medium', statement: 'Compare references/pointers.', input: 'None', output: 'Comparison shown', hint: 'References cannot be null/reassigned.' },
]);

// 10. OOP (170 problems)
generateProblems('oop', 'Object-Oriented Programming', 170, 1541, [
  { title: 'Class and Object {n}', difficulty: 'Easy', statement: 'Create class with attributes.', input: 'None', output: 'Object created', hint: 'class Name { public: data; }; object with dot.' },
  { title: 'Constructor {n}', difficulty: 'Easy', statement: 'Constructor initialization.', input: 'None', output: 'Constructor called', hint: 'Same name as class, no return type.' },
  { title: 'Destructor {n}', difficulty: 'Easy', statement: 'Destructor called.', input: 'None', output: 'Destructor called', hint: '~ClassName(), called on scope exit.' },
  { title: 'Encapsulation {n}', difficulty: 'Medium', statement: 'Encapsulation with getters/setters.', input: 'None', output: 'Data encapsulated', hint: 'Private data, public get/set methods.' },
  { title: 'Inheritance {n}', difficulty: 'Medium', statement: 'Base and derived class.', input: 'None', output: 'Inheritance shown', hint: 'class Derived : public Base;' },
  { title: 'Multiple Inheritance {n}', difficulty: 'Hard', statement: 'Multiple inheritance.', input: 'None', output: 'Multiple inheritance', hint: 'class C : public A, public B;' },
  { title: 'Multilevel Inheritance {n}', difficulty: 'Medium', statement: 'Multilevel inheritance.', input: 'None', output: 'Multilevel inheritance', hint: 'class C : public B; class B : public A;' },
  { title: 'Polymorphism {n}', difficulty: 'Medium', statement: 'Function overloading.', input: 'None', output: 'Overloaded functions', hint: 'Same name, different parameters.' },
  { title: 'Virtual Functions {n}', difficulty: 'Hard', statement: 'Runtime polymorphism.', input: 'None', output: 'Runtime polymorphism', hint: 'virtual in base, override in derived.' },
  { title: 'Abstract Class {n}', difficulty: 'Hard', statement: 'Abstract class.', input: 'None', output: 'Abstract class created', hint: 'virtual void func() = 0;' },
  { title: 'Operator Overloading {n}', difficulty: 'Hard', statement: 'Overload + operator.', input: 'None', output: 'Operator overloaded', hint: 'operator+ as member function.' },
  { title: 'Friend Function {n}', difficulty: 'Medium', statement: 'Friend function access.', input: 'None', output: 'Private accessed', hint: 'friend declaration inside class.' },
  { title: 'Static Members {n}', difficulty: 'Medium', statement: 'Static members.', input: 'None', output: 'Static members used', hint: 'Static belongs to class, define outside.' },
  { title: 'This Pointer {n}', difficulty: 'Medium', statement: 'Use this pointer.', input: 'None', output: 'This pointer used', hint: 'this points to current object.' },
  { title: 'Composition {n}', difficulty: 'Medium', statement: 'Composition.', input: 'None', output: 'Composition shown', hint: 'Class contains object of another class.' },
]);

// 11. STL (170 problems)
generateProblems('stl', 'Standard Template Library', 170, 1711, [
  { title: 'Vector Basics {n}', difficulty: 'Easy', statement: 'Use std::vector.', input: 'None', output: 'Vector printed', hint: '#include <vector>, vector<int> v;' },
  { title: 'Vector Push Pop {n}', difficulty: 'Easy', statement: 'push_back and pop_back.', input: 'None', output: 'Push/pop done', hint: 'push_back adds end, pop_back removes last.' },
  { title: 'Vector Size Capacity {n}', difficulty: 'Easy', statement: 'Size and capacity.', input: 'None', output: 'Size and capacity', hint: 'v.size() and v.capacity().' },
  { title: 'List Basics {n}', difficulty: 'Medium', statement: 'Use std::list.', input: 'None', output: 'List traversed', hint: '#include <list>.' },
  { title: 'Stack Basics {n}', difficulty: 'Medium', statement: 'Use std::stack.', input: 'None', output: 'Stack operations', hint: '#include <stack>, LIFO.' },
  { title: 'Queue Basics {n}', difficulty: 'Medium', statement: 'Use std::queue.', input: 'None', output: 'Queue operations', hint: '#include <queue>, FIFO.' },
  { title: 'Priority Queue {n}', difficulty: 'Medium', statement: 'Use std::priority_queue.', input: 'None', output: 'Largest element', hint: 'priority_queue top() gives largest.' },
  { title: 'Set Basics {n}', difficulty: 'Medium', statement: 'Use std::set.', input: 'None', output: 'Unique elements', hint: '#include <set>, unique sorted.' },
  { title: 'Map Basics {n}', difficulty: 'Medium', statement: 'Use std::map.', input: 'None', output: 'Key-value pairs', hint: '#include <map>.' },
  { title: 'Unordered Map {n}', difficulty: 'Medium', statement: 'Use std::unordered_map.', input: 'None', output: 'Fast lookup', hint: '#include <unordered_map>.' },
  { title: 'Sort Algorithm {n}', difficulty: 'Medium', statement: 'Use std::sort.', input: 'None', output: 'Sorted vector', hint: '#include <algorithm>, std::sort().' },
  { title: 'Binary Search {n}', difficulty: 'Medium', statement: 'Use std::binary_search.', input: 'None', output: 'Found/Not found', hint: 'Requires sorted range.' },
  { title: 'Reverse Algorithm {n}', difficulty: 'Easy', statement: 'Use std::reverse.', input: 'None', output: 'Reversed vector', hint: 'std::reverse(begin, end).' },
  { title: 'Copy Algorithm {n}', difficulty: 'Easy', statement: 'Use std::copy.', input: 'None', output: 'Elements copied', hint: 'std::copy().' },
  { title: 'Lambda Function {n}', difficulty: 'Medium', statement: 'Lambda with sort.', input: 'None', output: 'Custom sort done', hint: '[] (params) { body; }.' },
]);

// 12. DATA STRUCTURES & ALGORITHMS (170 problems)
generateProblems('dsa', 'Data Structures & Algorithms', 170, 1881, [
  { title: 'Big O Notation {n}', difficulty: 'Easy', statement: 'Analyze time complexity.', input: 'None', output: 'O(n)', hint: 'Count operations growing with n.' },
  { title: 'Linear Search {n}', difficulty: 'Easy', statement: 'Linear search.', input: '5\\n1 2 3 4 5\\n3', output: 'Found at index 2', hint: 'Check each element one by one.' },
  { title: 'Binary Search {n}', difficulty: 'Medium', statement: 'Binary search.', input: '5\\n1 2 3 4 5\\n3', output: 'Found at index 2', hint: 'Sorted array, discard half each step.' },
  { title: 'Linked List {n}', difficulty: 'Medium', statement: 'Singly linked list.', input: 'None', output: 'List created', hint: 'Node has data and next pointer.' },
  { title: 'Doubly Linked List {n}', difficulty: 'Medium', statement: 'Doubly linked list.', input: 'None', output: 'Doubly list created', hint: 'Node has next and prev.' },
  { title: 'Stack Using Array {n}', difficulty: 'Easy', statement: 'Stack using array.', input: 'None', output: 'Stack operations', hint: 'Array with top index.' },
  { title: 'Queue Using Array {n}', difficulty: 'Easy', statement: 'Queue using array.', input: 'None', output: 'Queue operations', hint: 'Front and rear indices.' },
  { title: 'Bubble Sort {n}', difficulty: 'Medium', statement: 'Bubble sort.', input: '4\\n4 3 2 1', output: '1 2 3 4', hint: 'Swap adjacent if wrong order.' },
  { title: 'Merge Sort {n}', difficulty: 'Hard', statement: 'Merge sort.', input: '4\\n4 3 2 1', output: '1 2 3 4', hint: 'Divide, sort recursively, merge.' },
  { title: 'Quick Sort {n}', difficulty: 'Hard', statement: 'Quick sort.', input: '4\\n4 3 2 1', output: '1 2 3 4', hint: 'Pivot, partition, recurse.' },
  { title: 'Recursion Basics {n}', difficulty: 'Easy', statement: 'Recursive N to 1.', input: '5', output: '5 4 3 2 1', hint: 'Print n, call with n-1 until 0.' },
  { title: 'Tower of Hanoi {n}', difficulty: 'Hard', statement: 'Tower of Hanoi.', input: '3', output: 'Moves printed', hint: 'Move n-1 to aux, move largest, move n-1 to target.' },
  { title: 'BFS Graph {n}', difficulty: 'Hard', statement: 'BFS on graph.', input: 'None', output: 'BFS traversal', hint: 'Queue, visit node, enqueue neighbors.' },
  { title: 'DFS Graph {n}', difficulty: 'Hard', statement: 'DFS on graph.', input: 'None', output: 'DFS traversal', hint: 'Recursion/stack, visit neighbors.' },
  { title: 'Dijkstra Algorithm {n}', difficulty: 'Hard', statement: 'Dijkstra shortest path.', input: 'None', output: 'Shortest path', hint: 'Priority queue, expand closest node.' },
  { title: 'Dynamic Programming {n}', difficulty: 'Hard', statement: 'DP memoization.', input: 'None', output: 'DP result', hint: 'Store subproblem results.' },
  { title: 'Knapsack Problem {n}', difficulty: 'Hard', statement: '0/1 knapsack DP.', input: 'None', output: 'Max value', hint: 'dp[i][w] = max value.' },
  { title: 'Logical Reasoning - Longest Increasing Subsequence {n}', difficulty: 'Hard', statement: 'Length of LIS.', input: '8\\n10 9 2 5 3 7 101 18', output: '4', hint: 'dp[i] = max length ending at i.' },
  { title: 'Logical Reasoning - Coin Change {n}', difficulty: 'Hard', statement: 'Minimum coins for amount.', input: '4\\n1 2 5\\n11', output: '3', hint: 'dp[amount] = min(dp[amount-coin]+1).' },
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
  const el = document.getElementById('overallProgress');
  if (el) el.textContent = pct + '%';
  const el2 = document.getElementById('solvedCount');
  if (el2) el2.textContent = solved.length;
  const easySolved = solved.filter(id => { const p = problems.find(x => x.id === id); return p && p.difficulty === 'Easy'; }).length;
  const mediumSolved = solved.filter(id => { const p = problems.find(x => x.id === id); return p && p.difficulty === 'Medium'; }).length;
  const hardSolved = solved.filter(id => { const p = problems.find(x => x.id === id); return p && p.difficulty === 'Hard'; }).length;
  const el3 = document.getElementById('easyCount');
  if (el3) el3.textContent = easySolved;
  const el4 = document.getElementById('mediumCount');
  if (el4) el4.textContent = mediumSolved;
  const el5 = document.getElementById('hardCount');
  if (el5) el5.textContent = hardSolved;
  const fill = document.getElementById('progressFill');
  if (fill) {
    const circumference = 2 * Math.PI * 60;
    const offset = circumference - (pct / 100) * circumference;
    fill.style.strokeDasharray = circumference;
    fill.style.strokeDashoffset = offset;
  }
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
  document.getElementById("modalHint").textContent = problem.hint || "Think step by step.";

  // Initialize code editor with problem template
  initCodeEditorForProblem(problem);

  const badge = document.getElementById("modalBadge");
  badge.className = "modal-badge " + getDifficultyBadge(problem.difficulty);

  const solvedBtn = document.getElementById("modalMarkSolved");
  const solvedBtnRight = document.getElementById("btnMarkSolvedRight");
  const alreadySolved = isProblemSolved(problem.id);
  const text = alreadySolved ? "Mark as Unsolved ↻" : "Mark as Solved ✓";
  solvedBtn.textContent = text;
  solvedBtnRight.textContent = text;
  solvedBtn.className = alreadySolved ? "btn btn-outline" : "btn btn-primary";
  solvedBtnRight.className = alreadySolved ? "btn btn-outline" : "btn btn-primary";

  const modal = document.getElementById("problemModal");
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("problemModal").classList.remove("open");
  document.body.style.overflow = "";
}

function closeAIReview() {
  const m = document.getElementById("aiReviewModal");
  if (m) m.classList.remove("open");
  document.body.style.overflow = "";
}

// ========================================
// COMPILER INTEGRATION
// ========================================
let isCompiling = false;

function showOutputPanel(show) {
  const panel = document.getElementById('outputPanel');
  if (panel) panel.style.display = show ? 'block' : 'none';
}

function switchOutputTab(tab) {
  const stdoutEl = document.getElementById('outputStdout');
  const stderrEl = document.getElementById('outputStderr');
  const tabStdout = document.getElementById('tabStdout');
  const tabStderr = document.getElementById('tabStderr');

  if (tab === 'stderr') {
    stdoutEl.style.display = 'none';
    stderrEl.style.display = 'block';
    tabStdout.classList.remove('active');
    tabStderr.classList.add('active');
  } else {
    stdoutEl.style.display = 'block';
    stderrEl.style.display = 'none';
    tabStdout.classList.add('active');
    tabStderr.classList.remove('active');
  }
}

function setOutputStatus(status, message) {
  const badge = document.getElementById('outputStatusBadge');
  if (badge) {
    badge.textContent = message;
    badge.className = 'status-badge ' + status;
  }
}

function setOutputMeta(exitCode, execTime) {
  const ecEl = document.getElementById('outputExitCode');
  const etEl = document.getElementById('outputExecTime');
  if (ecEl) ecEl.textContent = exitCode !== null ? exitCode : '-';
  if (etEl) etEl.textContent = execTime !== null ? execTime + ' ms' : '-';
}

function setOutputText(stdout, stderr) {
  const stdoutEl = document.getElementById('outputStdout');
  const stderrEl = document.getElementById('outputStderr');
  if (stdoutEl) stdoutEl.textContent = stdout || '(no output)';
  if (stderrEl) stderrEl.textContent = stderr || '(no stderr)';
}

async function executeCode() {
  if (isCompiling) return;

  const editor = document.getElementById('codeEditor');
  const stdinInput = document.getElementById('stdinInput');
  const btnExecute = document.getElementById('btnExecute');
  const executeStatus = document.getElementById('executeStatus');

  if (!editor) return;

  const sourceCode = editor.value;
  const stdinText = stdinInput ? stdinInput.value : '';

  // Show loading state
  isCompiling = true;
  btnExecute.disabled = true;
  btnExecute.textContent = 'Compiling...';
  executeStatus.style.display = 'inline';
  executeStatus.textContent = '⏳ Compiling and executing...';
  executeStatus.style.color = '#00f2ff';

  showOutputPanel(true);
  switchOutputTab('stdout');
  setOutputStatus('status-running', 'Running...');
  setOutputMeta('-', '-');
  setOutputText('', '');

  try {
    const response = await fetch(BACKEND_URL + '/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: sourceCode,
        stdin: stdinText,
        timeout: 10000,
      }),
    });

    const result = await response.json();

    // Hide loading
    btnExecute.disabled = false;
    btnExecute.textContent = '▶ Execute Code';
    isCompiling = false;
    executeStatus.style.display = 'none';

    // Display results based on status
    if (result.error === null || result.error === 'success') {
      setOutputStatus('status-accepted', 'Run executed successfully');
      setOutputMeta(result.exitCode, result.executionTimeMs);
      setOutputText(result.stdout, result.stderr);
      switchOutputTab('stdout');
    } else if (result.error === 'compilation_error') {
      setOutputStatus('status-error', 'Compilation failed');
      setOutputMeta(result.exitCode, result.executionTimeMs);
      setOutputText(result.stdout || '', result.stderr || 'Compilation error details above.');
      switchOutputTab('stderr');
    } else if (result.error === 'time_limit_exceeded') {
      setOutputStatus('status-error', 'Time limit exceeded');
      setOutputMeta(result.exitCode, result.executionTimeMs);
      setOutputText(result.stdout || '', result.stderr || 'Program exceeded the time limit.');
      switchOutputTab('stdout');
    } else if (result.error === 'runtime_error') {
      setOutputStatus('status-error', 'Runtime error');
      setOutputMeta(result.exitCode, result.executionTimeMs);
      setOutputText(result.stdout || '', result.stderr || 'Program exited with non-zero status.');
      switchOutputTab('stdout');
    } else if (result.error === 'compiler_unavailable') {
      setOutputStatus('status-error', 'Compiler unavailable');
      setOutputMeta('-', '-');
      setOutputText('', result.stderr || 'No C++ compiler installed on the server. Install g++ or clang++.');
      switchOutputTab('stderr');
    } else if (result.error === 'internal_error') {
      setOutputStatus('status-error', 'Internal error');
      setOutputMeta('-', '-');
      setOutputText('', result.stderr || 'An unexpected error occurred.');
      switchOutputTab('stderr');
    } else if (result.error === 'invalid_request' || result.error === 'source_too_large' || result.error === 'invalid_timeout') {
      setOutputStatus('status-error', 'Invalid request');
      setOutputMeta('-', '-');
      setOutputText('', result.message || 'Invalid submission.');
      switchOutputTab('stderr');
    } else {
      setOutputStatus('status-error', 'Unknown error');
      setOutputMeta('-', '-');
      setOutputText('', result.message || 'An unknown error occurred.');
      switchOutputTab('stderr');
    }
  } catch (err) {
    btnExecute.disabled = false;
    btnExecute.textContent = '▶ Execute Code';
    isCompiling = false;
    executeStatus.style.display = 'none';

    setOutputStatus('status-error', 'Backend unavailable');
    setOutputMeta('-', '-');
    setOutputText('', 'Cannot connect to the compiler backend at ' + BACKEND_URL + '\n\nMake sure the backend server is running:\n  cd cpp-practice-website\n  npm install\n  npm start\n\nThen check http://localhost:3001/health');
    switchOutputTab('stderr');
  }
}

// Initialize code editor with problem template when modal opens
function initCodeEditorForProblem(problem) {
  const editor = document.getElementById('codeEditor');
  if (!editor) return;

  // Provide a starter template based on the problem
  const template = `#include <iostream>
using namespace std;

int main() {
    // Problem #${problem.id}: ${problem.title}
    // ${problem.statement}

    // Write your solution here

    return 0;
}`;
  editor.value = template;

  // Clear stdin
  const stdinInput = document.getElementById('stdinInput');
  if (stdinInput) stdinInput.value = '';

  // Hide output panel
  showOutputPanel(false);
}

function startDailyChallenge() {
  const dailyProblem = problems.find(p => p.title === 'Reverse a Number');
  if (dailyProblem) openProblemModal(dailyProblem);
}

// Global so HTML onclick can find it
window.startDailyChallenge = startDailyChallenge;

document.addEventListener("DOMContentLoaded", () => {
  renderProblems("all");
  updateProgress();

  const mc = document.getElementById("modalClose");
  if (mc) mc.addEventListener("click", closeModal);

  const pm = document.getElementById("problemModal");
  if (pm) pm.addEventListener("click", (e) => { if (e.target === pm) closeModal(); });

  const bcs = document.getElementById("btnCopyStatement");
  if (bcs) bcs.addEventListener("click", () => {
    const statement = document.getElementById("modalStatement").textContent;
    navigator.clipboard.writeText(statement).then(() => {
      const btn = document.getElementById("btnCopyStatement");
      const original = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => btn.textContent = original, 1500);
    });
  });

  const bms = document.getElementById("modalMarkSolved");
  if (bms) bms.addEventListener("click", () => {
    toggleSolved(currentProblemId);
    const solvedBtn = document.getElementById("modalMarkSolved");
    const solvedBtnRight = document.getElementById("btnMarkSolvedRight");
    const alreadySolved = isProblemSolved(currentProblemId);
    const text = alreadySolved ? "Mark as Unsolved ↻" : "Mark as Solved ✓";
    solvedBtn.textContent = text;
    solvedBtnRight.textContent = text;
    solvedBtn.className = alreadySolved ? "btn btn-outline" : "btn btn-primary";
    solvedBtnRight.className = alreadySolved ? "btn btn-outline" : "btn btn-primary";
  });

  const bmsr = document.getElementById("btnMarkSolvedRight");
  if (bmsr) bmsr.addEventListener("click", () => {
    toggleSolved(currentProblemId);
    const solvedBtn = document.getElementById("modalMarkSolved");
    const solvedBtnRight = document.getElementById("btnMarkSolvedRight");
    const alreadySolved = isProblemSolved(currentProblemId);
    const text = alreadySolved ? "Mark as Unsolved ↻" : "Mark as Solved ✓";
    solvedBtn.textContent = text;
    solvedBtnRight.textContent = text;
    solvedBtn.className = alreadySolved ? "btn btn-outline" : "btn btn-primary";
    solvedBtnRight.className = alreadySolved ? "btn btn-outline" : "btn btn-primary";
  });

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeAIReview(); } });

  // Execute button
  const btnExecute = document.getElementById("btnExecute");
  if (btnExecute) {
    btnExecute.addEventListener("click", executeCode);
  }

  // Output tab switching
  const tabStdout = document.getElementById("tabStdout");
  const tabStderr = document.getElementById("tabStderr");
  if (tabStdout) tabStdout.addEventListener("click", () => switchOutputTab('stdout'));
  if (tabStderr) tabStderr.addEventListener("click", () => switchOutputTab('stderr'));
});