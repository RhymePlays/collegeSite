// Common
createSubNav({
    subText: "Admin Page",
    image: "/logo.png"
});

let extraCSS = ce("style");
extraCSS.append(`
    @media only screen and (max-width: ${mobileUiThreshold}px){

    }
`);
document.head.append(extraCSS);

// Post News
let newsTtlIO = document.getElementById("newsTtlIO");
let newsDateIO = document.getElementById("newsDateIO");
let newsBodyIO = document.getElementById("newsBodyIO");
let newsImages = [];
let newsBoardIO = document.getElementById("newsBoardIO");
let newsImgCont = document.getElementById("newsImgCont");

function setNewsDate(){newsDateIO.value = new Date().toISOString().split(".")[0]}
function updateImagePreview(){
    newsImgCont.innerHTML = "";
    for (index in newsImages){
        newsImgCont.append(Object.assign(ce("img"), {src: newsImages[index], imgID: index, onclick: function(){newsImages.splice(this.imgID, 1);updateImagePreview();}}));
    }
}
function addNewsImgLink(){
    let body = ce("div")
    body.append(
        Object.assign(ce("input"), {id: "newsImgLinkIO", placeholder: "URL"}),
        Object.assign(ce("div"), {className: "rBtn", style: "margin-top: 10px", innerText: "Add", onclick: function(){
            let link=document.getElementById("newsImgLinkIO").value;
            if(link.length > 0){newsImages.push(link);updateImagePreview();document.getElementById("overPage").style.display = "none";}
        }})
    )
    createOP("Add Image Link", body)
}
function addNewsImgFile(){
    newsImages.push();
    updateImagePreview();
}
function postNews(){
    let newsData = {
        title: newsTtlIO.value,
        date: new Date(newsDateIO.value).getTime(),
        body: newsBodyIO.value,
        images: newsImages
    }

    if (newsBoardIO.value == "News" && newsData.title && newsData.date && newsData.body){
        db.collection("news").add(newsData).then((newsRef)=>{
            document.getElementById("newsPostBtn").style.color = "var(--colorGreen)";
            
            // Cache
            newsData = Object.assign(newsData, {newsID: newsRef.id})
            db.collection("siteData").doc("common").get().then((commonRef)=>{
                let commonData = commonRef.data();
                if(commonData != undefined){
                    if ("newsSnippet" in commonData){
                        if (commonData.newsSnippet.length >= 10){commonData.newsSnippet.pop();console.log(11);}
                        commonData.newsSnippet.unshift(newsData);
                        db.collection("siteData").doc("common").set(commonData);
                    }
                    else{
                        commonData["newsSnippet"] = [newsData];
                        db.collection("siteData").doc("common").set(commonData);
                    }
                }else{
                    db.collection("siteData").doc("common").set({newsSnippet: [newsData]});
                }
            })

        });
    }
}

// Delete News
let newsDelIDIO = document.getElementById("newsDelIDIO")
let newsDelBoardIO = document.getElementById("newsDelBoardIO")
function delNews(){
    if (newsDelBoardIO.value == "News" && newsDelIDIO.value){
        db.collection("news").doc().delete()
    }
}



setNewsDate();updateImagePreview();