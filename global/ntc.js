/* -------------------------------------------------- *\
|---         HELP RELATING THE Notice Box.          ---|

ntcData = {
    title: "",
    date: 0,
    body: "",
    images: ["URL", "URL"]
}
createNtc(navData)

ToDo: Expand images when clicked/tapped upon.
ToDo: Create the "Share" area. (Below Images)
ToDo: Implement something like **MarkDown** for innerText.

\* -------------------------------------------------- */

function createNtc(ntcData){
    let ntcTtl = document.createElement("div");
    ntcTtl.style.fontSize = "20px";
    ntcTtl.style.fontWeight = "600";
    ntcTtl.innerText = ntcData.title;
    
    let ntcdateBStr = document.createElement("b");
    ntcdateBStr.style.fontWeight = "600";
    ntcdateBStr.innerText = "Date: "
    
    let ntcDateObj = new Date(ntcData.date);
    let ntcDate = document.createElement("div");
    ntcDate.style.color = color30;
    ntcDate.style.fontSize = "14px";
    ntcDate.style.fontWeight = "400";
    ntcDate.style.marginTop = "8px";
    ntcDate.append(ntcdateBStr, `${ntcDateObj.getDate()}/${ntcDateObj.getMonth()}/${ntcDateObj.getFullYear()}`);
    
    let ntcTop = document.createElement("div");
    ntcTop.style.color = color10;
    ntcTop.style.padding = "12px";
    ntcTop.style.borderRadius = "18px 18px 0px 0px";
    ntcTop.style.backgroundColor = "#ffffff20";
    ntcTop.style.fontFamily = "Montserrat";
    ntcTop.append(ntcTtl, ntcDate);
    
    let ntcBodyTxt = document.createElement("div");
    ntcBodyTxt.innerText = ntcData.body; //ToDo: MarkDown

    let ntcImgSect = document.createElement("div");
    if (typeof(ntcData.images) == "object"){
        let ntcImgCont = document.createElement("div");
        ntcImgCont.style.display = "flex";
        ntcImgCont.style.overflowX = "auto";
        ntcImgCont.style.marginTop = "8px";

        for (index in ntcData.images){
            let ntcImg = document.createElement("div");
            ntcImg.style.cursor = "pointer";
            ntcImg.style.minHeight = "140px";
            ntcImg.style.maxHeight = "140px";
            ntcImg.style.minWidth = "250px";
            ntcImg.style.maxWidth = "250px";
            ntcImg.style.marginRight = "10px";
            ntcImg.style.marginBottom = "5px";
            ntcImg.style.borderRadius = "10px";
            ntcImg.style.background = "#ffffff60";

            ntcImg.style.background = `url("${ntcData.images[index]}")`;
            ntcImg.style.backgroundRepeat = "no-repeat";
            ntcImg.style.backgroundPosition = "center";
            ntcImg.style.backgroundSize = "cover";
            ntcImg.style.border = `${color10}80 solid 2px`;

            ntcImgCont.append(ntcImg);
        }
        
        ntcImgSect.style.color = color10;
        ntcImgSect.style.marginTop = "12px";
        ntcImgSect.style.paddingTop = "8px";
        ntcImgSect.style.fontSize = "20px";
        ntcImgSect.style.fontWeight = "600";
        ntcImgSect.style.fontFamily = "Montserrat";
        
        ntcImgSect.style.border = `3px solid ${color10}`;
        ntcImgSect.style.borderBottom = "0";
        ntcImgSect.style.borderLeft = "0";
        ntcImgSect.style.borderRight = "0";
        ntcImgSect.append("Images", ntcImgCont);
    }

    let ntcBody = document.createElement("div");
    ntcBody.style.padding = "12px";
    ntcBody.append(ntcBodyTxt, ntcImgSect);

    let ntcCont = document.createElement("div");
    ntcCont.style.border = `solid ${color10} 2px`;
    ntcCont.style.boxShadow = `${color10}80 0px 0px 40px 5px, ${color10}40 0px 0px 20px 0px, inset 0px 0px 20px 0px ${color10}60`;
    ntcCont.style.background = colorObjBG;
    ntcCont.style.margin = "15px";
    ntcCont.style.borderRadius = "18px";
    ntcCont.append(ntcTop, ntcBody);
    
    console.log(ntcCont);

    return ntcCont;
}