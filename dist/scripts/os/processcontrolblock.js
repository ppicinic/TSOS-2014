/**
* Created by Phil on 10/3/2014.
*/
var TSOS;
(function (TSOS) {
    // stores information about a user program
    var ProcessControlBlock = (function () {
        function ProcessControlBlock(start, length, end, PC, Acc, XReg, YReg, ZFlag, PID) {
            if (typeof end === "undefined") { end = 0; }
            if (typeof PC === "undefined") { PC = 0; }
            if (typeof Acc === "undefined") { Acc = 0; }
            if (typeof XReg === "undefined") { XReg = 0; }
            if (typeof YReg === "undefined") { YReg = 0; }
            if (typeof ZFlag === "undefined") { ZFlag = 0; }
            if (typeof PID === "undefined") { PID = 0; }
            this.start = start;
            this.length = length;
            this.end = end;
            this.PC = PC;
            this.Acc = Acc;
            this.XReg = XReg;
            this.YReg = YReg;
            this.ZFlag = ZFlag;
            this.PID = PID;
            this.end = this.start + this.length;
            this.PC = this.start;
        }
        ProcessControlBlock.prototype.init = function () {
        };

        ProcessControlBlock.prototype.setPID = function (id) {
            this.PID = id;
        };

        ProcessControlBlock.prototype.getPID = function () {
            return this.PID;
        };

        ProcessControlBlock.prototype.dumpRegisters = function (pc, acc, x, y, z) {
            this.PC = pc;
            this.Acc = acc;
            this.XReg = x;
            this.YReg = y;
            this.ZFlag = z;
        };

        ProcessControlBlock.prototype.getPC = function () {
            return this.PC;
        };

        ProcessControlBlock.prototype.getAcc = function () {
            return this.Acc;
        };

        ProcessControlBlock.prototype.getXReg = function () {
            return this.XReg;
        };

        ProcessControlBlock.prototype.getYReg = function () {
            return this.YReg;
        };

        ProcessControlBlock.prototype.getZFlag = function () {
            return this.ZFlag;
        };

        /**
        * Gets next block of the program
        * @param pos the position in the program
        * @returns {number} the next piece of code
        */
        ProcessControlBlock.prototype.getBlock = function (pos) {
            return _MemoryManager.getMemoryBlock(pos);
        };

        ProcessControlBlock.prototype.getStart = function () {
            return this.start;
        };

        /**
        * Tells if the program is at the end
        * @param pos the position the cpu is at
        * @returns {boolean} true if finished, false otherwise
        */
        ProcessControlBlock.prototype.isFinished = function (pos) {
            if (pos >= this.end) {
                return true;
            } else {
                return false;
            }
        };
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
