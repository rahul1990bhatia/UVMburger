---
id: "sequencer"
title: "The Waiter"
icon: "User"
analogy:
  role: "The Waiter"
  description: "Sequencer = Traffic Cop. Holds tickets and hands them to the Chef."
code_snippet: |
  // Define the Waiter class specializing in burger_items
  typedef uvm_sequencer #(burger_item) burger_sequencer;
code_language: "systemverilog"
---

## The Traffic Cop
The Sequencer holds the tickets and hands them to the Chef one by one.
It manages the flow of orders to the kitchen (Arbitration).

## Why do we need it?
If multiple customers (Sequences) are shouting orders at once, the Waiter decides who gets served first.
- **FIFO:** First come, first served.
- **Priority:** VIP customers go first.
