import getNewCharacter from "../model/character"

export default class LocalStorageController {
    printBothPages=true;
    firstCall=true;
    constructor(
        printBothPages=true,
        firstCall=true
    ) {
        this.printBothPages=printBothPages;
        this.firstCall=firstCall;
    }

    saveToLocalStorage(character) {
        console.log("saveToLocalStorage");
        if (typeof (Storage) !== "undefined") {
            console.log("saving...");
            // Code for localStorage/sessionStorage.
            let text = JSON.stringify(character, null, 2);

            console.log(text);
            localStorage.setItem("slug-character-sheet", text);
            localStorage.setItem("slug-print-both",this.printBothPages.toString());
        } else {
            // Sorry! No Web Storage support... doing nothing
            console.log("LocalStorage not supported. Did not save.");
        }
    }

    loadFromLocalStorage() {
        console.log("loadFromLocalStorage");
        if (typeof (Storage) === "undefined" || localStorage.getItem("slug-character-sheet") === null) {
            console.log("LocalStorage not supported, or no prior sheet found. Creating new character instead.");
            return getNewCharacter();
        }
        console.log("loading character...");
        let text = localStorage.getItem("slug-character-sheet");
        this.printBothPages = localStorage.getItem("slug-print-both") === true.toString() || localStorage.getItem("slug-print-both") === null;
        console.log("loaded:", text);
        if (text === "undefined" || text === "null") return getNewCharacter();
        return JSON.parse(text);
    }
}