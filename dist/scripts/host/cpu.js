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
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting, pcb) {
            if (typeof PC === "undefined") { PC = 0; }
            if (typeof Acc === "undefined") { Acc = 0; }
            if (typeof Xreg === "undefined") { Xreg = 0; }
            if (typeof Yreg === "undefined") { Yreg = 0; }
            if (typeof Zflag === "undefined") { Zflag = 0; }
            if (typeof isExecuting === "undefined") { isExecuting = false; }
            if (typeof pcb === "undefined") { pcb = null; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.pcb = pcb;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };

        Cpu.prototype.setPcb = function (newPcb) {
            this.pcb = newPcb;
            this.PC = this.pcb.start;
            this.isExecuting = true;
        };

        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');

            // TODO: Accumulate CPU usage and profiling statistics here.
            console.log("happens");

            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if (this.isExecuting) {
                if (this.pcb != null) {
                    // do next command
                    var command = this.pcb.getBlock(this.PC);
                    this.PC++;
                    this.doCommand(command);
                    this.updateDisplay();

                    //                    _Console.putText("t");
                    if (this.pcb.isFinished(this.PC)) {
                        this.pcb = null;
                        this.isExecuting = false;
                    }
                }
            }
        };

        Cpu.prototype.updateDisplay = function () {
            console.log(this.Acc);
            document.getElementById("taPC").innerHTML = TSOS.MemoryManager.decToHex(this.PC);
            document.getElementById("taAcc").innerHTML = TSOS.MemoryManager.decToHex(this.Acc);
            document.getElementById("taXReg").innerHTML = TSOS.MemoryManager.decToHex(this.Xreg);
            document.getElementById("taYReg").innerHTML = TSOS.MemoryManager.decToHex(this.Yreg);
            document.getElementById("taZFlag").innerHTML = TSOS.MemoryManager.decToHex(this.Zflag);
        };

        Cpu.prototype.doCommand = function (command) {
            switch (command) {
                case 169:
                    this.Acc = _Memory.getMemoryBlock(this.PC);
                    this.PC++;
                    break;
            }
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
