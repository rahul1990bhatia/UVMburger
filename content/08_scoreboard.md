---
id: "scoreboard"
title: "The Shift Manager"
icon: "ClipboardCheck"
analogy:
  role: "Quality Control"
  description: "Scoreboard = Manager. Compares Order (Expected) vs Burger (Actual)."
code_snippet: |
  class burger_scoreboard extends uvm_scoreboard;
    `uvm_component_utils(burger_scoreboard)
    
    // Mailbox to receive reviews
    uvm_analysis_imp #(burger_item, burger_scoreboard) analysis_export;

    // This triggers whenever the Monitor shouts "Found one!"
    function void write(burger_item item);
      if (item.patty_type == 2) 
        `uvm_info("SCOREBOARD", "Veggie burger served correctly!", UVM_LOW)
      else
        `uvm_info("SCOREBOARD", "Meat burger served.", UVM_LOW)
    endfunction
  endclass
code_language: "systemverilog"
---

## Quality Control
The Manager ensures the Order matches the Result.
- They receive the "Actual Burger" from the Monitor.
- They compare it against the "Expected Order".
- If they match, great! If not, **UVM_ERROR**.

## Analysis Imp
The Scoreboard uses an `uvm_analysis_imp` to receive the broadcast from the Monitor.
It implements the `write()` function to process the incoming transaction.
