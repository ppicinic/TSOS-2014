var TSOS;
(function (TSOS) {
    var CPUScheduler = (function () {
        function CPUScheduler(readyQueue, displayQueue, mode, quantum, tick) {
            if (typeof readyQueue === "undefined") { readyQueue = []; }
            if (typeof displayQueue === "undefined") { displayQueue = []; }
            if (typeof mode === "undefined") { mode = 0; }
            if (typeof quantum === "undefined") { quantum = 6; }
            if (typeof tick === "undefined") { tick = 0; }
            this.readyQueue = readyQueue;
            this.displayQueue = displayQueue;
            this.mode = mode;
            this.quantum = quantum;
            this.tick = tick;
        }
        CPUScheduler.prototype.init = function () {
            this.updateDisplay();
        };

        // 0 do nothing
        // 1 grab a pcb
        // 2 context switch pcb
        // 3 execute one cycle
        CPUScheduler.prototype.cycle = function (executing) {
            if (executing) {
                if (this.mode == 0) {
                    if (this.tick == this.quantum) {
                        this.tick = 0;
                        return 2;
                    } else {
                        this.tick++;
                        return 3;
                    }
                }
            } else {
                if (!this.isEmpty()) {
                    return 1;
                }
            }
            return 0;
        };

        CPUScheduler.prototype.setQuantum = function (quant) {
            this.quantum = quant;
        };

        CPUScheduler.prototype.addAll = function (pcbs) {
            for (var i = 0; i < pcbs.length; i++) {
                this.readyQueue.push(pcbs[i]);
                this.displayQueue.push(pcbs[i]);
            }
        };

        CPUScheduler.prototype.kill = function (id) {
            var x = -1;
            for (var i = 0; i < this.readyQueue.length; i++) {
                if (this.readyQueue[i].getPID() == id) {
                    x = i;
                }
            }
            if (x == -1) {
                //check CPU
                _CPU.kill(id);
            } else {
                this.readyQueue.splice(x, 1);
            }
            var y = -1;
            for (var i = 0; i < this.displayQueue.length; i++) {
                if (this.displayQueue[i].getPID() == id) {
                    y = i;
                }
            }
            this.displayQueue.splice(y, 1);
        };

        CPUScheduler.prototype.finish = function (id) {
            var x = -1;
            for (var i = 0; i < this.displayQueue.length; i++) {
                if (this.displayQueue[i].getPID() == id) {
                    x = i;
                }
            }
            this.displayQueue.splice(x, 1);
        };

        CPUScheduler.prototype.isEmpty = function () {
            return this.readyQueue.length == 0;
        };
        CPUScheduler.prototype.next = function () {
            return this.readyQueue.shift();
        };

        CPUScheduler.prototype.add = function (pcb) {
            this.readyQueue.push(pcb);
        };

        CPUScheduler.prototype.addNew = function (pcb) {
            this.readyQueue.push(pcb);
            this.displayQueue.push(pcb);
        };

        CPUScheduler.prototype.display = function () {
            _StdOut.putText("PID    PC   IR   ACC    X    Y     Z");
            for (var i = 0; i < this.displayQueue.length; i++) {
                _StdOut.advanceLine();
                var pcb = this.displayQueue[i];
                _StdOut.putText(this.pad3(pcb.getPID().toString()));
                _StdOut.putText("   ");
                _StdOut.putText(this.pad3(TSOS.MemoryManager.decToHex2(pcb.getPC())));
                _StdOut.putText("   ");
                _StdOut.putText(this.pad2(TSOS.MemoryManager.decToHex(pcb.getIR())));
                _StdOut.putText("   ");
                _StdOut.putText(this.pad3(TSOS.MemoryManager.decToHex(pcb.getAcc())));
                _StdOut.putText("   ");
                _StdOut.putText(this.pad2(TSOS.MemoryManager.decToHex(pcb.getXReg())));
                _StdOut.putText("   ");
                _StdOut.putText(this.pad2(TSOS.MemoryManager.decToHex(pcb.getYReg())));
                _StdOut.putText("   ");
                _StdOut.putText(this.pad2(TSOS.MemoryManager.decToHex(pcb.getZFlag())));
            }
        };

        CPUScheduler.prototype.updateDisplay = function () {
            var output = "";
            output += "PID    PC   IR   Acc    X    Y    Z   State";
            if (this.displayQueue.length == 0) {
                output += "\nThere are no running processes.";
            }
            for (var i = 0; i < this.displayQueue.length; i++) {
                var pcb = this.displayQueue[i];
                output += "\n";
                output += this.pad3(pcb.getPID().toString());
                output += "   ";
                output += this.pad3(TSOS.MemoryManager.decToHex2(pcb.getPC()));
                output += "   ";
                output += this.pad2(TSOS.MemoryManager.decToHex(pcb.getIR()));
                output += "   ";
                output += this.pad3(TSOS.MemoryManager.decToHex(pcb.getAcc()));
                output += "   ";
                output += this.pad2(TSOS.MemoryManager.decToHex(pcb.getXReg()));
                output += "   ";
                output += this.pad2(TSOS.MemoryManager.decToHex(pcb.getYReg()));
                output += "   ";
                output += this.pad2(TSOS.MemoryManager.decToHex(pcb.getZFlag()));
                output += "   ";
                output += pcb.getState();
            }
            document.getElementById("taPCBDisplay").innerHTML = output;
        };

        CPUScheduler.prototype.pad3 = function (text) {
            if (text.length == 0) {
                return "   ";
            } else if (text.length == 1) {
                return "  " + text;
            } else if (text.length == 2) {
                return " " + text;
            }
            return text;
        };

        CPUScheduler.prototype.pad2 = function (text) {
            if (text.length == 0) {
                return "  ";
            } else if (text.length == 1) {
                return " " + text;
            }
            return text;
        };
        return CPUScheduler;
    })();
    TSOS.CPUScheduler = CPUScheduler;
})(TSOS || (TSOS = {}));
