initPage({
    pageName: "Home",
    extraCSS: `
    @media only screen and (max-width: ${mobileUiThreshold}px){
        #sldshw{height: 250px;margin-top: 20px;}
        #siteNameCont{font-size: 25px;}

        .rSectTitle{font-size:20px}
    }`,
    onCommonLoad: ()=>{
        document.getElementById("siteNameCont").innerText = commonDBData.siteName;
        initSldshw(commonDBData.pinnedPhotos);sldshwSetIndex(0);setInterval(sldshwNext, 5000);
        initTopNews(commonDBData.newsSnippet);
        initPinnedPpl(commonDBData.pinnedPeople);
        document.getElementById("shrtDesc").innerText = commonDBData.shortDescription;
    }
});

/* -------------------------------------------------- *\
|---             Slideshow Related Code             ---|
\* -------------------------------------------------- */
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
    if (index < sldshwLength && index >= 0){
        sldshwImgCont.children[currentSldshowIndex].style.display = "none";
        sldshwImgCont.children[index].style.display = "block";

        sldshwDotCont.children[currentSldshowIndex].style.color = "var(--color30)";
        sldshwDotCont.children[currentSldshowIndex].style.textShadow = "var(--color30) 0px 0px 10px";

        sldshwDotCont.children[index].style.color = "var(--color10)";
        sldshwDotCont.children[index].style.textShadow = "var(--color10) 0px 0px 10px";

        currentSldshowIndex = index;
    }
}
function sldshwNext(){if (currentSldshowIndex+1 >= sldshwLength){sldshwSetIndex(0);}else{sldshwSetIndex(currentSldshowIndex+1);}}
function sldshwPrev(){if (currentSldshowIndex-1 < 0){sldshwSetIndex(sldshwLength-1);}else{sldshwSetIndex(currentSldshowIndex-1);}}



/* -------------------------------------------------- *\
|---              Top News Related Code             ---|

newsData = {
    title: "",
    date: 0,
    body: "",
    images: ["URL", "URL"]
}
createNewsCard(newsData)

ToDo: Show something if the Body is empty.

\* -------------------------------------------------- */
function createNewsCard(newsData){
    
    let dateO = new Date(newsData.date);
    let date = ce("div");
    date.classList = "rCardDate";
    date.append(Object.assign(ce("b"), {innerText: "Date: ",}), `${dateO.getDate()}/${dateO.getMonth()}/${dateO.getFullYear()}`);

    let body = ce("div");
    body.className = "rCardBody";
    if (typeof(newsData.images) == "object"){
        if(newsData.images.length > 0){
            body.append(Object.assign(ce("img"), {src: newsData.images[0]}));
        }else{
            body.innerText = newsData.body;
        }
    }else{
        body.innerText = newsData.body;
    }

    let card = ce("div");
    card.className = "rCard";
    card.onclick = function(){location.href = `/news/?newsID=${newsData.newsID}`;}
    card.append(Object.assign(ce("div"), {classList: "rCardTtl", innerText: newsData.title}), date, body);
    
    return card;
}
function initTopNews(newsArray){
    document.getElementById("newsCardCont").innerHTML = "";
    for (news in newsArray){
        document.getElementById("newsCardCont").append(createNewsCard(newsArray[news]));
    }
};



/* -------------------------------------------------- *\
|---              prsnCard Related Code              ---|
\* -------------------------------------------------- */
function initPinnedPpl(pplArray){
    document.getElementById("prsnCardCont").innerText = "";
    for (index in pplArray){
        document.getElementById("prsnCardCont").append(createPrsnCard(pplArray[index]));
    }
}



/* -------------------------------------------------- *\
|---                    Page Init                   ---|
\* -------------------------------------------------- */
