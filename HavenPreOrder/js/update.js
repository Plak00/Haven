let allOrders = [];
let selectedOrder = null;

async function searchOrders() {

    const set =
        document.getElementById("updateSet").value;

    if (set === "Select Set") {
        alert("Please select a set");
        return;
    }

    const seller =
        document.getElementById("sellerFilter").value;

    const keyword =
        document.getElementById("customerFilter")
            .value
            .trim()
            .toLowerCase();


    showLoading("Searching orders...");

    try {

        allOrders = await getOrders(set);


        let result = allOrders.filter(order => {

            const sellerMatch =
                seller === "All" ||
                order.seller === seller;

            const customerMatch =
                order.customer
                    .toLowerCase()
                    .includes(keyword);

            return sellerMatch && customerMatch;

        });


        showSearchResult(result);


        hideLoading("Ready!");

    }
    catch(error) {

        console.error("Search error:", error);

        hideLoading("Failed to load orders");

        alert("Cannot load orders");

    }

}

function showSearchResult(orders) {

    const container =
        document.getElementById("searchResult");

    container.innerHTML = "";

    if (orders.length === 0) {

        container.innerHTML =
            "<p>No order found.</p>";

        return;

    }

    orders.forEach(order => {

        container.innerHTML += `
            <div class="product-card">

                <b>${order.id}</b><br>

                Customer :
                ${order.customer}<br>

                Seller :
                ${order.seller}<br>

                Payment :
                ${order.paymentStatus}<br>

                Remaining :
                ${order.remaining}

                <br><br>

                <button onclick="selectOrder('${order.id}')">
                    Edit
                </button>

            </div>
        `;

    });

}

function selectOrder(orderID) {

    selectedOrder =
        allOrders.find(o => o.id === orderID);

    const editor =
        document.getElementById("orderEditor");

    editor.classList.remove("hidden");

    editor.innerHTML = `

    <h2>✏️ Editing ${selectedOrder.id}</h2>

    <p><b>Customer:</b> ${selectedOrder.customer}</p>

    <p><b>Total:</b> ${selectedOrder.total}</p>

    <p><b>Deposit:</b> ${selectedOrder.deposit}</p>

    <label>Pay Later</label>

    <input
        id="payLater"
        type="number"
        value="${selectedOrder.payLater}">

    <br><br>

    <label>Receive Method</label>

    <select id="editReceive">
        <option value="Pick Up">Pick Up</option>
        <option value="Delivery">Delivery</option>
        <option value="For me">For me</option>
    </select>

    <div id="editAddressArea" class="hidden">

        <label>Address</label>

        <textarea id="editAddress"></textarea>

    </div>

    <div id="editPickupArea" class="hidden">

        <label>Pickup Location</label>

        <select id="editPickupLocation">

            <option value="Haven TCG">
                Haven TCG
            </option>

            <option value="Other">
                Other
            </option>

        </select>

    </div>

    <div id="editPickupOtherArea" class="hidden">

        <label>Pickup Details</label>

        <input
            id="editPickupOther"
            placeholder="Example: Mega Bangna">

    </div>

    <br>



    
    <button id="saveOrderButton" onclick="saveOrder()">
        Save
    </button>

    `;

    document.getElementById("editReceive").value =
        selectedOrder.receive;

    if (selectedOrder.receive === "Delivery") {

        document
            .getElementById("editAddress")
            .value = selectedOrder.address;

    }
    else if (selectedOrder.receive === "Pick Up") {

        if (selectedOrder.address === "Haven TCG") {

            document
                .getElementById("editPickupLocation")
                .value = "Haven TCG";

        }
        else {

            document
                .getElementById("editPickupLocation")
                .value = "Other";

            document
                .getElementById("editPickupOther")
                .value = selectedOrder.address;

        }

    }

    updateReceiveUI();

    editor.scrollIntoView({
    behavior: "smooth",
    block: "start"
    });

    document
    .getElementById("editReceive")
    .addEventListener("change", updateReceiveUI);

document
    .getElementById("editPickupLocation")
    .addEventListener("change", updateReceiveUI);

}




async function saveOrder() {

    const saveButton =
        document.getElementById("saveOrderButton");

    // Prevent double click
    if (saveButton.disabled) {
        return;
    }

    // Disable immediately
    saveButton.disabled = true;
    saveButton.textContent = "Saving...";

    try {

        const receive =
            document.getElementById("editReceive").value;

        let address = "";

        if (receive === "Delivery") {

            address =
                document.getElementById("editAddress").value;

        }
        else if (receive === "Pick Up") {

            const place =
                document.getElementById("editPickupLocation").value;

            if (place === "Other") {

                address =
                    document.getElementById("editPickupOther").value;

            }
            else {

                address = place;

            }

        }

        const payload = {

            set:
                document.getElementById("updateSet").value,

            orderID:
                selectedOrder.id,

            payLater:
                Number(
                    document.getElementById("payLater").value
                ),

            receive:
                receive,

            address:
                address

        };

        console.log("Updating order:", payload);

        const response = await fetch(
            API_URL + "?action=updateOrder",
            {
                method: "POST",
                body: JSON.stringify(payload)
            }
        );

        const result =
            await response.json();

        console.log("Update response:", result);

        if (result.success) {

            alert("Order updated");

            // Refresh order list
            await searchOrders();

        }
        else {

            alert(result.message);

            // Allow retry if update failed
            saveButton.disabled = false;
            saveButton.textContent = "Save";

        }

    }
    catch (error) {

        console.error("Update error:", error);

        alert("Failed to update order");

        // Allow retry if request failed
        saveButton.disabled = false;
        saveButton.textContent = "Save";

    }

}

function updateReceiveUI() {

    const receive =
        document.getElementById("editReceive").value;

    document
        .getElementById("editAddressArea")
        .classList.add("hidden");

    document
        .getElementById("editPickupArea")
        .classList.add("hidden");

    document
        .getElementById("editPickupOtherArea")
        .classList.add("hidden");

    if (receive === "Delivery") {

        document
            .getElementById("editAddressArea")
            .classList.remove("hidden");

    }
    else if (receive === "Pick Up") {

        document
            .getElementById("editPickupArea")
            .classList.remove("hidden");

        if (
            document
                .getElementById("editPickupLocation")
                .value === "Other"
        ) {

            document
                .getElementById("editPickupOtherArea")
                .classList.remove("hidden");

        }

    }

}