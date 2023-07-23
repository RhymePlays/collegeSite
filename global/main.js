/* -------------------------------------------------- *\
|---            Variables and Parameters            ---|

'mobileUiThreshold'
___________________

The Mobile UI will load after the
value for window.innerWidth goes below
'mobileUiThreshold'.

\* -------------------------------------------------- */

var mobileUiThreshold = 700;

var color10 = "#ff4466";
var color30 = "#ffaabb";
var colorTxt = "#ffffff";
var colorSubTxt = "#d5d5d5";
var colorObjBG = "#202020";
var colorAbsBG = "#151515";



/* -------------------------------------------------- *\
|---   HELP RELATING THE NAV. (The Top Floaty Bit)  ---|

The Logo at the Center will automatically be populated with
image found the following URL: "/logo.png"

navData = [
    {text: "Option Ichi", link: "#a", subOpts: []},

    {text: "Option Ni"},
    
    {logo: true},

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
        clsSym = matSym("close");
        clsSym.classList = "rNavBtn material-symbols-outlined"
        clsSym.onclick = function(){drwr.style.display = "none";drwrBack.style.display = "none";navCont.style.height = "auto"}

        drwrTop = document.createElement("div");
        drwrTop.id = "drwrTop";
        drwrTop.append("Pages", clsSym)
        
        drwrBody = document.createElement("div");
        drwrBody.id = "drwrBody";

        let drwr = document.createElement("div");
        drwr.id = "drwr";
        drwr.className = "frostFX";
        drwr.append(drwrTop, drwrBody)
        
        for (index1 in navData){
            if (navData[index1].logo){}
            else{
                let drwrOpts = document.createElement("span");
                drwrOpts.className = "drwrOpts rNavBtn";
                drwrOpts.append(navData[index1].text);
                if (typeof(navData[index1].link)=='string'){
                    drwrOpts.rLink = navData[index1].link;
                    drwrOpts.onclick = function(){location.href = this.rLink;}
                }
                drwrBody.append(drwrOpts);

                if (typeof(navData[index1]["subOpts"]) == "object"){
                    for (index2 in navData[index1]["subOpts"]){
                        let drwrSubOpts = document.createElement("span");
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


        let navPiImg = document.createElement("div");
        navPiImg.id = "navPiImg";
        let navPi = document.createElement("div");
        navPi.id = "navPi";
        navPi.onclick = function(){location.href = "/";};
        navPi.append(navPiImg);
        let navPiCont = document.createElement("div");
        navPiCont.id = "navPiCont";
        navPiCont.append(navPi);

        let menuSym = matSym("menu");
        menuSym.classList = "rNavBtn material-symbols-outlined";
        menuSym.onclick = function(){drwr.style.display = "flex";drwrBack.style.display = "block";navCont.style.height = "100%"}
        let homeSym = matSym("home");
        homeSym.classList = "rNavBtn material-symbols-outlined";
        homeSym.onclick = function(){location.href = "/";}

        let nav = document.createElement("div");
        nav.id = "nav";
        nav.className = "frostFX";
        nav.append(menuSym, navPiCont, homeSym);

        let stylesheet = document.createElement("style"); //ToDo: MobileUI Nav CSS to DOM.
        stylesheet.append(`
            .rNavBtn{padding: 8px 0px;margin: 2px 12px;border-radius: 10px;transition: ease-in 100ms;}
            .rNavBtn:hover{color: ${color10};background: #00000040;padding: 8px 10px;margin: 2px 2px;transition: ease-out 200ms;}
            #drwr{position: absolute;top: 0;bottom: 0;left: 0;right: 80px;display: none;flex-direction: column;text-shadow: ${colorAbsBG}B0 0px 0px 10px;}
            #drwrTop{color: ${color10};display: flex;align-items: center;justify-content: space-between;padding: 5px 10px;font-weight: 600;font-size: 25px;text-shadow: ${color10}B0 0px 0px 10px}
            #drwrTop .material-symbols-outlined{font-size: 40px;}
            #drwrBody{display: flex;flex-direction: column;overflow-y: scroll;overflow-x: none;}
            #drwrBody .material-symbols-outlined{font-size: 14px;max-width: 14px;margin-right: 5px;position: relative;top: 2px;}
            #drwrBack{display: none;position: absolute;top: 0;bottom: 0;right: 0px;width: 80px;backdrop-filter: brightness(0.20);}
            .drwrOpts{font-weight: 600;font-size: 16px;color: ${color30}}
            .drwrSubOpts{font-weight: 400;font-size: 14px;color: ${colorSubTxt};margin-left: 25px;}
            #navCont{position: fixed;top: 0px;width: 100%;font-family: "Montserrat";text-shadow: ${colorAbsBG}B0 0px 0px 10px, ${colorAbsBG} 0px 0px 5px;}
            #nav{color: ${color10};text-shadow: ${color10}B0 0px 0px 10px;display: flex;align-items: center;justify-content: center;height: 60px;padding: 0px 10px;border-radius: 0px 0px 25px 25px;}
            #nav .material-symbols-outlined{font-size: 30px;}
            #navPiCont{position: relative;top: 15px;width: 100%;display: flex;justify-content: center;}
            #navPi{height: 80px;width: 80px;border-radius: 50%;background: linear-gradient(180deg, #F5F5F5 0%, #a5a5a5 100%);box-shadow: ${colorAbsBG}55 0px 0px 20px 0px, ${colorAbsBG}80 0px 0px 5px 0px;}
            #navPiImg{width: 100%;height:100%;border-radius: 50%;background-image: url("/logo.png");background-position: center;background-repeat: no-repeat;background-size: contain;}
        `);

        let drwrBack = document.createElement("drwrBack");
        drwrBack.id = "drwrBack";
        drwrBack.onclick = function(){drwr.style.display = "none";drwrBack.style.display = "none";navCont.style.height = "auto"}
        
        let navCont = document.getElementById("navCont");
        navCont.innerHTML = "";
        navCont.append(nav, drwrBack, drwr, stylesheet);
    }else{

        let navLn1 = document.createElement("div");
        navLn1.id = "navLn1";
    
        let navLn2 = document.createElement("div");
        navLn2.id = "navLn2";
    
        for(index1 in navData){
            if (navData[index1].logo){
                let navPiImg = document.createElement("div");
                navPiImg.id = "navPiImg";
    
                let navPi = document.createElement("div");
                navPi.id = "navPi";
                navPi.onclick = function(){location.href = "/";};
                navPi.append(navPiImg);
                
                let navPiCont = document.createElement("div");
                navPiCont.id = "navPiCont";
                navPiCont.append(navPi);
                
                navLn1.append(navPiCont);
            }else{
                let navLn1Opts = document.createElement("span");
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
                            let navLn2Opts = document.createElement("span");
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
    
        let nav = document.createElement("div");
        nav.id = "nav";
        nav.className = "frostFX";
        nav.append(navLn1, navLn2);
        nav.onmouseleave = function(){
            navLn2.innerHTML = "";
            navLn2.style.marginBottom = "0px";
            navLn2.style.marginTop = "0px";
            navLn2.style.display = "none";
        }

        let stylesheet = document.createElement("style");
        stylesheet.append(`
            #navCont{position: fixed;top: 20px;width: 100%;display: flex;justify-content: center;font-family: "Montserrat";text-shadow: ${colorAbsBG}B0 0px 0px 10px, ${colorAbsBG} 0px 0px 5px;}
            #nav{white-space: nowrap;padding: 0px 15px;border-radius: 25px;}
            #navLn1{display: flex;justify-content: center;align-items: center;height: 90px;}
            #navLn1 .material-symbols-outlined{font-size: 24px;max-width: 24px;position: relative;top: 1px;}
            .navLn1Opts{color: ${colorTxt};font-weight: 400;display: flex;justify-content: center;font-size: 20px;}
            #navPiCont{position: relative;top: 20px;}
            #navPi{height: 112px;width: 112px;border-radius: 50%;cursor: pointer;background: linear-gradient(180deg, #F5F5F5 0%, #a5a5a5 100%);box-shadow: ${colorAbsBG}55 0px 0px 20px 0px, ${colorAbsBG}80 0px 0px 5px 0px;}
            #navPiImg{width: 100%;height:100%;border-radius: 50%;background-image: url("/logo.png");background-position: center;background-repeat: no-repeat;background-size: contain;}
            #navLn2{display: flex;flex-direction: column;}
            #navLn2 .material-symbols-outlined{font-size: 17px;max-width: 17px;margin-right: 5px;position: relative;top: 2px;}
            .navLn2Opts{font-size: 18px;font-weight: 400;color: ${colorSubTxt};}            
            .rNavBtn{padding: 8px 0px;margin: 2px 12px;border-radius: 10px;transition: ease-in 100ms;cursor: pointer;}
            .rNavBtn:hover{color: ${color10};background: #00000040;font-weight: 600;padding: 8px 10px;margin: 2px 2px;transition: ease-out 200ms;}
        `);
    
        let navCont = document.getElementById("navCont");
        navCont.innerHTML = "";
        navCont.append(nav, stylesheet);
        
        stylesheet.append(`
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

function matSym(id){
    let sym = document.createElement("span");
    sym.className = "material-symbols-outlined";
    sym.innerText = id;
    return sym
}

createNav(
    [
        {text: "Option Ichi", link: "/", subOpts: []},
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
        {logo: true},
        {text: "Option 4", subOpts: [{}]},
        {text: "Option 5", subOpts: [{}]},
        {text: "Option 6", subOpts: [{}]},
    ]
);



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
    let subNavImg = document.createElement("div");
    subNavImg.id = "subNavImg";
    subNavImg.style.background = `url("${subNavData.image}")`;
    subNavImg.style.backgroundRepeat = "no-repeat";
    subNavImg.style.backgroundPosition = "center";
    subNavImg.style.backgroundSize = "cover";

    let subNavTxt = document.createElement("div");
    subNavTxt.id = "subNavTxt";
    subNavTxt.innerText = subNavData.text;

    let subNavSubTxt = document.createElement("div");
    subNavSubTxt.id = "subNavSubTxt";
    subNavSubTxt.innerText = subNavData.subText;

    let stylesheet = document.createElement("style");
    stylesheet.append(`
        #subNavCont{font-family: "Montserrat";display: flex;flex-direction: column;align-items: center}
        #subNavImg{max-width: 100%;min-width: 100%;max-height: 250px;min-height: 250px;}
        #subNavTxt{margin-top: 30px;font-size: 35px;font-weight: 600;text-align: center;color: ${color10};text-shadow: ${color10}B0 0px 0px 10px;}
        #subNavSubTxt{margin-top: 10px;margin-bottom: 30px;font-size: 25px;text-align: center;color: ${color30};text-shadow: ${color30}B0 0px 0px 10px;}
        @media only screen and (max-width: ${mobileUiThreshold}px){#subNavImg{max-height: 150px;min-height: 150px;}#subNavTxt{font-size: 25px;}#subNavSubTxt{font-size: 18px;}}
    `);
    
    let subNavCont = document.getElementById("subNavCont");
    subNavCont.innerHTML = "";
    subNavCont.append(subNavImg, subNavTxt, subNavSubTxt, stylesheet);
}



/* -------------------------------------------------- *\
|---           HELP RELATING THE Footer.            ---|

ftrData = {
}
createFtr(ftrData)

\* -------------------------------------------------- */

function createFtr(ftrData){

}