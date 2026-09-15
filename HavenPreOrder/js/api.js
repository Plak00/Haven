const API_URL =
"https://script.google.com/macros/s/AKfycbwOJwKn4wvu-y-kKr59fRFmFt1P_J_9qUCva6M-WSzDjieigN38BXa3DoLlR_sVtbYRTA/exec";


async function getSets(){

    const response =
    await fetch(
        API_URL + "?action=getSets"
    );

    const data =
    await response.json();

    console.log("getSets:", data);

    return data;

}



async function getProducts(set){

    const response =
    await fetch(
        API_URL +
        "?action=getProducts&set=" +
        encodeURIComponent(set)
    );


    const data =
    await response.json();


    console.log("getProducts:", data);


    return data;

}

async function getOrders(set){

    const response = await fetch(
        API_URL +
        "?action=getOrders&set=" +
        encodeURIComponent(set)
    );

    return await response.json();
}

async function loadSets(selectID) {

    const sets = await getSets();

    const select = document.getElementById(selectID);

    sets.forEach(set => {

        const option = document.createElement("option");

        option.value = set;
        option.textContent = set;

        select.appendChild(option);

    });

}