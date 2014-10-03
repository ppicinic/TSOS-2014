/**
* Created by Phil on 10/3/2014.
*/
var TSOS;
(function (TSOS) {
    var ProcessControlBlock = (function () {
        function ProcessControlBlock(start, length, end) {
            if (typeof end === "undefined") { end = 0; }
            this.start = start;
            this.length = length;
            this.end = end;
            this.end = this.start + this.length;
        }
        ProcessControlBlock.prototype.init = function () {
        };

        ProcessControlBlock.prototype.getBlock = function (pos) {
            var r = _MemoryManager.getMemoryBlock(pos);
            return r;
        };

        ProcessControlBlock.prototype.isFinished = function (pos) {
            if (pos == this.end) {
                return true;
            } else {
                return false;
            }
        };
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
