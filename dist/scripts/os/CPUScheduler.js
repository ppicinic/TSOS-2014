var TSOS;
(function (TSOS) {
    var CPUScheduler = (function () {
        function CPUScheduler(readyQueue, mode, quantum, tick) {
            if (typeof readyQueue === "undefined") { readyQueue = []; }
            if (typeof mode === "undefined") { mode = 0; }
            if (typeof quantum === "undefined") { quantum = 6; }
            if (typeof tick === "undefined") { tick = 0; }
            this.readyQueue = readyQueue;
            this.mode = mode;
            this.quantum = quantum;
            this.tick = tick;
        }
        CPUScheduler.prototype.init = function () {
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
            }
            if (!_CPU.isExecuting) {
                _CPU.cycle();
            }
        };

        CPUScheduler.prototype.isEmpty = function () {
            return this.readyQueue.length == 0;
        };
        CPUScheduler.prototype.next = function () {
            return this.readyQueue.shift();
        };

        CPUScheduler.prototype.add = function (pcb) {
            this.readyQueue.push(pcb);
            if (!_CPU.isExecuting) {
                _CPU.cycle();
            }
        };
        return CPUScheduler;
    })();
    TSOS.CPUScheduler = CPUScheduler;
})(TSOS || (TSOS = {}));
