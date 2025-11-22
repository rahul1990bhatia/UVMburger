---
id: "work_station"
title: "The Work Station"
icon: "Briefcase"
analogy:
  role: "The Organized Station"
  description: "Agent = Sequencer + Driver + Monitor grouped together."
code_snippet: |
  class burger_agent extends uvm_agent;
    burger_sequencer sequencer;
    burger_driver    driver;
    burger_monitor   monitor;
    
    function void build_phase(uvm_phase phase);
      monitor = burger_monitor::type_id::create("monitor", this);
      if (get_is_active() == UVM_ACTIVE) begin
        sequencer = burger_sequencer::type_id::create("sequencer", this);
        driver    = burger_driver::type_id::create("driver", this);
      end
    endfunction
  endclass
code_language: "systemverilog"
---

## The Work Station

We don't want staff wandering around aimlessly. We **group them into an organized station**.

An **Agent** (`uvm_agent`) wraps the **Sequencer**, **Driver**, and **Monitor** into a single, reusable unit.

Think of it as **the fry station** or **the burger station** - all the tools and people needed for one specific job.

## Active vs. Passive Mode

The agent has two modes:

### Active Mode (Cooking)
We're **actively driving stimulus** into the DUT.
- Instantiate: Sequencer + Driver + Monitor
- The Chef cooks orders
- Used in block-level verification

### Passive Mode (Watching)
We're just **observing** what's happening.
- Instantiate: Monitor only
- No driving - we're at the chip level watching transactions
- Used in integration testing

```systemverilog
class burger_agent extends uvm_agent;
  `uvm_component_utils(burger_agent)
  
  burger_sequencer sequencer;
  burger_driver    driver;
  burger_monitor   monitor;

  function new(string name, uvm_component parent);
    super.new(name, parent);
  endfunction

  function void build_phase(uvm_phase phase);
    super.build_phase(phase);
    
    // Monitor is ALWAYS created (we always observe)
    monitor = burger_monitor::type_id::create("monitor", this);
    
    // Driver and Sequencer only in ACTIVE mode
    if (get_is_active() == UVM_ACTIVE) begin
      sequencer = burger_sequencer::type_id::create("sequencer", this);
      driver    = burger_driver::type_id::create("driver", this);
    end
  endfunction

  function void connect_phase(uvm_phase phase);
    if (get_is_active() == UVM_ACTIVE) begin
      // Plug the Driver into the Sequencer
      driver.seq_item_port.connect(sequencer.seq_item_export);
    end
  endfunction
endclass
```

## Why Use Agents?

**Reusability**: Once you build a "burger_agent", you can drop it into any project that needs burger verification.

**Organization**: All related components stay together - no loose parts.

**Flexibility**: Switch between active and passive without changing code.

## Configuration

You set the agent's mode in the environment or test:

```systemverilog
class burger_env extends uvm_env;
  burger_agent agent;
  
  function void build_phase(uvm_phase phase);
    super.build_phase(phase);
    agent = burger_agent::type_id::create("agent", this);
    
    // Set to ACTIVE for block-level, PASSIVE for chip-level
    agent.is_active = UVM_ACTIVE;
  endfunction
endclass
```

## Key Takeaways

- **Agent** = Sequencer + Driver + Monitor (organized station)
- **Active Mode** = Drive stimulus (block-level verification)
- **Passive Mode** = Only monitor (chip-level/integration)
- Agents make verification IP **plug-and-play** reusable
