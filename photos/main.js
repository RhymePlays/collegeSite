// Common
createSubNav({
    subText: "Photos",
    image: "/logo.png"
});

let extraCSS = ce("style");
extraCSS.append(`
@media only screen and (max-width: ${mobileUiThreshold}px){
    
}
`);
document.head.append(extraCSS);

// Main