initPage({
    pageName: "Administration",
    extraCSS: `
    @media only screen and (max-width: ${mobileUiThreshold}px){

    }`
});

// Main
let allPrsnCardCont = document.getElementById("allPrsnCardCont");
db.collection("siteData").doc("people").get().then((peopleRef)=>{
    allPrsnCardCont.innerHTML = "";
    peopleDocData = peopleRef.data();
    for (index in peopleDocData.allPeople){
        allPrsnCardCont.append(createPrsnCard(peopleDocData.allPeople[index]));
    }
});