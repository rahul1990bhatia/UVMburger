---
id: "env-test"
title: "The Grand Opening"
icon: "Play"
analogy:
  role: "The Restaurant"
  description: "Env = Restaurant. Test = Opening Day."
code_snippet: |
  // The Environment (The Floor Plan)
  class burger_env extends uvm_env;
    burger_agent      agent;
    burger_scoreboard scoreboard;
    function void connect_phase(uvm_phase phase);
      // Connect Critic (Monitor) to Manager (Scoreboard)
      agent.monitor.item_collected_port.connect(scoreboard.analysis_export);
    endfunction
  endclass

  // The Test (Opening Day)
  class burger_test extends uvm_test;
    burger_env env;
    task run_phase(uvm_phase phase);
      burger_sequence seq = burger_sequence::type_id::create("seq");
      phase.raise_objection(this); // Open the shop
      seq.start(env.agent.sequencer); // Start taking orders
      phase.drop_objection(this);  // Close the shop
    endtask
  endclass
code_language: "systemverilog"
---

## The Environment (The Floor Plan)
The Environment (`uvm_env`) is the container for the whole testbench.
It connects the Agent (Station) to the Scoreboard (Manager).

## The Test (Opening Day)
The Test (`uvm_test`) is the top-level component.
- It builds the Environment.
- It starts the Sequence (Traffic).
- It manages **Objections** (Opening and Closing the shop).
