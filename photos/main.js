initPage({
    pageName: "Photos",
    extraCSS: `
    @media only screen and (max-width: ${mobileUiThreshold}px){

    }`
});

// Main
function createImgItm(imgObj){
    let dateObj = new Date(imgObj.date);
    return ce("div", {className: "phto"}, [
        ce("div", {className: "phtoCptn"}, [matSym("image", {style: "margin-right:5px;"}), ce("span", {}, [imgObj.caption])]),
        ce("div", {className: "phtoDate"}, [matSym("schedule", {style: "margin-right:5px;"}), ce("span", {}, [ce("b", {}, ["Date: "]), `${dateObj.getDate()}/${dateObj.getMonth()}/${dateObj.getFullYear()}`])]),
        ce("div", {className: "imgID"}, [matSym("fingerprint", {style: "margin-right:5px;"}), ce("span", {}, [ce("b", {}, ["WebID: "]), imgObj.imgID])]),
        ce("img", {className: "phtoImg", src: imgObj.url})
    ]);
}
let allPhtosCont = document.getElementById("allPhtosCont");
db.collection("siteData").doc("photos").get().then((photosRef)=>{
    allPhtosCont.innerHTML = "";
    photosDocData = photosRef.data();
    for (index in photosDocData.allPhotos){
        allPhtosCont.append(createImgItm(photosDocData.allPhotos[index]));
    }
});