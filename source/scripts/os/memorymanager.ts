/**
 * Created by Phil on 10/2/2014.
 */

module TSOS {

    export class MemoryManager{

        constructor(public memoryTable : HTMLTableElement = null){

        }

        public init() : void {
            this.memoryTable = <HTMLTableElement> document.getElementById("memory");
//            this.memoryTable.insertRow()
//            this.memoryTable.rows.item(0).
            console.log("init memory");
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

        public static decToHex(i : number ): string{
            var x = Math.floor(i / 16);
            var y = Math.floor((i - (x * 16)));
            return "" + MemoryManager.transform(x) + MemoryManager.transform(y);
        }
        private static transform2(i : number): string{
            var x = Math.floor(i / 256);
            var y = Math.floor((i - (x * 256)) / 16);
            var z = ((i - (x * 256)) - (y * 16));
            return "" + MemoryManager.transform(x) + MemoryManager.transform(y) + MemoryManager.transform(z);
        }
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

        public static hexToDec(hex : String):number{
            var x = MemoryManager.getNumericValue(hex.charAt(0))* 16;
            x += MemoryManager.getNumericValue(hex.charAt(1));
            return x;
        }

        public loadMemory(hexValue : string){
            for(var i = 0; i < hexValue.length; i += 2){
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
        }

        public getMemoryBlock(i : number): number{
            return _Memory.getMemoryBlock(i);
        }

        public setMemoryBlock(index: number, value: number){
            _Memory.setMemoryBlock(index, value);
            this.updateControl(index);
        }

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
    }
}