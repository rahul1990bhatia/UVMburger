---
id: "dut"
title: "The Kitchen Equipment"
icon: "Cpu"
analogy:
  role: "The Grill"
  description: "DUT = The Grill (Static Hardware). Interface = Service Window."
code_snippet: |
  // The Interface (The Service Window)
  interface burger_if(input bit clk);
    logic       rst_n;
    logic [1:0] order_type;
    logic       ready_light;
  endinterface
code_language: "systemverilog"
---

## The DUT (The Grill)
This is the hardware module. It is static and bolted to the floor.
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

## The Interface (The Service Window)
This allows our dynamic UVM classes to talk to the static hardware.
It bundles the wires into a single cable that we can pass around.
