///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="../utils.ts" />

/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.
module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor(public pcb: number[] = []) {

        }

        public init() {
            var sc = null;
            this.pcb = [];
            console.log(this.pcb)
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellDate,
                                "date",
                                "<date> - Displays current date and time.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellWhereami,
                                "whereami",
                                "<string> - Displays drive location.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellMojito,
                                "mojito",
                                "<string> - Prints out RumOS mojito recipe.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellRumGone,
                                "rumgone",
                                "- Forces kernel trap.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellLoad,
                                "load",
                                "- Loads a user program");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellStatus, "status", "<string> - Sets a status message by the user");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellRun, "run", "<pid> - Run the specified user program");
            this.commandList[this.commandList.length] = sc;

            // processes - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            //
            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = new UserCommand();
            userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // JavaScript may not support associative arrays in all browsers so we have to
            // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses. {
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {    // Check for apologies. {
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        public getCommands() : string[]{
            var commands:string[] = [];
            for(var i = 0; i < this.commandList.length; i++){
                commands[i] = this.commandList[i].command;
            }
            return commands;
        }

        // args is an option parameter, ergo the ? which allows TypeScript to understand that
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }

        public parseInput(buffer) {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Duh. Go back to your Speak & Spell.");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("Okay. I forgive you. This time.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + " veerrsion " + APP_VERSION);
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, dumbass.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }

                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        // prints out the current date
        // could probably use some optimization
        public shellDate(args) {
            var date = new Date();
            var hours = date.getHours();
            var hour = "";
            var night = "A.M.";
            if(hours == 0){
                hour = "" + 12;
            }else if(hours > 12){
                hour = "" + (hours - 12);
                night = "P.M.";
            }else if(hours == 12) {
                hour += hours;
                night = "P.M.";
            }else{
                hour += hours;
            }
            var mins = date.getMinutes();
            var min = "";
            if(mins < 10){
                min = "0" + mins;
            }else{
                min += mins;
            }
            _StdOut.putText(date.toLocaleDateString() + " " + hour + ":" + min + " " + night);
        }

        // tells where the user is located
        public shellWhereami(args) {
            _StdOut.putText("R:\\PirateShip\\RumCellar\\");
        }

        // Mojito command gives you nifty quick access to the mojito recipe
        public shellMojito = function (args) {
            _StdOut.putText("Ingredients:");
            _StdOut.advanceLine();
            _StdOut.putText("2 oz light rum (Banks 5 Island Rum recommended)");
            _StdOut.advanceLine();
            _StdOut.putText("8 - 10 mint leaves, 1 sprig for garnish");
            _StdOut.advanceLine();
            _StdOut.putText("1 oz simple syrup");
            _StdOut.advanceLine();
            _StdOut.putText(".75 oz freshly squeezed lime juice");
            _StdOut.advanceLine();
            _StdOut.putText("Muddle mint leaves with simple syrup in a shaker. Add lime juice and rum. Shake with ice. Fine strain into a collins glass filled with ice. Garnish with mint sprig.");
        }

        // BSOD test shell command
        public shellRumGone = function (args) {
            _Kernel.krnTrapError("rum is gone!");
        }

        // loads a user program and validates the input
        public shellLoad = function(args) {
            var element:HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("taProgramInput");
            var program:string = element.value;
            program = program.trim();
            program = program.toUpperCase();
            var memoryString : string = "";
            var result:boolean = true;
            for(var i = 0; i < program.length; i++){
                var c = program.charAt(i);
                if(!( (c >= 'A' && c <= 'F') || (c >= 'a' && c <= 'f') || (c >= '0' && c <= '9') || c === ' ' )){
                    result = false;
                }else{
                    if(c !== ' ') {
                        memoryString += program.charAt(i);
                    }
                }
            }
            if(program.length == 0 || memoryString.length % 2 != 0){
                result = false;
            }
            if(result){
                _MemoryManager.loadMemory(memoryString);
                var pcb : ProcessControlBlock = new ProcessControlBlock(0, memoryString.length / 2);
                var i = _ProcessManager.add(pcb);
                _StdOut.putText("Program loaded with PID " + i + ".");
            }else{
                _StdOut.putText("Program is invalid.")
            }
        }

        public shellRun = function(args){
            var pcb : ProcessControlBlock = _ProcessManager.getPcb(args[0]);
            _CPU.setPcb(pcb);
        }

        // changes the status of the OS status bar
        public shellStatus = function(args){
            var element = <HTMLParagraphElement> document.getElementById('taStatusBarStatus');
            element.innerHTML = args[0];
        }
    }
}
