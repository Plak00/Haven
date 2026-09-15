function goHome(){

    window.location.href="index.html";

}



async function loadSets(selectID){

    showLoading("Loading sets...");

    try{


        const sets =
        await getSets();


        const select =
        document.getElementById(selectID);


        sets.forEach(set=>{


            const option =
            document.createElement("option");


            option.value=set;
            option.textContent=set;


            select.appendChild(option);


        });

        hideLoading("Ready!");


    }
    catch(error){

        console.log(error);
        alert("Cannot load sets");

    }

}

function showLoading(message = "Loading...") {

    let overlay = document.getElementById("loadingOverlay");

    if (!overlay) {

        overlay = document.createElement("div");

        overlay.id = "loadingOverlay";

        overlay.innerHTML = `
            <div class="loading-box">

                <div class="loading-spinner"></div>

                <div id="loadingMessage">
                    ${message}
                </div>

            </div>
        `;

        document.body.appendChild(overlay);

    }
    else {

        document.getElementById("loadingMessage").textContent = message;

    }

    overlay.style.display = "flex";

}


function hideLoading(message = "Ready!") {

    const overlay =
        document.getElementById("loadingOverlay");

    if (!overlay) return;

    document.getElementById("loadingMessage").textContent = message;

    setTimeout(() => {

        overlay.style.display = "none";

    }, 500);

}

function getNationClass(nation){

    const name = String(nation)
        .trim()
        .toLowerCase();

    if(name.includes("dragon")){
        return "nation-dragon";
    }

    if(name.includes("dark")){
        return "nation-dark";
    }

    if(name.includes("brandt")){
        return "nation-brandt";
    }

    if(name.includes("keter")){
        return "nation-keter";
    }

    if(name.includes("stoicheia")){
        return "nation-stoicheia";
    }

    if(name.includes("lyrical")){
        return "nation-lyrical";
    }

    console.log("Unknown nation:", nation);
    return "";
}