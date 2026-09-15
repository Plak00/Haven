async function loadStock(){

    const set =
    document.getElementById("stockSet").value;


    if(set==="Select Set"){

        alert("Please select set");

        return;

    }


    showLoading("Loading stock...");

    try {

        const products = await getProducts(set);


        const container =
        document.getElementById("stockProducts");


        container.innerHTML="";


        products.forEach(product=>{


            const card =
            document.createElement("div");


            card.className = "product-card " + getNationClass(product.nation);


            card.innerHTML = `

            <div class="product-name">
            ${product.name}
            </div>


            <div>
            Price: ${product.price}
            </div>


            <div>
            Remaining: ${product.remaining}
            </div>

            `;


            container.appendChild(card);


        });


        hideLoading("Ready!");

    }
    catch(error){

        console.log(error);

        hideLoading("Failed to load stock");

        alert("Cannot load stock");

    }

}