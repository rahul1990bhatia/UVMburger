---
id: "complete_example"
title: "The Grand Combo Meal"
icon: "Package"
analogy:
  role: "Everything Together"
  description: "A complete, runnable UVM testbench in one file."
code_snippet: |
  // Complete working example - ready to run!
  // VCS: vcs -sverilog -ntb_opts uvm uvm_burger_complete.sv -R +UVM_TESTNAME=burger_test
  // Xcelium: xrun -uvm uvm_burger_complete.sv +UVM_TESTNAME=burger_test
code_language: "systemverilog"
quiz:
  - question: "In the complete example, what does the DUT (burger_kitchen) do with the input?"
    options:
      - "Inverts it"
      - "Passes it through with 1 cycle delay"
      - "Adds 1 to it"
      - "Randomizes it"
    correct: 1
  - question: "How many burgers does the test sequence order?"
    options:
      - "3"
      - "5"
      - "10"
      - "Random number"
    correct: 1
  - question: "What is the purpose of phase.raise_objection() and phase.drop_objection()?"
    options:
      - "To generate random data"
      - "To control when the simulation ends"
      - "To compile the code"
      - "To reset the DUT"
    correct: 1
---

## Order Up! 🍔🍟

You asked for the **Grand Combo Meal**: A complete, fully functioning, copy-paste-runnable UVM testbench.

I have packed the entire franchise—from the Interface (Service Window) to the Test (Opening Day)—into a single file. You can run this directly on **EDA Playground** (select Synopsys VCS or Cadence Xcelium) or your local simulator.

## How to Run

Save the code below as `uvm_burger_complete.sv` and run:

**VCS:**
```bash
vcs -sverilog -ntb_opts uvm uvm_burger_complete.sv -R +UVM_TESTNAME=burger_test
```

**Xcelium:**
```bash
xrun -uvm uvm_burger_complete.sv +UVM_TESTNAME=burger_test
```

**Questa:**
```bash
vlog -sv uvm_burger_complete.sv +incdir+$UVM_HOME/src $UVM_HOME/src/uvm_pkg.sv
vsim top +UVM_TESTNAME=burger_test -do "run -all"
```

## The Complete Code

```systemverilog
// =============================================================================
//  🍔 THE UVMBURGER FRANCHISE - COMPLETE WORKING EXAMPLE
// =============================================================================

`include "uvm_macros.svh"
import uvm_pkg::*;

// =============================================================================
//  SECTION 1: THE PHYSICAL WORLD (The Kitchen Hardware)
// =============================================================================

// 1. The Service Window (Interface)
interface burger_if(input bit clk);
  logic       rst_n;       // 0=Reset (Closed), 1=Active (Open)
  logic [1:0] patty_type;  // 0=Beef, 1=Chicken, 2=Veggie
  logic       valid_in;    // Customer placing order
  logic [1:0] burger_out;  // The cooked burger
  logic       valid_out;   // Order up!
endinterface

// 2. The Grill (DUT - Design Under Test)
// Simple Logic: It takes 1 clock cycle to cook. Output = Input.
module burger_kitchen(
  input        clk,
  input        rst_n,
  input  [1:0] patty_type,
  input        valid_in,
  output reg [1:0] burger_out,
  output reg       valid_out
);
  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      burger_out <= 0;
      valid_out  <= 0;
    end else begin
      // The cooking logic (Pass-through with 1 cycle delay)
      valid_out  <= valid_in;
      burger_out <= patty_type;
    end
  end
endmodule

// =============================================================================
//  SECTION 2: THE FRANCHISE MANUAL (UVM Package)
// =============================================================================
package burger_pkg;
  import uvm_pkg::*;

  // ---------------------------------------------------------------------------
  //  PAGE 4: THE ORDER TICKET (Sequence Item)
  // ---------------------------------------------------------------------------
  class burger_item extends uvm_sequence_item;
    rand bit [1:0] patty_type; // The order
    bit [1:0]      burger_out; // The result (for checking)

    // Menu Rules (Constraints)
    constraint c_menu { patty_type inside {0, 1, 2}; }

    `uvm_object_utils_begin(burger_item)
      `uvm_field_int(patty_type, UVM_ALL_ON)
      `uvm_field_int(burger_out, UVM_ALL_ON)
    `uvm_object_utils_end

    function new(string name = "burger_item");
      super.new(name);
    endfunction
  endclass

  // ---------------------------------------------------------------------------
  //  PAGE 5: THE WAITER (Sequencer)
  // ---------------------------------------------------------------------------
  typedef uvm_sequencer #(burger_item) burger_sequencer;

  // ---------------------------------------------------------------------------
  //  PAGE 6: THE LINE COOK (Driver)
  // ---------------------------------------------------------------------------
  class burger_driver extends uvm_driver #(burger_item);
    `uvm_component_utils(burger_driver)
    virtual burger_if vif;

    function new(string name, uvm_component parent);
      super.new(name, parent);
    endfunction

    function void build_phase(uvm_phase phase);
      super.build_phase(phase);
      if (!uvm_config_db#(virtual burger_if)::get(this, "", "vif", vif))
        `uvm_fatal("DRIVER", "No virtual interface found!")
    endfunction

    task run_phase(uvm_phase phase);
      vif.valid_in <= 0;
      wait(vif.rst_n == 1);

      forever begin
        seq_item_port.get_next_item(req);
        
        @(posedge vif.clk);
        vif.valid_in   <= 1;
        vif.patty_type <= req.patty_type;
        `uvm_info("CHEF", $sformatf("Cooking Patty Type: %0d", req.patty_type), UVM_HIGH)
        
        @(posedge vif.clk);
        vif.valid_in <= 0;
        seq_item_port.item_done();
      end
    endtask
  endclass

  // ---------------------------------------------------------------------------
  //  PAGE 7: THE FOOD CRITIC (Monitor)
  // ---------------------------------------------------------------------------
  class burger_monitor extends uvm_monitor;
    `uvm_component_utils(burger_monitor)
    virtual burger_if vif;
    uvm_analysis_port #(burger_item) item_collected_port;

    function new(string name, uvm_component parent);
      super.new(name, parent);
      item_collected_port = new("item_collected_port", this);
    endfunction

    function void build_phase(uvm_phase phase);
      super.build_phase(phase);
      if (!uvm_config_db#(virtual burger_if)::get(this, "", "vif", vif))
        `uvm_fatal("MONITOR", "No interface found!")
    endfunction

    task run_phase(uvm_phase phase);
      forever begin
        @(posedge vif.clk);
        if (vif.valid_out) begin
          burger_item item = burger_item::type_id::create("item");
          item.burger_out = vif.burger_out;
          
          `uvm_info("CRITIC", $sformatf("I saw a burger! Type: %0d", item.burger_out), UVM_MEDIUM)
          item_collected_port.write(item);
        end
      end
    endtask
  endclass

  // ---------------------------------------------------------------------------
  //  PAGE 9: THE WORK STATION (Agent)
  // ---------------------------------------------------------------------------
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
      monitor = burger_monitor::type_id::create("monitor", this);
      if (get_is_active() == UVM_ACTIVE) begin
        sequencer = burger_sequencer::type_id::create("sequencer", this);
        driver    = burger_driver::type_id::create("driver", this);
      end
    endfunction

    function void connect_phase(uvm_phase phase);
      if (get_is_active() == UVM_ACTIVE) begin
        driver.seq_item_port.connect(sequencer.seq_item_export);
      end
    endfunction
  endclass

  // ---------------------------------------------------------------------------
  //  PAGE 8: THE SHIFT MANAGER (Scoreboard)
  // ---------------------------------------------------------------------------
  class burger_scoreboard extends uvm_scoreboard;
    `uvm_component_utils(burger_scoreboard)
    uvm_analysis_imp #(burger_item, burger_scoreboard) item_export;

    function new(string name, uvm_component parent);
      super.new(name, parent);
      item_export = new("item_export", this);
    endfunction

    function void write(burger_item item);
      if (item.burger_out inside {0, 1, 2}) begin
        `uvm_info("MANAGER", $sformatf("Valid Burger: %0d. Good!", item.burger_out), UVM_LOW)
      end else begin
        `uvm_error("MANAGER", "BURNT!")
      end
    endfunction
  endclass

  // ---------------------------------------------------------------------------
  //  PAGE 10: THE RESTAURANT (Environment)
  // ---------------------------------------------------------------------------
  class burger_env extends uvm_env;
    `uvm_component_utils(burger_env)
    burger_agent      agent;
    burger_scoreboard scoreboard;

    function new(string name, uvm_component parent);
      super.new(name, parent);
    endfunction

    function void build_phase(uvm_phase phase);
      super.build_phase(phase);
      agent      = burger_agent::type_id::create("agent", this);
      scoreboard = burger_scoreboard::type_id::create("scoreboard", this);
    endfunction

    function void connect_phase(uvm_phase phase);
      agent.monitor.item_collected_port.connect(scoreboard.item_export);
    endfunction
  endclass

  // ---------------------------------------------------------------------------
  //  THE MENU (Sequences)
  // ---------------------------------------------------------------------------
  class order_5_burgers extends uvm_sequence #(burger_item);
    `uvm_object_utils(order_5_burgers)

    function new(string name = "order_5_burgers");
      super.new(name);
    endfunction

    task body();
      repeat(5) begin
        req = burger_item::type_id::create("req");
        start_item(req);
        assert(req.randomize());
        finish_item(req);
      end
    endtask
  endclass

  // ---------------------------------------------------------------------------
  //  OPENING DAY (Test)
  // ---------------------------------------------------------------------------
  class burger_test extends uvm_test;
    `uvm_component_utils(burger_test)
    burger_env env;

    function new(string name, uvm_component parent);
      super.new(name, parent);
    endfunction

    function void build_phase(uvm_phase phase);
      super.build_phase(phase);
      env = burger_env::type_id::create("env", this);
    endfunction

    task run_phase(uvm_phase phase);
      order_5_burgers seq;
      seq = order_5_burgers::type_id::create("seq");

      phase.raise_objection(this);
      `uvm_info("TEST", "Restaurant is OPEN!", UVM_LOW)
      
      seq.start(env.agent.sequencer);
      
      #100;
      `uvm_info("TEST", "Restaurant is CLOSED!", UVM_LOW)
      phase.drop_objection(this);
    endtask
  endclass

endpackage

// =============================================================================
//  SECTION 3: THE CONSTRUCTION SITE (Top Module)
// =============================================================================
module top;
  import uvm_pkg::*;
  import burger_pkg::*;

  // 1. Generate Power (Clock)
  bit clk;
  always #5 clk = ~clk;

  // 2. Reset Logic
  bit rst_n;
  initial begin
    clk = 0;
    rst_n = 0;
    #20 rst_n = 1;
  end

  // 3. Instantiate Interface & DUT
  burger_if vif(clk);
  
  burger_kitchen DUT(
    .clk(vif.clk),
    .rst_n(rst_n),
    .patty_type(vif.patty_type),
    .valid_in(vif.valid_in),
    .burger_out(vif.burger_out),
    .valid_out(vif.valid_out)
  );

  // 4. Pass Interface to UVM & Start Test
  initial begin
    assign vif.rst_n = rst_n;
    uvm_config_db#(virtual burger_if)::set(null, "*", "vif", vif);
    run_test();
  end
endmodule
```

## What This Does

1. **Interface** - Defines the signals between testbench and DUT
2. **DUT** - Simple 1-cycle delay burger cooker
3. **Sequence Item** - The order ticket (burger type)
4. **Driver** - Drives signals to the DUT
5. **Monitor** - Observes what comes out
6. **Scoreboard** - Checks if burgers are valid
7. **Agent** - Groups driver, sequencer, monitor
8. **Environment** - Contains agent and scoreboard
9. **Test** - Orders 5 random burgers
10. **Top Module** - Connects everything and starts simulation

## Try It Yourself!

Copy this code to **EDA Playground** and run it. You'll see:
- 5 random orders being placed
- The chef cooking them
- The critic observing
- The manager verifying quality

**Welcome to UVM!** 🎉
