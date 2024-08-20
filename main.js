initPage({
    pageName: "Home",
    extraCSS: `
    @media only screen and (max-width: ${mobileUiThreshold}px){
        #sldshw{height: 250px;margin-top: 50px;}
        #siteNameCont{font-size: 25px;}

        .rSectTitle{font-size:20px}
    }`,
    onCommonLoad: ()=>{
        document.getElementById("siteNameCont").innerText = commonDBData.siteName || siteName;
        initSldshw(commonDBData.pinnedPhotos);sldshwSetIndex(0);setInterval(sldshwNext, 5000);
        initLatestNotice(commonDBData.noticeSnippet);
        initPinnedPpl(commonDBData.pinnedPeople);
        document.getElementById("shrtDesc").append(parseMD(commonDBData.shortDescription));
    }
});


let currentSldshowIndex = 0
let sldshwLength = 0
function initSldshw(sldshwData){
    let sldshwImgCont = document.getElementById("sldshwImgCont");
    let sldshwDotCont = document.getElementById("sldshwDotCont");

    for (index in sldshwData){
        let sldshwImg = ce("img", {
            src: sldshwData[index].url,
            style: "display:none"
        });
        sldshwImgCont.append(sldshwImg);
        
        let sldshwDot = ce("span", {
            className: "material-symbols-outlined sldshwDot",innerText: "radio_button_checked",imgIndex: index,
            onclick: function(){sldshwSetIndex(parseInt(this.imgIndex));},
            style: "color: var(--color30);textShadow: var(--color30) 0px 0px 10px;"
        });
        sldshwDotCont.append(sldshwDot);
    }

    sldshwLength = sldshwImgCont.children.length;
}
function sldshwSetIndex(index){
    let sldshwImgCont = document.getElementById("sldshwImgCont");
    let sldshwImgBlurOverlayCont = document.getElementById("sldshwImgBlurOverlayCont");
    sldshwImgBlurOverlayCont.children[0].style.display = "block";
    if (index < sldshwLength && index >= 0){
        sldshwImgCont.children[currentSldshowIndex].style.display = "none";
        sldshwImgCont.children[index].style.display = "block";

        sldshwDotCont.children[currentSldshowIndex].style.color = "var(--color30)";
        sldshwDotCont.children[currentSldshowIndex].style.textShadow = "var(--color30) 0px 0px 10px";

        sldshwDotCont.children[index].style.color = "var(--color10)";
        sldshwDotCont.children[index].style.textShadow = "var(--color10) 0px 0px 10px";

        currentSldshowIndex = index;

        sldshwImgBlurOverlayCont.children[0].src = sldshwImgCont.children[index].src;
    }
}
function sldshwNext(){if (currentSldshowIndex+1 >= sldshwLength){sldshwSetIndex(0);}else{sldshwSetIndex(currentSldshowIndex+1);}}
function sldshwPrev(){if (currentSldshowIndex-1 < 0){sldshwSetIndex(sldshwLength-1);}else{sldshwSetIndex(currentSldshowIndex-1);}}


function createArtclCard(artclData){
    let dateO = new Date(artclData.date);
    let body = ce("div", {className: "rCardBody"});
    if (typeof(artclData.images) == "object"){
        if(artclData.images.length > 0){
            body.append(ce("img", {src: artclData.images[0]}));
        }else{
            body.append(parseMD(artclData.body));
        }
    }else{
        body.append(parseMD(artclData.body));
    }
    return ce("div", {className: "rCard", onclick: function(){location.href = `/article/?boardID=Notice&artclID=${artclData.artclID}`;}}, [
        ce("div", {classList: "rCardTtl", innerText: artclData.title}),
        ce("div", {className: "rCardDate"}, [matSym("schedule", {style: "margin-right:5px;"}), ce("span", {}, [ce("b", {}, ["Date: "]), `${dateO.getDate()}/${dateO.getMonth()}/${dateO.getFullYear()}`])]),
        body
    ]);
}
function initLatestNotice(artclArray){
    document.getElementById("ntcCardCont").innerHTML = "";
    for (artcl in artclArray){
        document.getElementById("ntcCardCont").append(createArtclCard(artclArray[artcl]));
    }
};


function initPinnedPpl(pplArray){
    document.getElementById("prsnCardCont").innerText = "";
    for (index in pplArray){
        document.getElementById("prsnCardCont").append(createPrsnCard(pplArray[index]));
    }
}