---
id: "oop-basics"
title: "The Ingredients (OOP Basics)"
icon: "FlaskConical"
analogy:
  role: "The Recipe"
  description: "Class = Recipe Card. Object = The Burger. Inheritance = Secret Menu."
code_snippet: |
  // The Base Recipe
  virtual class Burger;
    rand bit [3:0] patties;
    virtual function void cook();
      $display("Grilling %0d patties...", patties);
    endfunction
  endclass

  // The Extended Recipe (Inheritance)
  class CheeseBurger extends Burger;
    bit has_cheese = 1;
    function void cook();
      super.cook(); // Do the basic grilling first
      $display("Melting the cheese... Delicious!");
    endfunction
  endclass
code_language: "systemverilog"
---

## Class vs. Object (The Blueprint vs. The Building)
To run a franchise, you need to understand Object-Oriented Programming (OOP).
- **Class (The Recipe Card):** This is just a piece of paper. It lists ingredients (variables) and cooking steps (functions). You cannot eat the paper.
- **Object (The Burger):** This is the physical, edible thing created from the recipe. `Burger my_lunch = new();` creates a real burger object in memory.

## Inheritance (The Secret Menu)
We don't rewrite the entire menu just to add a slice of cheese. We take the existing `Burger` recipe and **extend** it.
- We create a new class `CheeseBurger` that inherits everything from `Burger`.
- We don't need to re-define "bun" or "meat". We just add `bit has_cheese = 1;`.

## Polymorphism (The Manager's Magic)
The Manager (Testbench) doesn't want to know if it's a Hamburger or a Cheeseburger. They just want to shout "COOK IT!".
- **Virtual Functions:** By marking `cook()` as `virtual`, we allow child classes to override it.
- If the Manager holds a generic `Burger` handle that points to a `CheeseBurger`, calling `cook()` will run the **Cheeseburger's** instructions (melting cheese).
