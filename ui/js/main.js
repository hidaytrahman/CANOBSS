// custom popup
function hrCustomPopup(title, htmlContent) {
    const popupClass = '.hr-custom-popup';
    $(popupClass).addClass('isVisible');
    $(popupClass + ' .popup-header').html(title);

    // close button
    $(popupClass + ' .close-button').on("click", function () {
        $(popupClass).removeClass('isVisible');
    })
    title
    // your dom will render here
    $(popupClass + ' .content-wrapper .popup-content-section').html(htmlContent);
}

// open your function to show html
function createSomething() {
    const title = `<h2>Your title here </h2>`;
    const htmlContent = `
    <section class="example-preview-wrapper">
    
    </section>
        `;
    hrCustomPopup(title, htmlContent);
}

function createLiveAnimation() {
    const title = `<h2>Animated Sequence</h2>`;
    const htmlContent = `
    <section class="animated-preview-wrapper">
        <iframe style="width: 90vw; height: 80vh;" src="./ui/animation/index-animation.html">
        </iframe>
    </section>
        `;
    hrCustomPopup(title, htmlContent);
}

function createLiveView() {
    const title = `<h2>Live View</h2>`;
    const htmlContent = `
    <section class="live-preview-wrapper">
    <aside class="controls">
        <input type="text" placeholder="Search for Node" id="searchGraph"/>
        <input type="submit" id="btnSearchGraph" value="Search"><br><br>
    </aside>
    
        <svg width="500" height="500" id="mainSvg"></svg>
        <div id="popup1" class="overlay secondry-popup">
	<div class="popup">
		<h2 id="popuph2">Graph Features of Node</h2>
		<a class="close" href = javascript:void(0) onclick="popupClose()">&times;</a>
		<div id="bar"class="content">
			
		</div>
	</div>
</div>
<div id="popup2" class="overlay">
	<div class="popup">
		<h2>Markov Chain</h2>
		<a class="close" href = javascript:void(0) onclick="popupClose2()">&times;</a>
		<div id="markov" class="content">
			
		</div>
	</div>
</div>
</section>
        `;
    hrCustomPopup(title, htmlContent);

    createGraph(getDateValues()[0], "mainSvg");
}



function createClusters() {
    const title = `<h2>Cluster</h2>`;
    const htmlContent = `
    <h2>Hey this is cluster</h2>
    `;
    hrCustomPopup(title, htmlContent);

}

function createGraphDiff() {
    const title = `<h2>Compare Network</h2>`;
    const htmlContent = `
    <section class="compare-graph-wrapper">
        <aside class="controls">
            <input type="date" id="graphDate1">
            <input type="date" id="graphDate2">
            <input type="submit" onclick="createJSONTimeGraph()">      
            <input type="submit" onclick="showDiffBarGraph()" value="Get Difference">
        </aside>

        <div class="diff-map-container">
            <svg width="400" height="400" id="timeSvg1" class="timeSvg"></svg>
            <svg width="400" height="400" id="timeSvg2" class="timeSvg"></svg>
        </div>

        <div id="divBarDiff">
    
         </div>
         <div id="popupdiff" class="overlay secondry-popup">
         <div class="popup">
             <h2>Graph Features Difference</h2>
             <a class="close" href = javascript:void(0) onclick="popupCloseDiff()">&times;</a>
             <div id="bardiff"class="content">
                 
             </div>
         </div>
     </div>
    </section>

    `;

    hrCustomPopup(title,htmlContent);
    createTimeGraphs();
}

/*
function createCluster() {
    $('.hr-custom-popup').addClass('isVisible');

    $('.hr-custom-popup .close-button').on("click", function () {
        $(this).parents('.hr-custom-popup').removeClass('isVisible');
    })

    // create your dom here
    $('.hr-custom-popup .content-wrapper .popup-content-section').html(`
            <h2>This is cluster</h2>
        `);
}*/
