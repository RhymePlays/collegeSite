// Common
initPage({
    pageName: "Common Page",
    subNavImage: "/logo.png",
    extraCSS: `
    @media only screen and (max-width: ${mobileUiThreshold}px){

    }`
});


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