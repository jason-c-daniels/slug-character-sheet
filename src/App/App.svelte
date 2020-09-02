<script>
    import GlobalCss from "../GlobalCss";
    /*-- Add support for Web Components to older browsers. --*/
    import "@webcomponents/webcomponentsjs/webcomponents-loader.js";
    import '@material/mwc-top-app-bar-fixed';
    import '@material/mwc-icon-button';
    import '@material/mwc-drawer';
    import '@material/mwc-icon';
    import '@material/mwc-list';
    import '@material/mwc-list/mwc-list-item';
    import '@material/mwc-list/mwc-check-list-item';
    import '@material/mwc-list/mwc-radio-list-item';
    import CharacterSheet from "../components/CharacterSheet"
    import getNewCharacter from "../model/character"
    import saveAs from 'file-saver';
    import Dropzone from "svelte-file-dropzone";
    import GameRules from "../components/GameRules/GameRules.svelte";

    export let appSettings = {applicationName: "WARNING: Please pass appSettings from within main.js props."};

    let drawerElement; // bind to the drawerElement component so we can open and close it.

    let printOptionListElement;
    let printBothPages = true;
    let disabled = "";
    let showLoadPane = false;
    let firstCall = true;

    let character = loadFromLocalStorage();

    function saveCharacter() {
        var blob = new Blob([JSON.stringify(character, null, 2)], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "character.slug");
    }

    function loadCharacter() {
        showLoadPane = true;
        disabled = "disabled";
    }

    function newCharacter() {
        character = getNewCharacter();
    }

    function handleFilesSelect(e) {
        let files = e.detail.acceptedFiles;
        const reader = new FileReader();
        reader.onload = function (e) {
            // e.target.result should contain the text
            let text = e.target.result;
            character = JSON.parse(text);
            showLoadPane = false;
        };
        reader.readAsText(files[0]);

    }

    function hideLoadPane() {
        showLoadPane = false;
        disabled = "";
    }

    function printIt() {
        setTimeout(() => window.print(), 500);
    }

    function saveToLocalStorage() {
        console.log("saveToLocalStorage");
        if (typeof (Storage) !== "undefined") {
            console.log("autosaving...");
            // Code for localStorage/sessionStorage.
            let text = JSON.stringify(character, null, 2);

            console.log(text);
            localStorage.setItem("slug-character-sheet", text);
            localStorage.setItem("slug-print-both",printBothPages);
        } else {
            // Sorry! No Web Storage support... doing nothing
            console.log("LocalStorage not supported. Did not save.");
        }
    }

    function loadFromLocalStorage() {
        console.log("loadFromLocalStorage");
        if (typeof (Storage) === "undefined" || localStorage.getItem("slug-character-sheet") === null) {
            console.log("LocalStorage not supported, or no prior sheet found. Creating new character instead.");
            scheduleAutosave();
            return getNewCharacter();
        }
        scheduleAutosave();
        console.log("loading character...");
        let text = localStorage.getItem("slug-character-sheet");
        printBothPages = localStorage.getItem("slug-print-both") == true || localStorage.getItem("slug-print-both") === null;
        console.log("loaded:", text);
        return JSON.parse(text);
    }

    function scheduleAutosave() {
        if (firstCall) {
            firstCall = false;
            setInterval(saveToLocalStorage, 5 * 1000);
        }
    }
    function handlePrintOptionSelected(e) {
        console.log('handlePrintOptionSelected');
        printBothPages = printOptionListElement.querySelectorAll('mwc-radio-list-item')[e.detail.index].value === 'printBothPages';
    }
</script>
<style>
    @import "App.css";
</style>

<svelte:head>
    <title>{appSettings.applicationName}</title>

    <!-- Your application must load the Roboto and Material Icons fonts. -->
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Material+Icons&display=block" rel="stylesheet">
</svelte:head>

<GlobalCss/>

<main class="noprint">
    <!-- this section is what the user interacts with to edit their data. It'll contain
    all sorts of UI controls that you do NOT want to printout. -->
    <mwc-drawer hasHeader type="modal" bind:this={drawerElement} >
        <span slot="title">Print Settings</span>
        <span slot="subtitle">What to print...</span>
        <div>
            <mwc-list bind:this={printOptionListElement} on:selected={handlePrintOptionSelected} style="margin: 1em; 0">
                <mwc-radio-list-item selected="{printBothPages}" value="printBothPages">Both Pages
                </mwc-radio-list-item>
                <mwc-radio-list-item selected="{!printBothPages}" value="printOnlyCharacterSheet">Only the Character Sheet
                </mwc-radio-list-item>
            </mwc-list>
        </div>
        <div slot="appContent">
            <mwc-top-app-bar-fixed>
                <mwc-icon-button icon="menu" slot="navigationIcon"
                                 on:click={()=>drawerElement.open = !drawerElement.open}></mwc-icon-button>
                <div slot="title"><span>{appSettings.applicationName}</span></div>
                <mwc-icon-button icon="create" slot="actionItems" on:click={newCharacter} {disabled}></mwc-icon-button>
                {#if showLoadPane}
                    <mwc-icon-button icon="clear" slot="actionItems" on:click={hideLoadPane}></mwc-icon-button>
                {:else}
                    <mwc-icon-button icon="file_upload" slot="actionItems" on:click={loadCharacter}></mwc-icon-button>
                {/if}
                <mwc-icon-button icon="file_download" slot="actionItems" on:click={saveCharacter}
                                 {disabled}></mwc-icon-button>
                <mwc-icon-button icon="print" slot="actionItems" on:click={printIt} {disabled}></mwc-icon-button>
                <div id="content" style="margin: 10pt;">
                    <div class="page">
                        <CharacterSheet bind:character={character}/>
                    </div>
                    {#if printBothPages}
                        <div class="page">
                            <GameRules/>
                        </div>
                   {/if}
                </div>
            </mwc-top-app-bar-fixed>

            {#if (showLoadPane)}
                <div class="noprint file-loader">
                    <Dropzone on:drop={handleFilesSelect} containerStyles="height:100%"/>
                </div>
            {/if}
        </div>
    </mwc-drawer>
</main>

<main class="printme" style="margin: 0.5in">
    <!-- This section is intended for print rendering only. You may suppress the rendering of this entire section
         to HTML if you like, but you'll need to ensure it's been rendered right before the print dialog is invoked.
         (i.e. print() )
     -->
    <div class="page">
        <CharacterSheet bind:character={character}/>
    </div>
    {#if printBothPages}
        <div class="page">
            <GameRules/>
        </div>
    {/if}
</main>
