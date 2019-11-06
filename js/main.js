// custom popup
function hrCustomPopup(title, htmlContent) {
    const popupClass = '.hr-custom-popup';
    $(popupClass).addClass('isVisible');
    $(popupClass+' .popup-header').html(title);

    // close button
    $(popupClass+' .close-button').on("click", function () {
        $(popupClass).removeClass('isVisible');
    })
    title
    // your dom will render here
    $(popupClass+' .content-wrapper .popup-content-section').html(htmlContent);
}

// open your function to show html
function createSomething() {
    const title = `<h2>This is title</h2>`;
    const htmlContent = `
    <h2>Hey this flag map</h2>
    `;
    hrCustomPopup(title,htmlContent);
}



function createClusters() {
    const title = `<h2>Cluster</h2>`;
    const htmlContent = `
    <h2>Hey this is cluster</h2>
    `;
    hrCustomPopup(title,htmlContent);
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
