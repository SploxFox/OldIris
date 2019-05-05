import { loadFile } from "./file-loader";

export class Localizer {
    private localized: { [index: string]: string};
    private _language: string;
    localizationLoadedCallback: () => void;
    constructor(language: string, localizationLoadedCallback?: () => void) {
        this.localizationLoadedCallback = localizationLoadedCallback;
        this._language = language;
        (window as any).localizer = this;
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
        return this.localized[name];
    }
    get language(): string {
        return this._language;
    }
}