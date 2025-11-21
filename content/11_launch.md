---
id: "launch"
title: "The Franchise Launch"
icon: "Rocket"
analogy:
  role: "Execution"
  description: "Running the Simulators (VCS, Xcelium, Questa)."
code_snippet: |
  # 1. VCS (Synopsys)
  vcs -sverilog -ntb_opts uvm +incdir+src top.sv -R +UVM_TESTNAME=burger_test

  # 2. Xcelium (Cadence)
  xrun -uvm +incdir+src top.sv +UVM_TESTNAME=burger_test

  # 3. Questa (Siemens)
  vlog -sv +incdir+src +incdir+$UVM_HOME/src top.sv
  vsim top -do "run -all; quit" +UVM_TESTNAME=burger_test
code_language: "bash"
---

## Turning on the Open Sign
You've built the kitchen, hired the staff, and prepped the food. Now it's time to run the business.

### 1. VCS (Synopsys)
The "Fast Food Giant" approach.
- `-sverilog`: Enable SystemVerilog.
- `-ntb_opts uvm`: Use built-in UVM.
- `-R`: Run immediately.

### 2. Xcelium / IES (Cadence)
The "Gourmet Experience" approach.
- `-uvm`: Enable UVM.
- `+UVM_TESTNAME`: Tell UVM which test to run.

### 3. Questa (Siemens/Mentor)
The "Classic Diner" approach.
- `vlog`: Compile.
- `vsim`: Simulate.
