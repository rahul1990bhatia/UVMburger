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
//  🍔 ENHANCED UVMBURGER FRANCHISE - COMPLETE WORKING EXAMPLE
//  Features: Sequences, Coverage, Reference Model, Factory Override Demo
// =============================================================================

`include "uvm_macros.svh"
import uvm_pkg::*;

// =============================================================================
//  SECTION 1: INTERFACE - The Service Window
// =============================================================================
interface burger_if(input bit clk);
  logic       rst_n;
  logic [1:0] patty_type;   // 0=Beef, 1=Chicken, 2=Veggie
  logic       valid_in;
  logic [1:0] burger_out;
  logic       valid_out;
  
  // Clocking block for testbench - avoids race conditions
  clocking cb @(posedge clk);
    default input #1step output #1;
    output patty_type, valid_in;
    input  burger_out, valid_out, rst_n;
  endclocking
  
  // Modports for access control
  modport driver_mp  (clocking cb, input clk, rst_n);
  modport monitor_mp (input clk, rst_n, patty_type, valid_in, burger_out, valid_out);
endinterface

// =============================================================================
//  SECTION 2: DUT - Design Under Test (The Grill)
// =============================================================================
module burger_kitchen(
  input        clk,
  input        rst_n,
  input  [1:0] patty_type,
  input        valid_in,
  output reg [1:0] burger_out,
  output reg       valid_out
);
  // Simple 1-cycle delay pipeline
  always @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      burger_out <= 2'b0;
      valid_out  <= 1'b0;
    end else begin
      valid_out  <= valid_in;
      burger_out <= patty_type;  // Pass-through (reference model behavior)
    end
  end
endmodule

// =============================================================================
//  SECTION 3: UVM PACKAGE - All Testbench Components
// =============================================================================
package burger_pkg;
  import uvm_pkg::*;
  `include "uvm_macros.svh"

  // -------------------------------------------------------------------------
  //  SEQUENCE ITEM - The Order Ticket
  // -------------------------------------------------------------------------
  class burger_item extends uvm_sequence_item;
    rand bit [1:0] patty_type;
    rand bit       is_combo;
    bit [1:0]      burger_out;  // For monitor to capture output
    
    // Constraints - make randomization meaningful
    constraint c_valid  { patty_type inside {[0:2]}; }
    constraint c_upsell { is_combo dist {1:=70, 0:=30}; }
    
    // Factory registration with field automation
    `uvm_object_utils_begin(burger_item)
      `uvm_field_int(patty_type, UVM_ALL_ON | UVM_DEC)
      `uvm_field_int(is_combo, UVM_ALL_ON)
      `uvm_field_int(burger_out, UVM_ALL_ON | UVM_DEC)
    `uvm_object_utils_end
    
    function new(string name = "burger_item");
      super.new(name);
    endfunction
    
    // Human-readable patty name
    function string get_patty_name();
      case (patty_type)
        0: return "Beef";
        1: return "Chicken";
        2: return "Veggie";
        default: return "Unknown";
      endcase
    endfunction
  endclass

  // -------------------------------------------------------------------------
  //  SEQUENCER - The Waiter (Traffic Cop)
  // -------------------------------------------------------------------------
  typedef uvm_sequencer #(burger_item) burger_sequencer;

  // -------------------------------------------------------------------------
  //  DRIVER - The Line Cook
  // -------------------------------------------------------------------------
  class burger_driver extends uvm_driver #(burger_item);
    `uvm_component_utils(burger_driver)
    
    virtual burger_if vif;
    int items_driven = 0;
    
    function new(string name, uvm_component parent);
      super.new(name, parent);
    endfunction
    
    function void build_phase(uvm_phase phase);
      super.build_phase(phase);
      if (!uvm_config_db#(virtual burger_if)::get(this, "", "vif", vif))
        `uvm_fatal("DRIVER", "❌ Virtual interface not found!")
    endfunction
    
    task run_phase(uvm_phase phase);
      // Initialize outputs
      vif.cb.valid_in <= 0;
      vif.cb.patty_type <= 0;
      
      // Wait for reset
      @(posedge vif.rst_n);
      @(vif.cb);
      
      forever begin
        // Get next item from sequencer (BLOCKS)
        seq_item_port.get_next_item(req);
        
        // Drive transaction
        vif.cb.valid_in   <= 1;
        vif.cb.patty_type <= req.patty_type;
        `uvm_info("DRIVER", $sformatf("🍳 Cooking %s burger (#%0d)", 
                  req.get_patty_name(), items_driven), UVM_MEDIUM)
        
        @(vif.cb);
        vif.cb.valid_in <= 0;
        items_driven++;
        
        // Signal completion to sequencer
        seq_item_port.item_done();
      end
    endtask
    
    function void report_phase(uvm_phase phase);
      `uvm_info("DRIVER", $sformatf("📊 Total items driven: %0d", items_driven), UVM_LOW)
    endfunction
  endclass

  // -------------------------------------------------------------------------
  //  MONITOR - The Food Critic (Observer Only!)
  // -------------------------------------------------------------------------
  class burger_monitor extends uvm_monitor;
    `uvm_component_utils(burger_monitor)
    
    virtual burger_if vif;
    uvm_analysis_port #(burger_item) ap;  // Broadcast port
    int items_observed = 0;
    
    function new(string name, uvm_component parent);
      super.new(name, parent);
      ap = new("ap", this);
    endfunction
    
    function void build_phase(uvm_phase phase);
      super.build_phase(phase);
      if (!uvm_config_db#(virtual burger_if)::get(this, "", "vif", vif))
        `uvm_fatal("MONITOR", "❌ Virtual interface not found!")
    endfunction
    
    task run_phase(uvm_phase phase);
      @(posedge vif.rst_n);
      
      forever begin
        @(posedge vif.clk);
        if (vif.valid_out) begin
          burger_item item = burger_item::type_id::create("observed_item");
          item.burger_out = vif.burger_out;
          item.patty_type = vif.burger_out;  // In this DUT, output = input
          
          `uvm_info("MONITOR", $sformatf("👀 Observed: %s burger", 
                    item.get_patty_name()), UVM_HIGH)
          items_observed++;
          ap.write(item);  // Broadcast to all listeners
        end
      end
    endtask
    
    function void report_phase(uvm_phase phase);
      `uvm_info("MONITOR", $sformatf("📊 Total items observed: %0d", items_observed), UVM_LOW)
    endfunction
  endclass

  // -------------------------------------------------------------------------
  //  COVERAGE COLLECTOR - Track What We've Tested
  // -------------------------------------------------------------------------
  class burger_coverage extends uvm_subscriber #(burger_item);
    `uvm_component_utils(burger_coverage)
    
    burger_item item;
    
    covergroup burger_cg with function sample(burger_item t);
      option.per_instance = 1;
      
      patty_cp: coverpoint t.patty_type {
        bins beef    = {0};
        bins chicken = {1};
        bins veggie  = {2};
        illegal_bins invalid = {3};
      }
      
      combo_cp: coverpoint t.is_combo {
        bins yes = {1};
        bins no  = {0};
      }
      
      // Cross coverage - all combinations tested?
      patty_X_combo: cross patty_cp, combo_cp;
    endgroup
    
    function new(string name, uvm_component parent);
      super.new(name, parent);
      burger_cg = new();
    endfunction
    
    // Called automatically when analysis port receives data
    function void write(burger_item t);
      item = t;
      burger_cg.sample(t);
    endfunction
    
    function void report_phase(uvm_phase phase);
      `uvm_info("COVERAGE", $sformatf("📈 Functional Coverage: %.2f%%", 
                burger_cg.get_inst_coverage()), UVM_LOW)
    endfunction
  endclass

  // -------------------------------------------------------------------------
  //  SCOREBOARD - Quality Control Manager
  // -------------------------------------------------------------------------
  class burger_scoreboard extends uvm_scoreboard;
    `uvm_component_utils(burger_scoreboard)
    
    uvm_analysis_imp #(burger_item, burger_scoreboard) actual_imp;
    burger_item expected_queue[$];
    
    int pass_cnt = 0;
    int fail_cnt = 0;
    
    function new(string name, uvm_component parent);
      super.new(name, parent);
      actual_imp = new("actual_imp", this);
    endfunction
    
    // Add expected item (from driver side)
    function void add_expected(burger_item item);
      expected_queue.push_back(item);
    endfunction
    
    // Called when monitor broadcasts actual result
    function void write(burger_item actual);
      burger_item expected;
      
      if (expected_queue.size() == 0) begin
        `uvm_error("SCOREBOARD", "❌ Received actual with no expected!")
        fail_cnt++;
        return;
      end
      
      expected = expected_queue.pop_front();
      
      // Reference model: output should equal input
      if (actual.burger_out == expected.patty_type) begin
        `uvm_info("SCOREBOARD", $sformatf("✅ PASS: Expected %s, Got %s",
                  expected.get_patty_name(), actual.get_patty_name()), UVM_MEDIUM)
        pass_cnt++;
      end else begin
        `uvm_error("SCOREBOARD", $sformatf("❌ FAIL: Expected %s, Got %0d",
                   expected.get_patty_name(), actual.burger_out))
        fail_cnt++;
      end
    endfunction
    
    function void report_phase(uvm_phase phase);
      `uvm_info("SCOREBOARD", "═══════════════════════════════════", UVM_LOW)
      `uvm_info("SCOREBOARD", $sformatf("📊 RESULTS: %0d PASS, %0d FAIL", pass_cnt, fail_cnt), UVM_LOW)
      if (fail_cnt == 0)
        `uvm_info("SCOREBOARD", "🏆 ALL TESTS PASSED!", UVM_LOW)
      else
        `uvm_error("SCOREBOARD", "💔 SOME TESTS FAILED!")
      `uvm_info("SCOREBOARD", "═══════════════════════════════════", UVM_LOW)
    endfunction
  endclass

  // -------------------------------------------------------------------------
  //  AGENT - The Work Station
  // -------------------------------------------------------------------------
  class burger_agent extends uvm_agent;
    `uvm_component_utils(burger_agent)
    
    burger_sequencer sequencer;
    burger_driver    driver;
    burger_monitor   monitor;
    burger_coverage  coverage;
    
    function new(string name, uvm_component parent);
      super.new(name, parent);
    endfunction
    
    function void build_phase(uvm_phase phase);
      super.build_phase(phase);
      
      // Always create monitor and coverage
      monitor  = burger_monitor::type_id::create("monitor", this);
      coverage = burger_coverage::type_id::create("coverage", this);
      
      // Only create driver/sequencer in ACTIVE mode
      if (get_is_active() == UVM_ACTIVE) begin
        sequencer = burger_sequencer::type_id::create("sequencer", this);
        driver    = burger_driver::type_id::create("driver", this);
      end
    endfunction
    
    function void connect_phase(uvm_phase phase);
      super.connect_phase(phase);
      
      // Connect monitor to coverage collector
      monitor.ap.connect(coverage.analysis_export);
      
      if (get_is_active() == UVM_ACTIVE) begin
        driver.seq_item_port.connect(sequencer.seq_item_export);
      end
    endfunction
  endclass

  // -------------------------------------------------------------------------
  //  ENVIRONMENT - The Restaurant Floor Plan
  // -------------------------------------------------------------------------
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
      super.connect_phase(phase);
      // Connect monitor's analysis port to scoreboard
      agent.monitor.ap.connect(scoreboard.actual_imp);
    endfunction
  endclass

  // -------------------------------------------------------------------------
  //  SEQUENCES - The Menu Options
  // -------------------------------------------------------------------------
  
  // Base sequence - order random burgers
  class random_burger_seq extends uvm_sequence #(burger_item);
    `uvm_object_utils(random_burger_seq)
    
    int num_orders = 10;
    
    function new(string name = "random_burger_seq");
      super.new(name);
    endfunction
    
    task body();
      burger_scoreboard sb;
      
      // Get scoreboard handle to add expected items
      if (!uvm_config_db#(burger_scoreboard)::get(null, "", "scoreboard", sb))
        `uvm_warning("SEQ", "Could not get scoreboard - no expected checking")
      
      `uvm_info("SEQUENCE", $sformatf("🍔 Ordering %0d random burgers!", num_orders), UVM_LOW)
      
      repeat(num_orders) begin
        req = burger_item::type_id::create("req");
        start_item(req);
        
        if (!req.randomize())
          `uvm_error("SEQ", "Randomization failed!")
        
        // Add to expected queue before finishing
        if (sb != null) sb.add_expected(req);
        
        finish_item(req);
      end
    endtask
  endclass
  
  // Specific sequence - all beef burgers
  class all_beef_seq extends uvm_sequence #(burger_item);
    `uvm_object_utils(all_beef_seq)
    
    function new(string name = "all_beef_seq");
      super.new(name);
    endfunction
    
    task body();
      burger_scoreboard sb;
      uvm_config_db#(burger_scoreboard)::get(null, "", "scoreboard", sb);
      
      `uvm_info("SEQUENCE", "🥩 Ordering 5 BEEF burgers!", UVM_LOW)
      
      repeat(5) begin
        req = burger_item::type_id::create("req");
        start_item(req);
        req.randomize() with { patty_type == 0; };  // Force beef
        if (sb != null) sb.add_expected(req);
        finish_item(req);
      end
    endtask
  endclass
  
  // Veggie only sequence
  class veggie_seq extends uvm_sequence #(burger_item);
    `uvm_object_utils(veggie_seq)
    
    function new(string name = "veggie_seq");
      super.new(name);
    endfunction
    
    task body();
      burger_scoreboard sb;
      uvm_config_db#(burger_scoreboard)::get(null, "", "scoreboard", sb);
      
      `uvm_info("SEQUENCE", "🥦 Ordering 5 VEGGIE burgers!", UVM_LOW)
      
      repeat(5) begin
        req = burger_item::type_id::create("req");
        start_item(req);
        req.randomize() with { patty_type == 2; };
        if (sb != null) sb.add_expected(req);
        finish_item(req);
      end
    endtask
  endclass

  // -------------------------------------------------------------------------
  //  TEST - Opening Day!
  // -------------------------------------------------------------------------
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
    
    function void end_of_elaboration_phase(uvm_phase phase);
      // Store scoreboard in config_db for sequences to access
      uvm_config_db#(burger_scoreboard)::set(null, "", "scoreboard", env.scoreboard);
      
      // Print the testbench topology
      `uvm_info("TEST", "📋 UVM Testbench Topology:", UVM_LOW)
      uvm_top.print_topology();
    endfunction
    
    task run_phase(uvm_phase phase);
      random_burger_seq rand_seq;
      all_beef_seq beef_seq;
      veggie_seq veg_seq;
      
      phase.raise_objection(this, "Starting test");
      `uvm_info("TEST", "🍔 ═══════════════════════════════════", UVM_NONE)
      `uvm_info("TEST", "🍔   UVMBURGER RESTAURANT IS OPEN!   ", UVM_NONE)
      `uvm_info("TEST", "🍔 ═══════════════════════════════════", UVM_NONE)
      
      // Run multiple sequences
      rand_seq = random_burger_seq::type_id::create("rand_seq");
      rand_seq.num_orders = 10;
      rand_seq.start(env.agent.sequencer);
      
      beef_seq = all_beef_seq::type_id::create("beef_seq");
      beef_seq.start(env.agent.sequencer);
      
      veg_seq = veggie_seq::type_id::create("veg_seq");
      veg_seq.start(env.agent.sequencer);
      
      // Wait for all transactions to complete
      #200;
      
      `uvm_info("TEST", "🍔 ═══════════════════════════════════", UVM_NONE)
      `uvm_info("TEST", "🍔   RESTAURANT CLOSED FOR THE DAY   ", UVM_NONE)
      `uvm_info("TEST", "🍔 ═══════════════════════════════════", UVM_NONE)
      phase.drop_objection(this, "Test complete");
    endtask
  endclass

endpackage

// =============================================================================
//  SECTION 4: TOP MODULE - The Construction Site
// =============================================================================
module top;
  import uvm_pkg::*;
  import burger_pkg::*;
  
  // Clock generation
  bit clk = 0;
  always #5 clk = ~clk;  // 100MHz clock
  
  // Reset generation
  bit rst_n = 0;
  initial begin
    rst_n = 0;
    #25 rst_n = 1;  // Release reset after 25ns
  end
  
  // Interface instance
  burger_if vif(clk);
  assign vif.rst_n = rst_n;
  
  // DUT instance
  burger_kitchen DUT (
    .clk       (vif.clk),
    .rst_n     (rst_n),
    .patty_type(vif.patty_type),
    .valid_in  (vif.valid_in),
    .burger_out(vif.burger_out),
    .valid_out (vif.valid_out)
  );
  
  // UVM startup
  initial begin
    // Post interface to config database
    uvm_config_db#(virtual burger_if)::set(null, "*", "vif", vif);
    
    // Start UVM test (reads +UVM_TESTNAME from command line)
    run_test("burger_test");
  end
  
  // Waveform dump (optional)
  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, top);
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
