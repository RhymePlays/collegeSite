createSubNav({
    subText: "News Page",
    image: "/logo.png"
});

let extraCSS = ce("style");
extraCSS.append(`
    @media only screen and (max-width: ${mobileUiThreshold}px){

    }
`);document.head.append(extraCSS);

const newsId=new URLSearchParams(window.location.search).get("newsID");
db.collection("news").doc(newsId).get().then((newsRef)=>{
    if (newsRef.exists){
        document.getElementById("news").append(createNews(newsRef.data()));
    }else{
        document.getElementById("news").append(createNews({"title": "Not Found!","date": Date(),"body": "The page you are looking for could not be found."}));
    }
});