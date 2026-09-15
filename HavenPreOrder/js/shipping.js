async function loadShipping() {

    const set =
        document.getElementById("shippingSet").value;

    const receive =
        document.getElementById("shippingReceive").value;


    if (set === "Select Set") {

        alert("Please select a set");
        return;

    }


    showLoading("Loading shipping list...");


    try {

        const orders =
            await getOrders(set);


        const filteredOrders =
            orders.filter(order => {

                if (receive === "All") {
                    return true;
                }

                return order.receive === receive;

            });


        let text = "";


        filteredOrders.forEach((order, index) => {

            if (index > 0) {
                text += "\n\n--------------------\n\n";
            }

            text += order.id + "\n";
            text += "==" + order.products + "==\n";
            text += order.address || "";

        });


        document.getElementById("shippingText").value =
            text;


        hideLoading("Ready!");

    }
    catch(error) {

        console.error("Shipping error:", error);

        hideLoading("Failed to load shipping list");

        alert("Cannot load shipping list");

    }

}



function copyShipping() {

    const text =
        document.getElementById("shippingText");


    text.select();

    document.execCommand("copy");


    alert("Copied");

}



function printShipping() {

    const text =
        document.getElementById("shippingText").value;


    if (!text) {

        alert("Nothing to print");
        return;

    }


    const printWindow =
        window.open("", "_blank");


    printWindow.document.write(`

        <html>

        <head>

            <title>Shipping List</title>

            <style>

                body {
                    white-space: pre-wrap;
                    font-family: Arial, sans-serif;
                    font-size: 18px;
                }

            </style>

        </head>

        <body>

            ${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}

        </body>

        </html>

    `);


    printWindow.document.close();

    printWindow.print();

}
