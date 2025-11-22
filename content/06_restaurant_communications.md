---
id: "restaurant_communications"
title: "Restaurant Communications"
icon: "Radio"
analogy:
  role: "The Intercom System"
  description: "TLM Ports, Exports, and FIFOs - How components talk without shouting."
code_snippet: |
  // The Critic broadcasts using an analysis port
  uvm_analysis_port #(burger_item) item_port;
  item_port.write(item); // Broadcast to all listeners
  
  // The Manager listens using an analysis export
  uvm_analysis_imp #(burger_item, scoreboard) item_export;
code_language: "systemverilog"
---

## How Components Talk

In a busy restaurant, people can't just shout across the room. We need an **organized communication system**.

This is **TLM (Transaction Level Modeling)** - the method UVM components use to pass data without direct function calls.

## The Problem: Tight Coupling

**Bad approach:**
```systemverilog
// DON'T DO THIS!
monitor.send_to_scoreboard(item);  // Direct call - tight coupling
```

**Why is this bad?**
- Hard to reuse components
- Can't easily add new listeners
- Breaks encapsulation

## The Solution: TLM Ports

Think of **ports** and **exports** as an **intercom system**:
- **Port (Megaphone)**: The person broadcasting
- **Export (Speaker)**: The person listening
- **FIFO (Bucket)**: A buffer in between

### Port vs. Export

**Port (initiating action):**
```systemverilog
class burger_monitor extends uvm_monitor;
  // The Critic's megaphone
  uvm_analysis_port #(burger_item) item_collected_port;
  
  function new(string name, uvm_component parent);
    super.new(name, parent);
    item_collected_port = new("item_collected_port", this);
  endfunction
  
  task run_phase(uvm_phase phase);
    // Broadcast to whoever is listening
    item_collected_port.write(item);
  endtask
endclass
```

**Export (receiving action):**
```systemverilog
class burger_scoreboard extends uvm_scoreboard;
  // The Manager's speaker (receives broadcasts)
  uvm_analysis_imp #(burger_item, burger_scoreboard) item_export;
  
  function new(string name, uvm_component parent);
    super.new(name, parent);
    item_export = new("item_export", this);
  endfunction
  
  // This function is automatically called when data arrives
  function void write(burger_item item);
    // Process the item
    `uvm_info("SCOREBOARD", "Received burger!", UVM_MEDIUM)
  endfunction
endclass
```

### Connecting Them

In the environment's `connect_phase`:
```systemverilog
function void connect_phase(uvm_phase phase);
  // Plug the Monitor's megaphone into the Scoreboard's speaker
  agent.monitor.item_collected_port.connect(scoreboard.item_export);
endfunction
```

## The Bucket Strategy (Analysis FIFO)

Sometimes the **Critic talks fast** but the **Manager reads slow**.

We use a **FIFO (First-In-First-Out) buffer** as a bucket:

```systemverilog
class burger_env extends uvm_env;
  burger_monitor monitor;
  burger_scoreboard scoreboard;
  uvm_tlm_analysis_fifo #(burger_item) fifo; // The bucket
  
  function void build_phase(uvm_phase phase);
    fifo = new("fifo", this);
  endfunction
  
  function void connect_phase(uvm_phase phase);
    // Critic throws items into the bucket
    monitor.item_collected_port.connect(fifo.analysis_export);
    
    // Manager pulls from the bucket (blocking get)
    // (Scoreboard would use fifo.blocking_get_port)
  endfunction
endclass
```

**Benefits:**
- **Decoupling**: Critic and Manager work at their own pace
- **Buffering**: No data loss if Manager is busy
- **Flexibility**: Easy to add more listeners

## Types of TLM Communications

### 1. Blocking (Wait for handshake)
```systemverilog
seq_item_port.get_next_item(req); // Waits until item is ready
seq_item_port.item_done();        // Signals completion
```

### 2. Non-Blocking (Try, but don't wait)
```systemverilog
if (port.try_get(item)) begin
  // Got an item
end else begin
  // No item available, continue
end
```

### 3. Analysis (Broadcast, one-to-many)
```systemverilog
item_collected_port.write(item); // All connected listeners receive it
```

## Key Takeaways

- **TLM** = How components communicate without tight coupling
- **Port** = Initiator (megaphone, "I'm sending")
- **Export** = Receiver (speaker, "I'm receiving")
- **FIFO** = Buffer between fast and slow components
- **Analysis Port** = One-to-many broadcast (Monitor → multiple listeners)
- Connects in `connect_phase`, used in `run_phase`

This is how the restaurant stays organized even during rush hour! 🍔📞
