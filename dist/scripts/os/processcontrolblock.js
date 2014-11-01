/**
* Created by Phil on 10/3/2014.
*/
var TSOS;
(function (TSOS) {
    // stores information about a user program
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
