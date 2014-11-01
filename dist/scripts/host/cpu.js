///<reference path="../globals.ts" />
/* ------------
CPU.ts
Requires global.ts.
Routines for the host CPU simulation, NOT for the OS itself.
In this manner, it's A LITTLE BIT like a hypervisor,
in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
TypeScript/JavaScript in both the host and client environments.
This code references page numbers in the text book:
Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
------------ */
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, IR, Acc, Xreg, Yreg, Zflag, base, limit, isExecuting, pcb) {
            if (typeof PC === "undefined") { PC = 0; }
            if (typeof IR === "undefined") { IR = 0; }
            if (typeof Acc === "undefined") { Acc = 0; }
            if (typeof Xreg === "undefined") { Xreg = 0; }
            if (typeof Yreg === "undefined") { Yreg = 0; }
            if (typeof Zflag === "undefined") { Zflag = 0; }
            if (typeof base === "undefined") { base = 0; }
            if (typeof limit === "undefined") { limit = 0; }
            if (typeof isExecuting === "undefined") { isExecuting = false; }
            if (typeof pcb === "undefined") { pcb = null; }
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.base = base;
            this.limit = limit;
            this.isExecuting = isExecuting;
            this.pcb = pcb;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.IR = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };

        /**
        * Sets a PCB to be executed by the CPU
        * @param newPcb
        */
        Cpu.prototype.setPcb = function (newPcb) {
            this.pcb = newPcb;
            this.PC = this.pcb.start;
            this.base = this.pcb.start;
            this.limit = this.base + 255;
            this.isExecuting = true;
            this.updateDisplay();
        };

        Cpu.prototype.cycle = function () {
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            var choice = _CPUScheduler.cycle(this.isExecuting);

            //            console.log("cycle: " + choice);
            if (choice == 1) {
                _Kernel.krnTrace('Context Switch');
                this.pcb = _CPUScheduler.next();
                this.PC = this.pcb.getPC();
                this.Acc = this.pcb.getAcc();
                this.Xreg = this.pcb.getXReg();
                this.Yreg = this.pcb.getYReg();
                this.Zflag = this.pcb.getZFlag();
                this.base = this.pcb.start;
                this.limit = this.base + 255;
                this.isExecuting = true;
                this.updateDisplay();
            } else if (choice == 2) {
                _Kernel.krnTrace('Context Switch');
                this.pcb.dumpRegisters(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag);
                _CPUScheduler.add(this.pcb);
                this.pcb = _CPUScheduler.next();
                this.PC = this.pcb.getPC();
                this.Acc = this.pcb.getAcc();
                this.Xreg = this.pcb.getXReg();
                this.Yreg = this.pcb.getYReg();
                this.Zflag = this.pcb.getZFlag();
                this.base = this.pcb.start;
                this.limit = this.base + 255;
                this.isExecuting = true;
                this.updateDisplay();
            } else if (choice == 3) {
                _Kernel.krnTrace('CPU cycle');
                var command = this.pcb.getBlock(this.PC);
                this.PC++;
                this.doCommand(command);
                this.IR = command;
                this.updateDisplay();
                this.pcb.dumpRegisters(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag);

                //                    _Console.putText("t");
                if (this.pcb.isFinished(this.PC)) {
                    _CPUScheduler.finish(this.pcb.getPID());
                    this.pcb = null;
                    this.isExecuting = false;
                    this.cycle();
                }
            }
            //            if(this.isExecuting){
            //                if(this.pcb != null){
            //                    // do next command
            //                    var command = this.pcb.getBlock(this.PC);
            //                    this.PC++;
            //                    this.doCommand(command);
            //                    this.IR = command;
            //                    this.updateDisplay()
            //
            //
            ////                    _Console.putText("t");
            //                    if(this.pcb.isFinished(this.PC)){
            //                        this.pcb = null;
            //                        this.isExecuting = false;
            //                    }
            //                }
            //            }
        };

        /**
        * Updates the host display
        */
        Cpu.prototype.updateDisplay = function () {
            document.getElementById("taPC").innerHTML = TSOS.MemoryManager.decToHex2(this.PC);
            document.getElementById("taIR").innerHTML = TSOS.MemoryManager.decToHex(this.IR);
            document.getElementById("taAcc").innerHTML = TSOS.MemoryManager.decToHex(this.Acc);
            document.getElementById("taXReg").innerHTML = TSOS.MemoryManager.decToHex(this.Xreg);
            document.getElementById("taYReg").innerHTML = TSOS.MemoryManager.decToHex(this.Yreg);
            document.getElementById("taZFlag").innerHTML = TSOS.MemoryManager.decToHex(this.Zflag);
        };

        Cpu.prototype.kill = function (id) {
            if (this.pcb.getPID() == id) {
                //                while(!this.pcb.isFinished(this.PC)){
                //                    this.PC++;
                //                }
                //                console.log("happens");
                this.isExecuting = false;
                this.pcb = null;
            }
        };

        /**
        * Handles an opcode and does necessary operations
        * @param command the opcode to execute.
        */
        Cpu.prototype.doCommand = function (command) {
            switch (command) {
                case 169:
                    this.Acc = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    break;

                case 173:
                    var valA = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var valB = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var val = (valB * 256) + valA;
                    this.Acc = _Memory.getMemoryBlock(val + this.base);
                    break;

                case 141:
                    var valA = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var valB = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var val = (valB * 256) + valA;
                    _MemoryManager.setMemoryBlock(val + this.base, this.Acc);
                    break;

                case 109:
                    var valA = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var valB = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var val = (valB * 256) + valA;
                    var value = _Memory.getMemoryBlock(val + this.base);
                    this.Acc += value;
                    if (this.Acc > 255) {
                        this.Acc = 255;
                    }
                    break;
                case 162:
                    this.Xreg = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    break;
                case 160:
                    this.Yreg = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    break;

                case 174:
                    var valA = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var valB = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var val = (valB * 256) + valA;
                    this.Xreg = _Memory.getMemoryBlock(val + this.base);
                    break;

                case 172:
                    var valA = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var valB = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var val = (valB * 256) + valA;
                    this.Yreg = _Memory.getMemoryBlock(val + this.base);
                    break;
                case 234:
                    break;

                case 236:
                    var valA = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var valB = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var val = (valB * 256) + valA;
                    var value = _Memory.getMemoryBlock(val + this.base);

                    //                    console.log(val);
                    //                    console.log(value);
                    if (value == this.Xreg) {
                        this.Zflag = 255;
                    } else {
                        this.Zflag = 0;
                    }
                    break;
                case 208:
                    var val = _Memory.getMemoryBlock(this.PC);
                    if (this.Zflag == 0) {
                        this.PC += val;
                        console.log(val);
                        if (this.PC > this.pcb.getStart() + 256) {
                            this.PC -= 256;
                        }
                    } else {
                        this.PC++;
                    }
                    break;

                case 238:
                    var valA = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var valB = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    var val = (valB * 256) + valA;
                    var value = _Memory.getMemoryBlock(val + this.base);
                    value++;
                    if (value > 255) {
                        value = 255;
                    }
                    _MemoryManager.setMemoryBlock(val + this.base, value);
                    break;
                case 0:
                    break;
                case 255:
                    this.sysCall();
                    break;
            }
        };

        /**
        * Does a system call and prints to the console
        */
        Cpu.prototype.sysCall = function () {
            switch (this.Xreg) {
                case 1:
                    var output = "" + this.Yreg;
                    _StdOut.putText(output);
                    break;
                case 2:
                    //                    console.log("happens");
                    var i = this.Yreg + this.base;
                    var x = _Memory.getMemoryBlock(i);
                    var output = "";
                    i++;
                    while (x != 0) {
                        var c = String.fromCharCode(x);

                        //                        alert(c);
                        //                        alert(i);
                        //                        i++;
                        output += c;
                        x = _Memory.getMemoryBlock(i);
                        i++;
                    }
                    _StdOut.putText(output);
                    break;
            }
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
