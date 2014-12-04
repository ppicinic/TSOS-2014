/**
* Created by Phil on 10/3/2014.
*/
var TSOS;
(function (TSOS) {
    // stores information about a user program
    var ProcessControlBlock = (function () {
        function ProcessControlBlock(length, start, end, PC, IR, Acc, XReg, YReg, ZFlag, PID, state, drive) {
            if (typeof start === "undefined") { start = 0; }
            if (typeof end === "undefined") { end = 0; }
            if (typeof PC === "undefined") { PC = 0; }
            if (typeof IR === "undefined") { IR = 0; }
            if (typeof Acc === "undefined") { Acc = 0; }
            if (typeof XReg === "undefined") { XReg = 0; }
            if (typeof YReg === "undefined") { YReg = 0; }
            if (typeof ZFlag === "undefined") { ZFlag = 0; }
            if (typeof PID === "undefined") { PID = 0; }
            if (typeof state === "undefined") { state = "Waiting"; }
            if (typeof drive === "undefined") { drive = false; }
            this.length = length;
            this.start = start;
            this.end = end;
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.XReg = XReg;
            this.YReg = YReg;
            this.ZFlag = ZFlag;
            this.PID = PID;
            this.state = state;
            this.drive = drive;
            this.end = this.start + this.length;
            this.PC = this.start;
        }
        ProcessControlBlock.prototype.setStart = function (i) {
            this.start = i * 256;
            this.PC = (this.PC % 256) + this.start;
            this.end = this.start + this.length;
        };

        ProcessControlBlock.prototype.init = function () {
        };

        ProcessControlBlock.prototype.setPID = function (id) {
            this.PID = id;
        };

        ProcessControlBlock.prototype.getPID = function () {
            return this.PID;
        };

        ProcessControlBlock.prototype.onDrive = function () {
            return this.drive;
        };

        ProcessControlBlock.prototype.setDrive = function (val) {
            this.drive = val;
        };

        ProcessControlBlock.prototype.setState = function (newState) {
            this.state = newState;
        };

        ProcessControlBlock.prototype.getState = function () {
            return this.state;
        };

        ProcessControlBlock.prototype.dumpRegisters = function (pc, ir, acc, x, y, z) {
            this.PC = pc;
            this.IR = ir;
            this.Acc = acc;
            this.XReg = x;
            this.YReg = y;
            this.ZFlag = z;
        };

        ProcessControlBlock.prototype.getIR = function () {
            return this.IR;
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
