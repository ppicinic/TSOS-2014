/**
* Created by Phil on 10/3/2014.
*/
var TSOS;
(function (TSOS) {
    var ProcessControlBlock = (function () {
        function ProcessControlBlock(start, length, pos) {
            if (typeof pos === "undefined") { pos = 0; }
            this.start = start;
            this.length = length;
            this.pos = pos;
        }
        ProcessControlBlock.prototype.init = function () {
        };

        ProcessControlBlock.prototype.getNextCommand = function () {
            var r = _MemoryManager.getMemoryBlock(this.start + this.pos);
            this.pos++;
            return r;
        };

        ProcessControlBlock.prototype.isFinished = function () {
            if (this.pos == this.length) {
                this.pos = 0;
                return true;
            } else {
                return false;
            }
        };
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
