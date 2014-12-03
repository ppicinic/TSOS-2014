/**
* Created by Phil on 12/2/2014.
*/
var TSOS;
(function (TSOS) {
    var Hdd = (function () {
        function Hdd(data) {
            if (typeof data === "undefined") { data = new Array(8); }
            this.data = data;
        }
        //compile
        Hdd.prototype.init = function () {
            var test = localStorage.getItem("drive");

            //console.log(localSto)
            if (true) {
                this.data = new Array(8);
                for (var x = 0; x < 8; x++) {
                    this.data[x] = new Array(8);
                    for (var y = 0; y < 8; y++) {
                        this.data[x][y] = new Array(8);
                        for (var z = 0; z < 8; z++) {
                            this.data[x][y][z] = new Array(64);
                            for (var j = 0; j < 64; j++) {
                                if (test != "true") {
                                    this.data[x][y][z][j] = 0;

                                    //console.log(this.data[x][y][z][j]);
                                    localStorage.setItem("drive" + x + "" + y + "" + z + "" + j + "", this.data[x][y][z][j].toString());
                                } else {
                                    this.data[x][y][z][j] = parseInt(localStorage.getItem("drive" + x + "" + y + "" + z + "" + j + ""));
                                }
                            }
                        }
                    }
                }
            }

            //            console.log("a".charCodeAt(0));
            localStorage.setItem("drive", "true");
        };

        Hdd.prototype.format = function () {
            localStorage.setItem("drive", "false");
            this.init();
        };

        Hdd.prototype.deleteFile = function (filename) {
            var exists = false;
            var x1 = 0;
            var y1 = 0;
            var z1 = 0;

            //            var mx = 0;
            var my = 0;
            var mz = 0;

            for (var y = 0; y < 8 && !exists; y++) {
                for (var z = 0; z < 8 && !exists; z++) {
                    var same = true;

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
                        } else if (this.data[0][y][z][j + 4] == 0) {
                            same = false;
                        } else if (filename.charCodeAt(j) != this.data[0][y][z][j + 4]) {
                            same = false;
                        }
                    }
                }
                //                }
            }
            if (exists) {
                if (this.data[0][my][mz][3] == 0) {
                    this.data[0][my][mz][3] = 1;
                    this.setData(0, my, mz, 3);

                    var done = false;
                    while (!done) {
                        var x2 = 0;
                        var y2 = 0;
                        var z2 = 0;
                        var next = false;
                        if (this.data[x1][y1][z1][61] != 0) {
                            x2 = this.data[x1][y1][z1][61];
                            y2 = this.data[x1][y1][z1][62];
                            z2 = this.data[x1][y1][z1][63];
                            this.data[x1][y1][z1][61] = 0;
                            this.data[x1][y1][z1][62] = 0;
                            this.data[x1][y1][z1][63] = 0;
                            this.setData(x1, y1, z1, 61);
                            this.setData(x1, y1, z1, 62);
                            this.setData(x1, y1, z1, 63);
                        } else {
                            done = true;
                        }
                        this.data[x1][y1][z1][0] = 0;
                        this.setData(x1, y1, z1, 0);
                        x1 = x2;
                        y1 = y2;
                        z1 = z2;
                    }
                    for (var i = 0; i < 64; i++) {
                        if (i != 3) {
                            this.data[0][my][mz][i] = 0;
                            this.setData(0, my, mz, i);
                        }
                        this.data[0][my][mz][3] = 0;
                        this.setData(0, my, mz, 3);
                    }
                    _StdOut.putText(filename + " successfully deleted.");
                } else {
                    //file in use
                    _StdOut.putText(filename + " is already in use.");
                }
            } else {
                _StdOut.putText(filename + " does not exist.");
            }
        };

        Hdd.prototype.readFile = function (filename) {
            var file = new Array();
            var exists = false;
            var x1 = 0;
            var y1 = 0;
            var z1 = 0;

            //            var mx = 0;
            var my = 0;
            var mz = 0;

            for (var y = 0; y < 8 && !exists; y++) {
                for (var z = 0; z < 8 && !exists; z++) {
                    var same = true;

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
                        } else if (this.data[0][y][z][j + 4] == 0) {
                            same = false;
                        } else if (filename.charCodeAt(j) != this.data[0][y][z][j + 4]) {
                            same = false;
                        }
                    }
                }
                //                }
            }
            console.log("exists " + exists);
            if (exists) {
                if (this.data[0][my][mz][3] == 0) {
                    this.data[0][my][mz][3] = 1;
                    this.setData(0, my, mz, 3);
                    var done = false;
                    var h = 1;
                    while (!done) {
                        //                        console.log("x: " + x1);
                        //                        console.log("y: " + y1);
                        //                        console.log("z: " + z1);
                        //                        console.log("h: " + h);
                        if (h >= 61) {
                            if (this.data[x1][y1][z1][h] != 0) {
                                var x2 = this.data[x1][y1][z1][61];
                                var y2 = this.data[x1][y1][z1][62];
                                var z2 = this.data[x1][y1][z1][63];
                                x1 = x2;
                                y1 = y2;
                                z1 = z2;
                                h = 1;
                            }
                        }
                        if (this.data[x1][y1][z1][h] != 0) {
                            file.push(this.data[x1][y1][z1][h]);
                        } else {
                            done = true;
                        }
                        h++;
                    }

                    this.data[0][my][mz][3] = 0;
                    this.setData(0, my, mz, 3);
                } else {
                    _StdOut.putText(filename + " is currently in use.");
                    return null;
                }
            } else {
                console.log("not found");
                _StdOut.putText(filename + " does not exist.");
                return null;
            }
            return file;
        };

        Hdd.prototype.readFileAsString = function (filename) {
            console.log("reading");
            var file = this.readFile(filename);
            if (file != null) {
                var text = "";
                for (var i = 0; i < file.length; i++) {
                    text += String.fromCharCode(file[i]);
                }
                _StdOut.putText(text);
            }
        };

        Hdd.prototype.createFile = function (filename) {
            var x1 = 0;
            var y1 = 0;
            var z1 = 0;
            var found = false;
            for (var x = 1; x < 8 && !found; x++) {
                for (var y = 0; y < 8 && !found; y++) {
                    for (var z = 0; z < 8 && !found; z++) {
                        if (this.data[x][y][z][0] == 0) {
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
            var exists = false;
            for (var y = 7; y >= 0; y--) {
                for (var z = 7; z >= 0; z--) {
                    if (this.data[0][y][z][0] == 0) {
                        y2 = y;
                        z2 = z;
                    } else {
                        var same = true;

                        for (var j = 0; (j < filename.length || j < 60) && same; j++) {
                            if (j >= filename.length) {
                                if (this.data[0][y][z][j + 4] == 0) {
                                    exists = true;
                                    same = false;
                                } else {
                                    same = false;
                                }
                            } else if (this.data[0][y][z][j + 4] == 0) {
                                same = false;
                            } else if (filename.charCodeAt(j) != this.data[0][y][z][j + 4]) {
                                same = false;
                            }
                        }
                    }
                }
            }
            if (exists) {
                _StdOut.putText("The file already exists.");
            } else {
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
                for (var i = 0; i < filename.length; i++) {
                    this.data[0][y2][z2][i + 4] = filename.charCodeAt(i);
                    this.setData(0, y2, z2, i + 4);
                }
                _StdOut.putText(filename + " created successfully.");
            }
        };

        Hdd.prototype.writeFile = function (filename, file) {
            //            console.log("writing");
            var exists = false;
            var x1 = 0;
            var y1 = 0;
            var z1 = 0;

            //            var mx = 0;
            var my = 0;
            var mz = 0;

            for (var y = 0; y < 8 && !exists; y++) {
                for (var z = 0; z < 8 && !exists; z++) {
                    var same = true;

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
                        } else if (this.data[0][y][z][j + 4] == 0) {
                            same = false;
                        } else if (filename.charCodeAt(j) != this.data[0][y][z][j + 4]) {
                            same = false;
                        }
                    }
                }
                //                }
            }
            if (exists) {
                if (this.data[0][my][mz][3] == 0) {
                    this.data[0][my][mz][3] = 1;
                    this.setData(0, my, mz, 3);

                    // write to the file
                    var i = 0;
                    var h = 1;
                    while (i < file.length) {
                        if (h >= 61) {
                            var x2 = 0;
                            var y2 = 0;
                            var z2 = 0;
                            var found = false;
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
                    _StdOut.putText("Written to " + filename + " successfully.");
                } else {
                    _StdOut.putText(filename + " is currently in use.");
                }
            } else {
                _StdOut.putText(filename + " does not exist.");
            }
        };

        Hdd.prototype.writeToFileAsString = function (filename, text) {
            console.log("occurs");
            var file = new Array();
            for (var i = 0; i < text.length; i++) {
                file.push(text.charCodeAt(i));
            }
            this.writeFile(filename, file);
        };
        Hdd.prototype.setData = function (x, y, z, j) {
            localStorage.setItem("drive" + x + "" + y + "" + z + "" + j + "", this.data[x][y][z][j].toString());
        };

        Hdd.prototype.test = function () {
            console.log(parseInt(localStorage.getItem("drive" + 0 + "" + 0 + "" + 0 + "" + 0 + "")));
        };
        return Hdd;
    })();
    TSOS.Hdd = Hdd;
})(TSOS || (TSOS = {}));
