interface QueuedCharacter {
    character: string;
    mode: string;
    speed: string;
    index: number;
}

export class TextBox {
    element: HTMLElement;
    speakerElement: HTMLElement;
    textElement: HTMLElement;
    blipNum: number;
    isFinished: boolean;
    constructor() {
        this.element = document.createElement("div");
        this.element.classList.add("text","text-box");

        this.speakerElement = document.createElement("span");
        this.speakerElement.classList.add("name");

        this.textElement = document.createElement("div");
        this.textElement.classList.add("text-block");

        this.element.appendChild(this.speakerElement);
        this.element.appendChild(this.textElement);
    }
    clear() {
        while (this.textElement.firstElementChild) { this.textElement.firstElementChild.remove(); }
        this.speakerElement.textContent = "";
        this.blipNum = 0;
        this.isFinished = false;
    }
    showText(speaker: string, text: string) {
        this.clear();

        this.speakerElement.textContent = speaker;

        //var queuedCharacters: Array<QueuedCharacter> = [];

        var speed: "fast" | "slow" | "very-slow" = "fast";
        var mode: "speech" | "thought" | "emphasis" | "object" | "question" = "speech";

        var parseChar = function (index: number): object {
            var char = text[index];
            if (!(char == "#" && text[index + 1] == "#")) {
                //return new QueuedCharacter(text[index], mode, speed, index);
                var qchar: QueuedCharacter = {
                    character: text[index],
                    mode: mode,
                    speed: speed,
                    index: index
                }
                return qchar;
            } else {
                try {
                    //Determining the command
                    var command = "";
                    for (var i = index + 2; text[i] != "(" && text.length > i; i++) {
                        command += text[i];
                    }

                    //Determining its parameters
                    var paramString = '';
                    var params: Array<string> = [];
                    for (var j = i + 1; text[j] != ")" && text.length > j; j++) {
                        paramString += text[j];
                    }
                    params = paramString.split(",");

                    switch (command) {
                        case "mode":
                            mode = params[0] as "speech" | "thought" | "emphasis" | "object" | "question";
                            break;
                        case "speed":
                            speed = params[0] as "fast" | "slow" | "very-slow";
                            break;
                    }
                    //return j + 1;
                    return { index: j };
                } catch (e) {
                    console.log("Unable to parse command!");
                    console.log(e);
                }
            }
            
            //return index + 1;
        }.bind(this);

        function nextChar(index: number) {
            //console.log("index: " + index + "  text length: " + text.length);
            window.setTimeout(function () {
                if (index < text.length) {
                    var char = parseChar(index);
                    var nextIndex = char.index + 1;
                    if (TextBox.instanceOfQueuedCharacter(char)) {
                        this.addChar(char);
                    }
                    nextChar.bind(this)(nextIndex);
                }
            }.bind(this), TextBox.getWaitTime(speed));
        }

        for (var i = 0; i < text.length; i++) {
            var char = parseChar(i);
            if (!TextBox.instanceOfQueuedCharacter(char)) {
                i = char.index;
                continue;
            }
            var charElement = document.createElement("span");
            charElement.classList.add("text", mode, "hidden");
            charElement.textContent = text[i];
            charElement.dataset.index = "" + i;

            this.textElement.appendChild(charElement);
        }

        nextChar.bind(this)(0);
    }

    static getWaitTime(speed: "fast" | "slow" | "very-slow"): number {
        switch(speed) {
            case "fast":
                return 20;
            case "slow":
                return 50;
            case "very-slow":
                return 200;
        }
    }

    static instanceOfQueuedCharacter(char: any): char is QueuedCharacter {
        //console.log(char);
        //console.log(char.character !== undefined);
        return char.character !== undefined;
    }

    addChar(char: QueuedCharacter): void {
        var charElement = document.querySelector("[data-index='" + char.index + "']");
        //console.log("ran");
        charElement.classList.remove("hidden");
        /*var charElement = document.createElement("span");
        charElement.classList.add("text", mode);
        charElement.textContent = character;

        //console.log("Added: " + character);

        this.textElement.appendChild(charElement);*/

        var isPronounced = "abcdefghijklmnopqrstuvwxyz";

        //if ((char.speed != "fast" || this.blipNum % 2 == 0) && isPronounced.includes(char.character.toLowerCase())) {
            //new Audio("resources/DeepMaleBlip.wav").play();
            //console.log("Played sound, blip%: " + this.blipNum % 2);
        //}
        this.blipNum++;
        if (char.character == " ") {
            this.blipNum = 0;
        }
    }
}