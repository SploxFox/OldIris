interface Localizations {
    [index: string]: string;
}

/*class LocalizationsLoader {
    load: Promise<Localizations>
    constructor(readonly blockLocation: string) {

    }
}*/


export class Localizer {
    actionDescriptors: Promise<Localizations>;
    
    constructor(readonly language: string){
        this.actionDescriptors = this.loadLocalizations("interface/action-descriptors")
    }
    loadLocalizations(location: string) {
        return new Promise<Localizations>((resolve, reject) => {
            var request = new XMLHttpRequest();
            request.open("GET", "assets/localized/" + this.language + "/" + location + ".json");

            request.onload = (ev) => {
                if (request.readyState == 4) {
                    resolve(JSON.parse(request.responseText));
                }
            }

            request.send();
        })
    }
}
