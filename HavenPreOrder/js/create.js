async function loadProducts(selectID, containerID){

    const set =
    document.getElementById(selectID).value;


    if(!set || set==="Select Set")
    {
        alert("Please select set");
        return;
    }


    showLoading("Loading products...");

    try {

        const products = await getProducts(set);


        const container =
        document.getElementById(containerID);


        container.innerHTML="";


        const complete =
        products.filter(
        p=>p.id.endsWith("_C")
        );


        const singles =
        products.filter(
        p=>!p.id.endsWith("_C")
        );


        complete.forEach(parent=>{


            const children =
            singles.filter(
            child=>child.nation===parent.nation
            );


            container.innerHTML += `
            <div class="complete-box ${getNationClass(parent.nation)}">
                <label>
                <input 
                type="checkbox"
                class="complete-check"
                data-id="${parent.id}"
                data-name="${parent.name}"
                data-price="${parent.price}"
                >
                <b>${parent.name}</b>
                - ${parent.price}
                </label>

                <div class="children">
                ${children.map(child=>`
                    <label>
                    <input
                    type="checkbox"
                    class="child-check"
                    data-parent="${parent.id}"
                    data-id="${child.id}"
                    data-name="${child.name}"
                    data-price="${child.price}"
                    >
                    ${child.name}
                    (${child.price})
                    </label>
                `).join("")}
                </div>
            </div>
            `;


        });


        hideLoading("Ready!");

    }
    catch(error){

        console.log(error);

        hideLoading("Failed to load products");

        alert("Cannot load products");

    }

}

document.addEventListener(
"change",
function(e){


if(e.target.classList.contains("complete-check"))
{


const parent =
e.target.dataset.id;


document
.querySelectorAll(
`.child-check[data-parent="${parent}"]`
)
.forEach(child=>{

child.checked =
e.target.checked;

});


}



if(
e.target.classList.contains("complete-check") ||
e.target.classList.contains("child-check")
){

calculateTotal();

}


});

function calculateTotal(){


let total = 0;



document
.querySelectorAll(".complete-check:checked")
.forEach(item=>{

total += Number(item.dataset.price);

});



document
.querySelectorAll(".child-check:checked")
.forEach(item=>{


const parent =
document.querySelector(
`.complete-check[data-id="${item.dataset.parent}"]`
);



if(!parent.checked){

total += Number(item.dataset.price);

}


});



document.getElementById("totalPrice").value = total;


}

document.addEventListener("DOMContentLoaded", () => {

    const receive = document.getElementById("receive");

    const addressArea = document.getElementById("addressArea");
    const address = document.getElementById("address");

    const pickupArea = document.getElementById("pickupArea");
    const pickupLocation = document.getElementById("pickupLocation");
    const pickupOtherArea = document.getElementById("pickupOtherArea");
    const pickupOther = document.getElementById("pickupOther");

    function updateAddress(){

        addressArea.classList.add("hidden");
        pickupArea.classList.add("hidden");
        pickupOtherArea.classList.add("hidden");

        address.value = "";
        pickupOther.value = "";

        if(receive.value === "Delivery"){

            addressArea.classList.remove("hidden");

        }
        else if(receive.value === "Pick Up"){

            pickupArea.classList.remove("hidden");

            if(pickupLocation.value === "Other"){
                pickupOtherArea.classList.remove("hidden");
            }

        }

    }

    updateAddress();

    receive.addEventListener("change", updateAddress);
    pickupLocation.addEventListener("change", updateAddress);

});



async function createOrder(){


let products = [];


// Complete selections
let selectedParents = [];


document
.querySelectorAll(".complete-check:checked")
.forEach(item=>{


    selectedParents.push(item.dataset.id);


    products.push({

        id:item.dataset.id,
        name:item.dataset.name,
        price:item.dataset.price,
        qty:1

    });


});


// Individual selections

document
.querySelectorAll(".child-check:checked")
.forEach(item=>{


    const parent =
    item.dataset.parent;


    if(!selectedParents.includes(parent)){


        products.push({

            id:item.dataset.id,
            name:item.dataset.name,
            price:item.dataset.price,
            qty:1

        });


    }


});


if(products.length===0){

    alert("Please select product");
    return;

}



const receive =
document.getElementById("receive").value;


const order = {

    set:
    document.getElementById("orderSet").value,

    customer:
    document.getElementById("customer").value,

    products:products,

    totalPrice:
    document.getElementById("totalPrice").value,

    deposit:
    document.getElementById("deposit").value,

    receive:receive,

    address:(()=>{

        if(receive==="Delivery"){

            return document
                .getElementById("address")
                .value;

        }


        if(receive==="Pick Up"){

            const place =
            document
                .getElementById("pickupLocation")
                .value;


            if(place==="Other"){

                return document
                    .getElementById("pickupOther")
                    .value;

            }


            return place;

        }


        return "";

    })(),

    seller:
    document.getElementById("seller").value

};



if(!order.customer){

    alert("Please enter customer name");
    return;

}


if(!order.seller){

    alert("Please select seller");
    return;

}


if(order.set === "Select Set"){

    alert("Please select set");
    return;

}



// Get Create Order button

const createButton =
document.getElementById("createOrderButton");


// Prevent double click

if(createButton.disabled){

    return;

}


// Disable button immediately

createButton.disabled = true;

createButton.textContent = "Creating...";


// Show loading overlay

showLoading("Creating order...");


try {


    console.log("Sending order:",order);


    const response =
    await fetch(

        API_URL+"?action=createOrder",

        {

            method:"POST",

            body:
            JSON.stringify(order)

        }

    );


    const result =
    await response.json();


    console.log("API response:",result);


    if(result.success){

        hideLoading("Order created!");

        alert(
            "Order created: " +
            result.orderID
        );

        location.reload();

    }
    else{

        hideLoading("Failed to create order");


        alert(result.message);


        // Allow retry

        createButton.disabled = false;

        createButton.textContent =
            "Create Order";

    }


}
catch(error){


    console.error(
        "Create order error:",
        error
    );


    hideLoading("Failed to create order");


    alert("Failed to create order");


    // Allow retry

    createButton.disabled = false;

    createButton.textContent =
        "Create Order";

}

}
