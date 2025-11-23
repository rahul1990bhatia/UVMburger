---
id: "meet_the_team"
title: "Meet the Team"
icon: "Users"
analogy:
  role: "The Core Staff"
  description: "Order Ticket (seq_item), Waiter (sequencer), Line Cook (driver), Food Critic (monitor)."
code_snippet: |
  class burger_item extends uvm_sequence_item;
    rand bit [1:0] patty_type;
    constraint c_menu { patty_type inside {0,1,2}; }
  endclass
  
  typedef uvm_sequencer #(burger_item) burger_sequencer;
code_language: "systemverilog"
quiz:
  - question: "What is a uvm_sequence_item?"
    options:
      - "A verification component"
      - "A transaction representing data to be driven or monitored"
      - "A testbench environment"
      - "A clock generator"
    correct: 1
  - question: "What does the uvm_sequencer do?"
    options:
      - "Drives signals to the DUT"
      - "Monitors output signals"
      - "Manages the flow of transactions (arbitration)"
      - "Compares results"
    correct: 2
  - question: "What is the driver's primary job?"
    options:
      - "Generate random transactions"
      - "Convert transactions into pin-level stimulus"
      - "Check for correctness"
      - "Report results"
    correct: 1
---

## 1. The Order Ticket (`uvm_sequence_item`)

### The Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        STIMULUS GENERATION                          │
│  ┌──────────┐    ┌────────────┐    ┌──────────┐    ┌─────────────┐  │
│  │ Sequence │───▶│  Sequencer │───▶│  Driver  │───▶│     DUT     │  │
│  │ (Menu)   │    │  (Waiter)  │    │  (Chef)  │    │   (Grill)   │  │
│  └──────────┘    └────────────┘    └──────────┘    └──────┬──────┘  │
│       │                                                    │        │
│       │          Sequence Item = Order Ticket              │        │
│       │                                                    ▼        │
│  ┌────┴────────────────────────────────────────────────────────┐    │
│  │                       CHECKING                              │    │
│  │  ┌──────────┐         ┌────────────┐         ┌───────────┐  │    │
│  │  │ Monitor  │────────▶│ Scoreboard │◀────────│ Reference │  │    │
│  │  │ (Critic) │         │ (Manager)  │         │   Model   │  │    │
│  │  └──────────┘         └────────────┘         └───────────┘  │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

The **sequence_item** is the **transaction** - the data packet traveling through our system. Think of it as **the customer's order ticket**.

It's not a person; it's just **data**.

```systemverilog
class burger_item extends uvm_sequence_item;
  // 1. The Food (Data Fields)
  rand bit [1:0] patty_type; // 0=Beef, 1=Chicken, 2=Veggie
  rand bit       is_combo;   // 1=Fries included

  // 2. The Menu Rules (Constraints)
  constraint c_diet { patty_type inside {0, 1, 2}; }
  constraint c_upsell { is_combo dist { 1:=80, 0:=20 }; } // 80% combos

  // 3. UVM Registration Macros
  `uvm_object_utils_begin(burger_item)
    `uvm_field_int(patty_type, UVM_ALL_ON)
    `uvm_field_int(is_combo, UVM_ALL_ON)
  `uvm_object_utils_end

  function new(string name = "burger_item");
    super.new(name);
  endfunction
endclass
```

**Key Points:**
- **`rand`** makes fields randomizable
- **Constraints** limit randomization to valid/meaningful values
- **`uvm_object`** base class (not component - transactions are temporary objects)

### The Menu Rules (Constraints)

We don't want random garbage - we want valid orders:
- **`inside {0,1,2}`**: Only allow beef, chicken, or veggie
- **`dist`**: Bias the randomization (80% chance of combo upsell)

---

## 2. The Waiter (`uvm_sequencer`)

The **sequencer** is the **traffic cop** - the waiter managing the flow of orders to the kitchen.

```systemverilog
// Simple typedef - we specialize the generic sequencer for burger_items
typedef uvm_sequencer #(burger_item) burger_sequencer;
```

**Job Description:**
- Holds tickets in a queue
- Decides who gets served first (Arbitration)
- Hands tickets to the Chef one at a time

**Why do we need it?**

If multiple customers (Sequences) are shouting orders simultaneously, the Waiter ensures orderly service:
- **FIFO**: First come, first served
- **Priority**: VIP customers go first
- **Random**: Sometimes we shake things up for fairness

---

## 3. The Line Cook (`uvm_driver`)

The **driver** is the **chef** - the hard worker who converts abstract orders (objects) into concrete actions (pin wiggles).

```systemverilog
class burger_driver extends uvm_driver #(burger_item);
  `uvm_component_utils(burger_driver)
  virtual burger_if vif; // Access to the Service Window

  function void build_phase(uvm_phase phase);
    super.build_phase(phase);
    if (!uvm_config_db#(virtual burger_if)::get(this, "", "vif", vif))
      `uvm_fatal("DRIVER", "No interface found!")
  endfunction

  task run_phase(uvm_phase phase);
    forever begin
      // 1. Get the next ticket from the Waiter
      seq_item_port.get_next_item(req);
      
      // 2. Cook it! (Drive signals to DUT)
      @(posedge vif.clk);
      vif.order_type <= req.patty_type;
      `uvm_info("CHEF", $sformatf("Cooking: %0d", req.patty_type), UVM_MEDIUM)
      
      // 3. Tell Waiter we're done
      seq_item_port.item_done();
    end
  endtask
endclass
```

**The Cooking Loop:**
1. **`get_next_item(req)`**: Ask the Waiter for the next order
2. **Drive Signals**: Wiggle pins on the interface to stimulate the DUT
3. **`item_done()`**: Tell the Waiter the order is complete

**Virtual Interface:**
The driver uses `virtual burger_if vif` to reach out of the class world and touch the actual hardware signals.

---

## 4. The Food Critic (`uvm_monitor`)

The **monitor** is the **food critic** - a passive observer who watches everything but touches nothing.

```systemverilog
class burger_monitor extends uvm_monitor;
  `uvm_component_utils(burger_monitor)
  virtual burger_if vif;
  uvm_analysis_port #(burger_item) item_collected_port; // The Megaphone

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
      // 1. Spy on the service window
      if (vif.ready_light == 1) begin
        burger_item item = burger_item::type_id::create("item");
        item.patty_type = vif.order_type; // Reconstruct the order
        
        // 2. Broadcast to the world
        `uvm_info("CRITIC", $sformatf("Burger served: %0d", item.patty_type), UVM_MEDIUM)
        item_collected_port.write(item);
      end
    end
  endtask
endclass
```

**Critical Rules:**
- **NEVER drive signals** - read-only access
- **Sample on clock edges** to capture transactions
- **Broadcast using analysis port** - anyone can listen (scoreboard, coverage, etc.)

### The Megaphone (Analysis Port)

The **`uvm_analysis_port`** is a one-to-many broadcast channel:
- The Critic shouts once
- Multiple listeners hear it (Scoreboard, Coverage Collector, Logger)
- This is **TLM (Transaction Level Modeling)** - we'll cover it in Chapter 6

---

## How They Work Together

1. **Sequence** generates random `burger_item` objects
2. **Sequencer** queues them and hands to Driver
3. **Driver** converts objects to pin wiggles on the interface
4. **DUT** processes the stimulus
5. **Monitor** observes the DUT's response
6. **Monitor** broadcasts transactions via analysis port
7. **Scoreboard** (next chapter) compares expected vs actual

This is the heart of UVM - a well-organized assembly line from stimulus generation to result checking!
