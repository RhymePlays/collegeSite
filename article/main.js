const artclID=new URLSearchParams(window.location.search).get("artclID");
const boardID=new URLSearchParams(window.location.search).get("boardID");
if (artclID && boardID){
    initPage({pageName: "Article"});
    db.collection(boardID).doc(artclID).get().then((artclRef)=>{
        if (artclRef.exists){
            document.getElementById("artclCont").append(createArticle(Object.assign(artclRef.data(), {artclID: artclID})));
        }else{
            document.getElementById("artclCont").append(createArticle({"title": "Not Found!","date": Date(),"body": "The page you are looking for could not be found."}));
        }
    });
}else{
    initPage({pageName: "404"});
    document.getElementById("artclCont").append(createArticle({"title": "Not Found!","date": Date(),"body": "The page you are looking for could not be found."}));
}