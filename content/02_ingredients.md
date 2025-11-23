---
id: "oop-basics"
title: "The Ingredients (OOP Basics)"
icon: "FlaskConical"
analogy:
  role: "The Recipe"
  description: "Class = Recipe Card. Object = The Burger. Inheritance = Secret Menu."
code_snippet: |
  // The Recipe (Class)
  class Burger;
    rand bit [3:0] patties;
    
    function void cook();
      $display("Grilling %0d patties...", patties);
    endfunction
  endclass

  // The Burger (Object)
  Burger my_lunch;
  initial begin
    my_lunch = new();  // Create the object
    my_lunch.cook();   // Use the object
  end
code_language: "systemverilog"
---

## Class vs. Object (The Blueprint vs. The Building)

To run a franchise, you need to understand Object-Oriented Programming (OOP).

### The Analogy

| Term | Analogy | Description |
| :--- | :--- | :--- |
| **Class** | **The Recipe Card** | Just a piece of paper. Lists ingredients and steps. You cannot eat it. |
| **Object** | **The Burger** | The physical, edible thing created from the recipe. |
| **Handle** | **The Order Number** | A reference to the object. |

### The Code

```systemverilog
// The RECIPE (Class) - Just a blueprint on paper
class Burger;
  rand bit [3:0] patties;    // Variable (ingredient)
  rand bit       has_cheese; // Another variable
  
  // Method (cooking instruction)
  function void cook();
    $display("Grilling %0d patties...", patties);
  endfunction
endclass

// The BURGER (Object) - The real thing you can eat!
Burger my_lunch;           // Declare a handle
my_lunch = new();          // Actually CREATE the object
my_lunch.cook();           // USE the object
```

**Key Point**: A class is just a template. You must call `new()` to create an actual object.

## Inheritance (The Secret Menu)

We don't rewrite the entire menu just to add a slice of cheese. We take the existing `Burger` recipe and **extend** it.

```systemverilog
// Base burger has everything standard
class Burger;
  rand bit [1:0] patty_type;
  bit has_bun = 1;
  
  virtual function void prepare();
    $display("Basic burger preparation");
  endfunction
endclass

// CheeseBurger EXTENDS Burger - gets everything for free!
class CheeseBurger extends Burger;
  bit has_cheese = 1;  // Add new ingredient
  
  // Override the preparation
  function void prepare();
    super.prepare();   // Do base preparation first
    $display("Adding melted cheese!");
  endfunction
endclass
```

## Polymorphism (The Manager's Magic)

The Manager (Testbench) doesn't want to know if it's a Hamburger or a Cheeseburger. They just want to shout "COOK IT!".

```systemverilog
// Manager holds a generic Burger handle
Burger order;

// But it can point to ANY burger type!
order = new CheeseBurger();  // Polymorphism!
order.prepare();              // Calls CheeseBurger's prepare()!
```

**Why This Matters**: Your testbench can handle different transaction types without changing code.
