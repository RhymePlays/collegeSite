/* -------------------------------------------------- *\
|---            Variables and Parameters            ---|

'mobileUiThreshold'
___________________

The Mobile UI will load after the
value for window.innerWidth goes below
'mobileUiThreshold'.

\* -------------------------------------------------- */
var commonDBData = undefined;
var mobileUiThreshold = 700;
var siteName = "bakedSiteName";
var navData = [
    {text: "Home", link: "/"},
    {text: "Option Ni"},
    {
        text: "Option San",
        link: "#a",
        subOpts: [
            {
                text: "Sub-Option C",
                link: "#b"
            },
            {
                text: "Sub-Option D",
                link: "#c"
            },
            {
                text: "Sub-Option E",
                link: "#d"
            },
        ]
    },
    {logo: true, src: "/logo.png"},
    {text: "Option 4", subOpts: [{}]},
    {text: "Option 5", subOpts: [{}]},
    {text: "Option 6", subOpts: [{}]},
];


/* -------------------------------------------------- *\
|---                    Firebase                    ---|
\* -------------------------------------------------- */
const firebaseConfig = {
    apiKey: "AIzaSyA6imB2RfnEt33HwDM7bau_ENl2AqKvkZo",
    authDomain: "collegewebsite-97395.firebaseapp.com",
    projectId: "collegewebsite-97395",
    storageBucket: "collegewebsite-97395.appspot.com",
    messagingSenderId: "243874537979",
    appId: "1:243874537979:web:d93808fb9fc3f7f57fab5e",
    measurementId: "G-5XV400E00S"
};
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics(app);
const db = firebase.firestore();



/* -------------------------------------------------- *\
|---                      Random                    ---|
\* -------------------------------------------------- */
function ce(type, opts={}, children=[]){
    let elem = document.createElement(type);
    Object.assign(elem, opts);
    for (index in children){elem.append(children[index]);}
    return elem;
}
function matSym(id, opts={}){return ce("span", Object.assign(opts, {className: "material-symbols-outlined", innerText: id}))}
function escapeHTML(str){return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;");}
function parseMD(str){
    try{return ce("div", {className: "md", parseSuccess: true, innerHTML: marked.parse(escapeHTML(str))});}
    catch(e){return ce("div", {className: "md", parseSuccess: false, innerText: str});}
}


/* -------------------------------------------------- *\
|---   HELP RELATING THE NAV. (The Top Floaty Bit)  ---|

Maybe ToDo: Maybe update the thing to use ce

The Logo at the Center will automatically be populated with
image found the following URL: "/logo.png"

navData = [
    {text: "Option Ichi", link: "#a", subOpts: []},

    {text: "Option Ni"},
    
    {logo: true, src: "/logo.png"},

    {
        text: "Option San",
        link: "#b",
        subOpts: [
            {
                text: "Sub-Option C",
                link: "#c"
            },
            {
                text: "Sub-Option D",
                link: "#d"
            },
            {
                text: "Sub-Option E",
                link: "/"
            },
        ]
    },

    {text: "Option 4", subOpts: [{}]}
]
createNav(navData)

\* -------------------------------------------------- */
function createNav(navData, forceMobile=false){
    if (forceMobile || window.innerWidth < mobileUiThreshold){        
        drwrTop = ce("div");
        drwrTop.id = "drwrTop";
        drwrTop.append(
            "Pages",
            Object.assign(matSym("close"), {
                classList: "rNavBtn material-symbols-outlined",
                onclick: function(){drwr.style.display = "none";drwrBack.style.display = "none";navCont.style.height = "auto"},
            })
        )
        
        drwrBody = ce("div");
        drwrBody.id = "drwrBody";

        let drwr = ce("div");
        drwr.id = "drwr";
        drwr.className = "frostFX";
        drwr.append(drwrTop, drwrBody)
        
        for (index1 in navData){
            if (navData[index1].logo){}
            else{
                let drwrOpts = ce("span");
                drwrOpts.className = "drwrOpts rNavBtn";
                drwrOpts.append(navData[index1].text);
                if (typeof(navData[index1].link)=='string'){
                    drwrOpts.rLink = navData[index1].link;
                    drwrOpts.onclick = function(){location.href = this.rLink;}
                }
                drwrBody.append(drwrOpts);

                if (typeof(navData[index1]["subOpts"]) == "object"){
                    for (index2 in navData[index1]["subOpts"]){
                        let drwrSubOpts = ce("span");
                        drwrSubOpts.className = "drwrSubOpts rNavBtn";
                        drwrSubOpts.append(matSym("open_in_new"), navData[index1]["subOpts"][index2].text);
                        if (typeof(navData[index1]["subOpts"][index2].link)=='string'){
                            drwrSubOpts.rLink = navData[index1]["subOpts"][index2].link;
                            drwrSubOpts.onclick = function(){location.href = this.rLink;}
                        }
                        
                        drwrBody.append(drwrSubOpts);
                    }
                }

            }
        }


        let navPiImg = ce("img");
        navPiImg.src = navData[index1].src || "/logo.png";
        let navPi = ce("div");
        navPi.id = "navPi";
        navPi.onclick = function(){location.href = "/";};
        navPi.append(navPiImg);
        let navPiCont = ce("div");
        navPiCont.id = "navPiCont";
        navPiCont.append(navPi);

        let menuSym = matSym("menu");
        menuSym.classList = "rNavBtn material-symbols-outlined";
        menuSym.onclick = function(){drwr.style.display = "flex";drwrBack.style.display = "block";navCont.style.height = "100%"}
        let homeSym = matSym("home");
        homeSym.classList = "rNavBtn material-symbols-outlined";
        homeSym.onclick = function(){location.href = "/";}

        let nav = ce("div");
        nav.id = "nav";
        nav.className = "frostFX";
        nav.append(menuSym, navPiCont, homeSym);

        let css = ce("style"); //ToDo: MobileUI Nav CSS to DOM.
        css.append(`
            .rNavBtn{padding: 8px 0px;margin: 2px 12px;border-radius: 10px;transition: ease-in 100ms;}
            .rNavBtn:hover{color: var(--color10);background: #00000040;padding: 8px 10px;margin: 2px 2px;transition: ease-out 200ms;}
            #drwr{position: absolute;top: 0;bottom: 0;left: 0;right: 80px;display: none;flex-direction: column;text-shadow: var(--color60) 0px 0px 10px;}
            #drwrTop{color: var(--color30);display: flex;align-items: center;justify-content: space-between;padding: 5px 10px;font-weight: 600;font-size: 25px;text-shadow: var(--color30) 0px 0px 10px;}
            #drwrTop .material-symbols-outlined{font-size: 40px;}
            #drwrBody{display: flex;flex-direction: column;overflow-y: scroll;overflow-x: none;}
            #drwrBody .material-symbols-outlined{font-size: 14px;max-width: 14px;margin-right: 5px;position: relative;top: 2px;}
            #drwrBack{display: none;position: absolute;top: 0;bottom: 0;right: 0px;width: 80px;backdrop-filter: brightness(0.20);}
            .drwrOpts{font-weight: 600;font-size: 16px;color: var(--color30);}
            .drwrSubOpts{font-weight: 400;font-size: 14px;color: var(--color30Shade);margin-left: 25px;}
            #navCont{z-index:3;position: fixed;top: 0px;width: 100%;text-shadow: var(--color60) 0px 0px 10px, var(--color60) 0px 0px 5px;}
            #nav{color: var(--color30);text-shadow: var(--color30) 0px 0px 10px;display: flex;align-items: center;justify-content: center;height: 60px;padding: 0px 10px;border-radius: 0px 0px 25px 25px;}
            #nav .material-symbols-outlined{font-size: 30px;}
            #navPiCont{position: relative;top: 15px;width: 100%;display: flex;justify-content: center;}
            #navPi{height:80px;width:80px;border-radius: 50%;background: linear-gradient(180deg, #F5F5F5 0%, #a5a5a5 100%);box-shadow: var(--color60) 0px 0px 20px 0px, var(--color60) 0px 0px 5px 0px;}
            #navPi img{width:inherit;height:inherit;border-radius:50%;object-fit:contain;}
        `);

        let drwrBack = ce("drwrBack");
        drwrBack.id = "drwrBack";
        drwrBack.onclick = function(){drwr.style.display = "none";drwrBack.style.display = "none";navCont.style.height = "auto"}
        
        let navCont = document.getElementById("navCont");
        navCont.innerHTML = "";
        navCont.append(nav, drwrBack, drwr, css);
    }else{

        let navLn1 = ce("div");
        navLn1.id = "navLn1";
    
        let navLn2 = ce("div");
        navLn2.id = "navLn2";
    
        for(index1 in navData){
            if (navData[index1].logo){
                let navPiImg = ce("img");
                navPiImg.src = navData[index1].src || "/logo.png";
    
                let navPi = ce("div");
                navPi.id = "navPi";
                navPi.onclick = function(){location.href = "/";};
                navPi.append(navPiImg);
                
                let navPiCont = ce("div");
                navPiCont.id = "navPiCont";
                navPiCont.append(navPi);
                
                navLn1.append(navPiCont);
            }else{
                let navLn1Opts = ce("span");
                navLn1Opts.className = "navLn1Opts rNavBtn";
                navLn1Opts.innerText = navData[index1].text;
                if (typeof(navData[index1].link)=='string'){
                    navLn1Opts.rLink = navData[index1].link;
                    navLn1Opts.onclick = function(){location.href = this.rLink;}
                }
        
                if (typeof(navData[index1]["subOpts"]) == "object"){
                    navLn1Opts.append(matSym("expand_more"));
                    navLn1Opts.subOpts=navData[index1]["subOpts"];
    
                    navLn1Opts.onmouseenter = function(){
                        navLn2.innerHTML = "";
                        navLn2.style.marginBottom = "15px";
                        navLn2.style.marginTop = "35px";
                        navLn2.style.display = "flex";
    
                        for (index2 in this.subOpts){
                            let navLn2Opts = ce("span");
                            navLn2Opts.className = "navLn2Opts rNavBtn";
                            navLn2Opts.append(matSym("open_in_new"), this.subOpts[index2].text);
                            if (typeof(this.subOpts[index2].link)=='string'){
                                navLn2Opts.rLink = this.subOpts[index2].link;
                                navLn2Opts.onclick = function(){location.href = this.rLink;}
                            }
                            
                            navLn2.append(navLn2Opts);
                        }
                    }
                }else{
                    navLn1Opts.onmouseenter = function(){
                        navLn2.innerHTML = "";
                        navLn2.style.marginBottom = "0px";
                        navLn2.style.marginTop = "0px";
                        navLn2.style.display = "none";
                    }
                }
                
                navLn1.append(navLn1Opts);
            }
        }
    
        let nav = ce("div");
        nav.id = "nav";
        nav.className = "frostFX";
        nav.append(navLn1, navLn2);
        nav.onmouseleave = function(){
            navLn2.innerHTML = "";
            navLn2.style.marginBottom = "0px";
            navLn2.style.marginTop = "0px";
            navLn2.style.display = "none";
        }

        let css = ce("style");
        css.append(`
            #navCont{z-index:3;position: fixed;top: 20px;width: 100%;display: flex;justify-content: center;text-shadow: var(--color60) 0px 0px 10px, var(--color60) 0px 0px 5px;}
            #nav{white-space: nowrap;padding: 0px 15px;border-radius: 25px;}
            #navLn1{display: flex;justify-content: center;align-items: center;height: 90px;}
            #navLn1 .material-symbols-outlined{font-size: 24px;max-width: 24px;position: relative;top: 1px;}
            .navLn1Opts{color: var(--color30);font-weight: 400;display: flex;justify-content: center;font-size: 20px;}
            #navPiCont{position: relative;top: 20px;}
            #navPi{height: 112px;width: 112px;border-radius: 50%;cursor: pointer;background: linear-gradient(180deg, #F5F5F5 0%, #a5a5a5 100%);box-shadow: var(--color60) 0px 0px 20px 0px, var(--color60) 0px 0px 5px 0px;}
            #navPi img{width:inherit;height:inherit;border-radius:50%;object-fit:contain;}
            #navLn2{display: flex;flex-direction: column;}
            #navLn2 .material-symbols-outlined{font-size: 17px;max-width: 17px;margin-right: 5px;position: relative;top: 2px;}
            .navLn2Opts{font-size: 18px;font-weight: 400;color: var(--color30Shade);}            
            .rNavBtn{padding: 8px 0px;margin: 2px 12px;border-radius: 10px;transition: ease-in 100ms;cursor: pointer;}
            .rNavBtn:hover{color: var(--color10);background: #00000040;font-weight: 600;padding: 8px 10px;margin: 2px 2px;transition: ease-out 200ms;}
        `);
    
        let navCont = document.getElementById("navCont");
        navCont.innerHTML = "";
        navCont.append(nav, css);
        
        css.append(`
            @media only screen and (max-width: ${nav.offsetWidth || 1000}px){
                #nav{padding: 0px 10px;border-radius: 20px;}
                #navLn1{height: 60px;}
                #navLn1 .material-symbols-outlined{font-size: 18px;max-width: 18px;}
                .navLn1Opts{font-size: 14px;}
                #navPi{height: 80px;width: 80px;}
                #navLn2 .material-symbols-outlined{font-size: 14px;max-width: 14px;}
                .navLn2Opts{font-size: 14px;}
                .rNavBtn{padding: 4px 0px;margin: 1px 6px;border-radius: 5px;}
                .rNavBtn:hover{padding: 4px 5px;margin: 1px 1px;}
            }
        `)

    }

}



/* -------------------------------------------------- *\
|---           HELP RELATING THE SubNav.            ---|

subNavData = {
    text: "",
    subText: "",
    image: "URL"
}
createSubNav(subNavData)

\* -------------------------------------------------- */
function createSubNav(subNavData){
    try{
        let subNavCont = document.getElementById("subNavCont");
        subNavCont.innerHTML = "";
        subNavCont.append(
            ce("div", {id: "subNavImg", style: `background: url("${subNavData.image}");background-repeat: no-repeat;background-position: center;background-size: cover`}),
            ce("div", {id: "subNavTxt", innerText: subNavData.text || siteName}),
            ce("div", {id: "subNavSubTxt", innerText: subNavData.subText || siteName})
        );
    }catch(e){}
}



/* -------------------------------------------------- *\
|---          HELP RELATING THE OverPage.           ---|
\* -------------------------------------------------- */

function createOP(title, bodyDom){
    document.getElementById("overPage").innerHTML = "";
    document.getElementById("overPage").append(
        ce("div", {className: "OPCard"}, [
            ce("div", {className: "OPTopBar"}, [
                title,
                matSym("close", {className: "rBtn material-symbols-outlined", onclick: function(){document.getElementById("overPage").style.display = "none";}})
            ]),
            bodyDom
        ])
    );
    document.getElementById("overPage").style.display = "flex";
}



/* -------------------------------------------------- *\
|---         HELP RELATING THE Notice Box.          ---|

artclData = {
    title: "",
    boardID: "",
    artclID: "",
    date: 0,
    body: "",
    images: ["URL", "URL"]
}
createArticle(navData)

ToDo: Expand images when clicked/tapped upon.
ToDo: Create the "Share" area. (Below Images)
ToDo: Implement something like **MarkDown** for innerText.

\* -------------------------------------------------- */
function createArticle(artclData){
    let dateObj = new Date(artclData.date);

    return ce("div", {className: "artcl"}, [
        ce("div", {className: "artclTop"}, [
            ce("div", {className: "rSectTitle"}, [matSym("newspaper", {style: "margin-right: 5px;"}), ce("span", {innerText: artclData.title})]),
            ce("div", {className: "rSectGrayTxt"}, [matSym("schedule", {style: "margin-right: 5px;"}), ce("b", {innerText: "Date:", style: "margin-right: 5px;"}), ce("span", {innerText: `${dateObj.getDate()}/${dateObj.getMonth()}/${dateObj.getFullYear()}`})]),
            ce("div", {className: "rSectGrayTxt"}, [matSym("fingerprint", {style: "margin-right: 5px;"}), ce("b", {innerText: "WebID:", style: "margin-right: 5px;"}), ce("span", {innerText: artclData.artclID})]),
        ]),
        ce("div", {className: "artclDiv artclBody"}, [parseMD(artclData.body)]),
        ce("div", {className: "artclDiv"}, [
            ce("hr"),
            ce("div", {className: "rSectGrayTxt"}, [matSym("photo", {style: "margin-right: 5px;"}), ce("span", {innerText: "Images"})]),
            ce("div", {className: "artclImgCont"}, function(){
                let retVal=[];
                for(index in artclData.images){retVal.push(ce("img", {src: artclData.images[index]}));}
                return retVal;
            }()),
        ]),
        ce("div", {className: "artclDiv"}, [
            ce("hr"),
            ce("div", {className: "rSectGrayTxt"}, [matSym("share", {style: "margin-right: 5px;"}), ce("span", {innerText: "Share"})]),
            ce("div", {className: "artclShare"}, [
                ce("div", {className: "rBtn", onclick: function(){window.open(`${window.location.origin}/article/?boardID=${artclData.boardID||""}&artclID=${artclData.artclID||""}`, "_blank");}}, [matSym("link")]),
                ce("div", {className: "rBtn", onclick: function(){}}, [matSym("mail")]),
            ]),
        ]),
    ]);
}

function createArtclCard(artclData){
    let dateO = new Date(artclData.date);
    let body = ce("div", {className: "rCardBody"});
    if (typeof(artclData.images) == "object"){
        if(artclData.images.length > 0){
            body.append(ce("img", {src: artclData.images[0]}));
        }else{
            body.append(parseMD(artclData.body));
        }
    }else{
        body.append(parseMD(artclData.body));
    }
    return ce("div", {className: "rCard", onclick: function(){location.href = `/article/?boardID=Notice&artclID=${artclData.artclID}`;}}, [
        ce("div", {classList: "rCardTtl", innerText: artclData.title}),
        ce("div", {className: "rCardDate"}, [matSym("schedule", {style: "margin-right:5px;"}), ce("span", {}, [ce("b", {}, ["Date: "]), `${dateO.getDate()}/${dateO.getMonth()}/${dateO.getFullYear()}`])]),
        body
    ]);
}


/* -------------------------------------------------- *\
|---          HELP RELATING THE prsnCard.           ---|

prsnData = {
    name: "",
    post: "",
    image: "",
    body: "",
    prsnID: ""
}
createPrsnCard(prsnData)

\* -------------------------------------------------- */

function createPrsnCard(prsnData){
    return ce("div", {className: "prsnCard"}, [
        ce("div", {className: "prsnCardBGTop"}),
        ce("div", {className: "prsnCardFG"}, [
            ce("div", {className: "prsnCardName", innerText: prsnData.name}),
            ce("div", {className: "prsnCardPost"}, [matSym("work", {style: "margin-right:5px;"}), ce("span", {}, ["Post:", ce("b",{innerText: prsnData.post, style: "margin-left:5px"})])]),
            ce("img", {className: "prsnCardImg", src: prsnData.image}),
            ce("div", {className: "prsnCardBody"}, [parseMD(prsnData.body)]),
            ce("div", {className: "prsnCardID"}, [matSym("fingerprint", {style: "margin-right:5px;"}), ce("span", {}, [ce("b", {}, ["WebID: "]), prsnData.prsnID])]),
        ])
    ]);
}



/* -------------------------------------------------- *\
|---           HELP RELATING THE Footer.            ---|

ftrData = {
}
createFtr(ftrData)

\* -------------------------------------------------- */

function createFtr(ftrData){

}



/* -------------------------------------------------- *\
|---                    Page Init                   ---|
\* -------------------------------------------------- */
function loadCommonData(callback){
    db.collection("siteData").doc("common").get().then((ref)=>{
        commonDBData = ref.data();
        callback();
    });
}
function initPage(arg={pageName: undefined, subNavImage: undefined, onCommonLoad: undefined, extraCSS: undefined}){
    loadCommonData(()=>{
        // Set Colors
        try{commonDBData.colors.color10}catch(e){commonDBData = Object(commonDBData);commonDBData["colors"]={};}
        let commonCSSExtra = ce("style");
        commonCSSExtra.append(`
            :root{
                --color10: ${commonDBData.colors.color10 || "#ff4466"};
                --color10Tint: ${commonDBData.colors.color10Tint || "#ffaabb"};
                --color30: ${commonDBData.colors.color30 || "#ffffff"};
                --color30Shade: ${commonDBData.colors.color30Shade || "#b5b5b5"};
                --color60: ${commonDBData.colors.color60 || "#151515"};
                --color60Tint: ${commonDBData.colors.color60Tint || "#202020"};
                --colorGreen: ${commonDBData.colors.colorGreen || "#10f060"};
                --mobileUiThreshold: ${mobileUiThreshold}px;
            }
            @media only screen and (max-width: ${mobileUiThreshold}px){
                #subNavImg{max-height: 150px;min-height: 150px;}#subNavTxt{font-size: 25px;}#subNavSubTxt{font-size: 18px;}
            }
        `, arg.extraCSS);
        document.head.append(commonCSSExtra);
    
        // Load Nav
        createNav(commonDBData.navData || navData);
    
        // Load Footer
        createFtr(commonDBData.ftrData);
        
        // Load SubNav And Set Page Title
        createSubNav({image: arg.subNavImage || Object(Object(commonDBData.pinnedPhotos)[Math.floor(Math.random() * (Object(commonDBData.pinnedPhotos).length)) || 0]).url, text: commonDBData.siteName || siteName, subText: arg.pageName || ""});
        document.getElementsByTagName("head")[0].append(ce("title", {}, [`${arg.pageName || ""} - ${commonDBData.siteName || siteName}`]));

        // OnLoad Callback
        if (typeof(arg.onCommonLoad) == 'function'){arg.onCommonLoad();}
    });
}