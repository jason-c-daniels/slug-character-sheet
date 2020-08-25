<style>
    @import "CharacterSheet.css";
</style>

<script>
    import getNewCharacter from '../../model/character'
    export let character = getNewCharacter();
</script>

<section class="title-box">
<h1 class="title">SLUG</h1>
<span class="serif">(Simple, Laid-back, Universal, Game)</span>
</section>
<div class="thick-separator"><span>&nbsp;</span></div>
<section class="character-info">
    <section class="info-box">
        <h4 class="box-title">background information (name, occupation and such)</h4>
        <textarea bind:value={character.backgroundInfo} rows="7"></textarea>
    </section>
    <section class="center-grouping">
        <section class="flex-row">
            <section class="flex-col" style="flex-grow: 2; margin-right:10pt">
                <section class="info-box" style="margin-bottom: 6pt">
                    <h4 class="box-title">attributes, skills, traits, and stuff like that</h4>
                    <textarea bind:value={character.attributesSkillsAndTraits} rows="20"></textarea>
                </section>

                <section class="info-box">
                    <h4 class="box-title">weapons and cool stuff like psi and magic</h4>
                    <textarea bind:value={character.weaponsPsiAndMagic} rows="7"></textarea>
                </section>
            </section>
            <section class="info-box flex-fixed-size">
                <h4 class="box-title">miscellaneous gear</h4>
                <textarea bind:value={character.miscellaneousGear} rows="30"></textarea>
            </section>
        </section>
        <section class="info-box">
            <h4 class="box-title">miscellaneous notes about adventures ...etc.</h4>
            <textarea bind:value={character.notes} rows="4"></textarea>
        </section>
    </section>
</section>