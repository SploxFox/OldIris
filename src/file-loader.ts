/*export function loadFile(path: string, callback: (request: XMLHttpRequest) => void) {
    var request = new XMLHttpRequest();
    request.open("GET", "resources/" + path, true);
    request.onload = function(this: XMLHttpRequest): void {callback(this)};
    request.send(null)
}*/
export function resolvePath(path: string, localized: boolean = true): string {
    return "resources/" + (localized ? ((window as any).localizer.language + "/") : "default/") + path;
}

export function loadFile(path: string, callback: (request: XMLHttpRequest) => void, localized: boolean = true) {
    //console.log(this);
    var request = new XMLHttpRequest();
    request.open("GET", resolvePath(path, localized), true);
    request.onreadystatechange = (() => {
        if (request.readyState === 4) {
            if (request.status == 200) {
                //success
            } else if (localized) {
                loadFile.bind(this)(path, callback, false);
            }
        }
    }).bind(this);
    request.onload = function(): any { 
        if (request.status == 200) {
            callback.bind(this)(request)
        }
    }.bind(this);
    request.send(null);
}