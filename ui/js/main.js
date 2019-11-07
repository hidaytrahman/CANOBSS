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

function createLiveView() {
    const title = `<h2>Live View</h2>`;
    const htmlContent = `
    <section class="live-preview-wrapper">
    <aside class="controls">
        <input type="text" placeholder="Search for Node" id="searchGraph"/>
        <input type="submit" id="btnSearchGraph" value="Search"><br><br>
    </aside>
    
        <svg width="500" height="500" id="mainSvg"></svg>
        <div id="popup1" class="overlay">
	<div class="popup">
		<h2 id="popuph2">Node Details</h2>
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
    draw(getDateValues()[0], "mainSvg");
}

function createIframAnimation() {
    const title = `<h2>Frame Animation</h2>`;
    const htmlContent = `
    <section class="live-preview-wrapper">
    <div class="iframe-wrapper">
    <iframe src="http://setosa.io/markov/index.html#%7B%22tm%22%3A%5B%5B0%2C0%2C0%2C0%2C1%2C0%2C0%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0.5%2C0%2C0%2C0%2C0%2C0%2C0.5%2C0%5D%2C%5B0%2C0.333333333%2C0%2C0%2C0.666666667%2C0%2C0%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0.04%2C0%2C0.12%2C0.52%2C0.04%2C0.12%2C0.04%2C0%2C0%2C0.12%5D%2C%5B0%2C0%2C0.019607843%2C0.176470588%2C0.539215686%2C0.009803922%2C0.039215686%2C0%2C0.009803922%2C0.009803922%2C0.196078431%5D%2C%5B0%2C0%2C0%2C0%2C0.5%2C0%2C0%2C0.5%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0%2C0.875%2C0%2C0%2C0%2C0%2C0.125%2C0%5D%2C%5B0%2C0%2C0%2C0.666666667%2C0.333333333%2C0%2C0%2C0%2C0%2C0%2C0%5D%2C%5B0%2C0%2C0%2C0%2C0.5%2C0%2C0%2C0%2C0%2C0%2C0.5%5D%2C%5B0%2C0%2C0%2C0.166666667%2C0.5%2C0%2C0%2C0%2C0.166666667%2C0%2C0.166666667%5D%2C%5B0%2C0%2C0.026315789%2C0%2C0.447368421%2C0%2C0.026315789%2C0.026315789%2C0.078947368%2C0.078947368%2C0.315789474%5D%5D%7D" height="100%" width="100%">
    </iframe>
    </div>
    
    </section>
        `;
    hrCustomPopup(title, htmlContent);
    draw(getDateValues()[0], "mainSvg");
}



function createClusters() {
    const title = `<h2>Cluster</h2>`;
    const htmlContent = `
    <h2>Hey this is cluster</h2>
    `;
    hrCustomPopup(title, htmlContent);

}



function createGraphDiff() {
    const title = `<h2>Diff 2 Dates</h2>`;
    const htmlContent = `
    <section class="diff-wrapper">
    <div class="controls">
    <input type="date" id="graphDate1">
    <input type="date" id="graphDate2">
    <input type="submit" onclick="createJSONTimeGraph()"><br><br>
    </div>
    <div class="map-area-wrapper">
    <svg width="400" height="400" id="timeSvg1" class="timeSvg"></svg>
    <svg width="400" height="400" id="timeSvg2" class="timeSvg"></svg>
    </div>
    
    <div>
    <select name="selector" id="attSelect">
    <option value="inDegreeDiff" selected="selected">In Degree</option>
    <option value="outDegreeDiff">Out Degree</option>
    <option value="closenessCDiff">Closeness Centrality</option>
    <option value="betweennessCDiff">Betweenness Centrality</option>
    <option value="degreeCDiff">Degree Centrality</option>
    <option value="eigenCDiff">Eigen Vector Centrality</option>
    </select>
    <table id="attributeDiffTbl">
    <thead>
    <tr>
    <th>Node</th>
    <th>Difference</th>
    </tr>
    </thead>
    <tbody></tbody>
    </table>
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
