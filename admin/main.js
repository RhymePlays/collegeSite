// Appwrite
let awURL = `https://[REGION].cloud.appwrite.io/v1`;
let awID = '';
const aw = new Appwrite.Client();
aw.setEndpoint(awURL);
aw.setProject(awID);
awAcc = new Appwrite.Account(aw); // mainUser
awStg = new Appwrite.Storage(aw); // mainBucket

// Common
initPage({
    pageName: "Admin Page",
    extraCSS: `
    @media only screen and (max-width: ${mobileUiThreshold}px){

    }`,
    onCommonLoad: function(){
        artclSetBoards();
        tempNavData = commonDBData.navData || navData;navUpdater();
        tempFtrData = commonDBData.ftrData || ftrData;ftrUpdater();
    }
});


// Sign In
function askToSignIn(){
    document.getElementById("adminControls").style.display = "none";
    createOP("Sign In", ce("div", {style: "display:flex;flex-direction:column;"}, [
        ce("form", {style: "display:flex;flex-direction:column;"}, [
            ce("input", {id: "signInEmailIO", placeholder: "Email", type: "email"}),
            ce("input", {id: "signInPassIO", placeholder: "Password", type: "password", style: "margin-top: 10px"})
        ]),
        ce("div", {className: "rBtn", style: "margin-top: 10px", innerText: "Sign In", onclick: function(){
            let signInEmail=document.getElementById("signInEmailIO").value;
            let signInPass=document.getElementById("signInPassIO").value;
            if(signInEmail.length > 0 && signInPass.length > 0){
                document.getElementById("overPage").style.display = "none";
    
                firebase.auth().signInWithEmailAndPassword(signInEmail, signInPass).then(async (arg)=>{
                    document.getElementById("adminControls").style.display = "block";
                    try{
                        await awAcc.get();
                    }catch(e){
                        awAcc.createEmailPasswordSession(signInEmail, signInPass);
                    }
                }).catch((e)=>{
                    createOP("Error!", ce("div", {}, ["Failed to Sign In!"]));
                });
            }
        }})
    ]));
}askToSignIn();


// Post Artcl
let artclTtlIO = document.getElementById("artclTtlIO");
let artclDateIO = document.getElementById("artclDateIO");
let artclBodyIO = document.getElementById("artclBodyIO");
let artclImages = [];
let artclBoardIO = document.getElementById("artclBoardIO");
let artclImgCont = document.getElementById("artclImgCont");

function artclSetBoards(){
    // Sets Board Info for 3 Fields: Add Article, Delete Article, Delete Board
    let boardIDsCopy = commonDBData.boardIDs;

    let boardOpenIDIO = document.getElementById("boardOpenIDIO");
    let boardDelIDIO = document.getElementById("boardDelIDIO");
    let artclDelBoardIO = document.getElementById("artclDelBoardIO");
    let artclBoardIO = document.getElementById("artclBoardIO");

    boardOpenIDIO.innerHTML = "";boardDelIDIO.innerHTML = "";artclDelBoardIO.innerHTML = "";artclBoardIO.innerHTML = "";

    if (boardIDsCopy == undefined){boardIDsCopy = []}
    if (boardIDsCopy.includes("About") == false){boardIDsCopy.unshift("About");}
    if (boardIDsCopy.includes("Notice") == false){boardIDsCopy.unshift("Notice");}

    for(i in boardIDsCopy){
        let boardID = boardIDsCopy[i];
        boardOpenIDIO.append(ce("option", {value: boardID}, [boardID]));
        boardDelIDIO.append(ce("option", {value: boardID}, [boardID]));
        artclDelBoardIO.append(ce("option", {value: boardID}, [boardID]));
        artclBoardIO.append(ce("option", {value: boardID}, [boardID]));
    }
}
function artclSetDate(){artclDateIO.value = new Date().toISOString().split(".")[0]}
function artclImgContUpdate(){
    artclImgCont.innerHTML = "";
    for (i in artclImages){
        artclImgCont.append(ce("img", {
            src: artclImages[i].url,
            imgID: i,
            onclick: function(){
                if (artclImages[this.imgID].bID){awStg.deleteFile(artclImages[this.imgID].bID, artclImages[this.imgID].fID)};
                artclImages.splice(this.imgID, 1);
                artclImgContUpdate();
            }
        }));
    }
}
function addArtclImgLink(){
    createOP("Add Image Link", ce("div", {}, [
        ce("input", {id: "tempURLIO", placeholder: "URL"}),
        ce("div", {className: "rBtn", style: "margin-top: 10px", innerText: "Add", onclick: function(){
            let link=document.getElementById("tempURLIO").value;
            if(link.length > 0){artclImages.push({url: link, bID: false});artclImgContUpdate();document.getElementById("overPage").style.display = "none";}
        }})
    ]));
}
function addArtclImgFile(){
    ce("input", {type: "file", multiple: "true", accept: ".png,.jpg,.jpeg,.webp", onchange: function(inputArg){
        let imgFiles = inputArg.target.files;
        for (i in imgFiles){
            if(typeof(imgFiles[i]) == "object"){
                awStg.createFile("mainBucket", `a-${(new Date().getTime()).toString(30).toUpperCase()}${(Math.floor(Math.random() * 10000)).toString(16).toUpperCase()}_${i}`, imgFiles[i]).then((awFile)=>{
                    let url = `${awURL}/storage/buckets/${awFile.bucketId}/files/${awFile.$id}/view?project=${awID}`;
                    artclImages.push({url: url, bID: awFile.bucketId, fID: awFile.$id});
                    artclImgContUpdate();
                });
            }
        }
    }}).click();
}
function artclPost(){
    let imageUrls = [];
    let storageDependencies = [];
    for (i in artclImages){
        imageUrls.push(artclImages[i].url);
        if (artclImages[i].bID){storageDependencies.push({bID: artclImages[i].bID, fID: artclImages[i].fID});}
    }

    let artclData = {
        title: artclTtlIO.value,
        boardID: artclBoardIO.value,
        date: new Date(artclDateIO.value).getTime(),
        body: function (){let returnVal="";artclBodyIO.value.split("\n").forEach((line) => {returnVal=returnVal+line+"  \n"});return returnVal}(),
        images: imageUrls,
        storageDeps: storageDependencies
    }
    artclImages=[];artclImgContUpdate();

    if (artclBoardIO.value && artclData.title && artclData.date && artclData.body && artclBoardIO.value!="siteData"){
        db.collection(artclBoardIO.value).add(artclData).then((artclRef)=>{
            createOP("Success", ce("div", {style: "display:flex;flex-direction:column;"}, [
                ce("div", {style: "display:flex;align-items:center;margin-bottom:20px;"}, [matSym("check_circle", {style: "margin-right:5px"}), "Article Posted Successfully!"]),
                ce("div", {}, [`Article Board: ${artclBoardIO.value}`]),
                ce("div", {}, [`Article ID: ${artclRef.id}`]),
                ce("div", {
                    style: "text-decoration: underline;cursor: pointer;",
                    onclick: function(){window.open(`/article/?boardID=${artclBoardIO.value}&artclID=${artclRef.id}`, target="_blank");}
                }, [
                    `Article URL: "/article/?boardID=${artclBoardIO.value}&artclID=${artclRef.id}"`
                ])
            ]));
            
            // Add to CommonDB
            if (artclBoardIO.value == "Notice"){
                artclData = Object.assign(artclData, {artclID: artclRef.id})
                db.collection("siteData").doc("common").get().then((commonRef)=>{
                    let commonData = commonRef.data();
                    if(commonData != undefined){
                        if ("noticeSnippet" in commonData){
                            if (commonData.noticeSnippet.length >= 10){commonData.noticeSnippet.pop();}
                            commonData.noticeSnippet.unshift(artclData);
                            db.collection("siteData").doc("common").set(commonData);
                        }
                        else{
                            commonData["noticeSnippet"] = [artclData];
                            db.collection("siteData").doc("common").set(commonData);
                        }
                    }else{
                        db.collection("siteData").doc("common").set({noticeSnippet: [artclData]});
                    }
                });
            }

        });
    }
}
artclSetDate();artclImgContUpdate();

// Delete Artcl
function artclDel(){
    let artclDelIDIO = document.getElementById("artclDelIDIO");
    let artclDelBoardIO = document.getElementById("artclDelBoardIO");
    
    if (artclDelBoardIO.value && artclDelIDIO.value){
        db.collection(artclDelBoardIO.value).doc(artclDelIDIO.value).get().then((artclRef)=>{
            if(artclRef.exists){
                let deps = artclRef.data().storageDeps;
                db.collection(artclDelBoardIO.value).doc(artclDelIDIO.value).delete();
                for (depIndex in deps){
                    awStg.deleteFile(deps[depIndex].bID, deps[depIndex].fID);
                }

                createOP("Done", ce("div", {style: "display:flex;flex-direction:column;"}, [
                    ce("div", {style: "display:flex;align-items:center;margin-bottom:20px;"}, [matSym("delete", {style: "margin-right:5px"}), "Article Deleted Successfully!"]),
                    ce("div", {}, [`Article Board: ${artclDelBoardIO.value}`]),
                    ce("div", {}, [`Article ID: ${artclDelIDIO.value}`])
                ]));

                // Remove from CommonDB
                if (artclDelBoardIO.value == "Notice"){
                    db.collection("siteData").doc("common").get().then((commonRef)=>{
                        let commonDBDataLatest = commonRef.data();
                        let hasChanged = false;
                        for (i in commonDBDataLatest.noticeSnippet){
                            if (commonDBDataLatest.noticeSnippet[i].artclID == artclDelIDIO.value){
                                commonDBDataLatest.noticeSnippet.splice(i, 1);
                                hasChanged = true;
                            };
                        }
                        if (hasChanged){db.collection("siteData").doc("common").set(commonDBDataLatest);}
                    });
                }
            }
        });
    }
}


// Add Board
function boardAdd(){
    let boardAddIDIO = document.getElementById("boardAddIDIO");

    if (boardAddIDIO.value && boardAddIDIO.value!="siteData"){
        db.collection(boardAddIDIO.value).add({}).then(()=>{
            db.collection("siteData").doc("common").get().then((commonRef)=>{
                let commonData = commonRef.data();
                if(commonData != undefined){
                    if ("boardIDs" in commonData){
                        if (commonData.boardIDs.includes(boardAddIDIO.value) == false){commonData.boardIDs.push(boardAddIDIO.value)}
                        db.collection("siteData").doc("common").set(commonData);
                    }
                    else{
                        commonData["boardIDs"] = [boardAddIDIO.value];
                        db.collection("siteData").doc("common").set(commonData);
                    }
                }else{
                    db.collection("siteData").doc("common").set({boardIDs: [boardAddIDIO.value]});
                }
                commonDBData = commonData;artclSetBoards();
            });
            
            createOP("Success", ce("div", {style: "display:flex;flex-direction:column;"}, [
                ce("div", {style: "display:flex;align-items:center;margin-bottom:20px;"}, [matSym("check_circle", {style: "margin-right:5px"}), "Board Added Successfully!"]),
                ce("div", {}, [`Board: ${boardAddIDIO.value}`]),
                ce("div", {
                    style: "text-decoration: underline;cursor: pointer;",
                    onclick: function(){window.open(`/allArticle/?boardID=${boardAddIDIO.value}`, target="_blank");}
                }, [
                    `Board URL: "/allArticle/?boardID=${boardAddIDIO.value}"`
                ])
            ]));
        });
    }
}
function boardDel(){
    let boardDelIDIO = document.getElementById("boardDelIDIO");

    db.collection("siteData").doc("common").get().then((commonRef)=>{
        let commonDBDataLatest = commonRef.data();
        let hasChanged = false;
        for (i in commonDBDataLatest.boardIDs){
            if (commonDBDataLatest.boardIDs[i] == boardDelIDIO.value){
                commonDBDataLatest.boardIDs.splice(i, 1);
                hasChanged = true;
            };
        }
        if (hasChanged){db.collection("siteData").doc("common").set(commonDBDataLatest);}
        commonDBData = commonDBDataLatest;artclSetBoards();
    });

    window.open("https://console.firebase.google.com", target="_blank");
}
function boardOpen(){
    let boardOpenIDIO = document.getElementById("boardOpenIDIO");
    
    window.open(`/allArticle/?boardID=${boardOpenIDIO.value}`, target="_blank");
}



// Add Photos
let addPhotosImages = [];
let photoAddImgCont = document.getElementById("photoAddImgCont");

function photosImgContUpdate(){
    photoAddImgCont.innerHTML = "";
    for (i in addPhotosImages){
        photoAddImgCont.append(ce("img", {
            src: addPhotosImages[i].url,
            imgID: i,
            onclick: function(){
                if (addPhotosImages[this.imgID].bID){awStg.deleteFile(addPhotosImages[this.imgID].bID, addPhotosImages[this.imgID].fID)};
                addPhotosImages.splice(this.imgID, 1);
                photosImgContUpdate();
            }
        }));
    }
}
function addPhotoImgLink(){
    createOP("Add Image Link", ce("div", {}, [        
        ce("input", {id: "tempURLIO", placeholder: "URL"}),
        ce("div", {className: "rBtn", style: "margin-top: 10px", innerText: "Add", onclick: function(){
            let link=document.getElementById("tempURLIO").value;
            if(link.length > 0){addPhotosImages.push({url: link, bID: false});photosImgContUpdate();document.getElementById("overPage").style.display = "none";}
        }})
    ]));
}
function addPhotoImgFile(){
    ce("input", {type: "file", multiple: "true", accept: ".png,.jpg,.jpeg,.webp", onchange: function(inputArg){
        let imgFiles = inputArg.target.files;
        for (i in imgFiles){
            if(typeof(imgFiles[i]) == "object"){
                awStg.createFile("mainBucket", `p-${(new Date().getTime()).toString(30).toUpperCase()}${(Math.floor(Math.random() * 10000)).toString(16).toUpperCase()}_${i}`, imgFiles[i]).then((awFile)=>{
                    let url = `${awURL}/storage/buckets/${awFile.bucketId}/files/${awFile.$id}/view?project=${awID}`;
                    addPhotosImages.push({url: url, bID: awFile.bucketId, fID: awFile.$id});
                    photosImgContUpdate();
                });
            }
        }
    }}).click();
}
function photoAdd(){
    let imageUrls = [];
    let storageDependencies = [];
    for (i in addPhotosImages){
        imageUrls.push(addPhotosImages[i].url);
        if (addPhotosImages[i].bID){storageDependencies.push({bID: addPhotosImages[i].bID, fID: addPhotosImages[i].fID});}
    }

    if (addPhotosImages.length > 0){
        let retVal = [];
        for (i in addPhotosImages){
            retVal.unshift({
                url: imageUrls[i],
                imgID: `${(new Date().getTime()).toString(16).toUpperCase()}${(Math.floor(Math.random() * 10000)).toString(16).toUpperCase()}_${i}`,
                date: new Date().getTime(),
                caption: document.getElementById("photoAddCaptIO").value,
                storageDeps: storageDependencies
            });
        }
        addPhotosImages=[];photosImgContUpdate();
    
        db.collection("siteData").doc("photos").get().then((photosRef)=>{
            let photosDocData = photosRef.data();
            if(photosDocData != undefined){
                if ("allPhotos" in photosDocData){
                    if (document.getElementById("phtoOrderIO").value=="front"){
                        for(i in retVal){photosDocData.allPhotos.unshift(retVal[i]);}
                    }else{
                        let rvrstRetVal = [];for(i in retVal){rvrstRetVal.unshift(retVal[i]);}
                        for (i in rvrstRetVal){photosDocData.allPhotos.push(rvrstRetVal[i]);}
                    }
                    db.collection("siteData").doc("photos").set(photosDocData);
                }
                else{
                    photosDocData["allPhotos"] = [];
                    for (i in retVal){photosDocData.allPhotos.unshift(retVal[i]);}
                    db.collection("siteData").doc("photos").set(photosDocData);
                }
            }else{
                let setVal = [];
                for (i in retVal){setVal.unshift(retVal[i]);}
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
            for (i in photosDocData.allPhotos){
                if (photosDocData.allPhotos[i].imgID == delPhotoIDIO){
                    for (depIndex in photosDocData.allPhotos[i].storageDeps){
                        awStg.deleteFile(photosDocData.allPhotos[i].storageDeps[depIndex].bID, photosDocData.allPhotos[i].storageDeps[depIndex].fID);
                    }

                    photosDocData.allPhotos.splice(i, 1);
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
            for(i in photosDocData.allPhotos){
                if(photosDocData.allPhotos[i].imgID==pinnedPhtoAddIDIO.value){
                    let phtoData = photosDocData.allPhotos[i];
                    db.collection("siteData").doc("common").get().then((commonRef)=>{
                        let commonData = commonRef.data();
                        if(commonData != undefined){
                            if ("pinnedPhotos" in commonData){
                                for (i2 in commonData.pinnedPhotos){
                                    if (commonData.pinnedPhotos[i2].imgID == pinnedPhtoAddIDIO.value){
                                        commonData.pinnedPhotos.splice(i2, 1);break;
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
            for (i in commonData.pinnedPhotos){
                if (commonData.pinnedPhotos[i].imgID == pinnedPhtoDelIDIO){
                    commonData.pinnedPhotos.splice(i, 1);
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
    for (i in prsnAddImages){
        prsnAddImgCont.append(ce("img", {
            src: prsnAddImages[i].url,
            imgID: i,
            onclick: function(){
                if (prsnAddImages[this.imgID].bID){awStg.deleteFile(prsnAddImages[this.imgID].bID, prsnAddImages[this.imgID].fID)};
                prsnAddImages.splice(this.imgID, 1);
                prsnImgContUpdate();
            }
        }));
    }
}
function addPrsnImgLink(){
    if (prsnAddImages.length <= 0){
        createOP("Add Image Link", ce("div", {}, [
            ce("input", {id: "tempURLIO", placeholder: "URL"}),
            ce("div", {className: "rBtn", style: "margin-top: 10px", innerText: "Add", onclick: function(){
                let link=document.getElementById("tempURLIO").value;
                if(link.length > 0){prsnAddImages.push({url: link, bID: false});prsnImgContUpdate();document.getElementById("overPage").style.display = "none";}
            }})
        ]));
    }
}
function addPrsnImgFile(){
    if (prsnAddImages.length <= 0){
        ce("input", {type: "file", accept: ".png,.jpg,.jpeg,.webp", onchange: function(inputArg){
            let imgFiles = inputArg.target.files;
            for (i in imgFiles){
                if(typeof(imgFiles[i]) == "object"){
                    awStg.createFile("mainBucket", `prsn-${(new Date().getTime()).toString(30).toUpperCase()}${(Math.floor(Math.random() * 10000)).toString(16).toUpperCase()}_${i}`, imgFiles[i]).then((awFile)=>{
                        let url = `${awURL}/storage/buckets/${awFile.bucketId}/files/${awFile.$id}/view?project=${awID}`;
                        prsnAddImages.push({url: url, bID: awFile.bucketId, fID: awFile.$id});
                        prsnImgContUpdate();
                    });
                }
            }
        }}).click();
    }
}
function prsnAdd(){
    let imageUrls = [];
    let storageDependencies = [];
    for (i in prsnAddImages){
        imageUrls.push(prsnAddImages[i].url);
        if (prsnAddImages[i].bID){storageDependencies.push({bID: prsnAddImages[i].bID, fID: prsnAddImages[i].fID});}
    }

    if ((prsnAddImages.length > 0) && prsnAddNameIO.value && prsnAddPostIO.value && prsnAddBodyIO.value){
        prsnData = {
            prsnID: `${(new Date().getTime()).toString(16).toUpperCase()}_${(Math.floor(Math.random() * 10000)).toString(16).toUpperCase()}`,
            name: prsnAddNameIO.value,
            post: prsnAddPostIO.value,
            image: imageUrls[0],
            body: function (){let returnVal="";prsnAddBodyIO.value.split("\n").forEach((line) => {returnVal=returnVal+line+"  \n"});return returnVal}(),
            storageDeps: storageDependencies
        }
        prsnAddImages=[];prsnImgContUpdate();
    
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
            for (i in peopleDocData.allPeople){
                if (peopleDocData.allPeople[i].prsnID == prsnDelIDIO){
                    for (depIndex in peopleDocData.allPeople[i].storageDeps){
                        awStg.deleteFile(peopleDocData.allPeople[i].storageDeps[depIndex].bID, peopleDocData.allPeople[i].storageDeps[depIndex].fID);
                    }

                    peopleDocData.allPeople.splice(i, 1);
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
            for(i in peopleDocData.allPeople){
                if(peopleDocData.allPeople[i].prsnID==pinnedPrsnAddIDIO.value){
                    let prsnData = peopleDocData.allPeople[i];
                    db.collection("siteData").doc("common").get().then((commonRef)=>{

                        let commonData = commonRef.data();
                        if(commonData != undefined){
                            if ("pinnedPeople" in commonData){
                                for (i2 in commonData.pinnedPeople){
                                    if (commonData.pinnedPeople[i2].prsnID == pinnedPrsnAddIDIO.value){
                                        commonData.pinnedPeople.splice(i2, 1);break;
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
            for (i in commonData.pinnedPeople){
                if (commonData.pinnedPeople[i].prsnID == pinnedPrsnDelIDIO){
                    commonData.pinnedPeople.splice(i, 1);
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
                commonData["shortDescription"] = function (){let returnVal="";shrtDescIO.split("\n").forEach((line) => {returnVal=returnVal+line+"  \n"});return returnVal}();
                db.collection("siteData").doc("common").set(commonData);
            }else{
                db.collection("siteData").doc("common").set({shortDescription: function (){let returnVal="";shrtDescIO.split("\n").forEach((line) => {returnVal=returnVal+line+"  \n"});return returnVal}()});
            }
            createOP("Success", ce("div", {style: "display:flex;flex-direction:column;align-items:center;justify-content:center;"}, [
                matSym("check_circle", {style: "margin-bottom:5px"}), ce("div", {}, ["Short Description Updated!"]),
            ]));
        });
    }
}


// Nav
let tempNavData;
let rSectNavItemCont = document.getElementById("rSectNavItemCont");
function navUpdater(){
    rSectNavItemCont.innerHTML = "";
    
    let hasLogo = false;
    for (i in tempNavData){if (tempNavData[i].logo){hasLogo = true;}}
    if (hasLogo==false){tempNavData.unshift({logo: true, src: "/logo.png"});}

    for (i1 in tempNavData){
        let rSectNavFtrItemData;
        if (tempNavData[i1].logo){ //Logo
            rSectNavFtrItemData = ce("div", {className: "rSectNavFtrItemData"}, [
                ce("span", {className: "rBtn"}, [matSym("arrow_upward", {
                    onclick: function(){
                        tempNavData.splice(this.parentNode.parentNode.parentNode.i1-1, 0, tempNavData.splice(this.parentNode.parentNode.parentNode.i1, 1)[0]);navUpdater();
                    }
                })]),
                ce("span", {className: "rBtn"}, [matSym("arrow_downward", {
                    onclick: function(){
                        tempNavData.splice(this.parentNode.parentNode.parentNode.i1+1, 0, tempNavData.splice(this.parentNode.parentNode.parentNode.i1, 1)[0]);navUpdater();
                    }
                })]),
                ce("span", {className: "rBtn"}, [matSym("edit", {
                    onclick: function(){
                        let editingIndex1 = this.parentNode.parentNode.parentNode.i1;
                        createOP("Edit", ce("div", {style: "display:flex;flex-direction:column;"}, [
                            ce("input", {id: "navItemLinkIO", placeholder: "Image URL", value: tempNavData[editingIndex1].src}),
                            ce("div", {className: "rBtn", style: "margin-top: 10px;border-color: var(--color10);color: var(--color10);", innerText: "Save", onclick: function(){
                                let navItemLinkIO=document.getElementById("navItemLinkIO").value;
                                if(navItemLinkIO.length > 0){
                                    document.getElementById("overPage").style.display = "none";
                                    tempNavData[editingIndex1].src = navItemLinkIO;
                                    navUpdater();
                                }
                            }}),
                        ]));
                    }
                })]),
                ce("span", {className: "rSectNavFtrItemText"}, ["Logo"]),
                ce("span", {className: "rSectNavFtrItemLink"}, [tempNavData[i1].src])
            ]);
        }else{ //Items
            rSectNavFtrItemData = ce("div", {className: "rSectNavFtrItemData"}, [
                ce("span", {className: "rBtn"}, [matSym("arrow_upward", {
                    onclick: function(){
                        tempNavData.splice(this.parentNode.parentNode.parentNode.i1-1, 0, tempNavData.splice(this.parentNode.parentNode.parentNode.i1, 1)[0]);
                        navUpdater();
                    }
                })]),
                ce("span", {className: "rBtn"}, [matSym("arrow_downward", {
                    onclick: function(){
                        tempNavData.splice(this.parentNode.parentNode.parentNode.i1+1, 0, tempNavData.splice(this.parentNode.parentNode.parentNode.i1, 1)[0]);
                        navUpdater();
                    }
                })]),
                ce("span", {className: "rBtn"}, [matSym("edit", {
                    onclick: function(){
                        let editingIndex1 = this.parentNode.parentNode.parentNode.i1;
                        createOP("Edit", ce("div", {style: "display:flex;flex-direction:column;"}, [
                            ce("input", {id: "navItemTextIO", placeholder: "Text", value: tempNavData[editingIndex1].text}),
                            ce("input", {id: "navItemLinkIO", placeholder: "Link", value: tempNavData[editingIndex1].link, style: "margin-top: 10px"}),
                            ce("div", {className: "rBtn", style: "margin-top: 10px;", innerText: "Delete", onclick: function(){
                                document.getElementById("overPage").style.display = "none";
                                tempNavData.splice(editingIndex1, 1);
                                navUpdater();
                            }}),
                            ce("div", {className: "rBtn", style: "margin-top: 10px;border-color: var(--color10);color: var(--color10);", innerText: "Save", onclick: function(){
                                let navItemTextIO=document.getElementById("navItemTextIO").value;
                                let navItemLinkIO=document.getElementById("navItemLinkIO").value;
                                if(navItemTextIO.length > 0 && navItemLinkIO.length > 0){
                                    document.getElementById("overPage").style.display = "none";
                                    tempNavData[editingIndex1].text = navItemTextIO;
                                    tempNavData[editingIndex1].link = navItemLinkIO;
                                    navUpdater();
                                }
                            }}),
                        ]));
                    }
                })]),
                ce("span", {className: "rBtn"}, [matSym("add", {
                    onclick: function(){
                        let editingIndex1 = this.parentNode.parentNode.parentNode.i1;
                        createOP("Add Nav SubItem", ce("div", {style: "display:flex;flex-direction:column;"}, [
                            ce("input", {id: "navItemTextIO", placeholder: "Text"}),
                            ce("input", {id: "navItemLinkIO", placeholder: "Link", style: "margin-top: 10px"}),
                            ce("div", {className: "rBtn", style: "margin-top: 10px;", innerText: "Add", onclick: function(){
                                let navItemTextIO=document.getElementById("navItemTextIO").value;
                                let navItemLinkIO=document.getElementById("navItemLinkIO").value;
                                if(navItemTextIO.length > 0 && navItemLinkIO.length > 0){
                                    document.getElementById("overPage").style.display = "none";
                                    if (typeof(tempNavData[editingIndex1].subOpts)!="object"){tempNavData[editingIndex1].subOpts = [];}
                                    tempNavData[editingIndex1].subOpts.push({text: navItemTextIO, link: navItemLinkIO});
                                    navUpdater();
                                }
                            }}),
                        ]));
                    }
                })]),
                ce("span", {className: "rSectNavFtrItemText"}, [tempNavData[i1].text]),
                ce("span", {className: "rSectNavFtrItemLink"}, [tempNavData[i1].link])
            ]);
        }
        let rSectNavFtrSubItemCont = ce("div", {className: "rSectNavFtrSubItemCont"})
        if ("subOpts" in tempNavData[i1]){ //Sub Items
            for (i2 in tempNavData[i1]["subOpts"]){
                rSectNavFtrSubItemCont.append(ce("div", {className: "rSectNavFtrSubItem", i2: i2}, [
                    ce("span", {className: "rBtn"}, [matSym("arrow_upward", {
                        onclick: function(){
                            tempNavData[this.parentNode.parentNode.parentNode.parentNode.i1].subOpts
                                .splice(this.parentNode.parentNode.i2-1, 0, tempNavData[this.parentNode.parentNode.parentNode.parentNode.i1].subOpts.splice(this.parentNode.parentNode.i2, 1)[0]);
                            navUpdater();
                        }
                    })]),
                    ce("span", {className: "rBtn"}, [matSym("arrow_downward", {
                        onclick: function(){
                            tempNavData[this.parentNode.parentNode.parentNode.parentNode.i1].subOpts
                                .splice(this.parentNode.parentNode.i2-1, 0, tempNavData[this.parentNode.parentNode.parentNode.parentNode.i1].subOpts.splice(this.parentNode.parentNode.i2, 1)[0]);
                            navUpdater();
                        }
                    })]),
                    ce("span", {className: "rBtn"}, [matSym("edit", {
                        onclick: function(){
                            let editingIndex1 = this.parentNode.parentNode.parentNode.parentNode.i1;
                            let editingIndex2 = this.parentNode.parentNode.i2;
                            createOP("Edit", ce("div", {style: "display:flex;flex-direction:column;"}, [
                                ce("input", {id: "navItemTextIO", placeholder: "Text", value: tempNavData[editingIndex1].subOpts[editingIndex2].text}),
                                ce("input", {id: "navItemLinkIO", placeholder: "Link", value: tempNavData[editingIndex1].subOpts[editingIndex2].link, style: "margin-top: 10px"}),
                                ce("div", {className: "rBtn", style: "margin-top: 10px;", innerText: "Delete", onclick: function(){
                                    document.getElementById("overPage").style.display = "none";
                                    tempNavData[editingIndex1].subOpts.splice(editingIndex2, 1);
                                    if (tempNavData[editingIndex1].subOpts.length == 0){delete tempNavData[editingIndex1].subOpts;}
                                    navUpdater();
                                }}),
                                ce("div", {className: "rBtn", style: "margin-top: 10px;border-color: var(--color10);color: var(--color10);", innerText: "Save", onclick: function(){
                                    let navItemTextIO=document.getElementById("navItemTextIO").value;
                                    let navItemLinkIO=document.getElementById("navItemLinkIO").value;
                                    if(navItemTextIO.length > 0 && navItemLinkIO.length > 0){
                                        document.getElementById("overPage").style.display = "none";
                                        tempNavData[editingIndex1].subOpts[editingIndex2].text = navItemTextIO;
                                        tempNavData[editingIndex1].subOpts[editingIndex2].link = navItemLinkIO;
                                        navUpdater();
                                    }
                                }}),
                            ]));
                        }
                    })]),
                    ce("span", {className: "rSectNavFtrSubItemText"}, [tempNavData[i1]["subOpts"][i2].text]),
                    ce("span", {className: "rSectNavFtrSubItemLink"}, [tempNavData[i1]["subOpts"][i2].link])
                ]));
            }
        }
        
        rSectNavItemCont.append(ce("div", {className: "rSectNavFtrItem", i1: i1}, [
            rSectNavFtrItemData,
            rSectNavFtrSubItemCont
        ]))
    }
}
function addNavItem(){
    createOP("Add Nav Item", ce("div", {style: "display:flex;flex-direction:column;"}, [
        ce("input", {id: "navItemTextIO", placeholder: "Text"}),
        ce("input", {id: "navItemLinkIO", placeholder: "Link", style: "margin-top: 10px"}),
        ce("div", {className: "rBtn", style: "margin-top: 10px;", innerText: "Add", onclick: function(){
            let navItemTextIO=document.getElementById("navItemTextIO").value;
            let navItemLinkIO=document.getElementById("navItemLinkIO").value;
            if(navItemTextIO.length > 0 && navItemLinkIO.length > 0){
                document.getElementById("overPage").style.display = "none";
                tempNavData.push({text: navItemTextIO, link: navItemLinkIO});
                navUpdater();
            }
        }}),
    ]));
}
function navUpdt(){
    if(tempNavData){
        db.collection("siteData").doc("common").get().then((commonRef)=>{
            let commonData = commonRef.data();
            if(commonData != undefined){
                commonData["navData"] = tempNavData;
                db.collection("siteData").doc("common").set(commonData);
            }else{
                db.collection("siteData").doc("common").set({navData: tempNavData});
            }
            createOP("Success", ce("div", {style: "display:flex;flex-direction:column;align-items:center;justify-content:center;"}, [
                matSym("check_circle", {style: "margin-bottom:5px"}), ce("div", {}, ["Nav Updated!", ce("br"), "Reload the Page!"]),
            ]));
        });
    }
}


// Ftr
let tempFtrData;
let rSectFtrItemCont = document.getElementById("rSectFtrItemCont");

function ftrUpdater(){
    rSectFtrItemCont.innerHTML = "";

    for (i1 in tempFtrData){

        let rSectNavFtrSubItemCont = ce("div", {className: "rSectNavFtrSubItemCont"})
        if ("subOpts" in tempFtrData[i1]){ //Sub Items
            for (i2 in tempFtrData[i1]["subOpts"]){

                let rSectFtrSubItemLogoIconChild="";
                if(tempFtrData[i1]["subOpts"][i2].matSym){rSectFtrSubItemLogoIconChild = matSym(tempFtrData[i1]["subOpts"][i2].matSym || "link_off")}
                else if(tempFtrData[i1]["subOpts"][i2].iconUrl){rSectFtrSubItemLogoIconChild = ce("img", {src: tempFtrData[i1]["subOpts"][i2].iconUrl || ""});}

                rSectNavFtrSubItemCont.append(ce("div", {className: "rSectNavFtrSubItem", i2: i2}, [
                    ce("span", {className: "rBtn"}, [matSym("arrow_upward", {
                        onclick: function(){
                            tempFtrData[this.parentNode.parentNode.parentNode.parentNode.i1].subOpts
                                .splice(this.parentNode.parentNode.i2-1, 0, tempFtrData[this.parentNode.parentNode.parentNode.parentNode.i1].subOpts.splice(this.parentNode.parentNode.i2, 1)[0]);
                            ftrUpdater();
                        }
                    })]),
                    ce("span", {className: "rBtn"}, [matSym("arrow_downward", {
                        onclick: function(){
                            tempFtrData[this.parentNode.parentNode.parentNode.parentNode.i1].subOpts
                                .splice(this.parentNode.parentNode.i2-1, 0, tempFtrData[this.parentNode.parentNode.parentNode.parentNode.i1].subOpts.splice(this.parentNode.parentNode.i2, 1)[0]);
                            ftrUpdater();
                        }
                    })]),
                    ce("span", {className: "rBtn"}, [matSym("edit", {
                        onclick: function(){
                            let editingIndex1 = this.parentNode.parentNode.parentNode.parentNode.i1;
                            let editingIndex2 = this.parentNode.parentNode.i2;
                            createOP("Edit", ce("div", {style: "display:flex;flex-direction:column;"}, [
                                ce("input", {id: "ftrItemMatSymIO", placeholder: "MatSym (More priority)", value: tempFtrData[editingIndex1].subOpts[editingIndex2].matSym || ""}),
                                ce("input", {id: "ftrItemIconLinkIO", placeholder: "Icon (Less priority)", value: tempFtrData[editingIndex1].subOpts[editingIndex2].iconUrl || "", style: "margin-top: 10px"}),
                                ce("input", {id: "ftrItemTextIO", placeholder: "Text", value: tempFtrData[editingIndex1].subOpts[editingIndex2].text || "", style: "margin-top: 10px"}),
                                ce("input", {id: "ftrItemLinkIO", placeholder: "Link", value: tempFtrData[editingIndex1].subOpts[editingIndex2].link || "", style: "margin-top: 10px"}),
                                ce("div", {className: "rBtn", style: "margin-top: 10px;", innerText: "Delete", onclick: function(){
                                    document.getElementById("overPage").style.display = "none";
                                    tempFtrData[editingIndex1].subOpts.splice(editingIndex2, 1);
                                    if (tempFtrData[editingIndex1].subOpts.length == 0){delete tempFtrData[editingIndex1].subOpts;}
                                    ftrUpdater();
                                }}),
                                ce("div", {className: "rBtn", style: "margin-top: 10px;border-color: var(--color10);color: var(--color10);", innerText: "Save", onclick: function(){
                                    let ftrItemMatSymIO=document.getElementById("ftrItemMatSymIO");
                                    let ftrItemIconLinkIO=document.getElementById("ftrItemIconLinkIO");
                                    let ftrItemTextIO=document.getElementById("ftrItemTextIO");
                                    let ftrItemLinkIO=document.getElementById("ftrItemLinkIO");
                                    if(ftrItemTextIO.value.length > 0 && ftrItemLinkIO.value.length > 0){
                                        document.getElementById("overPage").style.display = "none";
                                        tempFtrData[editingIndex1].subOpts[editingIndex2].text = ftrItemTextIO.value;
                                        tempFtrData[editingIndex1].subOpts[editingIndex2].link = ftrItemLinkIO.value;
                                        if(ftrItemMatSymIO.value!=""){
                                            delete tempFtrData[editingIndex1].subOpts[editingIndex2].iconUrl;
                                            tempFtrData[editingIndex1].subOpts[editingIndex2].matSym = ftrItemMatSymIO.value;
                                        }else if(ftrItemIconLinkIO.value!=""){
                                            delete tempFtrData[editingIndex1].subOpts[editingIndex2].matSym;
                                            tempFtrData[editingIndex1].subOpts[editingIndex2].iconUrl = ftrItemIconLinkIO.value;
                                        }else{
                                            delete tempFtrData[editingIndex1].subOpts[editingIndex2].iconUrl;
                                            delete tempFtrData[editingIndex1].subOpts[editingIndex2].matSym;
                                        }
                                        ftrUpdater();
                                    }
                                }}),
                            ]));
                        }
                    })]),
                    ce("span", {className: "rSectFtrItemLogoIcon"}, [rSectFtrSubItemLogoIconChild]),
                    ce("span", {className: "rSectNavFtrSubItemText"}, [tempFtrData[i1]["subOpts"][i2].text]),
                    ce("span", {className: "rSectNavFtrSubItemLink"}, [tempFtrData[i1]["subOpts"][i2].link]),
                ]))
            }
        }


        let rSectFtrItemLogoIconChild="";
        if(tempFtrData[i1].matSym){rSectFtrItemLogoIconChild = matSym(tempFtrData[i1].matSym || "link_off")}
        else if(tempFtrData[i1].iconUrl){rSectFtrItemLogoIconChild = ce("img", {src: tempFtrData[i1].iconUrl || ""});}

        rSectFtrItemCont.append(ce("div", {className: "rSectNavFtrItem", i1: i1}, [
            ce("div", {className: "rSectNavFtrItemData"}, [
                ce("span", {className: "rBtn"}, [matSym("arrow_upward", {
                    onclick: function(){
                        tempFtrData.splice(this.parentNode.parentNode.parentNode.i1-1, 0, tempFtrData.splice(this.parentNode.parentNode.parentNode.i1, 1)[0]);
                        ftrUpdater();
                    }
                })]),
                ce("span", {className: "rBtn"}, [matSym("arrow_downward", {
                    onclick: function(){
                        tempFtrData.splice(this.parentNode.parentNode.parentNode.i1+1, 0, tempFtrData.splice(this.parentNode.parentNode.parentNode.i1, 1)[0]);
                        ftrUpdater();
                    }
                })]),
                ce("span", {className: "rBtn"}, [matSym("edit", {
                    onclick: function(){
                        let editingIndex1 = this.parentNode.parentNode.parentNode.i1;
                        createOP("Edit", ce("div", {style: "display:flex;flex-direction:column;"}, [
                            ce("input", {id: "ftrItemMatSymIO", placeholder: "MatSym (More priority)", value: tempFtrData[editingIndex1].matSym || ""}),
                            ce("input", {id: "ftrItemIconLinkIO", placeholder: "Icon (Less priority)", value: tempFtrData[editingIndex1].iconUrl || "", style: "margin-top: 10px"}),
                            ce("input", {id: "ftrItemTextIO", placeholder: "Text", value: tempFtrData[editingIndex1].text || "", style: "margin-top: 10px"}),
                            ce("div", {className: "rBtn", style: "margin-top: 10px;", innerText: "Delete", onclick: function(){
                                document.getElementById("overPage").style.display = "none";
                                tempFtrData.splice(editingIndex1, 1);
                                ftrUpdater();
                            }}),
                            ce("div", {className: "rBtn", style: "margin-top: 10px;border-color: var(--color10);color: var(--color10);", innerText: "Save", onclick: function(){
                                let ftrItemMatSymIO=document.getElementById("ftrItemMatSymIO");
                                let ftrItemIconLinkIO=document.getElementById("ftrItemIconLinkIO");
                                let ftrItemTextIO=document.getElementById("ftrItemTextIO");
                                if(ftrItemTextIO.value.length > 0){
                                    document.getElementById("overPage").style.display = "none";
                                    tempFtrData[editingIndex1].text = ftrItemTextIO.value;

                                    if(ftrItemMatSymIO.value!=""){
                                        delete tempFtrData[editingIndex1].iconUrl;
                                        tempFtrData[editingIndex1].matSym = ftrItemMatSymIO.value;
                                    }else if(ftrItemIconLinkIO.value!=""){
                                        delete tempFtrData[editingIndex1].matSym;
                                        tempFtrData[editingIndex1].iconUrl = ftrItemIconLinkIO.value;
                                    }else{
                                        delete tempFtrData[editingIndex1].iconUrl;
                                        delete tempFtrData[editingIndex1].matSym;
                                    }

                                    ftrUpdater();
                                }
                            }}),
                        ]));
                    }
                })]),
                ce("span", {className: "rBtn"}, [matSym("add", {
                    onclick: function(){
                        let editingIndex1 = this.parentNode.parentNode.parentNode.i1;
                        createOP("Add Ftr SubItem", ce("div", {style: "display:flex;flex-direction:column;"}, [
                            ce("input", {id: "ftrItemMatSymIO", placeholder: "MatSym (More priority)"}),
                            ce("input", {id: "ftrItemIconLinkIO", placeholder: "Icon (Less priority)", style: "margin-top: 10px"}),
                            ce("input", {id: "ftrItemTextIO", placeholder: "Text", style: "margin-top: 10px"}),
                            ce("input", {id: "ftrItemLinkIO", placeholder: "Link", style: "margin-top: 10px"}),
                            ce("div", {className: "rBtn", style: "margin-top: 10px;", innerText: "Add", onclick: function(){
                                let ftrItemMatSymIO=document.getElementById("ftrItemMatSymIO");
                                let ftrItemIconLinkIO=document.getElementById("ftrItemIconLinkIO");
                                let ftrItemTextIO=document.getElementById("ftrItemTextIO");
                                let ftrItemLinkIO=document.getElementById("ftrItemLinkIO");
                                if(ftrItemTextIO.value.length > 0 && ftrItemLinkIO.value.length > 0){
                                    document.getElementById("overPage").style.display = "none";
                                    
                                    let ftrSubItem = {
                                        text: ftrItemTextIO.value,
                                        link: ftrItemLinkIO.value,
                                    }
                                    if(ftrItemMatSymIO.value!=""){
                                        delete ftrSubItem.iconUrl;
                                        ftrSubItem.matSym = ftrItemMatSymIO.value;
                                    }else if(ftrItemIconLinkIO.value!=""){
                                        delete ftrSubItem.matSym;
                                        ftrSubItem.iconUrl = ftrItemIconLinkIO.value;
                                    }else{
                                        delete ftrSubItem.iconUrl;
                                        delete ftrSubItem.matSym;
                                    }

                                    if (typeof(tempFtrData[editingIndex1].subOpts)!="object"){tempFtrData[editingIndex1].subOpts = [];}
                                    tempFtrData[editingIndex1].subOpts.push(ftrSubItem);

                                    ftrUpdater();
                                }
                            }}),
                        ]));
                    }
                })]),
                ce("span", {className: "rSectFtrItemLogoIcon"}, [rSectFtrItemLogoIconChild]),
                ce("span", {className: "rSectNavFtrItemText"}, [tempFtrData[i1].text])
            ]),
            rSectNavFtrSubItemCont
        ]))
    }
}
function addFtrItem(){
    createOP("Add Ftr Item", ce("div", {style: "display:flex;flex-direction:column;"}, [
        ce("input", {id: "ftrItemMatSymIO", placeholder: "MatSym (More priority)"}),
        ce("input", {id: "ftrItemIconLinkIO", placeholder: "Icon (Less priority)", style: "margin-top: 10px"}),
        ce("input", {id: "ftrItemTextIO", placeholder: "Text", style: "margin-top: 10px"}),
        ce("div", {className: "rBtn", style: "margin-top: 10px;", innerText: "Add", onclick: function(){
            let ftrItemMatSymIO=document.getElementById("ftrItemMatSymIO");
            let ftrItemIconLinkIO=document.getElementById("ftrItemIconLinkIO");
            let ftrItemTextIO=document.getElementById("ftrItemTextIO");
            if(ftrItemTextIO.value.length > 0){
                document.getElementById("overPage").style.display = "none";
                
                let ftrItem = {
                    text: ftrItemTextIO.value,
                }
                if(ftrItemMatSymIO.value!=""){
                    delete ftrItem.iconUrl;
                    ftrItem.matSym = ftrItemMatSymIO.value;
                }else if(ftrItemIconLinkIO.value!=""){
                    delete ftrItem.matSym;
                    ftrItem.iconUrl = ftrItemIconLinkIO.value;
                }else{
                    delete ftrItem.iconUrl;
                    delete ftrItem.matSym;
                }
                tempFtrData.push(ftrItem);

                ftrUpdater();
            }
        }}),
    ]));
}
function ftrUpdt(){
    if(tempFtrData){
        db.collection("siteData").doc("common").get().then((commonRef)=>{
            let commonData = commonRef.data();
            if(commonData != undefined){
                commonData["ftrData"] = tempFtrData;
                db.collection("siteData").doc("common").set(commonData);
            }else{
                db.collection("siteData").doc("common").set({ftrData: tempFtrData});
            }
            createOP("Success", ce("div", {style: "display:flex;flex-direction:column;align-items:center;justify-content:center;"}, [
                matSym("check_circle", {style: "margin-bottom:5px"}), ce("div", {}, ["Footer Updated!", ce("br"), "Reload the Page!"]),
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