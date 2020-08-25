<style>
    @import "GameRules.css";
</style>

<script>
    import PageHeader from '../shared/PageHeader';
    import marked from 'marked';
    let intro="";
    let ch1="";
    let ch2="";
    let ch3="";

    fetch("./md/Introduction.md").then((response)=> response.text().then((data) => intro=data));
    fetch("./md/Chapter1.md").then((response)=> response.text().then((data) => ch1=data));
    fetch("./md/Chapter2.md").then((response)=> response.text().then((data) => ch2=data));
    fetch("./md/Chapter3.md").then((response)=> response.text().then((data) => ch3=data));
    // fetch("./md/Chapter1.md").then((response)=> ch1=response.text().toString());
/*
    fetch("./md/Chapter2.md").then((response)=> ch2=response.text());
    fetch("./md/Chapter3.md").then((response)=> ch3=response.text());
*/

</script>

<PageHeader />
<section id="introduction-and-copyright" style="display: block; height: 5.5em;">
    <div id="introduction" class="single-column-content" style="width:66%; display:inline-block; height:100%;">
        {@html marked(intro)}
    </div>
    <div id="copyright" class="copyright-box" style="width:33%; display:inline-block; height:100%">
        <div style="text-align: center; vertical-align: center">
        <p style="letter-spacing: 0.001em">
            Copyright 1992 & 1993 By Steffan O'Sullivan
        </p>
        <p>
             Edited by Ann Dupuis
        </p>
        <p>
            Typesetting & App by Jason C. Daniels
        </p>
        </div>
    </div>
</section>
<section id="chapter-1">
    <div id="ch1-content" class="three-column-content">
        {@html marked(ch1)}
    </div>
</section>
<section id="chapter-2">
    <div id="ch2-content" class="three-column-content">
        {@html marked(ch2)}
    </div>
</section>
<section id="chapter-3">
    <div id="ch3-content" class="three-column-content">
        {@html marked(ch3)}
    </div>
</section>
<section id="the-end">
<h2>The End</h2>
</section>