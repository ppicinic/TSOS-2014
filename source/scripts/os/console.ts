///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "",
                    public cmdBuffer:string[] = [],
                    public lastCmd = -1) {

        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    if(this.buffer.length > 0) {
                        _OsShell.handleInput(this.buffer);
                        this.cmdBuffer[this.cmdBuffer.length] = this.buffer;
                        this.lastCmd = this.cmdBuffer.length;
                        // ... and reset our buffer.
                        this.buffer = "";
                    }
                } else if(chr === String.fromCharCode(8)){
                    this.deleteText();
                    this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                } else if(chr === String.fromCharCode(9)) {
                    this.tabComplete(this.buffer);
                } else if(chr === String.fromCharCode(38)){
                    this.lastCmd--;
                    if(this.lastCmd >= 0){
                        this.deleteBuffer();
                        this.buffer = this.cmdBuffer[this.lastCmd];
                        this.putText(this.buffer);
//                        this.lastCmd--;
                    }else{
                        this.lastCmd++;
                    }
                } else if(chr === String.fromCharCode(40)){
//                    alert(this.lastCmd);
                    this.lastCmd++;
                    if(this.lastCmd < this.cmdBuffer.length){
                        this.deleteBuffer();
                        this.buffer = this.cmdBuffer[this.lastCmd];
                        this.putText(this.buffer);
                        this.lastCmd++;
                    }else{
                        this.lastCmd--;
                    }
                }
                else{
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        }

        public deleteBuffer(){
            while(this.buffer.length > 0){
                this.deleteText();
                this.buffer = this.buffer.substring(0, this.buffer.length - 1);
            }
        }

        public tabComplete(buffer):void {
            var commands:string[] = [];
            var commandList = _OsShell.getCommands();
            for(var i = 0; i < commandList.length; i++ ){
                var cmd = commandList[i];
                if(Console.startsWith(buffer, cmd)){
                    commands[commands.length] = commandList[i];
                }
            }
            if(commands.length == 1){
                var textAdd:string = commands[0].substring(this.buffer.length, commands[0].length);
                this.putText(textAdd);
                this.buffer += textAdd;
            }
        }

        public static startsWith(arg1:string, arg2:string): boolean{
            if(arg1.length > arg2.length){
                return false;
            }
            for(var i = 0; i < arg1.length; i++){
                if(arg1.charAt(i) !== arg2.charAt(i)){
                    return false;
                }
            }
            return true;
        }

        public deleteText() : void {
            var char = this.buffer.charAt(this.buffer.length - 1);
            var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, char);
            this.currentXPosition -= offset;
            var temp = this.currentXPosition;
            _DrawingContext.deleteText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, char);
            this.currentXPosition = temp;
        }

        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                if(text.length > 1) {
                    for( var i:number = 0; i < text.length; i++ ){
                        this.putText(text.charAt(i));
                    }
                }else{
                    if(this.currentXPosition > 490){
                        this.currentXPosition = 0;
                        this.currentYPosition += _DefaultFontSize + _FontHeightMargin;
                    }
                    var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                    // Move the current X position.

                    this.currentXPosition = this.currentXPosition + offset;
                }
            }
         }

        public advanceLine(): void {
            this.currentXPosition = 0;
            this.currentYPosition += _DefaultFontSize + _FontHeightMargin;
            // TODO: Handle scrolling. (Project 1)
        }
    }
 }
