import getNewCharacter from "../model/character"
import ViewOptions from "../model/viewOptions";

export default class LocalStorageController {
    constructor(

    ) {

    }

    save(itemName, object) {
        console.log("save");
        let key="slug-"+itemName;
        if (typeof (Storage) !== "undefined") {
            console.log("saving...");
            // Code for localStorage/sessionStorage.
            let text = JSON.stringify(object);
            console.log(text);
            localStorage.setItem(key,text);
        } else {
            // Sorry! No Web Storage support... doing nothing.
            console.log("LocalStorage not supported. Did not save.");
        }
    }

    load(itemName,defaultItemGenerator= ()=>null) {
        console.log("load");
        let key="slug-"+itemName;
        if (typeof (Storage) === "undefined" || localStorage.getItem(key) === null) {
            console.log("LocalStorage not supported, or no prior item found. Creating new character instead.");
            return defaultItemGenerator();
        }
        console.log("loading...");
        let text = localStorage.getItem(key);
        console.log("loaded:", text);
        if (text === "undefined" || text === "null") return defaultItemGenerator();
        return JSON.parse(text);
    }

    saveViewOptions(viewOptions){
        this.save("view-options",viewOptions);
    }
    loadViewOptions() {
        return this.load("view-options",()=>new ViewOptions());
    }

    saveCharacter(character) {
        this.save("character-sheet",character);
    }

    loadCharacter() {
        return this.load("character-sheet",getNewCharacter);
    }
}