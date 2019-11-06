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



function createClusters() {
    const title = `<h2>Cluster</h2>`;
    const htmlContent = `
    <h2>Hey this is cluster</h2>
    `;
    hrCustomPopup(title, htmlContent);

}

function createGraphDiff() {
    const title = `<h2>Diff 2 Dates</h2>`;
    const htmlContent = `<input type="date" id="graphDate1">
    <input type="date" id="graphDate2">
    <input type="submit" onclick="createJSONTimeGraph()"><br><br>
    <svg width="400" height="400" id="timeSvg1" class="timeSvg"></svg>
    <svg width="400" height="400" id="timeSvg2" class="timeSvg"></svg>
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
