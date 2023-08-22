// Common
createSubNav({
    subText: "Common Page",
    image: "/logo.png"
});

loadCommonData(()=>{});

let extraCSS = ce("style");
extraCSS.append(`
    @media only screen and (max-width: ${mobileUiThreshold}px){

    }
`);
document.head.append(extraCSS);


// Main
document.getElementsByTagName("body")[0].append(createNews({
    title: "Random Title",
    date: Date(),
    body: "What do i write here? No idea.\nLine Break Works!!",
    images: [
        "/logo.png",
        "/logo.png"
    ]
}));
document.getElementsByTagName("body")[0].append(createNews({
    title: "Random Title",
    date: Date(),
    body: "What do i write here? No idea.\nLine Break Works!!",
    images: [
        "/logo.png",
        "/logo.png"
    ]
}));
document.getElementsByTagName("body")[0].append(createNews({
    title: "Random Title",
    date: Date(),
    body: "What do i write here? No idea.\nLine Break Works!!",
    images: [
        "/logo.png",
        "/logo.png"
    ]
}));