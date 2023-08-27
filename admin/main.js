// Common
initPage({
    pageName: "Admin Page",
    extraCSS: `
    @media only screen and (max-width: ${mobileUiThreshold}px){

    }`
});

// Post News
let newsTtlIO = document.getElementById("newsTtlIO");
let newsDateIO = document.getElementById("newsDateIO");
let newsBodyIO = document.getElementById("newsBodyIO");
let newsImages = [];
let newsBoardIO = document.getElementById("newsBoardIO");
let newsImgCont = document.getElementById("newsImgCont");

function newsSetDate(){newsDateIO.value = new Date().toISOString().split(".")[0]}
function newsImgContUpdate(){
    newsImgCont.innerHTML = "";
    for (index in newsImages){
        newsImgCont.append(ce("img", {src: newsImages[index], imgID: index, onclick: function(){newsImages.splice(this.imgID, 1);newsImgContUpdate();}}));
    }
}
function addNewsImgLink(){
    createOP("Add Image Link", ce("div", {}, [
        ce("input", {id: "tempURLIO", placeholder: "URL"}),
        ce("div", {className: "rBtn", style: "margin-top: 10px", innerText: "Add", onclick: function(){
            let link=document.getElementById("tempURLIO").value;
            if(link.length > 0){newsImages.push(link);newsImgContUpdate();document.getElementById("overPage").style.display = "none";}
        }})
    ]));
}
function addNewsImgFile(){
    newsImages.push();
    newsImgContUpdate();
}
function newsPost(){
    let newsData = {
        title: newsTtlIO.value,
        date: new Date(newsDateIO.value).getTime(),
        body: newsBodyIO.value,
        images: newsImages
    }

    if (newsBoardIO.value && newsData.title && newsData.date && newsData.body){
        db.collection(newsBoardIO.value).add(newsData).then((newsRef)=>{
            createOP("Success", ce("div", {style: "display:flex;flex-direction:column;"}, [
                ce("div", {style: "display:flex;align-items:center;margin-bottom:20px;"}, [matSym("check_circle", {style: "margin-right:5px"}), "News Posted Successfully!"]),
                ce("div", {}, [`News Board: ${newsBoardIO.value}`]),
                ce("div", {}, [`News ID: ${newsRef.id}`])
            ]));
            
            // Add to CommonDB
            if (newsBoardIO.value == "news"){
                newsData = Object.assign(newsData, {newsID: newsRef.id})
                db.collection("siteData").doc("common").get().then((commonRef)=>{
                    let commonData = commonRef.data();
                    if(commonData != undefined){
                        if ("newsSnippet" in commonData){
                            if (commonData.newsSnippet.length >= 10){commonData.newsSnippet.pop();}
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
                });
            }

        });
    }
}
newsSetDate();newsImgContUpdate();

// Delete News
function newsDel(){
    let newsDelIDIO = document.getElementById("newsDelIDIO");
    let newsDelBoardIO = document.getElementById("newsDelBoardIO");
    
    if (newsDelBoardIO.value && newsDelIDIO.value){
        createOP("Done", ce("div", {style: "display:flex;flex-direction:column;"}, [
            ce("div", {style: "display:flex;align-items:center;"}, [matSym("delete", {style: "margin-right:5px"}), "News Deletion Invoked!"]),
            ce("div", {style: "margin-bottom:20px;"}, ["News will be removed if found."]),
            ce("div", {}, [`News Board: ${newsDelBoardIO.value}`]),
            ce("div", {}, [`News ID: ${newsDelIDIO.value}`])
        ]));

        db.collection(newsDelBoardIO.value).doc(newsDelIDIO.value).delete();

        // Remove from CommonDB
        if (newsDelBoardIO.value == "news"){
            db.collection("siteData").doc("common").get().then((commonRef)=>{
                let commonDBDataLatest = commonRef.data();
                let hasChanged = false;
                for (index in commonDBDataLatest.newsSnippet){
                    if (commonDBDataLatest.newsSnippet[index].newsID == newsDelIDIO.value){
                        commonDBDataLatest.newsSnippet.splice(index, 1);
                        hasChanged = true;
                    };
                }
                if (hasChanged){db.collection("siteData").doc("common").set(commonDBDataLatest);}
            });
        }
    }
}



// Add Photos
let addPhotosImages = [];
let photoAddImgCont = document.getElementById("photoAddImgCont");

function photosImgContUpdate(){
    photoAddImgCont.innerHTML = "";
    for (index in addPhotosImages){
        photoAddImgCont.append(ce("img", {src: addPhotosImages[index], imgID: index, onclick: function(){addPhotosImages.splice(this.imgID, 1);photosImgContUpdate();}}));
    }
}
function addPhotoImgLink(){
    createOP("Add Image Link", ce("div", {}, [        
        ce("input", {id: "tempURLIO", placeholder: "URL"}),
        ce("div", {className: "rBtn", style: "margin-top: 10px", innerText: "Add", onclick: function(){
            let link=document.getElementById("tempURLIO").value;
            if(link.length > 0){addPhotosImages.push(link);photosImgContUpdate();document.getElementById("overPage").style.display = "none";}
        }})
    ]));
}
function photoAdd(){
    if (addPhotosImages.length > 0){
        let retVal = [];
        for (index in addPhotosImages){
            retVal.unshift({
                url: addPhotosImages[index],
                imgID: `${(new Date().getTime()).toString(16).toUpperCase()}${(Math.floor(Math.random() * 10000)).toString(16).toUpperCase()}_${index}`,
                date: new Date().getTime(),
                caption: document.getElementById("photoAddCaptIO").value
            });
        }
    
        db.collection("siteData").doc("photos").get().then((photosRef)=>{
            let photosDocData = photosRef.data();
            if(photosDocData != undefined){
                if ("allPhotos" in photosDocData){
                    if (document.getElementById("phtoOrderIO").value=="front"){
                        for(index in retVal){photosDocData.allPhotos.unshift(retVal[index]);}
                    }else{
                        let rvrstRetVal = [];for(index in retVal){rvrstRetVal.unshift(retVal[index]);}
                        for (index in rvrstRetVal){photosDocData.allPhotos.push(rvrstRetVal[index]);}
                    }
                    db.collection("siteData").doc("photos").set(photosDocData);
                }
                else{
                    photosDocData["allPhotos"] = [];
                    for (index in retVal){photosDocData.allPhotos.unshift(retVal[index]);}
                    db.collection("siteData").doc("photos").set(photosDocData);
                }
            }else{
                let setVal = [];
                for (index in retVal){setVal.unshift(retVal[index]);}
                db.collection("siteData").doc("photos").set({allPhotos: setVal});
            }

            createOP("Success", ce("div", {style: "display:flex;flex-direction:column;align-items:center;justify-content:center;"}, [
                matSym("check_circle", {style: "margin-bottom:5px"}), ce("div", {}, ["Photo Successfully Added!"]),
            ]));
        });
    }
}
function photoDel(delPhotoID=undefined){
    let delPhotoIDIO = delPhotoID || document.getElementById("delPhotoIDIO").value;
    if (delPhotoIDIO){
        db.collection("siteData").doc("photos").get().then((photosRef)=>{
            let photosDocData = photosRef.data();
            let hasChanged = false;
            for (index in photosDocData.allPhotos){
                if (photosDocData.allPhotos[index].imgID == delPhotoIDIO){
                    photosDocData.allPhotos.splice(index, 1);
                    hasChanged = true;
                };
            }
            if (hasChanged){
                db.collection("siteData").doc("photos").set(photosDocData);
                setTimeout(()=>{pinnedPhtoDel(delPhotoIDIO);}, 2000);
                createOP("Success", ce("div", {style: "display:flex;flex-direction:column;align-items:center;justify-content:center;"}, [
                    matSym("check_circle", {style: "margin-bottom:5px"}), ce("div", {}, ["Photo Successfully Removed!"]),
                ]));
            }
        });
    }
}

// Pin Photo
function pinnedPhtoAdd(){
    let pinnedPhtoAddIDIO=document.getElementById("pinnedPhtoAddIDIO");
    let maxPinnedPhtoCount=30;
    if(pinnedPhtoAddIDIO.value){
        db.collection("siteData").doc("photos").get().then((photosRef)=>{
            let photosDocData=photosRef.data();
            for(index in photosDocData.allPhotos){
                if(photosDocData.allPhotos[index].imgID==pinnedPhtoAddIDIO.value){
                    let phtoData = photosDocData.allPhotos[index];
                    db.collection("siteData").doc("common").get().then((commonRef)=>{
                        let commonData = commonRef.data();
                        if(commonData != undefined){
                            if ("pinnedPhotos" in commonData){
                                for (index2 in commonData.pinnedPhotos){
                                    if (commonData.pinnedPhotos[index2].imgID == pinnedPhtoAddIDIO.value){
                                        commonData.pinnedPhotos.splice(index2, 1);break;
                                    };
                                }
                                if(document.getElementById("pinnedPhtoOrderIO").value=="front"){
                                    if (commonData.pinnedPhotos.length >= maxPinnedPhtoCount){commonData.pinnedPhotos.pop();}
                                    commonData.pinnedPhotos.unshift(phtoData);
                                }else{
                                    if (commonData.pinnedPhotos.length >= maxPinnedPhtoCount){commonData.pinnedPhotos.splice(0,1);}
                                    commonData.pinnedPhotos.push(phtoData);
                                }
                                db.collection("siteData").doc("common").set(commonData);
                            }
                            else{
                                commonData["pinnedPhotos"] = [phtoData];
                                db.collection("siteData").doc("common").set(commonData);
                            }
                        }else{
                            db.collection("siteData").doc("common").set({pinnedPhotos: [phtoData]});
                        }
                        createOP("Success", ce("div", {style: "display:flex;flex-direction:column;align-items:center;justify-content:center;"}, [
                            matSym("check_circle", {style: "margin-bottom:5px"}), ce("div", {}, ["Photo Successfully Pinned!"]),
                        ]));
                    });

                }
            }

        });        
    }
}
function pinnedPhtoDel(pinnedPhtoDelID=undefined){
    let pinnedPhtoDelIDIO=pinnedPhtoDelID || document.getElementById("pinnedPhtoDelIDIO").value;
    if (pinnedPhtoDelIDIO){
        db.collection("siteData").doc("common").get().then((commonRef)=>{
            let commonData = commonRef.data();
            let hasChanged = false;
            for (index in commonData.pinnedPhotos){
                if (commonData.pinnedPhotos[index].imgID == pinnedPhtoDelIDIO){
                    commonData.pinnedPhotos.splice(index, 1);
                    hasChanged = true;
                };
            }
            if (hasChanged){
                db.collection("siteData").doc("common").set(commonData);
                createOP("Success", ce("div", {style: "display:flex;flex-direction:column;align-items:center;justify-content:center;"}, [
                    matSym("check_circle", {style: "margin-bottom:5px"}), ce("div", {}, ["Photo Successfully Unpinned!"]),
                ]));
            }
        });
    }
}

// Add Person
let prsnAddImages = [];
let prsnAddImgCont = document.getElementById("prsnAddImgCont");
let prsnAddNameIO = document.getElementById("prsnAddNameIO");
let prsnAddPostIO = document.getElementById("prsnAddPostIO");
let prsnAddBodyIO = document.getElementById("prsnAddBodyIO");

function prsnImgContUpdate(){
    prsnAddImgCont.innerHTML = "";
    for (index in prsnAddImages){
        prsnAddImgCont.append(ce("img", {src: prsnAddImages[index], imgID: index, onclick: function(){prsnAddImages.splice(this.imgID, 1);prsnImgContUpdate();}}));
    }
}
function addPrsnImgLink(){
    createOP("Add Image Link", ce("div", {}, [        
        ce("input", {id: "tempURLIO", placeholder: "URL"}),
        ce("div", {className: "rBtn", style: "margin-top: 10px", innerText: "Add", onclick: function(){
            let link=document.getElementById("tempURLIO").value;
            if(link.length > 0){prsnAddImages.push(link);prsnImgContUpdate();document.getElementById("overPage").style.display = "none";}
        }})
    ]));
}
function prsnAdd(){
    if ((prsnAddImages.length > 0) && prsnAddNameIO.value && prsnAddPostIO.value && prsnAddBodyIO.value){
        prsnData = {
            prsnID: `${(new Date().getTime()).toString(16).toUpperCase()}_${(Math.floor(Math.random() * 10000)).toString(16).toUpperCase()}`,
            name: prsnAddNameIO.value,
            post: prsnAddPostIO.value,
            image: prsnAddImages[0],
            body: prsnAddBodyIO.value
        }
    
        db.collection("siteData").doc("people").get().then((peopleRef)=>{
            let peopleDocData = peopleRef.data();
            if(peopleDocData != undefined){
                if ("allPeople" in peopleDocData){
                    if (document.getElementById("prsnAddOrderIO").value=="front"){
                        peopleDocData.allPeople.unshift(prsnData);
                    }else{
                        peopleDocData.allPeople.push(prsnData);
                    }
                    db.collection("siteData").doc("people").set(peopleDocData);
                }
                else{
                    peopleDocData["allPeople"] = [prsnData];
                    db.collection("siteData").doc("people").set(peopleDocData);
                }
            }else{
                db.collection("siteData").doc("people").set({allPeople: [prsnData]});
            }

            createOP("Success", ce("div", {style: "display:flex;flex-direction:column;align-items:center;justify-content:center;"}, [
                matSym("check_circle", {style: "margin-bottom:5px"}), ce("div", {}, ["Person Successfully Added!"]), ce("div", {}, [`Person ID: ${prsnData.prsnID}`])
            ]));
        });
    }
}
function prsnDel(prsnDelID=undefined){
    let prsnDelIDIO = prsnDelID || document.getElementById("prsnDelIDIO").value;

    if (prsnDelIDIO){
        db.collection("siteData").doc("people").get().then((peopleRef)=>{
            let peopleDocData = peopleRef.data();
            let hasChanged = false;
            for (index in peopleDocData.allPeople){
                if (peopleDocData.allPeople[index].prsnID == prsnDelIDIO){
                    peopleDocData.allPeople.splice(index, 1);
                    hasChanged = true;
                };
            }
            if (hasChanged){
                db.collection("siteData").doc("people").set(peopleDocData);
                setTimeout(()=>{pinnedPrsnDel(prsnDelIDIO);}, 2000);
                createOP("Success", ce("div", {style: "display:flex;flex-direction:column;align-items:center;justify-content:center;"}, [
                    matSym("check_circle", {style: "margin-bottom:5px"}), ce("div", {}, ["Person Successfully Removed!"]),
                ]));
            }
        });
    }
}

// Pin Person
function pinnedPrsnAdd(){
    let pinnedPrsnAddIDIO=document.getElementById("pinnedPrsnAddIDIO");
    let maxPinnedPrsnCount = 30;
    if(pinnedPrsnAddIDIO.value){
        db.collection("siteData").doc("people").get().then((peopleRef)=>{
            let peopleDocData=peopleRef.data();
            for(index in peopleDocData.allPeople){
                if(peopleDocData.allPeople[index].prsnID==pinnedPrsnAddIDIO.value){
                    let prsnData = peopleDocData.allPeople[index];
                    db.collection("siteData").doc("common").get().then((commonRef)=>{

                        let commonData = commonRef.data();
                        if(commonData != undefined){
                            if ("pinnedPeople" in commonData){
                                for (index2 in commonData.pinnedPeople){
                                    if (commonData.pinnedPeople[index2].prsnID == pinnedPrsnAddIDIO.value){
                                        commonData.pinnedPeople.splice(index2, 1);break;
                                    };
                                }
                                if(document.getElementById("pinnedPrsnOrderIO").value=="front"){
                                    if (commonData.pinnedPeople.length >= maxPinnedPrsnCount){commonData.pinnedPeople.pop();}
                                    commonData.pinnedPeople.unshift(prsnData);
                                }else{
                                    if (commonData.pinnedPeople.length >= maxPinnedPrsnCount){commonData.pinnedPeople.splice(0,1);}
                                    commonData.pinnedPeople.push(prsnData);
                                }
                                db.collection("siteData").doc("common").set(commonData);
                            }
                            else{
                                commonData["pinnedPeople"] = [prsnData];
                                db.collection("siteData").doc("common").set(commonData);
                            }
                        }else{
                            db.collection("siteData").doc("common").set({pinnedPeople: [prsnData]});
                        }
                        createOP("Success", ce("div", {style: "display:flex;flex-direction:column;align-items:center;justify-content:center;"}, [
                            matSym("check_circle", {style: "margin-bottom:5px"}), ce("div", {}, ["Person Successfully Pinned!"]),
                        ]));

                    });

                }
            }

        });        
    }
}
function pinnedPrsnDel(pinnedPrsnDelID=undefined){
    let pinnedPrsnDelIDIO=pinnedPrsnDelID || document.getElementById("pinnedPrsnDelIDIO").value;
    if (pinnedPrsnDelIDIO){
        db.collection("siteData").doc("common").get().then((commonRef)=>{
            let commonData = commonRef.data();
            let hasChanged = false;
            for (index in commonData.pinnedPeople){
                if (commonData.pinnedPeople[index].prsnID == pinnedPrsnDelIDIO){
                    commonData.pinnedPeople.splice(index, 1);
                    hasChanged = true;
                };
            }
            if (hasChanged){
                db.collection("siteData").doc("common").set(commonData);
                createOP("Success", ce("div", {style: "display:flex;flex-direction:column;align-items:center;justify-content:center;"}, [
                    matSym("check_circle", {style: "margin-bottom:5px"}), ce("div", {}, ["Person Successfully Unpinned!"]),
                ]));
            }
        });
    }
}

// Short Description
function shrtDescUpdt(){
    let shrtDescIO=document.getElementById("shrtDescIO").value;
    if(shrtDescIO){
        db.collection("siteData").doc("common").get().then((commonRef)=>{
            let commonData = commonRef.data();
            if(commonData != undefined){
                commonData["shortDescription"] = shrtDescIO;
                db.collection("siteData").doc("common").set(commonData);
            }else{
                db.collection("siteData").doc("common").set({shortDescription: shrtDescIO});
            }
            createOP("Success", ce("div", {style: "display:flex;flex-direction:column;align-items:center;justify-content:center;"}, [
                matSym("check_circle", {style: "margin-bottom:5px"}), ce("div", {}, ["Short Description Updated!"]),
            ]));
        });
    }
}

// Site Stuff
function siteNameUpdt(){
    let siteNameIO=document.getElementById("siteNameIO").value;
    if(siteNameIO){
        db.collection("siteData").doc("common").get().then((commonRef)=>{
            let commonData = commonRef.data();
            if(commonData != undefined){
                commonData["siteName"] = siteNameIO;
                db.collection("siteData").doc("common").set(commonData);
            }else{
                db.collection("siteData").doc("common").set({siteName: siteNameIO});
            }
            createOP("Success", ce("div", {style: "display:flex;flex-direction:column;align-items:center;justify-content:center;"}, [
                matSym("check_circle", {style: "margin-bottom:5px"}), ce("div", {}, ["Site Name Updated!"]),
            ]));
        });
    }
}
function colorUpdt(){
    let c10IO=document.getElementById("c10IO").value;
    let c10TintIO=document.getElementById("c10TintIO").value;
    let c30IO=document.getElementById("c30IO").value;
    let c30ShadeIO=document.getElementById("c30ShadeIO").value;
    let c60IO=document.getElementById("c60IO").value;
    let c60TintIO=document.getElementById("c60TintIO").value;
    let cGreenIO=document.getElementById("cGreenIO").value;

    if(c10IO && c10TintIO && c30IO && c30ShadeIO && c60IO && c60TintIO && cGreenIO){
        let colors = {
            color10: c10IO,
            color10Tint: c10TintIO,
            color30: c30IO,
            color30Shade: c30ShadeIO,
            color60: c60IO,
            color60Tint: c60TintIO,
            colorGreen: cGreenIO
        }
        db.collection("siteData").doc("common").get().then((commonRef)=>{
            let commonData = commonRef.data();
            if(commonData != undefined){
                commonData["colors"] = colors;
                db.collection("siteData").doc("common").set(commonData);
            }else{
                db.collection("siteData").doc("common").set({colors: colors});
            }
            createOP("Success", ce("div", {style: "display:flex;flex-direction:column;align-items:center;justify-content:center;"}, [
                matSym("check_circle", {style: "margin-bottom:5px"}), ce("div", {}, ["Colors Updated!"]),
            ]));
        });
    }
}