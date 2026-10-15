// ==========================================
// SEARCH AND STATUS FILTER
// ==========================================

// Kinukuha ang search input kung mayroon sa page
const searchInput = document.getElementById("search-item");

// Kinukuha ang status dropdown kung mayroon sa page
const statusFilter = document.getElementById("item-status");

// Kinukuha ang no-results message kung mayroon sa page
const noResults = document.getElementById("noResults");

// Kinukuha ang lahat ng existing item cards
const itemCards = document.querySelectorAll(".item-card");

// Function para mag-search at mag-filter ng items
function filterItems() {

    // Huminto kung wala ang search input o status dropdown
    if (!searchInput || !statusFilter) {
        return;
    }

    // Kinukuha ang search text at ginagawang lowercase
    const searchValue = searchInput.value.toLowerCase().trim();

    // Kinukuha ang napiling status
    const selectedStatus = statusFilter.value;

    // Variable para malaman kung may matching item
    let found = false;

    // Sinusuri ang bawat item card
    itemCards.forEach(function(card) {

        // Kinukuha ang pangalan ng item
        const itemName = (card.dataset.name || "").toLowerCase();

        // Kinukuha ang status ng item
        const itemStatus = card.dataset.status || "";

        // Sinusuri kung tumutugma ang pangalan sa search
        const matchSearch = itemName.includes(searchValue);

        // Sinusuri kung tumutugma ang status
        const matchStatus =
            selectedStatus === "all" ||
            itemStatus === selectedStatus;

        // Ipinapakita ang item kung tugma ang search at status
        if (matchSearch && matchStatus && searchValue !== "") {

            card.style.display = "flex";
            found = true;

        } else {

            // Itinatago ang item kung hindi tugma
            card.style.display = "none";
        }
    });

    // Ipinapakita o itinatago ang no-results message
    if (noResults) {
        noResults.style.display = found ? "none" : "block";
    }
}

// Nag-a-activate ng search habang nagta-type ang user
if (searchInput) {
    searchInput.addEventListener("input", filterItems);
}

// Nag-a-activate ng filter kapag nagbago ang dropdown
if (statusFilter) {
    statusFilter.addEventListener("change", filterItems);
}


// ==========================================
// LOGOUT
// ==========================================

// Function para bumalik sa Home page
function logoutBtn() {
    window.location.href = "index.html";
}


// ==========================================
// LOAD SAVED ITEMS
// ==========================================

// Kinukuha ang items na naka-save sa localStorage
var savedItemData = localStorage.getItem("itemData");

// Variable para sa listahan ng items
var books;

// Kung may saved items na, gamitin ang mga iyon
if (savedItemData !== null) {

    books = JSON.parse(savedItemData);

} else {

    // Kung wala sa itemData, tingnan ang dating pkc_items
    var previousData = localStorage.getItem("pkc_items");

    if (previousData !== null) {

        // I-load ang dating saved items
        books = JSON.parse(previousData);

        // Ilipat ang data sa iisang storage key
        localStorage.setItem("itemData", JSON.stringify(books));

    } else {

        // Default books kung wala pang saved data
        books = [
            {
                name: "To Kill a Mockingbird",
                itemID: "BK-001",
                status: "available"
            },
            {
                name: "The Alchemist",
                itemID: "BK-002",
                status: "available"
            },
            {
                name: "Noli Me Tangere",
                itemID: "BK-003",
                status: "available"
            },
            {
                name: "Pride and Prejudice",
                itemID: "BK-004",
                status: "available"
            },
            {
                name: "El Filibusterismo",
                itemID: "BK-005",
                status: "available"
            }
        ];

        // I-save ang default books
        localStorage.setItem("itemData", JSON.stringify(books));
    }
}


// ==========================================
// ADD ITEM
// ==========================================

// Function para magdagdag ng item
function addItem() {

    // Kinukuha ang Item ID
    var itemID = document.getElementById("ItemID").value.trim();

    // Kinukuha ang pangalan ng item
    var itemName = document.getElementById("ItemName").value.trim();

    // Kinukuha ang status
    var status = document.getElementById("item-status").value;

    // Sinusuri kung may kulang na details
    if (
        itemID === "" ||
        itemName === "" ||
        status === "" ||
        status === "all"
    ) {
        alert("Please complete all item details!");
        return;
    }

    // Sinusuri kung may kaparehong Item ID
    var duplicate = books.some(function(item) {
        return item.itemID.toLowerCase() === itemID.toLowerCase();
    });

    // Hindi papayagan ang duplicate Item ID
    if (duplicate) {
        alert("This Item ID already exists!");
        return;
    }

    // Idinadagdag ang bagong item sa array
    books.push({
        name: itemName,
        itemID: itemID,
        status: status
    });

    // Sine-save ang updated list
    localStorage.setItem("itemData", JSON.stringify(books));

    // Ina-update ang table kung naroon sa page
    displayItems();

    // Nagpapakita ng success message
    alert("Item Added Successfully!");

    // Nililinis ang form
    clearForm();
}


// ==========================================
// DISPLAY ITEMS
// ==========================================

// Function para ipakita ang items sa librarian table
function displayItems() {

    // Hinahanap ang table body sa HTML
    var itemTable = document.getElementById("itemTable");

    // Huminto kung wala ang table sa current page
    if (!itemTable) {
        return;
    }

    // Dito ilalagay ang HTML rows
    var table = "";

    // Inuulit ang bawat item sa array
    for (var i = 0; i < books.length; i++) {

        // Simula ng table row
        table += "<tr>";

        // Ipinapakita ang Item ID
        table += "<td>" + books[i].itemID + "</td>";

        // Ipinapakita ang pangalan ng item
        table += "<td>" + books[i].name + "</td>";

        // Ipinapakita ang status
        table += "<td>" + books[i].status + "</td>";

        // Simula ng column para sa actions
        table += "<td>";

        // Gumagawa ng Edit button
        table +=
            "<input type='button' value='Edit' onclick='editBtn(" + i + ")'>";

        // Gumagawa ng Delete button
        table +=
            "<input type='button' value='Delete' onclick='deleteBtn(" + i + ")'>";

        // Katapusan ng actions column
        table += "</td>";

        // Katapusan ng table row
        table += "</tr>";
    }

    // Ipinapasok ang lahat ng rows sa table
    itemTable.innerHTML = table;
}


// ==========================================
// EDIT ITEM
// ==========================================

// Index ng item na kasalukuyang ine-edit
var editIndex = -1;

// Function kapag pinindot ang Edit button
function editBtn(index) {

    // Itinatala ang index ng napiling item
    editIndex = index;

    // Inilalagay ang kasalukuyang Item ID sa form
    document.getElementById("ItemID").value = books[index].itemID;

    // Inilalagay ang pangalan sa form
    document.getElementById("ItemName").value = books[index].name;

    // Inilalagay ang status sa dropdown
    document.getElementById("item-status").value = books[index].status;

    // Pinapalitan ang Add Item button para maging Update Item
    document.getElementById("addItem").value = "Update Item";

    // Ikokonekta ang button sa updateItem function
    document.getElementById("addItem").onclick = updateItem;

    // Ipinapakita ang editing message kung mayroon nito
    var message = document.getElementById("message");

    if (message) {
        message.textContent = "Editing Item: " + books[index].name;
    }
}


// ==========================================
// UPDATE ITEM
// ==========================================

// Function para i-save ang pagbabago sa item
function updateItem() {

    // Sinusuri kung valid ang index
    if (editIndex < 0 || editIndex >= books.length) {
        return;
    }

    // Kinukuha ang bagong Item ID
    var itemID = document.getElementById("ItemID").value.trim();

    // Kinukuha ang bagong pangalan
    var itemName = document.getElementById("ItemName").value.trim();

    // Kinukuha ang bagong status
    var status = document.getElementById("item-status").value;

    // Sinusuri kung may kulang na details
    if (
        itemID === "" ||
        itemName === "" ||
        status === "" ||
        status === "all"
    ) {
        alert("Please complete all item details!");
        return;
    }

    // Sinusuri kung ginagamit ng ibang item ang ID
    var duplicate = books.some(function(item, index) {
        return (
            index !== editIndex &&
            item.itemID.toLowerCase() === itemID.toLowerCase()
        );
    });

    // Hindi papayagan ang duplicate Item ID
    if (duplicate) {
        alert("This Item ID already exists!");
        return;
    }

    // Pinapalitan ang details ng napiling item
    books[editIndex] = {
        name: itemName,
        itemID: itemID,
        status: status
    };

    // Sine-save ang updated list
    localStorage.setItem("itemData", JSON.stringify(books));

    // Ibinabalik sa normal ang editing state
    editIndex = -1;

    // Nililinis ang form
    clearForm();

    // Ibinabalik ang button sa Add Item
    document.getElementById("addItem").value = "Add Item";

    // Ikinokonekta ulit sa addItem function
    document.getElementById("addItem").onclick = addItem;

    // Ipinapakita ang success message kung mayroon nito
    var message = document.getElementById("message");

    if (message) {
        message.textContent = "Item Updated Successfully!";
    }

    // Ina-update ang table
    displayItems();

    // Nagpapakita ng success alert
    alert("Item Updated Successfully!");
}


// ==========================================
// DELETE ITEM
// ==========================================

// Function para mag-delete ng item
function deleteBtn(index) {

    // Sinusuri kung valid ang index
    if (index < 0 || index >= books.length) {
        return;
    }

    // Humihingi ng confirmation bago mag-delete
    var answer = confirm(
        "Are you sure you want to delete this item? " + books[index].name
    );

    // Kung kinumpirma ng user ang deletion
    if (answer === true) {

        // Tinatanggal ang isang item mula sa array
        books.splice(index, 1);

        // Sine-save ang updated list
        localStorage.setItem("itemData", JSON.stringify(books));

        // Ipinapakita ang success message kung mayroon nito
        var message = document.getElementById("message");

        if (message) {
            message.textContent = "Item Deleted Successfully!";
        }

        // Ina-update ang table
        displayItems();

        // Nagpapakita ng success alert
        alert("Item Deleted Successfully!");

    } else {

        // Kung kinansela ang deletion
        alert("Item Deletion Cancelled!");
    }
}


// ==========================================
// CLEAR FORM
// ==========================================

// Function para linisin ang Add/Edit form
function clearForm() {

    // Hinahanap ang Item ID input
    var itemIDInput = document.getElementById("ItemID");

    // Nililinis ang Item ID kung mayroon nito
    if (itemIDInput) {
        itemIDInput.value = "";
    }

    // Hinahanap ang Item Name input
    var itemNameInput = document.getElementById("ItemName");

    // Nililinis ang Item Name kung mayroon nito
    if (itemNameInput) {
        itemNameInput.value = "";
    }

    // Hinahanap ang status dropdown
    var itemStatusInput = document.getElementById("item-status");

    // Ibinabalik ang status sa unang option
    if (itemStatusInput) {
        itemStatusInput.value = "";
    }

    // Ibinabalik ang button sa Add Item kung mayroon nito
    var addButton = document.getElementById("addItem");

    if (addButton) {
        addButton.value = "Add Item";
        addButton.onclick = addItem;
    }
}


// Ipinapakita ang items kapag nag-load ang page
displayItems();


// ==========================================
// BORROW AND RETURN NAVIGATION
// ==========================================

// Function kapag pinindot ang Borrow button
function borrowBtn() {

    // Humihingi ng confirmation sa user
    var confirmed = confirm("Do you want to book this Item?");

    // Kung kinansela ng user
    if (!confirmed) {

        alert("Book Cancelled!");

    } else {

        // Ipinapaalam na kailangang punan ang form
        alert("Please Fill out this form!");

        // Binubuksan ang borrowing form
        window.location.href = "borrow-form.html";
    }
}


// Function para sa Start Borrow button
function startBorrowbtn() {

    // Ipinapaalam na punan ang borrowing form
    alert("Please Fill out this form!");

    // Binubuksan ang borrowing form
    window.location.href = "borrow-form.html";
}


// Function para sa Return Borrow button
function returnBorrowbtn() {

    // Ipinapaalam na punan ang return form
    alert("Please Fill out this form!");

    // Binubuksan ang return form
    window.location.href = "return-form.html";
}


// ==========================================
// SUBMIT BORROW FORM
// ==========================================

// Function para i-validate at isumite ang borrowing form
function submitBtn() {

    // Kinukuha ang pangalan
    var name = document.getElementById("name").value.trim();

    // Sinusuri kung may pangalan
    if (name === "") {
        alert("Please Enter Your Name!");
        return;
    }

    // Kinukuha ang pangalan ng school
    var school = document.getElementById("school").value.trim();

    // Sinusuri kung may school
    if (school === "") {
        alert("Please Enter Your School!");
        return;
    }

    // Kinukuha ang email address
    var emailAdd = document.getElementById("emailAdd").value.trim();

    // Sinusuri kung may email address
    if (emailAdd === "") {
        alert("Please Enter Your Email Address!");
        return;
    }

    // Kinukuha ang contact number
    var contactNum = document.getElementById("contactNum").value.trim();

    // Sinusuri kung may contact number
    if (contactNum === "") {
        alert("Please Enter Your Contact Number!");
        return;
    }

    // Kinukuha ang book title
    var bookTitle = document.getElementById("bookTitle").value.trim();

    // Sinusuri kung may book title
    if (bookTitle === "") {
        alert("Please Enter Book Title!");
        return;
    }

    // Kinukuha ang Item ID bilang text
    var itemNum = document.getElementById("itemNum").value.trim();

    // Sinusuri kung may Item ID
    if (itemNum === "") {
        alert("Please Enter a Valid Book ID!");
        return;
    }

    // Kinukuha ang borrow date
    var borrowDateValue = document.getElementById("borrowDate").value;

    // Sinusuri kung may borrow date
    if (borrowDateValue === "") {
        alert("Please Enter Borrow Date!");
        return;
    }

    // Kinukuha ang due date
    var dueDateValue = document.getElementById("dueDate").value;

    // Sinusuri kung may due date
    if (dueDateValue === "") {
        alert("Please Enter Due Date!");
        return;
    }

    // Kino-convert ang dates sa Date objects
    var borrow = new Date(borrowDateValue + "T00:00:00");
    var due = new Date(dueDateValue + "T00:00:00");

    // Sinusuri kung mas maaga ang due date kaysa borrow date
    if (due < borrow) {
        alert("Due Date cannot be earlier than Borrow Date!");
        return;
    }

    // Kinukuwenta ang pagitan ng dates sa araw
    var difference = (due - borrow) / (1000 * 60 * 60 * 24);

    // Tatlong araw lang ang pinapayagang borrowing period
    if (difference > 3) {
        alert("Due Date cannot exceed 3 days from the Borrow Date!");
        return;
    }

    // Gumagawa ng unique transaction ID
    var transactionID = "TXN-" + Date.now();

    // Pinagsasama ang borrowing details sa isang object
    const borrowData = {
        name: name,
        school: school,
        emailAdd: emailAdd,
        contactNum: contactNum,
        bookTitle: bookTitle,
        itemNum: itemNum,
        transactionID: transactionID,
        borrowDate: borrowDateValue,
        dueDate: dueDateValue
    };

    // Kino-convert ang borrowing data sa JSON text
    const jsonData = JSON.stringify(borrowData);

    // Hinahanap ang QR code container
    var qrContainer = document.getElementById("qrcode");

    // Huminto kung walang QR container
    if (!qrContainer) {
        alert("QR code container was not found!");
        return;
    }

    // Sinusuri kung available ang QRCode library
    if (typeof QRCode === "undefined") {
        alert("QR code library is not loaded. Please check your HTML script.");
        return;
    }

    // Nililinis ang dating QR code
    qrContainer.innerHTML = "";

    // Gumagawa ng QR code gamit ang transaction ID
    new QRCode(qrContainer, {
        text: transactionID,
        width: 180,
        height: 180
    });

    // Ipinapakita ang borrowing success message
    alert("Borrowing Successful!");

    // Hinahanap ang output container
    var output = document.getElementById("output");

    // Ipinapakita ang borrowing details
    if (output) {
        output.innerHTML =
            "<b>Name: </b>" + name + "<br>" +
            "<b>School Name: </b>" + school + "<br>" +
            "<b>Email Address: </b>" + emailAdd + "<br>" +
            "<b>Contact Number: </b>" + contactNum + "<br>" +
            "<center><b>--------------- Book Information ---------------</b></center><br>" +
            "<b>Book Title: </b>" + bookTitle + "<br>" +
            "<b>Item ID: </b>" + itemNum + "<br>" +
            "<b>Transaction Number: </b>" + transactionID + "<br>" +
            "<b>Borrow Date: </b>" + borrowDateValue +
            " to " + dueDateValue;
    }

    // Naka-prepare ang JSON data para magamit kung kailangan sa susunod
    console.log("Borrow Data:", jsonData);
}