---
id: "monitor"
title: "The Food Critic"
icon: "Eye"
analogy:
  role: "The Critic"
  description: "Monitor = Food Critic. Passive observer who broadcasts reviews."
code_snippet: |
  class burger_monitor extends uvm_monitor;
    `uvm_component_utils(burger_monitor)
    virtual burger_if vif;
    uvm_analysis_port #(burger_item) item_collected_port; // The Megaphone

    task run_phase(uvm_phase phase);
      forever begin
        @(posedge vif.clk);
        // 1. Spy on the window
        if (vif.ready_light == 1) begin
          burger_item item = burger_item::type_id::create("item");
          item.patty_type = vif.order_type; // Reconstruct the order
          
          // 2. Broadcast to the world
          item_collected_port.write(item);
        end
      end
    endtask
  endclass
code_language: "systemverilog"
---

## Passive Observation
The Critic (Monitor) watches the service window.
It must **never** drive signals. It only observes.

## The Megaphone (Analysis Port)
When the Critic sees a burger, they don't just tell one person. They shout it to the world.
- **`uvm_analysis_port`**: A one-to-many broadcast channel.
- Anyone who cares (Scoreboard, Coverage Collector) can listen.
