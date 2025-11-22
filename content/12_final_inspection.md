---
id: "final_quiz"
title: "The Final Inspection"
icon: "Award"
analogy:
  role: "Health Inspector's Final Exam"
  description: "Prove you're ready to run your own UVM franchise!"
quiz:
  - question: "What is the primary benefit of using UVM over traditional Verilog testbenches?"
    options:
      - "It's faster to compile"
      - "Standardization and reusability across projects"
      - "It uses less memory"
      - "It's easier to learn"
    correct: 1
  - question: "In the Burger Shop analogy, what does the uvm_driver represent?"
    options:
      - "The customer placing orders"
      - "The line cook driving signals to the DUT"
      - "The food critic observing quality"
      - "The shift manager checking results"
    correct: 1
  - question: "What is the purpose of uvm_config_db?"
    options:
      - "To compile SystemVerilog code"
      - "To share configuration data and virtual interfaces across components"
      - "To generate random test patterns"
      - "To measure code coverage"
    correct: 1
  - question: "Which UVM phase is used to instantiate and configure components?"
    options:
      - "run_phase"
      - "connect_phase"
      - "build_phase"
      - "extract_phase"
    correct: 2
  - question: "In the restaurant analogy, what does the uvm_monitor do?"
    options:
      - "Cooks the burgers"
      - "Takes customer orders"
      - "Silently observes and reports what's happening"
      - "Manages the kitchen staff"
    correct: 2
  - question: "What is a sequence_item in UVM?"
    options:
      - "A list of test cases"
      - "A transaction representing data to be driven or monitored"
      - "A type of monitor"
      - "A verification component"
    correct: 1
  - question: "What does TLM stand for in UVM?"
    options:
      - "Test Level Monitoring"
      - "Transaction Level Modeling"
      - "Testbench Logic Manager"
      - "Timing Level Measurement"
    correct: 1
  - question: "In the Burger Shop, the uvm_sequencer is like a:"
    options:
      - "Grill"
      - "Food critic"
      - "Waiter managing the flow of orders"
      - "Restaurant manager"
    correct: 2
  - question: "What is the purpose of raise_objection() in a UVM test?"
    options:
      - "To report an error"
      - "To prevent simulation from ending prematurely"
      - "To randomize data"
      - "To connect components"
    correct: 1
  - question: "What does a modport define in an interface?"
    options:
      - "The clock frequency"
      - "Access permissions (input/output) for different components"
      - "The number of signals"
      - "The simulation time"
    correct: 1
  - question: "In UVM, what is the scoreboard's primary job?"
    options:
      - "Drive stimulus to the DUT"
      - "Compare expected vs. actual results"
      - "Monitor signals passively"
      - "Generate clock signals"
    correct: 1
  - question: "What does 'is_active' control in a uvm_agent?"
    options:
      - "Whether the agent is powered on"
      - "Whether the agent drives stimulus or just monitors"
      - "The speed of the agent"
      - "The priority of the agent"
    correct: 1
  - question: "In the restaurant analogy, what is the top module (module top)?"
    options:
      - "The menu"
      - "The construction site where hardware meets software"
      - "The customer"
      - "The health inspector"
    correct: 1
  - question: "What is the purpose of constraints in a sequence_item?"
    options:
      - "To slow down simulation"
      - "To limit randomization to legal/meaningful values"
      - "To display debug messages"
      - "To connect components"
    correct: 1
  - question: "Which UVM component typically contains both an agent and a scoreboard?"
    options:
      - "uvm_driver"
      - "uvm_test"
      - "uvm_env (environment)"
      - "uvm_sequencer"
    correct: 2
---

## 🏆 The Final Inspection

Congratulations on making it this far! You've learned how to run a complete UVM verification franchise. Now it's time to prove you're ready for the **Health Inspector's Final Exam**.

This quiz covers the entire UVM methodology using our burger shop analogies. Answer all questions correctly to earn your **Head Chef of Verification** certification!

## What You've Mastered

Throughout this course, you've learned:

✅ **The Philosophy** - Why UVM beats the street stall approach  
✅ **Object-Oriented Programming** - The ingredients of modern verification  
✅ **Interfaces & Modports** - The service window with proper access control  
✅ **UVM Components** - From sequence items to environments  
✅ **The Top Module** - Where hardware meets software  
✅ **Complete Testbench** - A working example you can run today  

## Ready to Test Your Skills?

The quiz below tests your understanding of:
- **UVM Fundamentals** - Core concepts and terminology
- **Component Roles** - What each UVM class does
- **Best Practices** - Why we do things the UVM way
- **The Big Picture** - How everything fits together

Take your time, and remember: In a real franchise, the health inspector doesn't accept "almost correct" burgers! 🍔

---

**Good luck, future Head Chef!** 👨‍🍳✨
