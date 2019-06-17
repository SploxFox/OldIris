import { loadFile } from "./file-loader";
import { localizer } from ".";

export class Localizer {
    private localized: { [index: string]: string};
    private _language: string;
    localizationLoadedCallback: () => void;
    constructor(language: string, localizationLoadedCallback?: () => void) {
        this.localizationLoadedCallback = localizationLoadedCallback;
        this._language = language;
        /*for (let key in this.localized) {
            loadFile.bind(this)(key + ".json", function(request: XMLHttpRequest) {
                this.localized[key] = JSON.parse(request.responseText);
                this.localizationLoadedCallback(key);
            }.bind(this));
        }*/
        loadFile.bind(this)("interface.json", function(request: XMLHttpRequest) {
            this.localized = JSON.parse(request.responseText);
            this.localizationLoadedCallback();
        }.bind(this));
    }
    localize(name: string): string {
        if (this.localized[name]) {
            return this.localized[name];
        } else {
            //We don't have a localized version of this word. Let's just guess!
            var words = name.split("-");
            var finalString = "";
            for (var word in words) {
                word = word.charAt(0).toUpperCase() + word.substring(1);
                finalString += word;
            }
            return finalString;
        }
    }
    get language(): string {
        return this._language;
    }
}