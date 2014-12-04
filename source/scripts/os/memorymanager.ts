/**
 * Created by Phil on 10/2/2014.
 */

module TSOS {

    export class MemoryManager{

        constructor(public memoryTable : HTMLTableElement = null, public loadPos : number = 0, public avail : boolean[] = new Array(3)){
            this.avail[0] = true;
            this.avail[1] = true;
            this.avail[2] = true;
            console.log(this.avail);
        }

        /**
         * Initializes memory manager and the host display
         */
        public init() : void {
            this.loadPos = 0;
            this.memoryTable = <HTMLTableElement> document.getElementById("memory");
//            this.memoryTable.insertRow()
//            this.memoryTable.rows.item(0).
//            console.log("init memory");
            for(var i = 0; i < 96; i++){
                this.memoryTable.insertRow();
            }
            for(var i = 0; i < 96; i++ ){
//                var row = new HTMLTableRowElement();
//                this.memoryTable.innerHTML = "<tr></tr>"
                var row : HTMLTableRowElement = <HTMLTableRowElement> this.memoryTable.rows.item(i);
                for(var x = 0; x < 9; x++) {
                    row.insertCell();
                }
//                console.log("insert" + i);
                for(var x = 0; x < 9; x++) {
                    var cell:HTMLTableDataCellElement = <HTMLTableCellElement> row.cells.item(0);
                    cell.innerHTML = "0x" + MemoryManager.transform2(i * 8);
                    for(var y = 1; y <= 8; y++){
                        var cell:HTMLTableDataCellElement = <HTMLTableCellElement> row.cells.item(y);
                        var a = _Memory.getMemoryBlock(((i + 1) * y) - 1)
                        cell.innerHTML = MemoryManager.decToHex(a);

                    }
                }

            }

        }

        /**
         * Converts decimal to hex
         * Should be moved to utils?
         * @param i the number to convert
         * @returns {string} the converted hex
         */
        public static decToHex(i : number ): string{
            var x = Math.floor(i / 16);
            var y = Math.floor((i - (x * 16)));
            return "" + MemoryManager.transform(x) + MemoryManager.transform(y);
        }

        public static decToHex2(i : number): string{
            var x = Math.floor(i / 256);
            var y = Math.floor((i - (x * 256)) / 16)
            var z = Math.floor((i - (x * 256) - (y * 16)));
//            console.log(x);
//            console.log(y);
//            console.log(z);
            return "" + MemoryManager.transform(x) + MemoryManager.transform(y) + MemoryManager.transform(z);
        }
        /**
         * Converts decimal to hex
         * Should be moved to utils?
         * @param i the number to convert
         * @returns {string} the converted hex
         */
        public static transform2(i : number): string{
            var x = Math.floor(i / 256);
            var y = Math.floor((i - (x * 256)) / 16);
            var z = ((i - (x * 256)) - (y * 16));
            return "" + MemoryManager.transform(x) + MemoryManager.transform(y) + MemoryManager.transform(z);
        }
        // Converts a 4 bit number to hex
        public static transform(i : number): string{
            if(i < 10){
                return "" + i;
            }
            switch (i){
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
        }

        // Converts a single hex character to decimal
        public static getNumericValue(hexChar : string): number{
            switch (hexChar.charAt(0)){
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
        }

        /**
         * Converts hex to decimal
         * @param hex the hex to convert
         * @returns {number} the converted decimal
         */
        public static hexToDec(hex : String):number{
            var x = MemoryManager.getNumericValue(hex.charAt(0))* 16;
            x += MemoryManager.getNumericValue(hex.charAt(1));
            return x;
        }

        public memAvailable() : boolean {
            for(var i = 0; i < this.avail.length; i++){
                if(this.avail[i]){
                    return true;
                }
            }
            return false;
        }

        public getProgramData(i : number) : number[] {
            var code : number[] = new Array(256);
            for(var x = 0; x < 256; x++ ){
                code[x] = _Memory.getMemoryBlock((i * 256) + x);
            }
            return code;
        }

        public free(i : number) : void {
            this.avail[i] = true;
        }

        /**
         * Store a hex value in memory
         * @param hexValue the hex value
         */
        public parseCode(hexValue : string) : number[]{
//            if(_CPUScheduler.isEmpty() && !_CPU.isExecuting) {
            var code : number[] = new Array(256);
//                var pos = this.loadPos * 256;
            for(var i = 0; i < 256; i++){
                code[i] = 0;
            }
                for (var i = 0; i < hexValue.length; i += 2) {
                    var valA = hexValue.charAt(i);
                    var valB = hexValue.charAt(i + 1);
                    var a = MemoryManager.hexToDec(valA + valB);
                    code[i/2] = a;
//                    _Memory.setMemoryBlock(((i / 2) + pos), a);
//                    this.updateControl((i / 2) + pos);
//                var x = Math.floor(i / 16);
//                var y = (i - (x * 16)) / 2;
//                var cell = <HTMLTableCellElement>(<HTMLTableRowElement>this.memoryTable.rows.item(x)).cells.item(y + 1);
//                cell.innerHTML = valA + valB;
                }

//                this.loadPos++;
//                this.loadPos = this.loadPos % 3;
//                return pos;
//            }
            return code;
        }

        public loadMemory(code : number[]) : number {
            console.log(code);
            var found : boolean = false;
            for(var i = 0; i < 3 && !found; i++){
                if(this.avail[i]){
                    this.avail[i] = false;
                    found = true;
                    console.log("finds mem allocation" + i);
                    for(var j = 0; j < code.length; j++){
                        this.setMemoryBlock((i * 256) + j, code[j]);
//                        console.log(this.memoryTable[(i * 256) + j]);
//                        this.updateControl((i * 256) + j);
                    }
                    return i;
                }
            }
            return -1;
        }

        /**
         * Gets a block of memory
         * @param i the specified block
         * @returns {number} the value in memory
         */
        public getMemoryBlock(i : number): number{
            return _Memory.getMemoryBlock(i);
        }

        /**
         * Sets a block at memory
         * @param index the specified block
         * @param value the value to store
         */
        public setMemoryBlock(index: number, value: number){
            _Memory.setMemoryBlock(index, value);
            this.updateControl(index);
        }

        /**
         * Updates the host display
         * @param i the block in memory to update
         */
        public updateControl(i : number) : void{
            var rowNumber = Math.floor((i / 8));
            var cellNumber = i - (rowNumber * 8) + 1;
            var a = _Memory.getMemoryBlock(i)
            var row = <HTMLTableRowElement> this.memoryTable.rows.item(rowNumber);
            var cell = <HTMLTableCellElement> row.cells.item(cellNumber);
            cell.innerHTML = MemoryManager.decToHex(a);
//            var a = ((((i + 1) * y) - 1) * 2);
//            var b = a + 1;
//            var c = _Memory.getMemoryBlock(a);
//            var d = _Memory.getMemoryBlock(b);
//            cell.innerHTML = MemoryManager.transform(c) + MemoryManager.transform(d);
        }

        public clearMem(){
            for(var i = 0; i < 768; i++){
                _Memory.setMemoryBlock(i, 0);
                this.updateControl(i);
            }
        }
    }
}