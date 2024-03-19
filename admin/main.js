var storageRef = firebase.storage().ref();

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
    
                firebase.auth().signInWithEmailAndPassword(signInEmail, signInPass).then((arg)=>{
                    document.getElementById("adminControls").style.display = "block";
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

    let boardDelIDIO = document.getElementById("boardDelIDIO");
    let artclDelBoardIO = document.getElementById("artclDelBoardIO");
    let artclBoardIO = document.getElementById("artclBoardIO");

    boardDelIDIO.innerHTML = "";artclDelBoardIO.innerHTML = "";artclBoardIO.innerHTML = "";

    if (boardIDsCopy == undefined){boardIDsCopy = []}
    if (boardIDsCopy.includes("About") == false){boardIDsCopy.unshift("About");}
    if (boardIDsCopy.includes("Notice") == false){boardIDsCopy.unshift("Notice");}

    for(index in boardIDsCopy){
        let boardID = boardIDsCopy[index];
        artclBoardIO.append(ce("option", {value: boardID}, [boardID]));
        artclDelBoardIO.append(ce("option", {value: boardID}, [boardID]));
        boardDelIDIO.append(ce("option", {value: boardID}, [boardID]));
    }
}
function artclSetDate(){artclDateIO.value = new Date().toISOString().split(".")[0]}
function artclImgContUpdate(){
    artclImgCont.innerHTML = "";
    for (index in artclImages){
        artclImgCont.append(ce("img", {
            src: artclImages[index].url,
            imgID: index,
            onclick: function(){
                if (artclImages[this.imgID].storagePath){storageRef.child(artclImages[this.imgID].storagePath).delete()};
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
            if(link.length > 0){artclImages.push({url: link, storagePath: false});artclImgContUpdate();document.getElementById("overPage").style.display = "none";}
        }})
    ]));
}
function addArtclImgFile(){
    ce("input", {type: "file", multiple: "true", accept: ".png,.jpg,.jpeg,.webp", onchange: function(inputArg){
        let imgFiles = inputArg.target.files;
        for (index in imgFiles){
            if(typeof(imgFiles[index]) == "object"){
                storageRef.child(`articleImages/${(new Date().getTime()).toString(16).toUpperCase()}${(Math.floor(Math.random() * 10000)).toString(16).toUpperCase()}_${index}`).put(imgFiles[index]).then((gsFileRef) => {
                    gsFileRef.ref.getDownloadURL().then((url) => {

                        artclImages.push({url: url, storagePath: gsFileRef.ref.fullPath});
                        artclImgContUpdate();
                    
                    });
                });
            }
        }
    }}).click();
}
function artclPost(){
    let imageUrls = [];
    let storageDependencies = [];
    for (index in artclImages){
        imageUrls.push(artclImages[index].url);
        if (artclImages[index].storagePath){storageDependencies.push(artclImages[index].storagePath);}
    }

    let artclData = {
        title: artclTtlIO.value,
        boardID: artclBoardIO.value,
        date: new Date(artclDateIO.value).getTime(),
        body: artclBodyIO.value,
        images: imageUrls,
        storageDeps: storageDependencies
    }
    artclImages=[];artclImgContUpdate();

    if (artclBoardIO.value && artclData.title && artclData.date && artclData.body && artclBoardIO.value!="siteData"){
        db.collection(artclBoardIO.value).add(artclData).then((artclRef)=>{
            createOP("Success", ce("div", {style: "display:flex;flex-direction:column;"}, [
                ce("div", {style: "display:flex;align-items:center;margin-bottom:20px;"}, [matSym("check_circle", {style: "margin-right:5px"}), "Article Posted Successfully!"]),
                ce("div", {}, [`Article Board: ${artclBoardIO.value}`]),
                ce("div", {}, [`Article ID: ${artclRef.id}`])
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
                    storageRef.child(deps[depIndex]).delete();
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
                        for (index in commonDBDataLatest.noticeSnippet){
                            if (commonDBDataLatest.noticeSnippet[index].artclID == artclDelIDIO.value){
                                commonDBDataLatest.noticeSnippet.splice(index, 1);
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
                ce("div", {}, [`Board: ${boardAddIDIO.value}`])
            ]));
        });
    }
}
function boardDel(){
    let boardDelIDIO = document.getElementById("boardDelIDIO");

    db.collection("siteData").doc("common").get().then((commonRef)=>{
        let commonDBDataLatest = commonRef.data();
        let hasChanged = false;
        for (index in commonDBDataLatest.boardIDs){
            if (commonDBDataLatest.boardIDs[index] == boardDelIDIO.value){
                commonDBDataLatest.boardIDs.splice(index, 1);
                hasChanged = true;
            };
        }
        if (hasChanged){db.collection("siteData").doc("common").set(commonDBDataLatest);}
        commonDBData = commonDBDataLatest;artclSetBoards();
    });

    window.open("https://console.firebase.google.com", target="_blank");
}



// Add Photos
let addPhotosImages = [];
let photoAddImgCont = document.getElementById("photoAddImgCont");

function photosImgContUpdate(){
    photoAddImgCont.innerHTML = "";
    for (index in addPhotosImages){
        photoAddImgCont.append(ce("img", {
            src: addPhotosImages[index].url,
            imgID: index,
            onclick: function(){
                if (addPhotosImages[this.imgID].storagePath){storageRef.child(addPhotosImages[this.imgID].storagePath).delete()};
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
            if(link.length > 0){addPhotosImages.push({url: link, storagePath: false});photosImgContUpdate();document.getElementById("overPage").style.display = "none";}
        }})
    ]));
}
function addPhotoImgFile(){
    ce("input", {type: "file", multiple: "true", accept: ".png,.jpg,.jpeg,.webp", onchange: function(inputArg){
        let imgFiles = inputArg.target.files;
        for (index in imgFiles){
            if(typeof(imgFiles[index]) == "object"){
                storageRef.child(`photos/${(new Date().getTime()).toString(16).toUpperCase()}${(Math.floor(Math.random() * 10000)).toString(16).toUpperCase()}_${index}`).put(imgFiles[index]).then((gsFileRef) => {
                    gsFileRef.ref.getDownloadURL().then((url) => {

                        addPhotosImages.push({url: url, storagePath: gsFileRef.ref.fullPath});
                        photosImgContUpdate();
                    
                    });
                });
            }
        }
    }}).click();
}
function photoAdd(){
    let imageUrls = [];
    let storageDependencies = [];
    for (index in addPhotosImages){
        imageUrls.push(addPhotosImages[index].url);
        if (addPhotosImages[index].storagePath){storageDependencies.push(addPhotosImages[index].storagePath);}
    }

    if (addPhotosImages.length > 0){
        let retVal = [];
        for (index in addPhotosImages){
            retVal.unshift({
                url: imageUrls[index],
                imgID: `${(new Date().getTime()).toString(16).toUpperCase()}${(Math.floor(Math.random() * 10000)).toString(16).toUpperCase()}_${index}`,
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
                    for (depIndex in photosDocData.allPhotos[index].storageDeps){
                        storageRef.child(photosDocData.allPhotos[index].storageDeps[depIndex]).delete();
                    }

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
        prsnAddImgCont.append(ce("img", {
            src: prsnAddImages[index].url,
            imgID: index,
            onclick: function(){
                if (prsnAddImages[this.imgID].storagePath){storageRef.child(prsnAddImages[this.imgID].storagePath).delete()};
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
                if(link.length > 0){prsnAddImages.push({url: link, storagePath: false});prsnImgContUpdate();document.getElementById("overPage").style.display = "none";}
            }})
        ]));
    }
}
function addPrsnImgFile(){
    if (prsnAddImages.length <= 0){
        ce("input", {type: "file", accept: ".png,.jpg,.jpeg,.webp", onchange: function(inputArg){
            let imgFiles = inputArg.target.files;
            for (index in imgFiles){
                if(typeof(imgFiles[index]) == "object"){
                    storageRef.child(`peopleImages/${(new Date().getTime()).toString(16).toUpperCase()}${(Math.floor(Math.random() * 10000)).toString(16).toUpperCase()}_${index}`).put(imgFiles[index]).then((gsFileRef) => {
                        gsFileRef.ref.getDownloadURL().then((url) => {
    
                            prsnAddImages.push({url: url, storagePath: gsFileRef.ref.fullPath});
                            prsnImgContUpdate();
                        
                        });
                    });
                }
            }
        }}).click();
    }
}
function prsnAdd(){
    let imageUrls = [];
    let storageDependencies = [];
    for (index in prsnAddImages){
        imageUrls.push(prsnAddImages[index].url);
        if (prsnAddImages[index].storagePath){storageDependencies.push(prsnAddImages[index].storagePath);}
    }

    if ((prsnAddImages.length > 0) && prsnAddNameIO.value && prsnAddPostIO.value && prsnAddBodyIO.value){
        prsnData = {
            prsnID: `${(new Date().getTime()).toString(16).toUpperCase()}_${(Math.floor(Math.random() * 10000)).toString(16).toUpperCase()}`,
            name: prsnAddNameIO.value,
            post: prsnAddPostIO.value,
            image: imageUrls[0],
            body: prsnAddBodyIO.value,
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
            for (index in peopleDocData.allPeople){
                if (peopleDocData.allPeople[index].prsnID == prsnDelIDIO){
                    for (depIndex in peopleDocData.allPeople[index].storageDeps){
                        storageRef.child(peopleDocData.allPeople[index].storageDeps[depIndex]).delete();
                    }

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


// Nav
let tempNavData;
let rSectNavItemCont = document.getElementById("rSectNavItemCont");
function navUpdater(){
    rSectNavItemCont.innerHTML = "";
    
    let hasLogo = false;
    for (index in tempNavData){if (tempNavData[index].logo){hasLogo = true;}}
    if (hasLogo==false){tempNavData.unshift({logo: true, src: "/logo.png"});}

    for (index1 in tempNavData){
        let rSectNavFtrItemData;
        if (tempNavData[index1].logo){ //Logo
            rSectNavFtrItemData = ce("div", {className: "rSectNavFtrItemData"}, [
                ce("span", {className: "rBtn"}, [matSym("arrow_upward", {
                    onclick: function(){
                        tempNavData.splice(this.parentNode.parentNode.parentNode.index1-1, 0, tempNavData.splice(this.parentNode.parentNode.parentNode.index1, 1)[0]);navUpdater();
                    }
                })]),
                ce("span", {className: "rBtn"}, [matSym("arrow_downward", {
                    onclick: function(){
                        tempNavData.splice(this.parentNode.parentNode.parentNode.index1+1, 0, tempNavData.splice(this.parentNode.parentNode.parentNode.index1, 1)[0]);navUpdater();
                    }
                })]),
                ce("span", {className: "rBtn"}, [matSym("edit", {
                    onclick: function(){
                        let editingIndex1 = this.parentNode.parentNode.parentNode.index1;
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
                ce("span", {className: "rSectNavFtrItemLink"}, [tempNavData[index1].src])
            ]);
        }else{ //Items
            rSectNavFtrItemData = ce("div", {className: "rSectNavFtrItemData"}, [
                ce("span", {className: "rBtn"}, [matSym("arrow_upward", {
                    onclick: function(){
                        tempNavData.splice(this.parentNode.parentNode.parentNode.index1-1, 0, tempNavData.splice(this.parentNode.parentNode.parentNode.index1, 1)[0]);
                        navUpdater();
                    }
                })]),
                ce("span", {className: "rBtn"}, [matSym("arrow_downward", {
                    onclick: function(){
                        tempNavData.splice(this.parentNode.parentNode.parentNode.index1+1, 0, tempNavData.splice(this.parentNode.parentNode.parentNode.index1, 1)[0]);
                        navUpdater();
                    }
                })]),
                ce("span", {className: "rBtn"}, [matSym("edit", {
                    onclick: function(){
                        let editingIndex1 = this.parentNode.parentNode.parentNode.index1;
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
                        let editingIndex1 = this.parentNode.parentNode.parentNode.index1;
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
                ce("span", {className: "rSectNavFtrItemText"}, [tempNavData[index1].text]),
                ce("span", {className: "rSectNavFtrItemLink"}, [tempNavData[index1].link])
            ]);
        }
        let rSectNavFtrSubItemCont = ce("div", {className: "rSectNavFtrSubItemCont"})
        if ("subOpts" in tempNavData[index1]){ //Sub Items
            for (index2 in tempNavData[index1]["subOpts"]){
                rSectNavFtrSubItemCont.append(ce("div", {className: "rSectNavFtrSubItem", index2: index2}, [
                    ce("span", {className: "rBtn"}, [matSym("arrow_upward", {
                        onclick: function(){
                            tempNavData[this.parentNode.parentNode.parentNode.parentNode.index1].subOpts
                                .splice(this.parentNode.parentNode.index2-1, 0, tempNavData[this.parentNode.parentNode.parentNode.parentNode.index1].subOpts.splice(this.parentNode.parentNode.index2, 1)[0]);
                            navUpdater();
                        }
                    })]),
                    ce("span", {className: "rBtn"}, [matSym("arrow_downward", {
                        onclick: function(){
                            tempNavData[this.parentNode.parentNode.parentNode.parentNode.index1].subOpts
                                .splice(this.parentNode.parentNode.index2-1, 0, tempNavData[this.parentNode.parentNode.parentNode.parentNode.index1].subOpts.splice(this.parentNode.parentNode.index2, 1)[0]);
                            navUpdater();
                        }
                    })]),
                    ce("span", {className: "rBtn"}, [matSym("edit", {
                        onclick: function(){
                            let editingIndex1 = this.parentNode.parentNode.parentNode.parentNode.index1;
                            let editingIndex2 = this.parentNode.parentNode.index2;
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
                    ce("span", {className: "rSectNavFtrSubItemText"}, [tempNavData[index1]["subOpts"][index2].text]),
                    ce("span", {className: "rSectNavFtrSubItemLink"}, [tempNavData[index1]["subOpts"][index2].link])
                ]));
            }
        }
        
        rSectNavItemCont.append(ce("div", {className: "rSectNavFtrItem", index1: index1}, [
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

    for (index1 in tempFtrData){

        let rSectNavFtrSubItemCont = ce("div", {className: "rSectNavFtrSubItemCont"})
        if ("subOpts" in tempFtrData[index1]){ //Sub Items
            for (index2 in tempFtrData[index1]["subOpts"]){

                let rSectFtrSubItemLogoIconChild="";
                if(tempFtrData[index1]["subOpts"][index2].matSym){rSectFtrSubItemLogoIconChild = matSym(tempFtrData[index1]["subOpts"][index2].matSym || "link_off")}
                else if(tempFtrData[index1]["subOpts"][index2].iconUrl){rSectFtrSubItemLogoIconChild = ce("img", {src: tempFtrData[index1]["subOpts"][index2].iconUrl || ""});}

                rSectNavFtrSubItemCont.append(ce("div", {className: "rSectNavFtrSubItem", index2: index2}, [
                    ce("span", {className: "rBtn"}, [matSym("arrow_upward", {
                        onclick: function(){
                            tempFtrData[this.parentNode.parentNode.parentNode.parentNode.index1].subOpts
                                .splice(this.parentNode.parentNode.index2-1, 0, tempFtrData[this.parentNode.parentNode.parentNode.parentNode.index1].subOpts.splice(this.parentNode.parentNode.index2, 1)[0]);
                            ftrUpdater();
                        }
                    })]),
                    ce("span", {className: "rBtn"}, [matSym("arrow_downward", {
                        onclick: function(){
                            tempFtrData[this.parentNode.parentNode.parentNode.parentNode.index1].subOpts
                                .splice(this.parentNode.parentNode.index2-1, 0, tempFtrData[this.parentNode.parentNode.parentNode.parentNode.index1].subOpts.splice(this.parentNode.parentNode.index2, 1)[0]);
                            ftrUpdater();
                        }
                    })]),
                    ce("span", {className: "rBtn"}, [matSym("edit", {
                        onclick: function(){
                            let editingIndex1 = this.parentNode.parentNode.parentNode.parentNode.index1;
                            let editingIndex2 = this.parentNode.parentNode.index2;
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
                    ce("span", {className: "rSectNavFtrSubItemText"}, [tempFtrData[index1]["subOpts"][index2].text]),
                    ce("span", {className: "rSectNavFtrSubItemLink"}, [tempFtrData[index1]["subOpts"][index2].link]),
                ]))
            }
        }


        let rSectFtrItemLogoIconChild="";
        if(tempFtrData[index1].matSym){rSectFtrItemLogoIconChild = matSym(tempFtrData[index1].matSym || "link_off")}
        else if(tempFtrData[index1].iconUrl){rSectFtrItemLogoIconChild = ce("img", {src: tempFtrData[index1].iconUrl || ""});}

        rSectFtrItemCont.append(ce("div", {className: "rSectNavFtrItem", index1: index1}, [
            ce("div", {className: "rSectNavFtrItemData"}, [
                ce("span", {className: "rBtn"}, [matSym("arrow_upward", {
                    onclick: function(){
                        tempFtrData.splice(this.parentNode.parentNode.parentNode.index1-1, 0, tempFtrData.splice(this.parentNode.parentNode.parentNode.index1, 1)[0]);
                        ftrUpdater();
                    }
                })]),
                ce("span", {className: "rBtn"}, [matSym("arrow_downward", {
                    onclick: function(){
                        tempFtrData.splice(this.parentNode.parentNode.parentNode.index1+1, 0, tempFtrData.splice(this.parentNode.parentNode.parentNode.index1, 1)[0]);
                        ftrUpdater();
                    }
                })]),
                ce("span", {className: "rBtn"}, [matSym("edit", {
                    onclick: function(){
                        let editingIndex1 = this.parentNode.parentNode.parentNode.index1;
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
                        let editingIndex1 = this.parentNode.parentNode.parentNode.index1;
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
                ce("span", {className: "rSectNavFtrItemText"}, [tempFtrData[index1].text])
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