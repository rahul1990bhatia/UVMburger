---
id: "seq-item"
title: "The Order Ticket"
icon: "ScrollText"
analogy:
  role: "The Order"
  description: "Sequence Item = Customer Order. Constraints = Menu Rules."
code_snippet: |
  class burger_item extends uvm_sequence_item;
    // 1. The Food (Data)
    rand bit [1:0] patty_type; // 0=Beef, 1=Chicken, 2=Veggie
    rand bit       is_combo;   // 1=Fries included

    // 2. The Rules (Constraints)
    constraint c_diet { patty_type inside {0, 1, 2}; }
    constraint c_upsell { is_combo dist { 1:=80, 0:=20 }; } // 80% chance of combo

    // 3. The Magic Macros (Boilerplate)
    `uvm_object_utils_begin(burger_item)
      `uvm_field_int(patty_type, UVM_ALL_ON)
      `uvm_field_int(is_combo, UVM_ALL_ON)
    `uvm_object_utils_end

    function new(string name = "burger_item");
      super.new(name);
    endfunction
  endclass
code_language: "systemverilog"
---

## The Transaction
Data travels in packets called **Transactions** (`uvm_sequence_item`).
Analogy: The Customer Order.

## The Menu Rules (Constraints)
We don't just want random noise; we want valid orders.
- **`inside`**: Limits values to valid options (Beef, Chicken, Veggie).
- **`dist`**: Biases the randomization (80% chance of ordering a Combo).
