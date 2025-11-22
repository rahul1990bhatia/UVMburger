---
id: "physical_location"
title: "The Physical Location"
icon: "Building"
analogy:
  role: "The Grill & Service Window"
  description: "DUT = The Grill (Static Hardware). Interface = Service Window. Modports = Window Rules."
code_snippet: |
  interface burger_if(input bit clk);
    logic [1:0] order_type;
    
    modport driver_mp (output order_type);
    modport monitor_mp (input order_type);
    modport dut_mp (input order_type);
  endinterface
code_language: "systemverilog"
quiz:
  - question: "What is the DUT in verification?"
    options:
      - "The testbench"
      - "The Design Under Test (hardware being verified)"
      - "The monitor"
      - "The sequence"
    correct: 1
  - question: "What problem do modports solve?"
    options:
      - "They make interfaces faster"
      - "They prevent signal contention by restricting access"
      - "They reduce memory usage"
      - "They generate random data"
    correct: 1
  - question: "What can a monitor_mp modport typically do?"
    options:
      - "Drive all signals"
      - "Only read (input) signals"
      - "Modify the DUT"
      - "Delete signals"
    correct: 1
---

## The DUT (The Grill)

The **Design Under Test (DUT)** is the hardware module we're verifying. Think of it as **the grill** in our burger shop - it's **static**, bolted to the floor, and does the actual cooking.

```systemverilog
module burger_kitchen(
  input        clk,
  input        rst_n,
  input  [1:0] order_type, // 0=Plain, 1=Cheese, 2=Veggie
  output reg   ready_light
);
  // The grill logic (RTL)
  always @(posedge clk) begin
    if (!rst_n) ready_light <= 0;
    else        ready_light <= 1; // Fast food!
  end
endmodule
```

The DUT is written in **Verilog/SystemVerilog** and synthesizes to real hardware. Our job is to **stress-test** it with thousands of random orders to find bugs.

## The Interface (The Service Window)

The **Interface** is the **service window** - the boundary between the dynamic testbench (software) and the static DUT (hardware).

It bundles all the signals into a single, reusable object we can pass around.

```systemverilog
interface burger_if(input bit clk);
  logic       rst_n;       // Reset signal
  logic [1:0] order_type;  // Order request
  logic       ready_light; // Kitchen status
endinterface
```

**Why use an interface?**
- **Bundling**: Instead of passing 10 separate wires, we pass one interface handle.
- **Reusability**: The same interface can be used across multiple projects.
- **Virtual Handles**: UVM classes can grab a `virtual burger_if` handle to access these signals.

## The Window Rules (Modports)

Imagine our service window without rules - customers could climb through and start cooking! Chaos.

**Modports** are like **employee badges** that restrict what each person can do at the window.

### The Problem: Signal Contention

Without modports:
- The **Driver (Chef)** might accidentally **read** when they should only **write**.
- The **Monitor (Critic)** might try to **drive** signals when they should only **observe**.

**Result:** Signal contention, compiler errors, or incorrect behavior.

### The Solution: Access Control

```systemverilog
interface burger_if(input bit clk);
  logic        rst_n;
  logic [1:0]  order_type;
  logic        ready_light;

  // 1. The Chef's Badge (Driver)
  modport driver_mp (
    input  clk,
    input  rst_n,
    output order_type,  // Chef can PLACE orders
    input  ready_light  // Chef can SEE status
  );

  // 2. The Critic's Badge (Monitor)
  modport monitor_mp (
    input clk,
    input rst_n,
    input order_type,   // Critic can only WATCH
    input ready_light
  );

  // 3. The Kitchen's Badge (DUT)
  modport dut_mp (
    input  clk,
    input  rst_n,
    input  order_type,  // Kitchen RECEIVES orders
    output ready_light  // Kitchen SENDS status
  );

endinterface
```

### Enforcing the Rules

**In the DUT:**
```systemverilog
module burger_kitchen(
  burger_if.dut_mp vif  // Kitchen uses dut_mp
);
  // If RTL tries to drive 'order_type', compiler error!
endmodule
```

**In the Driver:**
```systemverilog
class burger_driver extends uvm_driver #(burger_item);
  virtual burger_if.driver_mp vif;  // Chef uses driver_mp

  task run_phase(uvm_phase phase);
    vif.order_type <= 1;  // ✅ Valid
    // vif.rst_n <= 0;    // ❌ Compile error!
  endtask
endclass
```

## Key Takeaways

- **DUT** = The static hardware we're verifying (The Grill)
- **Interface** = The signal bundle connecting testbench to DUT (The Service Window)
- **Modports** = Access control restricting what each component can do (Employee Badges)
- Use **`driver_mp`** for components that drive signals (Chef)
- Use **`monitor_mp`** for components that only observe (Critic)
- Use **`dut_mp`** for the design under test (Kitchen)
