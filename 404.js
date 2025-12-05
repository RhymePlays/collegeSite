initPage({
    pageName: "404: Page not Found",
    extraCSS: `
    @media only screen and (max-width: ${mobileUiThreshold}px){

    }`,
    onCommonLoad: function(){
        
    }
});

document.getElementById("artclCont").append(createArticle({
    title: "404: Page not Found",
    boardID: "boardID",
    artclID: "n/a",
    date: Date(),
    body: `Sorry! 😔 The page you're looking for couldn't be found. [Click here](/) to return home`,
}))