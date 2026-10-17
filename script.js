// ========================================
// PROBLEMS DATA - 1200 Problems (12 sections × 100)
// Each problem has: id, category, title, difficulty, statement, input, output, hint
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
      hint: template.hint || 'Think about the logic step by step. Break the problem into smaller parts.'
    });
  }
}

// 1. INPUT & OUTPUT
generateProblems('io', 'Input & Output', 100, 1, [
  { title: 'Hello World', difficulty: 'Easy', statement: 'Write a C++ program that prints "Hello, World!" to the console.', input: 'None', output: 'Hello, World!', hint: 'Use #include <iostream> and std::cout to print text. Remember to add endl or \n for a new line.' },
  { title: 'Add Two Numbers', difficulty: 'Easy', statement: 'Read two integers and print their sum.', input: '5 3', output: '8', hint: 'Declare two int variables, read them using cin, add them with +, and print the result using cout.' },
  { title: 'Area of a Circle {n}', difficulty: 'Easy', statement: 'Read radius and print area (PI = 3.14159).', input: '5', output: '78.53975', hint: 'Formula: Area = π × r². Use double for radius and area. Print with required precision.' },
  { title: 'Simple Interest {n}', difficulty: 'Easy', statement: 'Read P, R, T. Print simple interest.', input: '1000 5 2', output: '100', hint: 'Formula: Simple Interest = (P × R × T) / 100. Read three values and apply the formula.' },
  { title: 'Swap Two Numbers {n}', difficulty: 'Easy', statement: 'Read two integers and swap them.', input: '10 20', output: '20 10', hint: 'Use a temporary variable: temp = a; a = b; b = temp. Or swap without a temp using arithmetic.' },
  { title: 'ASCII Value {n}', difficulty: 'Easy', statement: 'Read a character and print its ASCII value.', input: 'A', output: '65', hint: 'Read a char and cast it to int using static_cast<int>(ch) to get its ASCII code.' },
  { title: 'Celsius to Fahrenheit {n}', difficulty: 'Easy', statement: 'Convert Celsius to Fahrenheit.', input: '0', output: '32', hint: 'Formula: F = (C × 9/5) + 32. Read Celsius, apply formula, print result.' },
  { title: 'Even or Odd {n}', difficulty: 'Easy', statement: 'Read integer and print Even or Odd.', input: '7', output: 'Odd', hint: 'Use the modulus operator %. If number % 2 == 0, it is Even; otherwise Odd.' },
  { title: 'Calculate Percentage {n}', difficulty: 'Easy', statement: 'Read marks out of 100 and print percentage.', input: '85', output: '85', hint: 'Percentage = (marks obtained / total marks) × 100. Since total is 100, percentage equals marks.' },
  { title: 'Size of Data Types {n}', difficulty: 'Easy', statement: 'Print sizes of int, char, float, double.', input: 'None', output: 'int: 4\nchar: 1\nfloat: 4\ndouble: 8', hint: 'Use the sizeof() operator on each data type: sizeof(int), sizeof(char), etc.' },
  { title: 'Multiply Two Numbers {n}', difficulty: 'Easy', statement: 'Read two integers and print product.', input: '6 7', output: '42', hint: 'Read two ints and multiply them using the * operator. Print the product.' },
  { title: 'Divide Two Numbers {n}', difficulty: 'Easy', statement: 'Read two integers and print quotient/remainder.', input: '17 5', output: '3 2', hint: 'Use / for quotient and % for remainder. Print both values separated by a space.' },
  { title: 'Average of Three Numbers {n}', difficulty: 'Easy', statement: 'Read three numbers and print average.', input: '10 20 30', output: '20', hint: 'Formula: Average = (a + b + c) / 3. Use float or double for accurate division.' },
  { title: 'Convert Days to Years {n}', difficulty: 'Easy', statement: 'Read total days and convert to years/weeks/days.', input: '400', output: '1 year, 1 week, 3 days', hint: 'Years = days / 365. Remaining days = days % 365. Weeks = remaining / 7. Days = remaining % 7.' },
  { title: 'Read and Print String {n}', difficulty: 'Easy', statement: 'Read a string with spaces and print it back.', input: 'Hello C++', output: 'Hello C++', hint: 'Use std::string and getline(cin, str) to read a full line including spaces.' },
  { title: 'Character Input Output {n}', difficulty: 'Easy', statement: 'Read char using cin.get() and print.', input: 'Z', output: 'Z', hint: 'Use char variable and cin.get() to read a single character, then print with cout.' },
  { title: 'Formatted Output {n}', difficulty: 'Easy', statement: 'Print float with 2 decimal places.', input: '3.14159', output: '3.14', hint: 'Use #include <iomanip> and std::fixed with std::setprecision(2) to control decimal places.' },
  { title: 'Multiple Inputs {n}', difficulty: 'Easy', statement: 'Read int, float, char in one line.', input: '5 3.14 A', output: '5 3.14 A', hint: 'Use cin >> intVar >> floatVar >> charVar to read multiple values in one statement.' },
  { title: 'Boolean Input Output {n}', difficulty: 'Easy', statement: 'Read boolean and print true/false.', input: '1', output: 'true', hint: 'Use bool variable. cin reads 0 as false and 1 as true. cout prints true or false.' },
  { title: 'Input Validation {n}', difficulty: 'Medium', statement: 'Read integer until positive entered.', input: '-5\n10', output: '10', hint: 'Use a while loop that continues as long as the number is <= 0. Read inside the loop.' },
]);

// 2. VARIABLES & DATA TYPES
generateProblems('variables', 'Variables & Data Types', 100, 101, [
  { title: 'Declare Variables {n}', difficulty: 'Easy', statement: 'Declare int, float, double, char, bool, string and print.', input: 'None', output: 'Values printed', hint: 'Declare one variable of each type, assign values, and print them with labels using cout.' },
  { title: 'Variable Naming Rules {n}', difficulty: 'Easy', statement: 'Demonstrate valid/invalid variable names.', input: 'None', output: 'Valid names shown', hint: 'Valid names start with letter or underscore, contain alphanumeric/underscore, and are case-sensitive.' },
  { title: 'Constants in C++ {n}', difficulty: 'Easy', statement: 'Use const and try to modify.', input: 'None', output: 'Compile error', hint: 'Use const before type to make a variable read-only. Attempting to change it causes a compile error.' },
  { title: 'Integer Types {n}', difficulty: 'Easy', statement: 'Use short, int, long, long long.', input: 'None', output: 'Ranges printed', hint: 'Declare variables of short, int, long, long long and print their values to see the difference.' },
  { title: 'Floating Point Types {n}', difficulty: 'Easy', statement: 'Compare float and double.', input: 'None', output: 'Precision compared', hint: 'float gives ~6 decimal digits precision; double gives ~15. Store same value in both and print.' },
  { title: 'Char Type {n}', difficulty: 'Easy', statement: 'Store char and print ASCII.', input: 'B', output: '66', hint: 'Store a character in char type and cast to int to see its ASCII value.' },
  { title: 'Boolean Type {n}', difficulty: 'Easy', statement: 'Store true/false in bool.', input: 'true', output: '1', hint: 'bool stores true or false. When printed, true shows as 1 and false as 0.' },
  { title: 'String Type {n}', difficulty: 'Easy', statement: 'Use std::string and print length.', input: 'Hello World', output: '11', hint: 'Use std::string and the .length() or .size() member function to get string length.' },
  { title: 'Type Conversion {n}', difficulty: 'Medium', statement: 'Convert int to double.', input: '5', output: '5.0', hint: 'Assign an int to a double variable; C++ performs implicit conversion. Or use static_cast<double>().' },
  { title: 'Type Casting {n}', difficulty: 'Medium', statement: 'Use static_cast.', input: '10', output: '10.0', hint: 'Use static_cast<double>(intVar) to explicitly convert int to double.' },
  { title: 'Auto Keyword {n}', difficulty: 'Medium', statement: 'Use auto type deduction.', input: 'None', output: 'Type deduced', hint: 'Use auto x = value; and let the compiler deduce the type from the initializer.' },
  { title: 'Enumeration {n}', difficulty: 'Medium', statement: 'Create enum for days.', input: 'None', output: 'Days printed', hint: 'Use enum Day { Mon, Tue, Wed, ... }; and print enum values which are integers by default.' },
  { title: 'Struct Basics {n}', difficulty: 'Medium', statement: 'Create Student struct.', input: 'None', output: 'Student data', hint: 'Use struct Student { string name; int roll; }; create an object and access members with dot operator.' },
  { title: 'Union Basics {n}', difficulty: 'Medium', statement: 'Demonstrate union.', input: 'None', output: 'Shared memory', hint: 'Use union to store different types in same memory location. Size equals largest member.' },
  { title: 'Typedef {n}', difficulty: 'Medium', statement: 'Create alias for unsigned int.', input: 'None', output: 'Alias created', hint: 'Use typedef unsigned int uint; or using uint = unsigned int; to create a type alias.' },
]);

// 3. OPERATORS & EXPRESSIONS
generateProblems('operators', 'Operators & Expressions', 100, 201, [
  { title: 'Arithmetic Operators {n}', difficulty: 'Easy', statement: 'Demonstrate +, -, *, /, %.', input: '10 3', output: '13 7 30 3 1', hint: 'Read two integers and print results of +, -, *, /, and % operators.' },
  { title: 'Relational Operators {n}', difficulty: 'Easy', statement: 'Compare using ==, !=, <, >, <=, >=.', input: '5 10', output: '0 1 1 0 1 0', hint: 'Read two numbers and print results of all relational comparisons (1 for true, 0 for false).' },
  { title: 'Logical Operators {n}', difficulty: 'Easy', statement: 'Demonstrate &&, ||, !.', input: '1 0', output: '0 1 0', hint: 'Use logical AND (&&), OR (||), NOT (!) on boolean conditions and print results.' },
  { title: 'Assignment Operators {n}', difficulty: 'Easy', statement: 'Use =, +=, -=, *=, /.', input: '5', output: '5 10 5 50 10', hint: 'Start with x = 5, then apply x += 5, x -= 5, x *= 5, x /= 5 and print after each step.' },
  { title: 'Increment Decrement {n}', difficulty: 'Easy', statement: 'Pre/post increment.', input: '5', output: '6 5', hint: 'Show difference between ++x (pre-increment) and x++ (post-increment).' },
  { title: 'Bitwise Operators {n}', difficulty: 'Medium', statement: 'Demonstrate &, |, ^, ~, <<, >>.', input: '5 3', output: '1 7 6 -6 40 1', hint: 'Read two integers and print results of bitwise AND, OR, XOR, NOT, left shift, right shift.' },
  { title: 'Ternary Operator {n}', difficulty: 'Easy', statement: 'Find larger of two numbers.', input: '7 12', output: '12', hint: 'Use condition ? valueIfTrue : valueIfFalse to pick the larger number in one line.' },
  { title: 'Operator Precedence {n}', difficulty: 'Medium', statement: 'Show precedence rules.', input: 'None', output: 'Based on precedence', hint: 'Remember: parentheses first, then */%, then +-, then relational, then logical.' },
  { title: 'Comma Operator {n}', difficulty: 'Medium', statement: 'Demonstrate comma in loop.', input: 'None', output: 'Final value', hint: 'Comma operator evaluates left to right and returns the rightmost value.' },
  { title: 'sizeof Operator {n}', difficulty: 'Easy', statement: 'Print sizes using sizeof.', input: 'None', output: 'int: 4\nchar: 1', hint: 'Use sizeof(variable) or sizeof(type) to get size in bytes.' },
]);

// 4. CONDITIONS
generateProblems('conditionals', 'Conditions & Decision Making', 100, 301, [
  { title: 'If Statement {n}', difficulty: 'Easy', statement: 'Check if number is positive.', input: '5', output: 'Positive', hint: 'Use if (n > 0) to check and print "Positive".' },
  { title: 'If Else Statement {n}', difficulty: 'Easy', statement: 'Check even or odd.', input: '4', output: 'Even', hint: 'Use if (n % 2 == 0) print Even else print Odd.' },
  { title: 'Else If Ladder {n}', difficulty: 'Easy', statement: 'Grade score (A-F).', input: '85', output: 'A', hint: 'Use else-if ladder: score >= 90 A, >= 80 B, >= 70 C, >= 60 D, else F.' },
  { title: 'Nested If {n}', difficulty: 'Medium', statement: 'Check divisible by 5 and 7.', input: '35', output: 'Divisible by both', hint: 'Use nested if: outer checks % 5, inner checks % 7.' },
  { title: 'Switch Statement {n}', difficulty: 'Easy', statement: 'Print day name 1-7.', input: '3', output: 'Wednesday', hint: 'Use switch on day number with cases 1-7 for Monday to Sunday.' },
  { title: 'Switch Default {n}', difficulty: 'Easy', statement: 'Switch with default case.', input: '9', output: 'Invalid day', hint: 'Include a default case in switch to handle invalid inputs.' },
  { title: 'Leap Year {n}', difficulty: 'Medium', statement: 'Check leap year.', input: '2024', output: 'Leap Year', hint: 'Leap year: divisible by 4 AND (not divisible by 100 OR divisible by 400).' },
  { title: 'Range Check {n}', difficulty: 'Easy', statement: 'Check between 10 and 100.', input: '50', output: 'In range', hint: 'Use if (n >= 10 && n <= 100) to check range.' },
  { title: 'Menu Driven {n}', difficulty: 'Medium', statement: 'Menu-driven calculator.', input: '1\n5 3', output: '8', hint: 'Use switch on user choice (1-add, 2-sub, etc.) inside a loop.' },
  { title: 'Vowel or Consonant {n}', difficulty: 'Easy', statement: 'Check vowel or consonant.', input: 'a', output: 'Vowel', hint: 'Check if character is one of a, e, i, o, u (case insensitive).' },
]);

// 5. LOOPS
generateProblems('loops', 'Loops & Repetition', 100, 401, [
  { title: 'For Loop 1 to N {n}', difficulty: 'Easy', statement: 'Print 1 to N.', input: '5', output: '1 2 3 4 5', hint: 'Use for (int i = 1; i <= n; i++) and print i.' },
  { title: 'While Loop {n}', difficulty: 'Easy', statement: 'Print N to 1.', input: '5', output: '5 4 3 2 1', hint: 'Use while (n > 0) { print n; n--; }.' },
  { title: 'Do While Loop {n}', difficulty: 'Easy', statement: 'Menu until exit.', input: 'None', output: 'Menu printed', hint: 'Use do { ... } while (choice != exit); so menu shows at least once.' },
  { title: 'Nested Loops {n}', difficulty: 'Medium', statement: 'Multiplication table.', input: '5', output: '5x1=5\n5x2=10...', hint: 'Outer loop for table number, inner loop for multiplier 1 to 10.' },
  { title: 'Break Statement {n}', difficulty: 'Easy', statement: 'Exit loop on condition.', input: 'None', output: 'Loop exited', hint: 'Use break inside a loop to terminate it immediately when condition is met.' },
  { title: 'Continue Statement {n}', difficulty: 'Easy', statement: 'Skip even numbers.', input: 'None', output: 'Odd numbers only', hint: 'Use continue when number is even to skip printing and move to next iteration.' },
  { title: 'Sum of Digits {n}', difficulty: 'Easy', statement: 'Sum digits using loop.', input: '123', output: '6', hint: 'Use while (n > 0): sum += n % 10; n /= 10;.' },
  { title: 'Reverse Number {n}', difficulty: 'Easy', statement: 'Reverse digits.', input: '1234', output: '4321', hint: 'In loop: rev = rev * 10 + (n % 10); n /= 10;.' },
  { title: 'Prime Check {n}', difficulty: 'Medium', statement: 'Check prime.', input: '17', output: 'Prime', hint: 'Check divisibility from 2 to sqrt(n). If any divides, not prime.' },
  { title: 'Fibonacci Series {n}', difficulty: 'Medium', statement: 'First N Fibonacci.', input: '6', output: '0 1 1 2 3 5', hint: 'Formula: F(n) = F(n-1) + F(n-2), with F(0)=0 and F(1)=1. Use a loop starting from 2, keeping previous two values.' },
  { title: 'Factorial {n}', difficulty: 'Easy', statement: 'Calculate factorial.', input: '5', output: '120', hint: 'Factorial n = 1 × 2 × ... × n. Use a loop multiplying from 1 to n.' },
  { title: 'Armstrong Number {n}', difficulty: 'Medium', statement: 'Check Armstrong.', input: '153', output: 'Armstrong', hint: 'Armstrong: sum of each digit raised to power of number of digits equals the number itself.' },
  { title: 'Palindrome Number {n}', difficulty: 'Medium', statement: 'Check palindrome.', input: '121', output: 'Palindrome', hint: 'Reverse the number and compare with original. If equal, it is palindrome.' },
  { title: 'Right Triangle Star {n}', difficulty: 'Medium', statement: 'Right triangle stars.', input: '4', output: '*\n**\n***\n****', hint: 'Outer loop for rows 1 to n, inner loop prints i stars in row i.' },
  { title: 'Pyramid Star {n}', difficulty: 'Medium', statement: 'Pyramid stars.', input: '3', output: '  *\n ***\n*****', hint: 'Print spaces then stars: spaces = n - i, stars = 2*i - 1 for row i.' },
  { title: 'Diamond Star {n}', difficulty: 'Medium', statement: 'Diamond stars.', input: '3', output: '  *\n ***\n*****\n ***\n  *', hint: 'Print upper pyramid then lower inverted pyramid using two loops.' },
  { title: 'Number Pattern {n}', difficulty: 'Medium', statement: 'Number pattern.', input: '4', output: '1\n12\n123\n1234', hint: 'Outer loop for rows, inner loop prints numbers 1 to i.' },
  { title: 'Hollow Square {n}', difficulty: 'Medium', statement: 'Hollow square.', input: '4', output: '****\n*  *\n*  *\n****', hint: 'Print * for first/last row or first/last column, else print space.' },
  { title: 'GCD {n}', difficulty: 'Medium', statement: 'GCD using loop.', input: '12 18', output: '6', hint: 'Use Euclidean algorithm: while (b != 0) { temp = b; b = a % b; a = temp; } GCD is a.' },
  { title: 'LCM {n}', difficulty: 'Medium', statement: 'LCM using loop.', input: '4 6', output: '12', hint: 'Formula: LCM(a, b) = (a × b) / GCD(a, b).' },
]);

// 6. FUNCTIONS
generateProblems('functions', 'Functions', 100, 501, [
  { title: 'Function Declaration {n}', difficulty: 'Easy', statement: 'Declare and define function.', input: 'None', output: 'Message printed', hint: 'Declare function before main, define it, and call from main.' },
  { title: 'Function with Parameters {n}', difficulty: 'Easy', statement: 'Function with two ints.', input: '5 3', output: '8', hint: 'Write void or int function taking two parameters, add them, and print/return.' },
  { title: 'Return Value {n}', difficulty: 'Easy', statement: 'Return max of two numbers.', input: '7 12', output: '12', hint: 'Use if inside function to return the larger of two values.' },
  { title: 'Pass by Value {n}', difficulty: 'Easy', statement: 'Pass by value swap.', input: '5 10', output: 'Original unchanged', hint: 'Swapping inside function does not affect original variables when passed by value.' },
  { title: 'Pass by Reference {n}', difficulty: 'Medium', statement: 'Pass by reference swap.', input: '5 10', output: '10 5', hint: 'Use references (int &a) in parameters so changes reflect in original variables.' },
  { title: 'Default Arguments {n}', difficulty: 'Medium', statement: 'Function with defaults.', input: '5', output: 'Result with default', hint: 'Declare function with default values like int f(int x, int y = 10).' },
  { title: 'Function Overloading {n}', difficulty: 'Medium', statement: 'Overload area calculation.', input: 'None', output: 'Areas printed', hint: 'Same function name, different parameter types/count for circle vs rectangle area.' },
  { title: 'Inline Function {n}', difficulty: 'Medium', statement: 'Inline function.', input: 'None', output: 'Result printed', hint: 'Use inline keyword before small functions to suggest compiler to embed code.' },
  { title: 'Recursive Function {n}', difficulty: 'Hard', statement: 'Recursive factorial.', input: '5', output: '120', hint: 'Base case: if n <= 1 return 1. Else return n * factorial(n-1).' },
  { title: 'Recursive Fibonacci {n}', difficulty: 'Hard', statement: 'Recursive Fibonacci.', input: '6', output: '8', hint: 'Base cases F(0)=0, F(1)=1. Else return fib(n-1) + fib(n-2).' },
  { title: 'Scope of Variables {n}', difficulty: 'Medium', statement: 'Local and global scope.', input: 'None', output: 'Scope shown', hint: 'Global variables accessible everywhere; local only inside their block/function.' },
  { title: 'Static Variables {n}', difficulty: 'Medium', statement: 'Static variable.', input: 'None', output: 'Value persists', hint: 'Use static inside function so value persists across function calls.' },
  { title: 'Function Pointers {n}', difficulty: 'Hard', statement: 'Function pointer call.', input: 'None', output: 'Function called', hint: 'Declare pointer with return type and parameters, assign function address, call via pointer.' },
]);

// 7. ARRAYS
generateProblems('arrays', 'Arrays', 100, 601, [
  { title: 'Array Declaration {n}', difficulty: 'Easy', statement: 'Declare array of 5 integers.', input: 'None', output: 'Array declared', hint: 'Use int arr[5]; to declare an array of 5 integers.' },
  { title: 'Array Input Output {n}', difficulty: 'Easy', statement: 'Read N integers and print.', input: '3\n1 2 3', output: '1 2 3', hint: 'Use a for loop to read N elements, then another loop to print them.' },
  { title: 'Array Traversal {n}', difficulty: 'Easy', statement: 'Traverse and print.', input: 'None', output: 'Elements printed', hint: 'Use for (int i = 0; i < n; i++) to access arr[i].' },
  { title: 'Find Maximum {n}', difficulty: 'Easy', statement: 'Find max value.', input: '5\n3 7 2 9 1', output: '9', hint: 'Initialize max = arr[0], loop and update max if arr[i] > max.' },
  { title: 'Find Minimum {n}', difficulty: 'Easy', statement: 'Find min value.', input: '5\n3 7 2 9 1', output: '1', hint: 'Initialize min = arr[0], loop and update min if arr[i] < min.' },
  { title: 'Array Sum {n}', difficulty: 'Easy', statement: 'Sum array elements.', input: '3\n1 2 3', output: '6', hint: 'Initialize sum = 0, add arr[i] in loop.' },
  { title: 'Array Average {n}', difficulty: 'Easy', statement: 'Array average.', input: '3\n1 2 3', output: '2', hint: 'Sum all elements then divide by n. Use float/double for result.' },
  { title: 'Linear Search {n}', difficulty: 'Easy', statement: 'Search element index.', input: '5\n10 20 30 40 50\n30', output: '2', hint: 'Loop through array, if arr[i] == target, return i. If not found, return -1.' },
  { title: 'Reverse Array {n}', difficulty: 'Easy', statement: 'Reverse array.', input: '4\n1 2 3 4', output: '4 3 2 1', hint: 'Swap arr[i] with arr[n-1-i] for i from 0 to n/2.' },
  { title: 'Count Even Odd {n}', difficulty: 'Easy', statement: 'Count even/odd.', input: '5\n1 2 3 4 5', output: 'Even: 2, Odd: 3', hint: 'Loop and check arr[i] % 2 == 0 for even, else odd.' },
  { title: 'Remove Duplicates {n}', difficulty: 'Medium', statement: 'Remove duplicates.', input: '5\n1 2 2 3 3', output: '1 2 3', hint: 'Use a nested loop or a second array to keep only first occurrence of each value.' },
  { title: 'Rotate Array {n}', difficulty: 'Medium', statement: 'Rotate by K positions.', input: '5\n1 2 3 4 5\n2', output: '3 4 5 1 2', hint: 'Store first k elements, shift rest left, append stored elements at end.' },
  { title: 'Second Largest {n}', difficulty: 'Medium', statement: 'Second largest element.', input: '5\n10 20 30 40 50', output: '40', hint: 'Track largest and second largest in one pass.' },
  { title: 'Pair Sum {n}', difficulty: 'Medium', statement: 'Pairs summing to target.', input: '5\n1 2 3 4 5\n5', output: '(1,4) (2,3)', hint: 'Use nested loops to check all pairs i<j for sum == target.' },
  { title: 'Bubble Sort {n}', difficulty: 'Medium', statement: 'Bubble sort.', input: '4\n4 3 2 1', output: '1 2 3 4', hint: 'Repeatedly swap adjacent elements if they are in wrong order.' },
  { title: 'Selection Sort {n}', difficulty: 'Medium', statement: 'Selection sort.', input: '4\n4 3 2 1', output: '1 2 3 4', hint: 'Find minimum in unsorted part and swap with first unsorted element.' },
  { title: 'Insertion Sort {n}', difficulty: 'Medium', statement: 'Insertion sort.', input: '4\n4 3 2 1', output: '1 2 3 4', hint: 'Take each element and insert it into correct position in sorted left part.' },
  { title: '2D Array Input Output {n}', difficulty: 'Medium', statement: 'Read/print 2D array.', input: '2 2\n1 2\n3 4', output: '1 2\n3 4', hint: 'Use nested loops: outer for rows, inner for columns.' },
  { title: 'Matrix Addition {n}', difficulty: 'Medium', statement: 'Matrix addition.', input: '2 2\n1 2\n3 4\n5 6\n7 8', output: '6 8\n10 12', hint: 'result[i][j] = mat1[i][j] + mat2[i][j] using nested loops.' },
  { title: 'Matrix Multiplication {n}', difficulty: 'Hard', statement: 'Matrix multiplication.', input: '2 2\n1 2\n3 4\n5 6\n7 8', output: '19 22\n43 50', hint: 'Use three nested loops: result[i][j] += mat1[i][k] * mat2[k][j].' },
  { title: 'Matrix Transpose {n}', difficulty: 'Medium', statement: 'Matrix transpose.', input: '2 2\n1 2\n3 4', output: '1 3\n2 4', hint: 'transpose[j][i] = mat[i][j]; swap rows and columns.' },
]);

// 8. STRINGS
generateProblems('strings', 'Strings', 100, 701, [
  { title: 'String Declaration {n}', difficulty: 'Easy', statement: 'Declare std::string.', input: 'None', output: 'String printed', hint: 'Use #include <string> and std::string name = "value";.' },
  { title: 'String Input with Spaces {n}', difficulty: 'Easy', statement: 'Read full line with getline.', input: 'Hello C++', output: 'Hello C++', hint: 'Use std::getline(std::cin, str) to read strings with spaces.' },
  { title: 'String Length {n}', difficulty: 'Easy', statement: 'Length without built-in.', input: 'hello', output: '5', hint: 'Loop until null terminator '\0' for C-string, or use .size() for std::string.' },
  { title: 'String Reverse {n}', difficulty: 'Easy', statement: 'Reverse string.', input: 'hello', output: 'olleh', hint: 'Swap str[i] with str[n-1-i] for i from 0 to n/2.' },
  { title: 'String Palindrome {n}', difficulty: 'Easy', statement: 'Check palindrome.', input: 'madam', output: 'Palindrome', hint: 'Compare characters from start and end moving toward center.' },
  { title: 'String Concatenation {n}', difficulty: 'Easy', statement: 'Concatenate with +.', input: 'Hello World', output: 'HelloWorld', hint: 'Use str1 + str2 with std::string to join them.' },
  { title: 'String Comparison {n}', difficulty: 'Easy', statement: 'Compare lexicographically.', input: 'abc abd', output: 'abc < abd', hint: 'Use strcmp() for C-strings or == / < / > for std::string.' },
  { title: 'Count Vowels {n}', difficulty: 'Easy', statement: 'Count vowels.', input: 'hello', output: '2', hint: 'Check each character if it is a/e/i/o/u (case insensitive).' },
  { title: 'Count Words {n}', difficulty: 'Easy', statement: 'Count words.', input: 'Hello World C++', output: '3', hint: 'Count spaces + 1, or count transitions from space to non-space.' },
  { title: 'Substring {n}', difficulty: 'Medium', statement: 'Extract substring.', input: 'Hello World 0 5', output: 'Hello', hint: 'Use str.substr(start, length) for std::string.' },
  { title: 'String to Uppercase {n}', difficulty: 'Easy', statement: 'Convert to uppercase.', input: 'hello', output: 'HELLO', hint: 'Use std::toupper() from <cctype> for each character.' },
  { title: 'String to Lowercase {n}', difficulty: 'Easy', statement: 'Convert to lowercase.', input: 'HELLO', output: 'hello', hint: 'Use std::tolower() from <cctype> for each character.' },
  { title: 'Anagram Check {n}', difficulty: 'Medium', statement: 'Check anagrams.', input: 'listen silent', output: 'Anagram', hint: 'Sort both strings and compare, or count frequency of each character.' },
  { title: 'Remove Spaces {n}', difficulty: 'Medium', statement: 'Remove spaces.', input: 'Hello World', output: 'HelloWorld', hint: 'Copy non-space characters to a new string/index.' },
  { title: 'Frequency of Characters {n}', difficulty: 'Medium', statement: 'Character frequency.', input: 'hello', output: 'h:1 e:1 l:2 o:1', hint: 'Use an array of size 256 to count frequency of each ASCII character.' },
]);

// 9. POINTERS & MEMORY
generateProblems('pointers', 'Pointers & Memory', 100, 801, [
  { title: 'Pointer Declaration {n}', difficulty: 'Easy', statement: 'Declare pointer and print address.', input: 'None', output: 'Address printed', hint: 'Use int *ptr = &var; and print ptr to see memory address.' },
  { title: 'Pointer Dereferencing {n}', difficulty: 'Easy', statement: 'Access/modify via pointer.', input: '10', output: '10', hint: 'Use *ptr to access the value stored at the address ptr holds.' },
  { title: 'Pointer to Pointer {n}', difficulty: 'Medium', statement: 'Pointer to pointer.', input: 'None', output: 'Value via double pointer', hint: 'Use int **ptr2 = &ptr; then **ptr2 gives the original value.' },
  { title: 'Null Pointer {n}', difficulty: 'Easy', statement: 'Null pointer check.', input: 'None', output: 'Null check passed', hint: 'Initialize pointer as int *ptr = nullptr; and check if (ptr == nullptr).' },
  { title: 'Pointer Arithmetic {n}', difficulty: 'Medium', statement: 'Pointer arithmetic on array.', input: 'None', output: 'Address incremented', hint: 'ptr++ moves to next element of same type (address increases by sizeof(type)).' },
  { title: 'Pointer and Array {n}', difficulty: 'Medium', statement: 'Traverse array with pointer.', input: 'None', output: 'Elements via pointer', hint: 'Use ptr = arr; then *(ptr + i) to access elements.' },
  { title: 'Pointer to Function {n}', difficulty: 'Hard', statement: 'Pointer to function.', input: 'None', output: 'Value modified', hint: 'Declare int (*fp)(int); assign function name, call fp(arg).' },
  { title: 'Dynamic Memory Allocation {n}', difficulty: 'Medium', statement: 'Use new for integer.', input: 'None', output: 'Memory allocated', hint: 'Use int *ptr = new int; to allocate on heap, then delete ptr;' },
  { title: 'Delete Memory {n}', difficulty: 'Medium', statement: 'Use delete.', input: 'None', output: 'Memory freed', hint: 'Always pair new with delete to avoid memory leaks.' },
  { title: 'Dynamic Array {n}', difficulty: 'Medium', statement: 'Dynamic array with new[].', input: 'None', output: 'Dynamic array created', hint: 'Use int *arr = new int[n]; and delete[] arr; to free.' },
  { title: 'Dangling Pointer {n}', difficulty: 'Hard', statement: 'Dangling pointer.', input: 'None', output: 'Dangling pointer shown', hint: 'Pointer pointing to deleted memory. Set to nullptr after delete.' },
  { title: 'Smart Pointers {n}', difficulty: 'Hard', statement: 'unique_ptr and shared_ptr.', input: 'None', output: 'Smart pointers used', hint: 'Use #include <memory>; unique_ptr owns exclusively, shared_ptr uses reference counting.' },
  { title: 'Reference vs Pointer {n}', difficulty: 'Medium', statement: 'Compare references/pointers.', input: 'None', output: 'Comparison shown', hint: 'References cannot be null and cannot be reassigned; pointers can.' },
]);

// 10. OOP
generateProblems('oop', 'Object-Oriented Programming', 100, 901, [
  { title: 'Class and Object {n}', difficulty: 'Easy', statement: 'Create class with attributes.', input: 'None', output: 'Object created', hint: 'Use class Name { public: data members; }; create object and access with dot.' },
  { title: 'Constructor {n}', difficulty: 'Easy', statement: 'Constructor initialization.', input: 'None', output: 'Constructor called', hint: 'Constructor has same name as class, no return type, called automatically on object creation.' },
  { title: 'Destructor {n}', difficulty: 'Easy', statement: 'Destructor called.', input: 'None', output: 'Destructor called', hint: 'Destructor name is ~ClassName(), called when object goes out of scope.' },
  { title: 'Encapsulation {n}', difficulty: 'Medium', statement: 'Encapsulation with getters/setters.', input: 'None', output: 'Data encapsulated', hint: 'Make data private, provide public get and set methods.' },
  { title: 'Inheritance {n}', difficulty: 'Medium', statement: 'Base and derived class.', input: 'None', output: 'Inheritance shown', hint: 'Use class Derived : public Base; to inherit members.' },
  { title: 'Multiple Inheritance {n}', difficulty: 'Hard', statement: 'Multiple inheritance.', input: 'None', output: 'Multiple inheritance', hint: 'class C : public A, public B; inherits from two base classes.' },
  { title: 'Multilevel Inheritance {n}', difficulty: 'Medium', statement: 'Multilevel inheritance.', input: 'None', output: 'Multilevel inheritance', hint: 'class C : public B; where class B : public A; forms a chain.' },
  { title: 'Polymorphism {n}', difficulty: 'Medium', statement: 'Function overloading.', input: 'None', output: 'Overloaded functions', hint: 'Same function name, different parameters — compile-time polymorphism.' },
  { title: 'Virtual Functions {n}', difficulty: 'Hard', statement: 'Runtime polymorphism.', input: 'None', output: 'Runtime polymorphism', hint: 'Use virtual in base class and override in derived; call via base pointer.' },
  { title: 'Abstract Class {n}', difficulty: 'Hard', statement: 'Abstract class.', input: 'None', output: 'Abstract class created', hint: 'Use pure virtual function: virtual void func() = 0; cannot instantiate abstract class.' },
  { title: 'Operator Overloading {n}', difficulty: 'Hard', statement: 'Overload + operator.', input: 'None', output: 'Operator overloaded', hint: 'Implement operator+ as member function returning new object.' },
  { title: 'Friend Function {n}', difficulty: 'Medium', statement: 'Friend function access.', input: 'None', output: 'Private accessed', hint: 'Declare friend void func(Class&); inside class to access private members.' },
  { title: 'Static Members {n}', difficulty: 'Medium', statement: 'Static members.', input: 'None', output: 'Static members used', hint: 'Static members belong to class, shared by all objects. Define outside class.' },
  { title: 'This Pointer {n}', difficulty: 'Medium', statement: 'Use this pointer.', input: 'None', output: 'This pointer used', hint: 'this points to current object; use to disambiguate member from parameter.' },
  { title: 'Composition {n}', difficulty: 'Medium', statement: 'Composition.', input: 'None', output: 'Composition shown', hint: 'A class contains an object of another class as a member ("has-a" relationship).' },
]);

// 11. STL
generateProblems('stl', 'Standard Template Library', 100, 1001, [
  { title: 'Vector Basics {n}', difficulty: 'Easy', statement: 'Use std::vector.', input: 'None', output: 'Vector printed', hint: 'Use #include <vector>; vector<int> v; v.push_back(val);' },
  { title: 'Vector Push Pop {n}', difficulty: 'Easy', statement: 'push_back and pop_back.', input: 'None', output: 'Push/pop done', hint: 'push_back adds at end; pop_back removes last element.' },
  { title: 'Vector Size Capacity {n}', difficulty: 'Easy', statement: 'Size and capacity.', input: 'None', output: 'Size and capacity', hint: 'Use v.size() for element count and v.capacity() for allocated space.' },
  { title: 'List Basics {n}', difficulty: 'Medium', statement: 'Use std::list.', input: 'None', output: 'List traversed', hint: 'Use #include <list>; list allows fast insertion/deletion anywhere.' },
  { title: 'Stack Basics {n}', difficulty: 'Medium', statement: 'Use std::stack.', input: 'None', output: 'Stack operations', hint: 'Use #include <stack>; LIFO: push(), pop(), top().' },
  { title: 'Queue Basics {n}', difficulty: 'Medium', statement: 'Use std::queue.', input: 'None', output: 'Queue operations', hint: 'Use #include <queue>; FIFO: push(), pop(), front(), back().' },
  { title: 'Priority Queue {n}', difficulty: 'Medium', statement: 'Use std::priority_queue.', input: 'None', output: 'Largest element', hint: 'priority_queue gives largest element by default using top().' },
  { title: 'Set Basics {n}', difficulty: 'Medium', statement: 'Use std::set.', input: 'None', output: 'Unique elements', hint: 'Use #include <set>; stores unique sorted elements.' },
  { title: 'Map Basics {n}', difficulty: 'Medium', statement: 'Use std::map.', input: 'None', output: 'Key-value pairs', hint: 'Use #include <map>; stores unique keys with associated values.' },
  { title: 'Unordered Map {n}', difficulty: 'Medium', statement: 'Use std::unordered_map.', input: 'None', output: 'Fast lookup', hint: 'Use #include <unordered_map>; hash table based, average O(1) lookup.' },
  { title: 'Sort Algorithm {n}', difficulty: 'Medium', statement: 'Use std::sort.', input: 'None', output: 'Sorted vector', hint: 'Use #include <algorithm>; std::sort(v.begin(), v.end());' },
  { title: 'Binary Search {n}', difficulty: 'Medium', statement: 'Use std::binary_search.', input: 'None', output: 'Found/Not found', hint: 'Requires sorted range; std::binary_search(v.begin(), v.end(), val).' },
  { title: 'Reverse Algorithm {n}', difficulty: 'Easy', statement: 'Use std::reverse.', input: 'None', output: 'Reversed vector', hint: 'std::reverse(v.begin(), v.end()); reverses in place.' },
  { title: 'Copy Algorithm {n}', difficulty: 'Easy', statement: 'Use std::copy.', input: 'None', output: 'Elements copied', hint: 'std::copy(source.begin(), source.end(), dest.begin());' },
  { title: 'Lambda Function {n}', difficulty: 'Medium', statement: 'Lambda with sort.', input: 'None', output: 'Custom sort done', hint: 'Use [] (params) { body; } as custom comparator in sort.' },
]);

// 12. DSA
generateProblems('dsa', 'Data Structures & Algorithms', 100, 1101, [
  { title: 'Big O Notation {n}', difficulty: 'Easy', statement: 'Analyze time complexity.', input: 'None', output: 'O(n)', hint: 'Count how many operations grow with input size n.' },
  { title: 'Linear Search {n}', difficulty: 'Easy', statement: 'Linear search.', input: '5\n1 2 3 4 5\n3', output: 'Found at index 2', hint: 'Check each element one by one from start to end.' },
  { title: 'Binary Search {n}', difficulty: 'Medium', statement: 'Binary search.', input: '5\n1 2 3 4 5\n3', output: 'Found at index 2', hint: 'Array must be sorted. Repeatedly check middle and discard half.' },
  { title: 'Linked List {n}', difficulty: 'Medium', statement: 'Singly linked list.', input: 'None', output: 'List created', hint: 'Each node has data and next pointer; traverse using next.' },
  { title: 'Doubly Linked List {n}', difficulty: 'Medium', statement: 'Doubly linked list.', input: 'None', output: 'Doubly list created', hint: 'Each node has next and prev pointers for bidirectional traversal.' },
  { title: 'Stack Using Array {n}', difficulty: 'Easy', statement: 'Stack using array.', input: 'None', output: 'Stack operations', hint: 'Use array with top index: push increments top, pop decrements top.' },
  { title: 'Queue Using Array {n}', difficulty: 'Easy', statement: 'Queue using array.', input: 'None', output: 'Queue operations', hint: 'Use front and rear indices; enqueue at rear, dequeue from front.' },
  { title: 'Bubble Sort {n}', difficulty: 'Medium', statement: 'Bubble sort.', input: '4\n4 3 2 1', output: '1 2 3 4', hint: 'Compare adjacent elements and swap if out of order; repeat n times.' },
  { title: 'Merge Sort {n}', difficulty: 'Hard', statement: 'Merge sort.', input: '4\n4 3 2 1', output: '1 2 3 4', hint: 'Divide array into halves, sort recursively, then merge two sorted halves.' },
  { title: 'Quick Sort {n}', difficulty: 'Hard', statement: 'Quick sort.', input: '4\n4 3 2 1', output: '1 2 3 4', hint: 'Pick pivot, partition array into smaller/greater, recurse on parts.' },
  { title: 'Recursion Basics {n}', difficulty: 'Easy', statement: 'Recursive N to 1.', input: '5', output: '5 4 3 2 1', hint: 'Print n, then call function with n-1 until n reaches 0 (base case).' },
  { title: 'Tower of Hanoi {n}', difficulty: 'Hard', statement: 'Tower of Hanoi.', input: '3', output: 'Moves printed', hint: 'Move n-1 disks to auxiliary, move largest to target, move n-1 to target.' },
  { title: 'BFS Graph {n}', difficulty: 'Hard', statement: 'BFS on graph.', input: 'None', output: 'BFS traversal', hint: 'Use queue; visit node, enqueue all unvisited neighbors.' },
  { title: 'DFS Graph {n}', difficulty: 'Hard', statement: 'DFS on graph.', input: 'None', output: 'DFS traversal', hint: 'Use recursion/stack; visit node, recursively visit unvisited neighbors.' },
  { title: 'Dijkstra Algorithm {n}', difficulty: 'Hard', statement: 'Dijkstra shortest path.', input: 'None', output: 'Shortest path', hint: 'Use priority queue to always expand the closest unvisited node.' },
  { title: 'Dynamic Programming {n}', difficulty: 'Hard', statement: 'DP memoization.', input: 'None', output: 'DP result', hint: 'Store results of subproblems to avoid recomputation.' },
  { title: 'Knapsack Problem {n}', difficulty: 'Hard', statement: '0/1 knapsack DP.', input: 'None', output: 'Max value', hint: 'dp[i][w] = max value using first i items with capacity w.' },
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
  document.getElementById("modalHint").textContent = problem.hint || "Think step by step.";

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
  document.getElementById("btnCopyStatement").addEventListener("click", () => {
    const statement = document.getElementById("modalStatement").textContent;
    navigator.clipboard.writeText(statement).then(() => {
      const btn = document.getElementById("btnCopyStatement");
      const original = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => btn.textContent = original, 1500);
    });
  });
  document.getElementById("modalMarkSolved").addEventListener("click", () => {
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
  document.getElementById("btnMarkSolvedRight").addEventListener("click", () => {
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
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  function startDailyChallenge() {
    const dailyProblem = problems.find(p => p.title === 'Reverse a Number');
    if (dailyProblem) openProblemModal(dailyProblem);
  }
  window.startDailyChallenge = startDailyChallenge;
});