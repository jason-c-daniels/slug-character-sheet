export default class ViewOptions {
    printBothPages=true;
    saveAlsoDownloads=true;
    constructor(printBothPages=true,saveAlsoDownloads=true){
        this.printBothPages=printBothPages;
        this.saveAlsoDownloads=saveAlsoDownloads;
    }
}