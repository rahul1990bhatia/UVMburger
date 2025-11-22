---
id: "operating_instructions"
title: "Operating Instructions"
icon: "Terminal"
analogy:
  role: "Turning on the Open Sign"
  description: "How to run your UVM testbench on real simulators."
code_snippet: |
  # Synopsys VCS
  vcs -sverilog -ntb_opts uvm top.sv -R +UVM_TESTNAME=burger_test
  
  # Cadence Xcelium
  xrun -uvm top.sv +UVM_TESTNAME=burger_test
  
  # Siemens Questa
  vsim top +UVM_TESTNAME=burger_test -do "run -all"
code_language: "bash"
---

## Turning on the Open Sign

You've built the restaurant. Now it's time to flip the "OPEN" sign and start serving customers.

This means **running your UVM testbench** on a real simulator.

## The Three Major Simulators

### 1. Synopsys VCS

**Compile and Run:**
```bash
vcs -sverilog -ntb_opts uvm top.sv -R +UVM_TESTNAME=burger_test
```

**Flags Explained:**
- `-sverilog`: Enable SystemVerilog
- `-ntb_opts uvm`: Include UVM library
- `-R`: Run immediately after compilation
- `+UVM_TESTNAME=burger_test`: Which test to run

**With Waveforms (DVE):**
```bash
vcs -sverilog -ntb_opts uvm -debug_all top.sv
./simv +UVM_TESTNAME=burger_test
dve -vpd vcdplus.vpd &
```

---

### 2. Cadence Xcelium

**Single Command (Compile + Run):**
```bash
xrun -uvm top.sv +UVM_TESTNAME=burger_test
```

**Flags Explained:**
- `-uvm`: Enable UVM
- `+UVM_TESTNAME=burger_test`: Which test to run

**With Waveforms (SimVision):**
```bash
xrun -uvm -gui -access +rwc top.sv +UVM_TESTNAME=burger_test
```

---

### 3. Siemens Questa/ModelSim

**Two-Step Process:**

**Step 1: Compile**
```bash
vlog -sv +incdir+$UVM_HOME/src $UVM_HOME/src/uvm_pkg.sv
vlog -sv top.sv
```

**Step 2: Simulate**
```bash
vsim -voptargs="+acc" top +UVM_TESTNAME=burger_test -do "run -all; quit"
```

**With Waveforms (GUI):**
```bash
vsim -gui top +UVM_TESTNAME=burger_test
# In GUI: run -all
```

---

## Command-Line Arguments

### Selecting Different Tests

```bash
+UVM_TESTNAME=burger_test          # Default test
+UVM_TESTNAME=vegan_burger_test    # Run vegan test
+UVM_TESTNAME=stress_test          # Run stress test
```

### UVM Verbosity Levels

```bash
+UVM_VERBOSITY=UVM_NONE    # Silent (errors only)
+UVM_VERBOSITY=UVM_LOW     # Minimal info
+UVM_VERBOSITY=UVM_MEDIUM  # Standard (default)
+UVM_VERBOSITY=UVM_HIGH    # Detailed
+UVM_VERBOSITY=UVM_DEBUG   # Everything (very noisy)
```

Example:
```bash
vcs -ntb_opts uvm top.sv -R +UVM_TESTNAME=burger_test +UVM_VERBOSITY=UVM_HIGH
```

### Config DB Overrides

You can override config values from command line:

```bash
+uvm_set_config_int=*,num_burgers,1000
+uvm_set_config_string=*,patty_type,"veggie"
```

---

## Common Workflow

**Development Cycle:**
```bash
# 1. Write code
vim burger_driver.sv

# 2. Compile (check syntax)
vcs -sverilog -ntb_opts uvm top.sv

# 3. Run test
./simv +UVM_TESTNAME=burger_test

# 4. Debug with waveforms
./simv +UVM_TEST NAME=burger_test -gui

# 5. Regression (run all tests)
./run_regression.sh
```

---

## Makefile Example

```makefile
# Simulator choice
SIM ?= vcs

# Test selection
TEST ?= burger_test

# Source files
SOURCES = top.sv burger_pkg.sv

ifeq ($(SIM),vcs)
    compile:
        vcs -sverilog -ntb_opts uvm $(SOURCES)
    run:
        ./simv +UVM_TESTNAME=$(TEST)
endif

ifeq ($(SIM),xcelium)
    run:
        xrun -uvm $(SOURCES) +UVM_TESTNAME=$(TEST)
endif

clean:
    rm -rf simv* csrc DVEfiles *.log
```

**Usage:**
```bash
make SIM=vcs TEST=burger_test run
make SIM=xcelium TEST=stress_test run
```

---

## Debugging Tips

### 1. Enable UVM Debug Messages
```bash
+UVM_VERBOSITY=UVM_DEBUG
```

### 2. Dump Waveforms
VCS:
```bash
vcs -debug_all top.sv
./simv +UVM_TESTNAME=burger_test
dve -vpd vcdplus.vpd &
```

### 3. UVM Topology
Add to your test:
```systemverilog
function void end_of_elaboration_phase(uvm_phase phase);
  uvm_top.print_topology();
endfunction
```

### 4. Config DB Dump
```bash
+UVM_CONFIG_DB_TRACE  # Show all config DB activity
```

---

## EDA Playground (Online)

Don't have a simulator? Use **EDA Playground**:
1. Go to [edaplayground.com](https://edaplayground.com)
2. Select "UVM / OVM" from testbench dropdown
3. Select "Synopsys VCS" or "Cadence Xcelium"
4. Paste your code
5. Click "Run"

Perfect for learning and sharing examples!

---

## Key Takeaways

- **VCS**: Industry standard, powerful debug tools
- **Xcelium**: Fast, single-command workflow
- **Questa**: Free version available (ModelSim)
- Use `+UVM_TESTNAME` to select which test runs
- Use `+UVM_VERBOSITY` to control output detail
- Makefiles automate the build process
- EDA Playground for online experimentation

Your restaurant is open for business! 🎉
