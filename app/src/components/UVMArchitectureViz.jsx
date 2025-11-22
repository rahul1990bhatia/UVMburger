import React, { useState, useEffect } from 'react';

const UVMArchitectureViz = () => {
    const [activeComponent, setActiveComponent] = useState(null);
    const [animationStep, setAnimationStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const components = {
        test: {
            name: "Test",
            analogy: "Opening Day Plan",
            description: "The top-level UVM component that builds the environment, configures components, and starts sequences. Controls simulation lifetime with objections.",
            color: "#8B5CF6",
            code: `class burger_test extends uvm_test;
  burger_env env;
  
  task run_phase(uvm_phase phase);
    phase.raise_objection(this);
    seq.start(env.agent.sequencer);
    phase.drop_objection(this);
  endtask
endclass`
        },
        env: {
            name: "Environment",
            analogy: "Restaurant Floor Plan",
            description: "Contains and connects all verification components - agents, scoreboards, coverage collectors. Provides a reusable, self-contained verification environment.",
            color: "#3B82F6",
            code: `class burger_env extends uvm_env;
  burger_agent agent;
  burger_scoreboard scoreboard;
  
  function void connect_phase(uvm_phase phase);
    agent.monitor.ap.connect(scoreboard.export);
  endfunction
endclass`
        },
        agent: {
            name: "Agent",
            analogy: "Work Station",
            description: "Groups related components: Sequencer, Driver, Monitor. Can operate in ACTIVE mode (drive stimulus) or PASSIVE mode (only monitor).",
            color: "#10B981",
            code: `class burger_agent extends uvm_agent;
  burger_sequencer sequencer;
  burger_driver driver;
  burger_monitor monitor;
  
  // Active mode: all three components
  // Passive mode: monitor only
endclass`
        },
        sequencer: {
            name: "Sequencer",
            analogy: "Waiter",
            description: "Manages the flow of transactions from sequences to the driver. Acts as an arbiter when multiple sequences are running.",
            color: "#F59E0B",
            code: `// Usually just a typedef
typedef uvm_sequencer #(burger_item) 
        burger_sequencer;

// Arbitrates between sequences
// Hands items to driver one at a time`
        },
        driver: {
            name: "Driver",
            analogy: "Line Cook",
            description: "Converts abstract transactions into pin-level signals. Gets items from sequencer via get_next_item(), drives DUT, then calls item_done().",
            color: "#EF4444",
            code: `task run_phase(uvm_phase phase);
  forever begin
    seq_item_port.get_next_item(req);
    @(posedge vif.clk);
    vif.data <= req.data;
    seq_item_port.item_done();
  end
endtask`
        },
        monitor: {
            name: "Monitor",
            analogy: "Food Critic",
            description: "Passively observes DUT signals and reconstructs transactions. NEVER drives signals. Broadcasts via analysis port to scoreboard and coverage.",
            color: "#EC4899",
            code: `task run_phase(uvm_phase phase);
  forever begin
    @(posedge vif.clk);
    if (vif.valid) begin
      item.data = vif.data;
      ap.write(item); // Broadcast!
    end
  end
endtask`
        },
        scoreboard: {
            name: "Scoreboard",
            analogy: "Shift Manager",
            description: "Compares expected results against actual DUT output. Receives transactions via analysis export. Reports PASS/FAIL.",
            color: "#6366F1",
            code: `function void write(burger_item actual);
  expected = expected_queue.pop_front();
  if (actual.data == expected.data)
    pass_count++;
  else
    fail_count++;
endfunction`
        },
        dut: {
            name: "DUT",
            analogy: "The Grill",
            description: "Design Under Test - the actual hardware being verified. Static Verilog/SystemVerilog module. Our job is to stress-test it!",
            color: "#64748B",
            code: `module burger_kitchen(
  input clk, rst_n,
  input [1:0] order_type,
  output reg [1:0] burger_out,
  output reg valid_out
);`
        },
        sequence: {
            name: "Sequence",
            analogy: "Menu/Recipe",
            description: "Generates stimulus patterns. Creates and randomizes sequence items. Uses start_item()/finish_item() handshake with driver.",
            color: "#14B8A6",
            code: `task body();
  repeat(10) begin
    req = burger_item::type_id::create("req");
    start_item(req);
    req.randomize();
    finish_item(req);
  end
endtask`
        }
    };

    const flowSteps = [
        { from: 'sequence', to: 'sequencer', label: '1. Generate item' },
        { from: 'sequencer', to: 'driver', label: '2. Provide to driver' },
        { from: 'driver', to: 'dut', label: '3. Drive signals' },
        { from: 'dut', to: 'monitor', label: '4. DUT responds' },
        { from: 'monitor', to: 'scoreboard', label: '5. Monitor broadcasts' },
        { from: 'scoreboard', to: null, label: '6. Check result' }
    ];

    const startAnimation = () => {
        setIsAnimating(true);
        setAnimationStep(0);
    };

    useEffect(() => {
        let interval;
        if (isAnimating) {
            interval = setInterval(() => {
                setAnimationStep(prev => {
                    if (prev >= flowSteps.length - 1) {
                        setIsAnimating(false);
                        return 0;
                    }
                    return prev + 1;
                });
            }, 1500);
        }
        return () => clearInterval(interval);
    }, [isAnimating]);

    const ComponentBox = ({ id, x, y, width = 120, height = 50 }) => {
        const comp = components[id];
        const isActive = activeComponent === id || (isAnimating && (flowSteps[animationStep]?.from === id || flowSteps[animationStep]?.to === id));

        return (
            <g
                onClick={() => setActiveComponent(activeComponent === id ? null : id)}
                style={{ cursor: 'pointer' }}
            >
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx={8}
                    fill={comp.color}
                    stroke={isActive ? '#fff' : 'transparent'}
                    strokeWidth={isActive ? 3 : 0}
                    opacity={isActive ? 1 : 0.85}
                    className="transition-all duration-300"
                />
                <text
                    x={x + width / 2}
                    y={y + height / 2 + 5}
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                >
                    {comp.name}
                </text>
            </g>
        );
    };

    const Arrow = ({ x1, y1, x2, y2, animated = false }) => (
        <g>
            <defs>
                <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                >
                    <polygon
                        points="0 0, 10 3.5, 0 7"
                        fill={animated ? "#22D3EE" : "#94A3B8"}
                    />
                </marker>
            </defs>
            <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={animated ? "#22D3EE" : "#94A3B8"}
                strokeWidth={animated ? 3 : 2}
                markerEnd="url(#arrowhead)"
                className="transition-all duration-300"
            />
        </g>
    );

    return (
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 text-white my-8">
            <h3 className="text-xl font-bold text-center mb-2">🍔 UVM Architecture Visualizer</h3>
            <p className="text-gray-400 text-center mb-4 text-sm">Click components to learn more • Watch the data flow animation</p>

            <div className="flex justify-center mb-4">
                <button
                    onClick={startAnimation}
                    disabled={isAnimating}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${isAnimating
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-cyan-500 hover:bg-cyan-400'
                        }`}
                >
                    {isAnimating ? `Step ${animationStep + 1}/${flowSteps.length}: ${flowSteps[animationStep]?.label}` : '▶ Animate Data Flow'}
                </button>
            </div>

            <div className="flex gap-4 flex-col lg:flex-row">
                <div className="flex-1 overflow-x-auto">
                    <svg viewBox="0 0 600 400" className="w-full min-w-[500px] max-w-2xl mx-auto">
                        {/* Background boxes for hierarchy */}
                        <rect x="40" y="10" width="520" height="380" rx="12" fill="#1E293B" stroke="#334155" strokeWidth="2" />
                        <text x="55" y="35" fill="#64748B" fontSize="11">Top Module (Static World)</text>

                        <rect x="60" y="50" width="480" height="280" rx="10" fill="#0F172A" stroke="#334155" />
                        <text x="75" y="72" fill="#64748B" fontSize="11">UVM Test</text>

                        <rect x="80" y="85" width="440" height="230" rx="8" fill="#1E293B" stroke="#475569" />
                        <text x="95" y="107" fill="#64748B" fontSize="11">Environment</text>

                        <rect x="100" y="120" width="280" height="180" rx="6" fill="#0F172A" stroke="#475569" />
                        <text x="115" y="142" fill="#64748B" fontSize="11">Agent</text>

                        {/* Components */}
                        <ComponentBox id="test" x="420" y="55" width={100} height={40} />
                        <ComponentBox id="env" x="420" y="100" width={100} height={40} />
                        <ComponentBox id="sequence" x="115" y="150" width={100} height={40} />
                        <ComponentBox id="sequencer" x="115" y="200" width={100} height={40} />
                        <ComponentBox id="driver" x="115" y="250" width={100} height={40} />
                        <ComponentBox id="monitor" x="250" y="250" width={100} height={40} />
                        <ComponentBox id="scoreboard" x="400" y="200" width={110} height={40} />
                        <ComponentBox id="dut" x="240" y="340" width={120} height={45} />

                        {/* Connections */}
                        <Arrow x1={165} y1={190} x2={165} y2={200} animated={isAnimating && animationStep === 0} />
                        <Arrow x1={165} y1={240} x2={165} y2={250} animated={isAnimating && animationStep === 1} />
                        <Arrow x1={165} y1={290} x2={240} y2={340} animated={isAnimating && animationStep === 2} />
                        <Arrow x1={360} y1={340} x2={300} y2={290} animated={isAnimating && animationStep === 3} />
                        <Arrow x1={350} y1={270} x2={400} y2={220} animated={isAnimating && animationStep === 4} />

                        {/* Labels */}
                        <text x="300" y="395" textAnchor="middle" fill="#64748B" fontSize="10">Design Under Test</text>
                    </svg>
                </div>

                <div className="lg:w-80">
                    {activeComponent ? (
                        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 h-full">
                            <div className="flex items-center gap-2 mb-3">
                                <div
                                    className="w-4 h-4 rounded"
                                    style={{ backgroundColor: components[activeComponent].color }}
                                />
                                <h3 className="font-bold text-lg">{components[activeComponent].name}</h3>
                            </div>
                            <p className="text-cyan-400 text-sm mb-2">🍔 {components[activeComponent].analogy}</p>
                            <p className="text-gray-300 text-sm mb-3">{components[activeComponent].description}</p>
                            <div className="bg-gray-900 rounded-lg p-3">
                                <pre className="text-xs text-green-400 overflow-x-auto whitespace-pre-wrap font-mono">
                                    {components[activeComponent].code}
                                </pre>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 h-full">
                            <h3 className="font-bold mb-3">📋 Quick Legend</h3>
                            <div className="space-y-2">
                                {Object.entries(components).map(([id, comp]) => (
                                    <div
                                        key={id}
                                        onClick={() => setActiveComponent(id)}
                                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 p-1 rounded transition-all"
                                    >
                                        <div
                                            className="w-3 h-3 rounded"
                                            style={{ backgroundColor: comp.color }}
                                        />
                                        <span className="text-sm">{comp.name}</span>
                                        <span className="text-gray-500 text-xs">- {comp.analogy}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-3">
                    <h4 className="font-bold text-sm mb-1">🏗️ Build Phase</h4>
                    <p className="text-xs text-gray-300">Components created top-down. Test → Env → Agent → Driver/Monitor</p>
                </div>
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-3">
                    <h4 className="font-bold text-sm mb-1">🔌 Connect Phase</h4>
                    <p className="text-xs text-gray-300">TLM ports wired bottom-up. Driver ↔ Sequencer, Monitor → Scoreboard</p>
                </div>
                <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-3">
                    <h4 className="font-bold text-sm mb-1">▶️ Run Phase</h4>
                    <p className="text-xs text-gray-300">Simulation time advances. Sequences generate stimulus, drivers wiggle pins!</p>
                </div>
            </div>
        </div>
    );
};

export default UVMArchitectureViz;
