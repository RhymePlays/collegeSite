/* -------------------------------------------------- *\
|---         HELP RELATING THE Notice Box.          ---|

newsData = {
    title: "",
    date: 0,
    body: "",
    images: ["URL", "URL"]
}
createNews(navData)

ToDo: Expand images when clicked/tapped upon.
ToDo: Create the "Share" area. (Below Images)
ToDo: Implement something like **MarkDown** for innerText.

\* -------------------------------------------------- */
function createNews(ntcData){
    let ntcTtl = ce("div");
    ntcTtl.style.fontSize = "20px";
    ntcTtl.style.fontWeight = "600";
    ntcTtl.innerText = ntcData.title;
    
    let ntcdateBStr = ce("b");
    ntcdateBStr.style.fontWeight = "600";
    ntcdateBStr.innerText = "Date: "
    
    let ntcDateObj = new Date(ntcData.date);
    let ntcDate = ce("div");
    ntcDate.style.color = "var(--color10Tint)";
    ntcDate.style.fontSize = "14px";
    ntcDate.style.fontWeight = "400";
    ntcDate.style.marginTop = "8px";
    ntcDate.append(ntcdateBStr, `${ntcDateObj.getDate()}/${ntcDateObj.getMonth()}/${ntcDateObj.getFullYear()}`);
    
    let ntcTop = ce("div");
    ntcTop.style.color = "var(--color10)";
    ntcTop.style.padding = "12px";
    ntcTop.style.borderRadius = "18px 18px 0px 0px";
    ntcTop.style.backgroundColor = "#ffffff20";
    ntcTop.append(ntcTtl, ntcDate);
    
    let ntcBodyTxt = ce("div");
    ntcBodyTxt.innerText = ntcData.body; //ToDo: MarkDown

    let ntcImgSect = ce("div");
    if (typeof(ntcData.images) == "object"){
        let ntcImgCont = ce("div");
        ntcImgCont.style.display = "flex";
        ntcImgCont.style.overflowX = "auto";
        ntcImgCont.style.marginTop = "8px";

        for (index in ntcData.images){
            let ntcImg = ce("div");
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
        
        ntcImgSect.style.color = "var(--color10)";
        ntcImgSect.style.marginTop = "12px";
        ntcImgSect.style.paddingTop = "8px";
        ntcImgSect.style.fontSize = "20px";
        ntcImgSect.style.fontWeight = "600";
        
        // ntcImgSect.style.border = `3px solid ${color10}`;
        ntcImgSect.style.borderBottom = "0";
        ntcImgSect.style.borderLeft = "0";
        ntcImgSect.style.borderRight = "0";
        ntcImgSect.append("Images", ntcImgCont);
    }

    let ntcBody = ce("div");
    ntcBody.style.padding = "12px";
    ntcBody.append(ntcBodyTxt, ntcImgSect);

    let ntcCont = ce("div");
    // ntcCont.style.border = `solid ${color10} 2px`;
    // ntcCont.style.boxShadow = `${color10}80 0px 0px 40px 5px, ${color10}40 0px 0px 20px 0px, inset 0px 0px 20px 0px ${color10}60`;
    // ntcCont.style.background = color60Tint;
    ntcCont.style.margin = "15px";
    ntcCont.style.borderRadius = "18px";
    ntcCont.append(ntcTop, ntcBody);
    
    return ntcCont;
}