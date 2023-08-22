/* -------------------------------------------------- *\
|---             Slideshow Related Code             ---|
\* -------------------------------------------------- */
let currentSldshowIndex = 0
let sldshwLength = 0
function initSldshw(sldshwData){
    let sldshwImgCont = document.getElementById("sldshwImgCont");
    let sldshwDotCont = document.getElementById("sldshwDotCont");

    for (index in sldshwData){
        let sldshwImg = ce("img");
        Object.assign(sldshwImg, {
            src: sldshwData[index],
            style: Object.assign(sldshwImg.style, {display: "none"})
        })
        sldshwImgCont.append(sldshwImg);
        
        let sldshwDot = ce("span");
        Object.assign(sldshwDot, {
            className: "material-symbols-outlined sldshwDot",innerText: "radio_button_checked",imgIndex: index,
            onclick: function(){sldshwSetIndex(parseInt(this.imgIndex));},
            style: Object.assign(sldshwDot.style, {color: color30, textShadow: `${color30} 0px 0px 10px`})
        })
        sldshwDotCont.append(sldshwDot);
    }

    sldshwLength = sldshwImgCont.children.length;
}
function sldshwSetIndex(index){
    let sldshwImgCont = document.getElementById("sldshwImgCont");
    if (index < sldshwLength && index >= 0){
        sldshwImgCont.children[currentSldshowIndex].style.display = "none";
        sldshwImgCont.children[index].style.display = "block";

        sldshwDotCont.children[currentSldshowIndex].style.color = color30;
        sldshwDotCont.children[currentSldshowIndex].style.textShadow = `${color30} 0px 0px 10px`;

        sldshwDotCont.children[index].style.color = color10;
        sldshwDotCont.children[index].style.textShadow = `${color10} 0px 0px 10px`;

        currentSldshowIndex = index;
    }
}
function sldshwNext(){if (currentSldshowIndex+1 >= sldshwLength){sldshwSetIndex(0);}else{sldshwSetIndex(currentSldshowIndex+1);}}
function sldshwPrev(){if (currentSldshowIndex-1 < 0){sldshwSetIndex(sldshwLength-1);}else{sldshwSetIndex(currentSldshowIndex-1);}}

initSldshw([
    // "https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_GenshinImpact_miHoYoLimited_S1_2560x1440-91c6cd7312cc2647c3ebccca10f30399",
    // "https://cdn.mos.cms.futurecdn.net/JarKa4TVZxSCuN8x8WNPSN.jpg",
    // "https://i.ytimg.com/vi/UHQ3u2TLkAg/maxresdefault.jpg"
    "https://www.stardewvalley.net/wp-content/uploads/2018/12/1_1screenshot15.png",
    "https://assetsio.reedpopcdn.com/stardew-valley-multiplayer-a.png?width=1200&height=1200&fit=bounds&quality=70&format=jpg&auto=webp"
]);
sldshwSetIndex(0);
setInterval(sldshwNext, 5000);



/* -------------------------------------------------- *\
|---              siteName Related Code             ---|
\* -------------------------------------------------- */
document.getElementById("siteName").innerText = siteName;



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
|---             shortAbout Related Code            ---|

ToDo: Maybe make it look better?
ToDo: Maybe add MarkDown Support?

\* -------------------------------------------------- */
document.getElementById("shortAbout").innerText = `Here at RhymePlays Academy, We like to Re-invent education.

From the start, our goal has been to give Proper and Adequate education to the masses. We strive to bring your
children the education they Deserve. Our institute has a Long and Rich history of raising  intellects. You only
stand to gain from RhymePlays Academy. Aprsny Today to ensure a bright future.`;



/* -------------------------------------------------- *\
|---              prsnCard Related Code              ---|
\* -------------------------------------------------- */
document.getElementById("prsnCardCont").innerText = "";
document.getElementById("prsnCardCont").append(
    createPrsnCard({
        name: "Name Here",
        post: "Post Name",
        image: "",
        body: `From the start, our goal has been to give Proper and Adequate education to the masses. We strive to bring your
        children the education they Deserve. Our institute has a Long and Rich history of raising intellects.`
    }),
    createPrsnCard({
        name: "Name Here",
        post: "Post Name",
        image: "",
        body: `From the start, our goal has been to give Proper and Adequate education to the masses. We strive to bring your
        children the education they Deserve. Our institute has a Long and Rich history of raising intellects.`
    }),
    createPrsnCard({
        name: "Name Here",
        post: "Post Name",
        image: "",
        body: `From the start, our goal has been to give Proper and Adequate education to the masses. We strive to bring your
        children the education they Deserve. Our institute has a Long and Rich history of raising intellects.`
    }),
    createPrsnCard({
        name: "Name Here",
        post: "Post Name",
        image: "",
        body: `From the start, our goal has been to give Proper and Adequate education to the masses. We strive to bring your
        children the education they Deserve. Our institute has a Long and Rich history of raising intellects.`
    }),
    createPrsnCard({
        name: "Name Here",
        post: "Post Name",
        image: "",
        body: `From the start, our goal has been to give Proper and Adequate education to the masses. We strive to bring your
        children the education they Deserve. Our institute has a Long and Rich history of raising intellects.`
    }),
    createPrsnCard({
        name: "Name Here",
        post: "Post Name",
        image: "",
        body: `From the start, our goal has been to give Proper and Adequate education to the masses. We strive to bring your
        children the education they Deserve. Our institute has a Long and Rich history of raising intellects.`
    })
);



/* -------------------------------------------------- *\
|---             Page Specific Extra CSS            ---|
\* -------------------------------------------------- */
let extraCSS = ce("style");
extraCSS.append(`
    @media only screen and (max-width: ${mobileUiThreshold}px){
        #sldshw{height: 250px;margin-top: 20px;}
        #siteName{font-size: 25px;}

        .rSectTitle{font-size:20px}
    }
`);
document.head.append(extraCSS);



/* -------------------------------------------------- *\
|---                    Page Init                   ---|
\* -------------------------------------------------- */
// db.collection("news").orderBy("date", "desc").limit(5).get().then((docRef)=>{
//     let newsDocs = docRef.docs;let newsArray = []
//     for (index in newsDocs){newsArray.push(Object.assign(newsDocs[index].data(), {newsID: newsDocs[index].id}));}
//     initTopNews(newsArray);
// });

loadCommonData(()=>{
    initTopNews(commonDBData.newsSnippet);
})