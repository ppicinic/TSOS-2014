/**
 * Created by Phil on 12/2/2014.
 */

module TSOS {

    export class Hdd {

        public constructor(public data: number[][][][] = new Array(8),
                            public diskTable = null){

        }
        //compile
        public init() : void {
            this.startUp();
            this.initDisplay();
        }

        public startUp() : void {
            var test = localStorage.getItem("drive");
            //console.log(localSto)
            if(true){
                this.data = new Array(8);
                for(var x = 0; x < 8; x++){
                    this.data[x] = new Array(8);
                    for(var y = 0; y < 8; y++){
                        this.data[x][y] = new Array(8);
                        for(var z = 0; z < 8; z++){
                            this.data[x][y][z] = new Array(64);
                            for(var j = 0; j < 64; j++){
                                if(test != "true") {
                                    this.data[x][y][z][j] = 0;
                                    //console.log(this.data[x][y][z][j]);
                                    localStorage.setItem("drive" + x + "" + y + "" + z + "" + j + "", this.data[x][y][z][j].toString());
                                }else{
                                    this.data[x][y][z][j] = parseInt(localStorage.getItem("drive" + x + "" + y + "" + z + "" + j + ""));
                                }
                            }
                        }
                    }
                }
            }
//            console.log("a".charCodeAt(0));
            localStorage.setItem("drive", "true");
        }

        public initDisplay() : void {
//            this.loadPos = 0;
            var x1 = 0;
            var y1 = 0;
            var z1 = 0;
            this.diskTable = <HTMLTableElement> document.getElementById("hdd");
//            this.memoryTable.insertRow()
//            this.memoryTable.rows.item(0).
//            console.log("init memory");
            for(var i = 0; i < 513; i++){
                this.diskTable.insertRow();
            }
            var row : HTMLTableRowElement = <HTMLTableRowElement> this.diskTable.rows.item(0);
            for(var x = 0; x < 3; x++){
                row.insertCell();
            }
            for(var x = 0; x < 3; x++){
                var cell:HTMLTableDataCellElement = <HTMLTableCellElement> row.cells.item(x);
                if(x == 0){
                    cell.innerHTML = "TSB";
                }else if(x == 1){
                    cell.innerHTML = "Meta";
                }else{
                    cell.innerHTML = "Data";
                }
            }
            for(var i = 1; i < 513; i++ ){
//                var row = new HTMLTableRowElement();
//                this.memoryTable.innerHTML = "<tr></tr>"
                var row : HTMLTableRowElement = <HTMLTableRowElement> this.diskTable.rows.item(i);
                for(var x = 0; x < 3; x++) {
                    row.insertCell();
                }
//                console.log("insert" + i);

                for(var x = 0; x < 3; x++) {
                    var cell:HTMLTableDataCellElement = <HTMLTableCellElement> row.cells.item(x);
                    if(x == 0){
                        cell.innerHTML = "" + x1 + ":" + y1 + ":" + z1;
                    }else if(x == 1){
                        var text : string = "";
                        for(var j = 0; j < 4; j++) {
                            text += MemoryManager.decToHex(this.data[x1][y1][z1][j]);
                        }
                        cell.innerHTML = text;
                    }else{
                        var text : string = "";
                        for(var j = 4; j < 64; j++) {
                            text += MemoryManager.decToHex(this.data[x1][y1][z1][j]);
                        }
                        cell.innerHTML = text;
                    }
                }
                z1++;
                if(z1 >= 8){
                    z1 = 0;
                    y1++;
                    if(y1 >= 8){
                        y1 = 0;
                        x1++;
                    }
                }

            }
        }

        public format() : void {
            localStorage.setItem("drive", "false");
            this.startUp();
            this.refreshWholeDisplay();
        }

        public refreshWholeDisplay() : void {
            for(var x = 0; x < 8; x++){
                for(var y = 0; y < 8; y++){
                    for(var z = 0; z < 8; z++){
                        this.updateDisplay(x, y, z);
                    }
                }
            }
        }

        public deleteFile(filename : string, user : boolean) : void {
            var exists : boolean = false;
            var x1 = 0;
            var y1 = 0;
            var z1 = 0;
//            var mx = 0;
            var my = 0;
            var mz = 0;
//            for(var x = 1; x < 8 && !exists; x++){
            for(var y = 0; y < 8 && !exists; y++) {
                for (var z = 0; z < 8 && !exists; z++) {
                    var same:boolean = true;

                    for (var j = 0; (j < filename.length || j < 60) && same; j++) {
                        if (j >= filename.length) {
                            if (this.data[0][y][z][j + 4] == 0) {
                                x1 = this.data[0][y][z][0];
                                y1 = this.data[0][y][z][1];
                                z1 = this.data[0][y][z][2];
                                my = y;
                                mz = z;
                                exists = true;
                                same = false;
                            } else {
                                same = false;
                            }
                        }
                        else if (this.data[0][y][z][j + 4] == 0) {
                            same = false;
                        }
                        else if (filename.charCodeAt(j) != this.data[0][y][z][j + 4]) {
                            same = false;
                        }
                    }
                }
//                }
            }
            if(exists) {
                if (this.data[0][my][mz][3] == 0) {
                    this.data[0][my][mz][3] = 1;
                    this.setData(0, my, mz, 3);

                    var done : boolean = false;
                    while(!done){
                        var x2 = 0;
                        var y2 = 0;
                        var z2 = 0;
                        var next = false;
                        if(this.data[x1][y1][z1][61] != 0){
                            x2 = this.data[x1][y1][z1][61]
                            y2 = this.data[x1][y1][z1][62]
                            z2 = this.data[x1][y1][z1][63]
                            this.data[x1][y1][z1][61] = 0;
                            this.data[x1][y1][z1][62] = 0;
                            this.data[x1][y1][z1][63] = 0;
                            this.setData(x1, y1, z1, 61);
                            this.setData(x1, y1, z1, 62);
                            this.setData(x1, y1, z1, 63);

                        }else{
                            done = true;
                        }
                        this.data[x1][y1][z1][0] = 0;
                        this.data[x1][y1][z1][1] = 0;
                        this.setData(x1, y1, z1, 0);
                        this.setData(x1, y1, z1, 1);
                        x1 = x2;
                        y1 = y2;
                        z1 = z2;
                    }
                    for(var i = 0; i < 64; i++){
                        if(i != 3){
                            this.data[0][my][mz][i] = 0;
                            this.setData(0, my, mz, i);
                        }
                        this.data[0][my][mz][3] = 0;
                        this.setData(0, my, mz, 3);
                    }
                    if(user) {
                        _StdOut.putText(filename + " successfully deleted.");
                    }
                }else{
                    //file in use
                    if(user) {
                        _StdOut.putText(filename + " is already in use.");
                    }
                }
            }else{
                if(user) {
                    _StdOut.putText(filename + " does not exist.");
                }
            }
        }

        public listFiles() : void {
            var filename : string = "";
            var first : boolean = true;
            for(var y = 0; y < 8; y++){
                for(var z = 0; z < 8; z++){
                    if(this.data[0][y][z][0] != 0){
                        var done : boolean = false;
                        for(var j = 4; j < 64 && !done; j++){
                            var i = this.data[0][y][z][j];
                            if(i == 0){
                                done = true;
                                if(!first){
                                    _StdOut.advanceLine();
                                }
                                _StdOut.putText(filename);
                                filename = "";
                                first = false;
                            }else{
                                filename += String.fromCharCode(i);
                            }
                        }
                    }
                }
            }
        }

        public readFile(filename : string ) : number[] {
            var file = new Array();
            var exists : boolean = false;
            var x1 = 0;
            var y1 = 0;
            var z1 = 0;
//            var mx = 0;
            var my = 0;
            var mz = 0;
//            for(var x = 1; x < 8 && !exists; x++){
            for(var y = 0; y < 8 && !exists; y++) {
                for (var z = 0; z < 8 && !exists; z++) {
                    var same:boolean = true;

                    for (var j = 0; (j < filename.length || j < 60) && same; j++) {
                        if (j >= filename.length) {
                            if (this.data[0][y][z][j + 4] == 0) {
                                x1 = this.data[0][y][z][0];
                                y1 = this.data[0][y][z][1];
                                z1 = this.data[0][y][z][2];
                                my = y;
                                mz = z;
                                exists = true;
                                same = false;
                            } else {
                                same = false;
                            }
                        }
                        else if (this.data[0][y][z][j + 4] == 0) {
                            same = false;
                        }
                        else if (filename.charCodeAt(j) != this.data[0][y][z][j + 4]) {
                            same = false;
                        }
                    }
                }
//                }
            }
            console.log("exists " + exists);
            if(exists){
                if(this.data[0][my][mz][3] == 0) {
                    this.data[0][my][mz][3] = 1;
                    this.setData(0, my, mz, 3);
                    var done = false;
                    var h = 1;
                    while(!done){
//                        console.log("x: " + x1);
//                        console.log("y: " + y1);
//                        console.log("z: " + z1);
//                        console.log("h: " + h);
                        if(h >= 61){
                            if(this.data[x1][y1][z1][h] != 0) {
                                var x2 = this.data[x1][y1][z1][61];
                                var y2 = this.data[x1][y1][z1][62];
                                var z2 = this.data[x1][y1][z1][63];
                                x1 = x2;
                                y1 = y2;
                                z1 = z2;
                                h = 1;
                            }
                        }
                        if(this.data[x1][y1][z1][h] != 0){
                            file.push(this.data[x1][y1][z1][h]);
                        }else{
                            done = true;
                        }
                        h++;
                    }

                    this.data[0][my][mz][3] = 0;
                    this.setData(0, my, mz, 3);
                }else{
                    _StdOut.putText(filename + " is currently in use.");
                    return null;
                }
            }else{
                console.log("not found");
                _StdOut.putText(filename + " does not exist.");
                return null;
            }
            return file;
        }

        public readFileAsString(filename : string){
            console.log("reading");
            var file : number[] = this.readFile(filename);
            if(file != null){
                var text : string = "";
                for(var i = 0; i < file.length; i++){
                    text += String.fromCharCode(file[i]);
                }
                _StdOut.putText(text);
            }
        }

        public createFile(filename : string, user : boolean) : void {
           var x1 = 0;
           var y1 = 0;
           var z1 = 0;
            var found : boolean = false;
           for(var x = 1; x < 8 && !found; x++){
                for(var y = 0; y < 8 && !found; y++){
                    for(var z = 0; z < 8 && !found; z++){
                        if(this.data[x][y][z][0] == 0){
                            x1 = x;
                            y1 = y;
                            z1 = z;
                            found = true;
                        }
                    }
                }
           }
            var y2 = 0;
            var z2 = 0;
            var exists : boolean = false;
            for(var y = 7; y >= 0; y--){
                for(var z = 7; z >= 0; z--){
                    if(this.data[0][y][z][0] == 0){
                        y2 = y;
                        z2 = z;
                    }else{
                        var same : boolean = true;

                        for(var j = 0; (j < filename.length || j < 60) && same; j++){
                            if(j >= filename.length){
                                if(this.data[0][y][z][j+4] == 0){
                                    exists = true;
                                    same = false;
                                }else{
                                    same = false;
                                }
                            }
                            else if(this.data[0][y][z][j + 4] == 0){
                                same = false;
                            }
                            else if(filename.charCodeAt(j) != this.data[0][y][z][j + 4]){
                                same = false;
                            }
                        }
                    }
                }
            }
            if(exists){
                if(user) {
                    _StdOut.putText("The file already exists.");
                }
            }else{
                this.data[0][y2][z2][0] = x1;
                this.data[0][y2][z2][1] = y1;
                this.data[0][y2][z2][2] = z1;
                this.data[0][y2][z2][3] = 0;
                this.data[x1][y1][z1][0] = 1;
                this.setData(x1, y1, z1, 0);
                this.setData(0, y2, z2, 0);
                this.setData(0, y2, z2, 1);
                this.setData(0, y2, z2, 2);
                this.setData(0, y2, z2, 3);
                for(var i = 0; i < filename.length; i++){
                    this.data[0][y2][z2][i + 4] = filename.charCodeAt(i);
                    this.setData(0, y2, z2, i + 4);
                }
                if(user) {
                    _StdOut.putText(filename + " created successfully.");
                }
            }

        }

        public writeFile(filename : string, file : number[], user : boolean){
//            console.log("writing");
            var exists : boolean = false;
            var x1 = 0;
            var y1 = 0;
            var z1 = 0;
//            var mx = 0;
            var my = 0;
            var mz = 0;
//            for(var x = 1; x < 8 && !exists; x++){
                for(var y = 0; y < 8 && !exists; y++) {
                    for (var z = 0; z < 8 && !exists; z++) {
                        var same:boolean = true;

                        for (var j = 0; (j < filename.length || j < 60) && same; j++) {
                            if (j >= filename.length) {
                                if (this.data[0][y][z][j + 4] == 0) {
                                    x1 = this.data[0][y][z][0];
                                    y1 = this.data[0][y][z][1];
                                    z1 = this.data[0][y][z][2];
                                    my = y;
                                    mz = z;
                                    exists = true;
                                    same = false;
                                } else {
                                    same = false;
                                }
                            }
                            else if (this.data[0][y][z][j + 4] == 0) {
                                same = false;
                            }
                            else if (filename.charCodeAt(j) != this.data[0][y][z][j + 4]) {
                                same = false;
                            }
                        }
                    }
//                }
            }
            if(exists){
                if(this.data[0][my][mz][3] == 0) {
                    this.data[0][my][mz][3] = 1;
                    this.setData(0, my, mz, 3);
                    // write to the file
                    var i = 0;
                    var h = 1;
                    while (i < file.length) {
                        if (h >= 61) {
                            if (this.data[x1][y1][z1][h] == 0) {
                                var x2 = 0;
                                var y2 = 0;
                                var z2 = 0;
                                var found:boolean = false;
                                for (var x = 1; x < 8 && !found; x++) {
                                    for (var y = 0; y < 8 && !found; y++) {
                                        for (var z = 0; z < 8 && !found; z++) {
                                            if (this.data[x][y][z][0] == 0) {
                                                this.data[x][y][z][0] = 1;
                                                this.setData(x, y, z, 0);
                                                found = true;
                                                x2 = x;
                                                y2 = y;
                                                z2 = z;
                                            }
                                        }
                                    }
                                }
                                this.data[x1][y1][z1][61] = x2;
                                this.data[x1][y1][z1][62] = y2;
                                this.data[x1][y1][z1][63] = z2;
                                this.setData(x1, y1, z1, 61);
                                this.setData(x1, y1, z1, 62);
                                this.setData(x1, y1, z1, 63);
                                x1 = x2;
                                y1 = y2;
                                z1 = z2;
                                h = 1;
                            }else{
                                var x2 = 0;
                                var y2 = 0;
                                var z2 = 0;
                                x2 = this.data[x1][y1][z1][61];
                                y2 = this.data[x1][y1][z1][62];
                                z2 = this.data[x1][y1][z1][63];
                                x1 = x2;
                                y1 = y2;
                                z1 = z2;
                                h = 1;
                            }
                        }
                        this.data[x1][y1][z1][h] = file[i];
                        this.setData(x1, y1, z1, h);
                        i++;
                        h++;
                    }
//                    if (h >= 61) {
//                        var x2 = 0;
//                        var y2 = 0;
//                        var z2 = 0;
//                        var found:boolean = false;
//                        for (var x = 1; x < 8 && !found; x++) {
//                            for (var y = 0; y < 8 && !found; y++) {
//                                for (var z = 0; z < 8 && !found; z++) {
//                                    if (this.data[x][y][z][0] == 0) {
//                                        this.data[x][y][z][0] = 1;
//                                        this.setData(x, y, z, 0);
//                                        found = true;
//                                        x2 = x;
//                                        y2 = y;
//                                        z2 = z;
//                                    }
//                                }
//                            }
//                        }
//                        this.data[x1][y1][z1][61] = x2;
//                        this.data[x1][y1][z1][62] = y2;
//                        this.data[x1][y1][z1][63] = z2;
//                        this.setData(x1, y1, z1, 61);
//                        this.setData(x1, y1, z1, 62);
//                        this.setData(x1, y1, z1, 63);
//                        x1 = x2;
//                        y1 = y2;
//                        z1 = z2;
//                        h = 1;
//                    }
                    this.data[x1][y1][z1][h] = 0;
                    this.setData(x1, y1, z1, h);

                    this.data[0][my][mz][3] = 0;
                    this.setData(0, my, mz, 3);
                    if(user) {
                        _StdOut.putText("Written to " + filename + " successfully.");
                    }
                }else{
                    if(user) {
                        _StdOut.putText(filename + " is currently in use.");
                    }
                }
            }else{
                if(user) {
                    _StdOut.putText(filename + " does not exist.")
                }
            }
        }

        public writeToFileAsString(filename : string, text : string){
            console.log("occurs");
            var file : number[] = new Array();
            for(var i = 0; i < text.length; i++){
                file.push(text.charCodeAt(i));
            }
            this.writeFile(filename, file, false);
        }
        public setData(x, y, z, j) : void {
            localStorage.setItem("drive" + x + "" + y + "" + z + "" + j + "", this.data[x][y][z][j].toString());
//            console.log(x);
            this.updateDisplay(x, y, z);
        }

        public updateDisplay(x, y, z): void{
            var i = (x * 64) + (y * 8) + z + 1;
            var row : HTMLTableRowElement = <HTMLTableRowElement> this.diskTable.rows.item(i);
            for(var l = 1; l < 3; l++){
                var cell:HTMLTableDataCellElement = <HTMLTableCellElement> row.cells.item(l);
                if(l == 1){
                    var text : string = "";
                    for(var k = 0; k < 4; k++) {
                        text += MemoryManager.decToHex(this.data[x][y][z][k]);
                    }
                    cell.innerHTML = text;
                }else{
                    var text : string = "";
                    for(var k = 4; k < 64; k++) {
                        text += MemoryManager.decToHex(this.data[x][y][z][k]);
                    }
                    cell.innerHTML = text;
                }
            }
        }

        public test() : void {
            console.log(parseInt(localStorage.getItem("drive" + 0 + "" + 0 + "" + 0 + "" + 0 + "")));
        }
    }
}