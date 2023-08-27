initPage({
    pageName: "All News",
    subNavImage: "/logo.png",
    extraCSS: `
    @media only screen and (max-width: ${mobileUiThreshold}px){

    }`
});


// allNews
let allNewsIter = 0;
let allNewsMaxIter = 99;
let allNewsRange = 8;
function popNews(from, to){
    document.getElementById("news").innerHTML = "";
    db.collection("news").orderBy("date", "desc").get().then((newsColl)=>{
        allNewsMaxIter = Math.ceil(newsColl.size/allNewsRange)
        console.log(newsColl.size-1, from);
        if (newsColl.size-1 <= from && from >= 0){
            let i = from;
            while (i < to){
                if (typeof(newsColl.docs[i]) != "undefined"){
                    if (newsColl.docs[i].exists){document.getElementById("news").append(createNews(newsColl.docs[i].data()));}
                }
                i=i+1;
            }
        }
    });
}
function updateIterElem(){
    let iters = document.getElementsByClassName("NPIter");
    for (index in iters){iters[index].innerText = allNewsIter;}
}
function next(){
    if (allNewsIter < allNewsMaxIter){
        allNewsIter = allNewsIter + 1;
        popNews((allNewsRange*allNewsIter), (allNewsRange*allNewsIter)+allNewsRange);
        updateIterElem();
    }
}
function prev(){
    if (allNewsIter > 0){
        allNewsIter = allNewsIter - 1;
        popNews((allNewsRange*allNewsIter), (allNewsRange*allNewsIter)+allNewsRange);
        updateIterElem();
    }
}


popNews(0, allNewsRange);
updateIterElem();