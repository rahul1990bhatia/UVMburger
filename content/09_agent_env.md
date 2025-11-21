---
id: "agent"
title: "The Work Station"
icon: "Network"
analogy:
  role: "The Station"
  description: "Agent = Work Station. Bundles Chef, Waiter, and Critic."
code_snippet: |
  class burger_agent extends uvm_agent;
    `uvm_component_utils(burger_agent)

    burger_sequencer sequencer;
    burger_driver    driver;
    burger_monitor   monitor;

    function void build_phase(uvm_phase phase);
      monitor = burger_monitor::type_id::create("monitor", this);

      // Only hire cooking staff if ACTIVE
      if (get_is_active() == UVM_ACTIVE) begin
        sequencer = burger_sequencer::type_id::create("sequencer", this);
        driver    = burger_driver::type_id::create("driver", this);
      end
    endfunction

    function void connect_phase(uvm_phase phase);
      if (get_is_active() == UVM_ACTIVE) begin
        // Connect Waiter to Chef
        driver.seq_item_port.connect(sequencer.seq_item_export);
      end
    endfunction
  endclass
code_language: "systemverilog"
---

## The Station
An Agent bundles the components related to a specific interface.
- **Active Agent:** Has a Driver and Sequencer. It drives traffic. (The Kitchen)
- **Passive Agent:** Only has a Monitor. It just watches. (The Health Inspector)

## Configuration
We use `get_is_active()` to decide whether to build the Driver and Sequencer.
This makes the Agent reusable in different environments.
