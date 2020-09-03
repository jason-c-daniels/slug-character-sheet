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
    import downloadToClient from 'file-saver';
    import Dropzone from "svelte-file-dropzone";
    import GameRules from "../components/GameRules/GameRules.svelte";
    import LocalStorageController from '../controllers/localStorageController'
    export let appSettings = {applicationName: "WARNING: Please pass appSettings from within main.js props."};

    let drawerElement; // bind to the drawerElement component so that we can open and close it.

    let printOptionListElement;
    let saveOptionsListElement;
    let disabled = "";
    let showLoadPane = false;
    let firstCall = true;
    let saveAlsoDownloads = true;
    let localStorageController = new LocalStorageController();
    let character = localStorageController.loadCharacter();
    let viewOptions = localStorageController.loadViewOptions();

    scheduleAutosave();

    function handleSaveCharacterClicked() {
        let blob = new Blob([JSON.stringify(character, null, 2)], {type: "text/plain;charset=utf-8"});
        localStorageController.saveCharacter(character);
        if (viewOptions.saveAlsoDownloads) {
            downloadToClient(blob, "character.slug");
        }
    }

    function handleLoadCharacterClicked() {
        showLoadPane = true;
        disabled = "disabled";
    }

    function handleNewCharacterClicked() {
        character = getNewCharacter();
    }

    function handleFilesSelect(e) {
        let files = e.detail.acceptedFiles;
        const reader = new FileReader();
        reader.onload = function (e) {
            // e.target.result should contain the text
            let text = e.target.result;
            character = JSON.parse(text);
            hideLoadPane();
        };
        reader.readAsText(files[0]);
    }

    function hideLoadPane() {
        showLoadPane = false;
        disabled = "";
    }

    function handlePrintClicked() {
        setTimeout(() => window.print(), 500);
    }

    function handlePrintOptionSelected(e) {
        console.log('handlePrintOptionSelected');
        viewOptions.printBothPages = printOptionListElement.querySelectorAll('mwc-radio-list-item')[e.detail.index].value === 'printBothPages';
    }

    function handleSaveOptionSelected(e) {
        console.log('handleSaveOptionSelected');
        viewOptions.saveAlsoDownloads = saveOptionsListElement.querySelectorAll('mwc-radio-list-item')[e.detail.index].value === 'saveAlsoDownloads';
    }

    function scheduleAutosave() {
        if (!localStorageController.firstCall) { return; }
        localStorageController.firstCall = false;
        if (typeof (Storage) === "undefined") { return; } // nothing to schedule since we can't get at local storage.
        setInterval(()=>localStorageController.saveCharacter(character), 5 * 1000);
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
            <mwc-list multi bind:this={printOptionListElement} on:selected={handlePrintOptionSelected} style="margin: 1em;">
                <mwc-radio-list-item group="a" selected="{viewOptions.printBothPages}" value="printBothPages">Both Pages
                </mwc-radio-list-item>
                <mwc-radio-list-item group="a" selected="{!viewOptions.printBothPages}" value="printOnlyCharacterSheet">Only the Character Sheet
                </mwc-radio-list-item>
                <li divider role="separator"></li>
            </mwc-list>
        </div>
        <div>
            <mwc-list multi bind:this={saveOptionsListElement} on:selected={handleSaveOptionSelected} style="margin: 1em;">
                <h3 role="heading">Save options</h3>
                <mwc-radio-list-item group="b" selected="{viewOptions.saveAlsoDownloads}" value="saveAlsoDownloads">Save also downloads
                </mwc-radio-list-item>
                <mwc-radio-list-item group="b" selected="{!viewOptions.saveAlsoDownloads}" value="saveDoesNotDownload">Save w/o downloading
                </mwc-radio-list-item>
            </mwc-list>
        </div>
        <div slot="appContent" style="height: 100vh; width: 100%;">
            <mwc-top-app-bar-fixed style="height:100%">
                <mwc-icon-button icon="menu" slot="navigationIcon"
                                 on:click={()=>drawerElement.open = !drawerElement.open}></mwc-icon-button>
                <div slot="title"><span>{appSettings.applicationName}</span></div>
                <mwc-icon-button icon="note_add" slot="actionItems" on:click={handleNewCharacterClicked} {disabled}></mwc-icon-button>
                {#if showLoadPane}
                    <mwc-icon-button icon="cancel" slot="actionItems" on:click={hideLoadPane}></mwc-icon-button>
                {:else}
                    <mwc-icon-button icon="folder_open" slot="actionItems" on:click={handleLoadCharacterClicked}></mwc-icon-button>
                {/if}
                <mwc-icon-button icon="save" slot="actionItems" on:click={handleSaveCharacterClicked} {disabled}></mwc-icon-button>
                <mwc-icon-button icon="print" slot="actionItems" on:click={handlePrintClicked} {disabled}></mwc-icon-button>

                {#if (showLoadPane)}
                    <div id="content" class="noprint file-loader" style="height: 100%">
                        <Dropzone on:drop={handleFilesSelect} containerStyles="height:92vh;color:#333333; background-color:#EFEFEF;"/>
                    </div>
                {:else}
                    <div id="content" style="margin: 10pt;">
                        <div class="page">
                            <CharacterSheet bind:character={character}/>
                        </div>
                        {#if viewOptions.printBothPages}
                            <div class="page">
                                <GameRules/>
                            </div>
                        {/if}
                    </div>
                {/if}
            </mwc-top-app-bar-fixed>
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
    {#if viewOptions.printBothPages}
        <div class="page">
            <GameRules/>
        </div>
    {/if}
</main>
