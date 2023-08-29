const boardID=new URLSearchParams(window.location.search).get("boardID");

// allArtcl
if (boardID){
    initPage({pageName: `${boardID} Board`});

    let allArtclIter = 0;
    let allArtclMaxIter = 99;
    let allArtclRange = 8;
    function popArtcl(from, to){
        document.getElementById("artclCont").innerHTML = "";
        db.collection(boardID).orderBy("date", "desc").get().then((artclColl)=>{
            allArtclMaxIter = Math.ceil(artclColl.size/allArtclRange)
            if (artclColl.size-1 <= from && from >= 0){
                let i = from;
                while (i < to){
                    if (typeof(artclColl.docs[i]) != "undefined"){
                        if (artclColl.docs[i].exists){document.getElementById("artclCont").append(createArticle(Object.assign(artclColl.docs[i].data(), {artclID: artclColl.docs[i].id})));}
                    }
                    i=i+1;
                }
            }
        });
    }
    function updateIterElem(){
        let iters = document.getElementsByClassName("NPIter");
        for (index in iters){iters[index].innerText = allArtclIter;}
    }
    function next(){
        if (allArtclIter < allArtclMaxIter){
            allArtclIter = allArtclIter + 1;
            popArtcl((allArtclRange*allArtclIter), (allArtclRange*allArtclIter)+allArtclRange);
            updateIterElem();
        }
    }
    function prev(){
        if (allArtclIter > 0){
            allArtclIter = allArtclIter - 1;
            popArtcl((allArtclRange*allArtclIter), (allArtclRange*allArtclIter)+allArtclRange);
            updateIterElem();
        }
    }
    
    
    popArtcl(0, allArtclRange);
    updateIterElem();
}else{
    initPage({pageName: `404`});
    document.getElementById("artclCont").append(createArticle({"title": "Not Found!","date": Date(),"body": "The page you are looking for could not be found."}));
}