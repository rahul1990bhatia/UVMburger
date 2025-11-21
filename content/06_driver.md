---
id: "driver"
title: "The Line Cook"
icon: "ChefHat"
analogy:
  role: "The Chef"
  description: "Driver = Chef. Converts Orders (Objects) into Pin Wiggles."
code_snippet: |
  class burger_driver extends uvm_driver #(burger_item);
    `uvm_component_utils(burger_driver)
    virtual burger_if vif; // Access to the Service Window

    task run_phase(uvm_phase phase);
      forever begin
        // 1. Get the next ticket from the Waiter
        seq_item_port.get_next_item(req);
        
        // 2. Cook it! (Drive signals to DUT)
        @(posedge vif.clk);
        vif.order_type <= req.patty_type;
        `uvm_info("DRIVER", $sformatf("Cooking patty type: %0d", req.patty_type), UVM_MEDIUM)
        
        // 3. Tell Waiter we are done
        seq_item_port.item_done();
      end
    endtask
  endclass
code_language: "systemverilog"
---

## The Cooking Loop
The Chef (Driver) has a simple job:
1.  **`get_next_item(req)`**: Ask the Waiter for an order.
2.  **Drive Signals**: Wiggle the pins on the DUT (Grill).
3.  **`item_done()`**: Tell the Waiter the order is ready.

## Virtual Interface
The Driver uses the `virtual interface` handle (`vif`) to reach out of the class and touch the actual hardware signals.
