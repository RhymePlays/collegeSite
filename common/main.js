// Common
initPage({
    pageName: "Common Page",
    subNavImage: "/logo.png",
    extraCSS: `
    @media only screen and (max-width: ${mobileUiThreshold}px){

    }`,
    onCommonLoad: function(){
        
    }
});


// Main
document.getElementById("prsnCardCont").append(createPrsnCard({
    name: "name",
    post: "post",
    image: "/logo.png",
    body: "body",
    prsnID: "prsnID"
}))
document.getElementById("artclCardCont").append(createArtclCard({
    title: "title",
    boardID: "boardID",
    artclID: "artclID",
    date: Date(),
    body: "body",
    images: ["/logo.png", "/logo.png"]
}))
document.getElementById("artclCont").append(createArticle({
    title: "title",
    boardID: "boardID",
    artclID: "artclID",
    date: Date(),
    body: "Supports **MarkDown**",
    images: ["/logo.png", "/logo.png"]
}))