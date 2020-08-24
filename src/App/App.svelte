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

    export let appSettings = {applicationName: "WARNING: Please pass appSettings from within main.js props."};

    let drawerElement; // bind to the drawerElement component so we can open and close it.

    let orientationListElement, pageSizeListElement;
    let largePageHeading=true, pageNumberOnly=true;


    function handlePageHeadingSelected(e) {
        console.log('handlePageHeadingSelected');
        largePageHeading=orientationListElement.querySelectorAll('mwc-radio-list-item')[e.detail.index].value === 'largePageHeading';
    }

    function handleFooterOptionSelected(e) {
        console.log('handleFooterOptionSelected');
        pageNumberOnly=pageSizeListElement.querySelectorAll('mwc-radio-list-item')[e.detail.index].value === 'pageNumberOnly';
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
    <mwc-drawer hasHeader type="modal" bind:this={drawerElement}>
        <span slot="title">Manage Notes</span>
        <span slot="subtitle">Manage the entire list</span>
        <div>
            <!-- Drawer Content -->
            <mwc-list>
                <mwc-list-item graphic="avatar">
                    <span>Clear Notes</span>
                    <mwc-icon slot="graphic">cancel</mwc-icon>
                </mwc-list-item>
                <mwc-list-item graphic="avatar">
                    <span>avatar item</span>
                    <mwc-icon slot="graphic">folder</mwc-icon>
                </mwc-list-item>
            </mwc-list>
            <mwc-list bind:this={orientationListElement} on:selected={handlePageHeadingSelected} >
                <li role="separator" class="drawer-header"><h3>Print Options</h3></li>
                <li divider role="separator" style="margin-left: 16px;"></li>
                <mwc-radio-list-item selected="{!largePageHeading}" value="smallPageHeading">Small Page Header</mwc-radio-list-item>
                <mwc-radio-list-item selected="{largePageHeading}" value="largePageHeading">Large Page Header</mwc-radio-list-item>
            </mwc-list>
            <mwc-list bind:this={pageSizeListElement} on:selected={handleFooterOptionSelected}>
                <li divider role="separator" style="margin-left: 16px;"></li>
                <mwc-radio-list-item group="c" selected="{!pageNumberOnly}" value="detailedFooter">Detailed Footer</mwc-radio-list-item>
                <mwc-radio-list-item group="c" selected="{pageNumberOnly}" value="pageNumberOnly">Page Number Only</mwc-radio-list-item>
            </mwc-list>
        </div>
        <div slot="appContent">
            <mwc-top-app-bar-fixed>
                <mwc-icon-button icon="menu" slot="navigationIcon"
                                 on:click={()=>drawerElement.open = !drawerElement.open}></mwc-icon-button>
                <div slot="title"><span>{appSettings.applicationName}</span></div>
                <mwc-icon-button icon="file_download" slot="actionItems"></mwc-icon-button>
                <mwc-icon-button icon="file_upload" slot="actionItems"></mwc-icon-button>
                <mwc-icon-button icon="print" slot="actionItems" on:click={printIt}></mwc-icon-button>
                <div id="content" style="margin: 10pt;">
                    <div>
                        <!-- App Content -->

                    </div>
                </div>
            </mwc-top-app-bar-fixed>
        </div>
    </mwc-drawer>
</main>

<main class="printme" style="margin: 0.5in">
    <!-- This section is intended for print rendering only. You may suppress the rendering of this entire section
         to HTML if you like, but you'll need to ensure it's been rendered right before the print dialog is invoked.
         (i.e. print() )
     -->
    <div style="height: 80%; margin: 1.0in; padding: 0">
        <div class="page-header">
            {#if largePageHeading}
            <h1 style="text-align: center">Large Page Heading</h1>
            {:else}
            <h4 style="text-align: center">Small Page Heading</h4>
            {/if}
        </div>
        <div>
            Put your content to actually print here. Adjust it based on settings (if any)
            <p>{JSON.stringify({  pageNumberOnly, largePageHeading})}</p>
        </div>
        <div style="position: absolute; bottom: 1in; display: block;width: 90%">
            {#if (!pageNumberOnly)}
                <h6 style="margin:0; padding:0; text-align: center; display: inline-block; position: relative; float: left">document details</h6>
            {/if}
            <div style="display: inline-block; position: relative; float: right"><span>Page 1</span></div>
        </div>
    </div>
</main>
