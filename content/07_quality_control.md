---
id: "quality_control"
title: "Management & Quality Control"
icon: "ClipboardCheck"
analogy:
  role: "The Shift Manager"
  description: "Scoreboard = Manager comparing Expected vs Actual."
code_snippet: |
  class burger_scoreboard extends uvm_scoreboard;
    uvm_analysis_imp #(burger_item, burger_scoreboard) item_export;
    
    function void write(burger_item item);
      if (expected == item.patty_type)
        `uvm_info("PASS", "Order correct!", UVM_LOW)
      else
        `uvm_error("FAIL", "Wrong burger!")
    endfunction
  endclass
code_language: "systemverilog"
---

## The Shift Manager

The **Scoreboard** is the **shift manager** sitting in the back office with two sources of information:

1. **Expected**: What the customer *ordered* (from the sequence/driver)
2. **Actual**: What the kitchen *produced* (from the monitor)

**The Logic:**
```systemverilog
if (Expected == Actual) 
  return PASS;
else
  return FAIL;
```

## How It Works

```systemverilog
class burger_scoreboard extends uvm_scoreboard;
  `uvm_component_utils(burger_scoreboard)
  
  // The Manager's inbox (receives from Monitor)
  uvm_analysis_imp #(burger_item, burger_scoreboard) item_export;
  
  // Storage for expected results
  burger_item expected_queue[$];

  function new(string name, uvm_component parent);
    super.new(name, parent);
    item_export = new("item_export", this);
  endfunction

  // Called automatically when Monitor broadcasts
  function void write(burger_item actual_item);
    burger_item expected_item;
    
    if (expected_queue.size() == 0) begin
      `uvm_error("SCOREBOARD", "Got result but no expected item!")
      return;
    end
    
    // Pop the first expected item
    expected_item = expected_queue.pop_front();
    
    // Compare
    if (actual_item.patty_type == expected_item.patty_type) begin
      `uvm_info("SCOREBOARD", $sformatf("PASS: Expected=%0d, Got=%0d", 
                expected_item.patty_type, actual_item.patty_type), UVM_LOW)
    end else begin
      `uvm_error("SCOREBOARD", $sformatf("FAIL: Expected=%0d, Got=%0d", 
                expected_item.patty_type, actual_item.patty_type))
    end
  endfunction
endclass
```

## Getting the Expected Values

**Option 1: Listen to the Driver**
```systemverilog
 // In the environment, also connect driver's analysis port to scoreboard
agent.driver.item_sent_port.connect(scoreboard.expected_export);
```

**Option 2: Predict from Input**
The scoreboard can implement a **reference model** - a software version of the DUT's behavior.

## Analysis Imp

The **`uvm_analysis_imp`** is the receiving end of TLM communication:
- Monitor has an **analysis_port** (broadcaster)
- Scoreboard has an **analysis_imp** (receiver)  
- Connected in `connect_phase`
- Scoreboard's `write()` function is automatically called when data arrives

## Beyond Simple Comparison

Advanced scoreboards can:
- **Track Coverage**: Did we test all burger types?
- **Performance Metrics**: How long did each order take?
- **Error Injection**: Intentionally break things to test error handling
- **Self-Checking**: Generate expected values using a golden model

## Key Takeaways

- **Scoreboard** = The quality control manager
- Compares **Expected** vs **Actual** results
- Uses **`uvm_analysis_imp`** to receive monitored transactions
- Reports **`uvm_info`** for pass, **`uvm_error`** for fail
- Can implement reference models for complex checking
