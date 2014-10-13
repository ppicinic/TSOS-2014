/**
* Created by Phil on 10/2/2014.
*/
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(memoryTable) {
            if (typeof memoryTable === "undefined") { memoryTable = null; }
            this.memoryTable = memoryTable;
        }
        /**
        * Initializes memory manager and the host display
        */
        MemoryManager.prototype.init = function () {
            this.memoryTable = document.getElementById("memory");

            //            this.memoryTable.insertRow()
            //            this.memoryTable.rows.item(0).
            console.log("init memory");
            for (var i = 0; i < 96; i++) {
                this.memoryTable.insertRow();
            }
            for (var i = 0; i < 96; i++) {
                //                var row = new HTMLTableRowElement();
                //                this.memoryTable.innerHTML = "<tr></tr>"
                var row = this.memoryTable.rows.item(i);
                for (var x = 0; x < 9; x++) {
                    row.insertCell();
                }

                for (var x = 0; x < 9; x++) {
                    var cell = row.cells.item(0);
                    cell.innerHTML = "0x" + MemoryManager.transform2(i * 8);
                    for (var y = 1; y <= 8; y++) {
                        var cell = row.cells.item(y);
                        var a = _Memory.getMemoryBlock(((i + 1) * y) - 1);
                        cell.innerHTML = MemoryManager.decToHex(a);
                    }
                }
            }
        };

        /**
        * Converts decimal to hex
        * Should be moved to utils?
        * @param i the number to convert
        * @returns {string} the converted hex
        */
        MemoryManager.decToHex = function (i) {
            var x = Math.floor(i / 16);
            var y = Math.floor((i - (x * 16)));
            return "" + MemoryManager.transform(x) + MemoryManager.transform(y);
        };

        /**
        * Converts decimal to hex
        * Should be moved to utils?
        * @param i the number to convert
        * @returns {string} the converted hex
        */
        MemoryManager.transform2 = function (i) {
            var x = Math.floor(i / 256);
            var y = Math.floor((i - (x * 256)) / 16);
            var z = ((i - (x * 256)) - (y * 16));
            return "" + MemoryManager.transform(x) + MemoryManager.transform(y) + MemoryManager.transform(z);
        };

        // Converts a 4 bit number to hex
        MemoryManager.transform = function (i) {
            if (i < 10) {
                return "" + i;
            }
            switch (i) {
                case 10:
                    return "A";
                case 11:
                    return "B";
                case 12:
                    return "C";
                case 13:
                    return "D";
                case 14:
                    return "E";
                case 15:
                    return "F";
            }
            return "";
        };

        // Converts a single hex character to decimal
        MemoryManager.getNumericValue = function (hexChar) {
            switch (hexChar.charAt(0)) {
                case 'A':
                    return 10;
                case 'B':
                    return 11;
                case 'C':
                    return 12;
                case 'D':
                    return 13;
                case 'E':
                    return 14;
                case 'F':
                    return 15;
            }
            return parseInt(hexChar.charAt(0));
        };

        /**
        * Converts hex to decimal
        * @param hex the hex to convert
        * @returns {number} the converted decimal
        */
        MemoryManager.hexToDec = function (hex) {
            var x = MemoryManager.getNumericValue(hex.charAt(0)) * 16;
            x += MemoryManager.getNumericValue(hex.charAt(1));
            return x;
        };

        /**
        * Store a hex value in memory
        * @param hexValue the hex value
        */
        MemoryManager.prototype.loadMemory = function (hexValue) {
            for (var i = 0; i < hexValue.length; i += 2) {
                var valA = hexValue.charAt(i);
                var valB = hexValue.charAt(i + 1);
                var a = MemoryManager.hexToDec(valA + valB);
                _Memory.setMemoryBlock(i / 2, a);
                this.updateControl(i / 2);
                //                var x = Math.floor(i / 16);
                //                var y = (i - (x * 16)) / 2;
                //                var cell = <HTMLTableCellElement>(<HTMLTableRowElement>this.memoryTable.rows.item(x)).cells.item(y + 1);
                //                cell.innerHTML = valA + valB;
            }
        };

        /**
        * Gets a block of memory
        * @param i the specified block
        * @returns {number} the value in memory
        */
        MemoryManager.prototype.getMemoryBlock = function (i) {
            return _Memory.getMemoryBlock(i);
        };

        /**
        * Sets a block at memory
        * @param index the specified block
        * @param value the value to store
        */
        MemoryManager.prototype.setMemoryBlock = function (index, value) {
            _Memory.setMemoryBlock(index, value);
            this.updateControl(index);
        };

        /**
        * Updates the host display
        * @param i the block in memory to update
        */
        MemoryManager.prototype.updateControl = function (i) {
            var rowNumber = Math.floor((i / 8));
            var cellNumber = i - (rowNumber * 8) + 1;
            var a = _Memory.getMemoryBlock(i);
            var row = this.memoryTable.rows.item(rowNumber);
            var cell = row.cells.item(cellNumber);
            cell.innerHTML = MemoryManager.decToHex(a);
            //            var a = ((((i + 1) * y) - 1) * 2);
            //            var b = a + 1;
            //            var c = _Memory.getMemoryBlock(a);
            //            var d = _Memory.getMemoryBlock(b);
            //            cell.innerHTML = MemoryManager.transform(c) + MemoryManager.transform(d);
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
