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

    export let appSettings = {applicationName: "WARNING: Please pass appSettings from within main.js props."};

    let drawerElement; // bind to the drawerElement component so we can open and close it.

    let orientationListElement, pageSizeListElement;
    let largePageHeading=true, pageNumberOnly=true;
    let character = getNewCharacter();

    let disabled="";
    let showLoadPane = false;

    function saveCharacter() {
        var blob = new Blob([JSON.stringify(character, null, 2)], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "character.slug");
    }

    function loadCharacter() {
        showLoadPane = true;
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
        disabled="";
    }
    function printIt() {
        print();
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
            <mwc-top-app-bar-fixed>
                <mwc-icon-button icon="menu" slot="navigationIcon"
                                 on:click={()=>drawerElement.open = !drawerElement.open}></mwc-icon-button>
                <div slot="title"><span>{appSettings.applicationName}</span></div>
                <mwc-icon-button icon="create" slot="actionItems" on:click={newCharacter}></mwc-icon-button>
                {#if showLoadPane}
                    <mwc-icon-button icon="clear" slot="actionItems" on:click={hideLoadPane}></mwc-icon-button>
                {:else}
                    <mwc-icon-button icon="file_upload" slot="actionItems" on:click={loadCharacter}></mwc-icon-button>
                {/if}
                <mwc-icon-button icon="file_download" slot="actionItems" on:click={saveCharacter}></mwc-icon-button>
                <mwc-icon-button icon="print" slot="actionItems" on:click={printIt}></mwc-icon-button>
                <div id="content" style="margin: 10pt;">
                    <div class="page">
                        <!-- App Content -->
                        <CharacterSheet bind:character={character} />
                    </div>
                </div>
            </mwc-top-app-bar-fixed>

    {#if (showLoadPane)}
        <div class="noprint file-loader" >
            <Dropzone on:drop={handleFilesSelect}  containerStyles="height:100%"/>
        </div>
    {/if}
</main>

<main class="printme" style="margin: 0.5in">
    <!-- This section is intended for print rendering only. You may suppress the rendering of this entire section
         to HTML if you like, but you'll need to ensure it's been rendered right before the print dialog is invoked.
         (i.e. print() )
     -->
    <div class="page">
        <CharacterSheet bind:character={character} />
    </div>
</main>
