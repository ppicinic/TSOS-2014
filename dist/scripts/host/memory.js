/**
* Created by Phil on 10/2/2014.
*/
var TSOS;
(function (TSOS) {
    // main memory class - stores and loads memory
    var Memory = (function () {
        function Memory(memory) {
            if (typeof memory === "undefined") { memory = []; }
            this.memory = memory;
        }
        Memory.prototype.init = function () {
            for (var i = 0; i < 768; i++) {
                this.memory[i] = 0;
            }
        };

        /**
        * Gets the memory value at a specified block
        * @param i the block of memory
        * @returns {number} The memory value at the block
        */
        Memory.prototype.getMemoryBlock = function (i) {
            return this.memory[i];
        };

        /**
        * Stores a value at specific point in memory
        * @param index the block to store in
        * @param value the value to store
        */
        Memory.prototype.setMemoryBlock = function (index, value) {
            this.memory[index] = value;
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
