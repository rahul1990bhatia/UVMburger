---
id: "grand_opening"
title: "The Grand Opening"
icon: "Rocket"
analogy:
  role: "The Restaurant & Construction Site"
  description: "Env = Floor Plan, Test = Opening Day, Top = Where Hardware Meets Software."
code_snippet: |
  class burger_test extends uvm_test;
    burger_env env;
    task run_phase(uvm_phase phase);
      phase.raise_objection(this);
      burger_sequence seq = burger_sequence::type_id::create("seq");
      seq.start(env.agent.sequencer);
      phase.drop_objection(this);
    endtask
  endclass
code_language: "systemverilog"
quiz:
  - question: "What is the primary purpose of the top module?"
    options:
      - "To generate random test cases"
      - "To connect static hardware with dynamic testbench"
      - "To display simulation results"
      - "To compile SystemVerilog code"
    correct: 1
  - question: "What does uvm_config_db do in the top module?"
    options:
      - "Generates clock signals"
      - "Compiles the design"
      - "Passes the interface handle to UVM components"
      - "Runs the simulation"
    correct: 2
  - question: "What does raise_objection() prevent?"
    options:
      - "Compilation errors"
      - "Simulation from ending prematurely"
      - "Random failures"
      - "Clock generation"
    correct: 1
---

## 1. The Environment (The Floor Plan)

The **Environment** (`uvm_env`) is the **floor plan** of the restaurant - it contains and connects all the major components.

```systemverilog
class burger_env extends uvm_env;
  `uvm_component_utils(burger_env)
  
  burger_agent      agent;
  burger_scoreboard scoreboard;

  function new(string name, uvm_component parent);
    super.new(name, parent);
  endfunction

  function void build_phase(uvm_phase phase);
    super.build_phase(phase);
    // Build the station and the manager's office
    agent      = burger_agent::type_id::create("agent", this);
    scoreboard = burger_scoreboard::type_id::create("scoreboard", this);
  endfunction

  function void connect_phase(uvm_phase phase);
    // Wire the Critic's megaphone to the Manager's speaker
    agent.monitor.item_collected_port.connect(scoreboard.item_export);
  endfunction
endclass
```

**The Environment's Job:**
- Create all agents and scoreboards
- Connect them via TLM ports
- Provide a reusable, self-contained verification environment

---

## 2. The Test (Opening Day)

The **Test** (`uvm_test`) is the **business plan** for today. It's the top-level UVM component that:
- Builds the environment
- Configures components
- Starts sequences
- Controls simulation lifetime

```systemverilog
class burger_test extends uvm_test;
  `uvm_component_utils(burger_test)
  
  burger_env env;

  function new(string name, uvm_component parent);
    super.new(name, parent);
  endfunction

  function void build_phase(uvm_phase phase);
    super.build_phase(phase);
    // Open the restaurant
    env = burger_env::type_id::create("env", this);
  endfunction

  task run_phase(uvm_phase phase);
    burger_sequence seq;
    seq = burger_sequence::type_id::create("seq");

    // Open for business
    phase.raise_objection(this, "Starting burger test");
    `uvm_info("TEST", "Restaurant is OPEN! Taking orders...", UVM_LOW)
    
    // Start serving customers
    seq.start(env.agent.sequencer);
    
    #100; // Give kitchen time to clean up
    
    // Close for the night
    `uvm_info("TEST", "Restaurant is CLOSED!", UVM_LOW)
    phase.drop_objection(this, "Ending burger test");
  endtask
endclass
```

**Objections Explained:**
- **`raise_objection()`**: "Don't end simulation yet, I'm working!"
- **`drop_objection()`**: "I'm done, you can end now."
- Simulation ends when ALL objections are dropped

---

## 3. The Construction Site (Top Module)

The **Top Module** is where the **static hardware world** meets the **dynamic UVM software world**. It's the construction site where everything comes together.

```systemverilog
module top;
  // Import UVM
  import uvm_pkg::*;
  `include "uvm_macros.svh"
  
  // Import our restaurant code
  import burger_pkg::*;

  // 1. POWER: Generate Clock & Reset
  bit clk;
  bit rst_n;
  
  initial begin
    clk = 0;
    rst_n = 0;
    #20 rst_n = 1; // Open shop after 20ns
  end
  
  always #5 clk = ~clk; // 10ns period (100MHz)

  // 2. EQUIPMENT: Instantiate Interface & DUT
  burger_if vif(clk);
  
  burger_kitchen DUT (
    .clk(vif.clk),
    .rst_n(rst_n),
    .order_type(vif.order_type),
    .ready_light(vif.ready_light)
  );

  // 3. KEYS: Pass Interface to UVM via Config DB
  initial begin
    // Connect reset to interface
    assign vif.rst_n = rst_n;
    
    // Post the interface handle on the bulletin board
    uvm_config_db#(virtual burger_if)::set(null, "*", "vif", vif);
    
    // 4. RIBBON CUTTING: Start the UVM test
    run_test();
  end
endmodule
```

**Four Critical Tasks:**
1. **Generate Clock/Reset** - The power supply
2. **Instantiate DUT & Interface** - The physical equipment
3. **Set Config DB** - Give UVM components access to the interface
4. **`run_test()`** - Start the UVM machinery

### Config DB in Detail

```systemverilog
uvm_config_db#(virtual burger_if)::set(null, "*", "vif", vif);
```

- **Type**: `virtual burger_if` - The data type we're storing
- **Scope**: `null` - Start from UVM root
- **Wildcard**: `"*"` - Any component can access it
- **Name**: `"vif"` - The lookup key
- **Value**: `vif` - The actual interface instance

Any UVM component can now retrieve it:
```systemverilog
if (!uvm_config_db#(virtual burger_if)::get(this, "", "vif", vif))
  `uvm_fatal("NO_VIF", "Interface not found!")
```

---

## Putting It All Together

**The Hierarchy:**
```
top (module)
└── burger_test (uvm_test)
    └── burger_env (uvm_env)
        ├── burger_agent (uvm_agent)
        │   ├── burger_sequencer
        │   ├── burger_driver
        │   └── burger_monitor
        └── burger_scoreboard
```

**The Flow:**
1. **Top module** creates clock, DUT, interface
2. **Top module** sets config DB and calls `run_test()`
3. **UVM builds hierarchy** (build_phase, top-down)
4. **UVM connects ports** (connect_phase, bottom-up)
5. **Test raises objection** and starts sequence
6. **Sequence generates transactions** → Sequencer → Driver
7. **Driver drives DUT**
8. **Monitor observes DUT** → Scoreboard
9. **Scoreboard checks** correctness
10. **Test drops objection** when done
11. **Simulation ends**

## Key Takeaways

- **Environment** = The restaurant floor plan (agents + scoreboards)
- **Test** = Opening day business plan (configuration + sequences)
- **Top Module** = Construction site (hardware + software bridge)
- **Objections** = Keep simulation alive until work is done
- **Config DB** = Share data between static and dynamic worlds
- **`run_test()`** = Start the entire UVM machinery

The restaurant is now ready for business! 🎉🍔
