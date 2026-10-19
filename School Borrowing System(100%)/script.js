// Kinukuha ang search input kung saan nagta-type ang user ng item na hahanapin.
const searchInput = document.getElementById("search-item");

// Kinukuha ang dropdown kung saan pipili ang user ng item status.
const statusFilter = document.getElementById("item-status");

// Kinukuha ang lahat ng element na may class na item-card.
const itemCards = document.querySelectorAll(".item-card");

// Kinukuha ang element na magpapakita ng message kapag walang nahanap na item.
const noResults = document.getElementById("noResults");

// Function na nagsasala ng items batay sa search text at status.
function filterItems() {

    // Itinitigil ang function kung wala ang search input sa kasalukuyang page.
    if (!searchInput) return;

    // Kinukuha ang search text, ginagawang lowercase, at inaalis ang spaces sa magkabilang dulo.
    const searchValue = searchInput.value.toLowerCase().trim();

    // Kinukuha ang napiling status; kung walang dropdown, gagamit ng "all".
    const selectedStatus = statusFilter ? statusFilter.value : "all";

    // Kinukuha ang item cards na nasa homeItems container.
    const itemCards = document.querySelectorAll("#homeItems .item-card");

    // Variable na nagsasaad kung may item na tumugma sa search.
    let found = false;

    // Inuulit ang proseso para sa bawat item card.
    itemCards.forEach(function(card) {

        // Kinukuha ang pangalan ng item at ginagawang lowercase.
        const itemName = (card.dataset.name || "").toLowerCase();

        // Kinukuha ang Item ID at ginagawang lowercase.
        const itemID = (card.dataset.id || "").toLowerCase();

        // Kinukuha ang status ng item at ginagawang lowercase.
        const itemStatus = (card.dataset.status || "").toLowerCase();

        // Tinitingnan kung tumugma ang search text sa pangalan o Item ID.
        const matchSearch =
            itemName.includes(searchValue) ||
            itemID.includes(searchValue);

        // Tinitingnan kung tumugma ang status sa napili ng user o "all" ang napili.
        const matchStatus =
            selectedStatus === "all" ||
            itemStatus === selectedStatus.toLowerCase();

        // Ipinapakita ang card kung may search text at parehong tugma ang pangalan/ID at status.
        if (
            searchValue !== "" &&
            matchSearch &&
            matchStatus
        ) {
            // Ginagawang flex ang display para makita ang card.
            card.style.display = "flex";

            // Itinatala na may nahanap na item.
            found = true;

        } else {
            // Itinatago ang card kung hindi ito tumugma.
            card.style.display = "none";
        }
    });

    // Sinusuri kung umiiral ang element na nagpapakita ng no-results message.
    if (noResults) {

        // Itinatago ang message kung walang inilagay na search text.
        if (searchValue === "") {
            noResults.style.display = "none";

        } else {
            // Ipinapakita ang message kapag walang nahanap; kung mayroon, itinatago ito.
            noResults.style.display = found ? "none" : "block";
        }
    }
}

// Function na nagdadala sa user pabalik sa Home page kapag nag-logout.
function logoutBtn(){

    // Binubuksan ang index.html.
    window.location.href = "index.html";
}

// Kinukuha ang naka-save na inventory data mula sa localStorage.
var savedItemData = localStorage.getItem("pkc_items");

// Sinusuri kung wala pang naka-save na inventory.
if (savedItemData == null){

    // Gumagawa ng array na naglalaman ng limang default books.
    var books = [
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

    // Kino-convert ang books array sa JSON text at sine-save sa localStorage.
    localStorage.setItem("pkc_items", JSON.stringify(books));
}


// Naka-comment ang lumang code para sa pagkuha at pag-save ng inventory.
// Dahil naka-comment ito, hindi ito kasalukuyang ine-execute.

/*
// Kinukuha ang saved items mula sa browser.
var savedItems = localStorage.getItem("pkc_items");

// Sinusuri kung may saved items.
if (!savedItems) {

    // Ipinapakita sa console ang value ng savedItems.
    console.log(savedItems);

    // Kino-convert ang JSON text pabalik sa JavaScript array.
    books = JSON.parse(savedItems);

// Kung wala pang saved items, tatakbo ang else.
} else {

    // Sine-save ang kasalukuyang books array sa browser.
    localStorage.setItem("pkc_items", JSON.stringify(books));
}
*/


// Function na nagdadagdag ng bagong item sa inventory.
function addItem(){

    // Kinukuha ang Item ID na inilagay ng user.
    var itemID = document.getElementById("ItemID").value;

    // Kinukuha ang pangalan ng item na inilagay ng user.
    var itemName = document.getElementById("ItemName").value;

    // Kinukuha ang status na pinili ng user.
    var status = document.getElementById("item-status").value;

    // Sinusuri kung may kulang na details o "all" ang napiling status.
    if (itemID === "" || itemName === "" || status === "all"){

        // Nagpapakita ng alert kung may kulang na details.
        alert("Please complete all item details!");

        // Itinitigil ang function kapag may kulang na details.
        return;

    } else {

        // Kinukuha ang inventory mula sa localStorage at gumagamit ng empty array kung wala ito.
        var books = JSON.parse(localStorage.getItem("pkc_items")) || [];
        // Idinadagdag ang bagong item sa dulo ng array.
        books.push({
            // Sine-save ang pangalan ng item.
            name: itemName,
            // Sine-save ang Item ID.
            itemID: itemID,
            // Sine-save ang status ng item.
            status: status
        });

        // Kino-convert ang updated array sa JSON text at sine-save ito.
        localStorage.setItem("pkc_items", JSON.stringify(books));

        // Nagpapakita ng mensaheng matagumpay na naidagdag ang item.
        alert("Item Added Successfully!");

        // Nililinis ang mga input field pagkatapos magdagdag.
        clearForm();

        // Ina-update ang listahan sa Librarian Update table.
        displayItems();

        // Ina-update ang mga item card sa Search Item section.
        displayHomeItems();

        // Ina-update ang mga card sa Equipment section.
        displayHomeEquipments();
    }
}


// Function na nagpapakita ng inventory sa Librarian Update table.
function displayItems(){

    // Gumagawa ng empty string na paglalagyan ng HTML table rows.
    var table = "";

    // Kinukuha ang inventory mula sa localStorage.
    var books = JSON.parse(localStorage.getItem("pkc_items"));

    // Inuulit ang proseso para sa bawat item sa inventory.
    for(var i = 0; i < books.length; i++){

        // Sinisimulan ang bagong table row.
        table += "<tr>";

        // Idinadagdag ang Item ID sa unang column.
        table += "<td>" + books[i].itemID + "</td>";

        // Idinadagdag ang pangalan ng item sa ikalawang column.
        table += "<td>" + books[i].name + "</td>";

        // Idinadagdag ang status sa ikatlong column.
        table += "<td>" + books[i].status + "</td>";

        // Sinisimulan ang column para sa mga action button.
        table += "<td>";

        // Gumagawa ng Edit button na tatawag sa editBtn gamit ang index ng item.
        table += "<input type='button' value='Edit' onclick='editBtn(" + i + ")'>";

        // Gumagawa ng Delete button na tatawag sa deleteBtn gamit ang index ng item.
        table += "<input type='button' value='Delete' onclick='deleteBtn(" + i + ")'>";

        // Isinasara ang action column.
        table += "</td>";

        // Isinasara ang table row.
        table += "</tr>";
    }

    // Kinukuha ang tbody kung saan ilalagay ang mga table row.
    const tableContainer = document.getElementById("itemTable");

    // Sinusuri kung umiiral ang table container sa page.
    if (tableContainer) {

        // Pinapalitan ang laman ng tbody gamit ang bagong table rows.
        tableContainer.innerHTML = table;
    }
}

// Function na gumagawa ng item cards sa Home page Search Item section.
function displayHomeItems() {

    // Kinukuha ang container ng Search Item cards.
    const homeItems = document.getElementById("homeItems");

    // Itinitigil ang function kung wala ang container sa page.
    if (!homeItems) return;

    // Kinukuha ang inventory mula sa localStorage o gumagamit ng empty array.
    const books = JSON.parse(localStorage.getItem("pkc_items")) || [];

    // Tinatanggal ang mga dating card bago gumawa ng bago.
    homeItems.innerHTML = "";

    // Gumagawa ng card para sa bawat item sa inventory.
    books.forEach(function(book) {

        // Gumagawa ng bagong div para sa item card.
        const card = document.createElement("div");

        // Itinatakda ang CSS class ng card.
        card.className = "item-card";

        // Itinatago muna ang card hanggang tumakbo ang search filter.
        card.style.display = "none";

        // Sine-save ang pangalan bilang data attribute ng card.
        card.dataset.name = book.name;

        // Sine-save ang Item ID bilang data attribute ng card.
        card.dataset.id = book.itemID;

        // Sine-save ang status bilang data attribute ng card.
        card.dataset.status = book.status;

        // Gumagawa ng h2 element para sa pangalan ng item.
        const title = document.createElement("h2");

        // Inilalagay ang pangalan ng item sa h2.
        title.textContent = book.name;

        // Gumagawa ng p element para sa Item ID.
        const id = document.createElement("p");

        // Inilalagay ang Item ID sa paragraph.
        id.textContent = "Item ID: " + book.itemID;

        // Gumagawa ng p element para sa status.
        const status = document.createElement("p");

        // Inilalagay ang status sa paragraph.
        status.textContent = "Status: " + book.status;

        // Idinadagdag ang title sa card.
        card.appendChild(title);

        // Idinadagdag ang Item ID sa card.
        card.appendChild(id);

        // Idinadagdag ang status sa card.
        card.appendChild(status);

        // Gumagawa ng input element para sa Borrow button.
        const borrowButton = document.createElement("input");

        // Itinatakda ang input element bilang button.
        borrowButton.type = "button";

        // Itinatakda ang text na makikita sa button.
        borrowButton.value = "Borrow";

        // Hindi pinapagana ang Borrow button kung hindi available ang item.
        borrowButton.disabled =
            book.status.toLowerCase() !== "available";

        // Itinatakda ang gagawin kapag pinindot ang Borrow button.
        borrowButton.onclick = function() {

            // Tinatawag ang borrowBtn function gamit ang Item ID ng item.
            borrowBtn(book.itemID);
        };

        // Idinadagdag ang Borrow button sa card.
        card.appendChild(borrowButton);

        // Idinadagdag ang buong card sa Search Item container.
        homeItems.appendChild(card);
    });

    // Ina-update ang visibility ng cards batay sa search text at status.
    filterItems();
}


// Function na gumagawa ng cards para sa PC at speakers sa Equipment section.
function displayHomeEquipments() {

    // Kinukuha ang container ng Equipment cards sa Home page.
    const container = document.getElementById("homeEquipments");

    // Itinitigil ang function kung wala ang Equipment container.
    if (!container) return;

    // Kinukuha ang pinakabagong inventory mula sa localStorage.
    const items = JSON.parse(localStorage.getItem("pkc_items")) || [];

    // Sinasala ang inventory upang PC at speakers lang ang maisama.
    const equipment = items.filter(function(item) {

        // Kinukuha ang Item ID at ginagawang uppercase.
        const id = (item.itemID || "").toUpperCase();

        // Ibinabalik lamang ang items na ang ID ay nagsisimula sa PC- o SP-.
        return id.startsWith("PC-") || id.startsWith("SP-");
    });

    // Tinatanggal ang dating Equipment cards bago gumawa ng bago.
    container.innerHTML = "";

    // Gumagawa ng card para sa bawat PC o speaker.
    equipment.forEach(function(item) {

        // Gumagawa ng bagong div para sa Equipment card.
        const card = document.createElement("div");

        // Itinatakda ang CSS class ng card.
        card.className = "equip-card";

        // Sine-save ang pangalan ng item bilang data attribute.
        card.dataset.name = item.name || "";

        // Sine-save ang Item ID bilang data attribute.
        card.dataset.id = item.itemID || "";

        // Sine-save ang status sa lowercase bilang data attribute.
        card.dataset.status = (item.status || "").toLowerCase();

        // Gumagawa ng h2 element para sa pangalan ng equipment.
        const title = document.createElement("h2");

        // Inilalagay ang pangalan ng equipment sa h2.
        title.textContent = item.name;

        // Gumagawa ng p element para sa Item ID.
        const id = document.createElement("p");

        // Inilalagay ang Item ID sa paragraph.
        id.textContent = "Item ID: " + item.itemID;

        // Gumagawa ng p element para sa status.
        const status = document.createElement("p");

        // Inilalagay ang status sa paragraph.
        status.textContent = "Status: " + item.status;

        // Idinadagdag ang title sa Equipment card.
        card.appendChild(title);

        // Idinadagdag ang Item ID sa Equipment card.
        card.appendChild(id);

        // Idinadagdag ang status sa Equipment card.
        card.appendChild(status);

        // Idinadagdag ang card sa Equipment container.
        container.appendChild(card);
    });
}


// Variable na nagtatala ng index ng item na kasalukuyang ine-edit.
// Ang -1 ay nangangahulugang walang item na kasalukuyang ine-edit.
var editIndex = -1;


// Function na kumukuha ng item details kapag pinindot ang Edit button.
function editBtn(index){

    // Nagpapakita ng alert na napili ang item para i-edit.
    alert("You selected to edit this item!");

    // Sine-save ang index ng item na ie-edit.
    editIndex = index;

    // Kinukuha ang inventory mula sa localStorage.
    var books = JSON.parse(localStorage.getItem("pkc_items"));

    // Inilalagay ang Item ID ng napiling item sa Item ID input.
    document.getElementById("ItemID").value = books[index].itemID;

    // Inilalagay ang pangalan ng napiling item sa Item Name input.
    document.getElementById("ItemName").value = books[index].name;

    // Pinipili ang kasalukuyang status ng item sa dropdown.
    document.getElementById("item-status").value = books[index].status;

    // Binabago ang label ng button mula Add Item tungo sa Update Item.
    document.getElementById("addItem").value = "Update Item";

    // Binabago ang onclick function ng button upang tawagin ang updateItem.
    document.getElementById("addItem").onclick = updateItem;
}


// Function na nagse-save ng mga pagbabagong ginawa sa isang item.
function updateItem(){

    // Kinukuha ang bagong Item ID mula sa input.
    var ItemID = document.getElementById("ItemID").value;

    // Kinukuha ang bagong pangalan mula sa input.
    var ItemName = document.getElementById("ItemName").value;

    // Kinukuha ang bagong status mula sa dropdown.
    var status = document.getElementById("item-status").value;

    // Kinukuha ang kasalukuyang inventory mula sa localStorage.
    var books = JSON.parse(localStorage.getItem("pkc_items"));

    // Pinapalitan ang item sa editIndex gamit ang bagong details.
    books[editIndex] = {
        // Sine-save ang bagong pangalan.
        name: ItemName,

        // Sine-save ang bagong Item ID.
        itemID: ItemID,

        // Sine-save ang bagong status.
        status: status
    };

    // Sine-save ang updated inventory sa localStorage.
    localStorage.setItem("pkc_items", JSON.stringify(books));

    // Nagpapakita ng mensaheng matagumpay ang pag-update.
    alert("Item Updated Successfully!");

    // Nililinis ang form pagkatapos ng pag-update.
    clearForm();

    // Ibinabalik ang editIndex sa -1 dahil tapos na ang pag-edit.
    editIndex = -1;

    // Ibinabalik ang button label sa Add Item.
    document.getElementById("addItem").value = "Add Item";

    // Ibinabalik ang button function sa addItem.
    document.getElementById("addItem").onclick = addItem;

    // Ina-update ang Librarian Update table.
    displayItems();

    // Ina-update ang Search Item cards sa Home page.
    displayHomeItems();

    // Ina-update ang Equipment cards sa Home page.
    displayHomeEquipments();
}


// Function na nagtatanggal ng item sa inventory.
function deleteBtn(index) {

    // Kinukuha ang inventory mula sa localStorage o gumagamit ng empty array.
    var books = JSON.parse(localStorage.getItem("pkc_items")) || [];

    // Humihingi ng confirmation bago burahin ang napiling item.
    var answer = confirm(
        "Are you sure you want to delete this item? " + books[index].name
    );

    // Sinusuri kung kinumpirma ng user ang deletion.
    if (answer === true) {

        // Tinatanggal ang isang item mula sa array gamit ang index.
        books.splice(index, 1);

        // Sine-save ang inventory na wala na ang tinanggal na item.
        localStorage.setItem("pkc_items", JSON.stringify(books));

        // Nagpapakita ng mensaheng matagumpay ang deletion.
        alert("Item Deleted Successfully!");

        // Ina-update ang Librarian Update table.
        displayItems();

        // Ina-update ang Search Item cards.
        displayHomeItems();

        // Ina-update ang Equipment cards.
        displayHomeEquipments();

    } else {

        // Nagpapakita ng mensahe kapag kinansela ang deletion.
        alert("Item Deletion Cancelled!");
    }
}


// Function na naglilinis sa mga input field ng item form.
function clearForm(){

    // Nililinis ang Item ID input.
    document.getElementById("ItemID").value = "";

    // Nililinis ang Item Name input.
    document.getElementById("ItemName").value = "";

    // Ibinabalik sa empty value ang status dropdown.
    document.getElementById("item-status").value = "";
}


// Tinatawag ang mga display function kapag na-load ang JavaScript.
displayItems();

// Ipinapakita ang mga item card sa Search Item section kung mayroon ang page.
displayHomeItems();

// Ipinapakita ang Equipment cards kung mayroon ang page.
displayHomeEquipments();


// Nakikinig sa storage event kapag may ibang tab na nagbago sa localStorage.
window.addEventListener("storage", function(event) {

    // Sinusuri kung ang nabagong localStorage key ay pkc_items.
    if (event.key === "pkc_items") {

        // Ina-update ang Search Item cards.
        displayHomeItems();

        // Ina-update ang Equipment cards.
        displayHomeEquipments();
    }
});


// Sinusuri kung umiiral ang search input bago magdagdag ng input event listener.
if(searchInput){

    // Tinatawag ang filterItems tuwing may pagbabago sa search text.
    searchInput.addEventListener("input", filterItems);
}

// Sinusuri kung umiiral ang status dropdown bago magdagdag ng change event listener.
if(statusFilter){

    // Tinatawag ang filterItems tuwing nagbabago ang napiling status.
    statusFilter.addEventListener("change", filterItems);
}


// Kinukuha ang element na may ID na borrow-form, kung mayroon.
const borrowForm = document.getElementById("borrow-form");


// Function na tinatawag kapag pinindot ang Borrow button.
function borrowBtn() {

    // Humihingi ng confirmation kung itutuloy ang pag-book ng item.
    var confirmed = confirm("Do you want to book this Item?");

    // Sinusuri kung hindi kinumpirma ng user ang booking.
    if(!confirmed){

        // Nagpapakita ng mensaheng nakansela ang booking.
        alert("Book Cancelled!");

    } else {

        // Ipinapaalam sa user na kailangan niyang punan ang form.
        alert("Please Fill out this form!");

        // Dinadala ang user sa borrow form page.
        window.location.href = "borrow-form.html";
    }
}


// Function para sa Start Borrow button sa cover page.
function startBorrowbtn() {

    // Ipinapaalam sa user na kailangan niyang punan ang form.
    alert("Please Fill out this form!");

    // Dinadala ang user sa borrow form page.
    window.location.href = "borrow-form.html";
}


// Function para sa Return Item button sa cover page.
function returnBorrowbtn() {

    // Ipinapaalam sa user na kailangan niyang punan ang form.
    alert("Please Fill out this form!");

    // Dinadala ang user sa return form page.
    window.location.href = "return-form.html";
}


// Function na nagsusuri sa borrowing form at gumagawa ng transaction details.
function submitBtn() {

    // Kinukuha ang pangalan ng borrower.
    var name = document.getElementById("name").value;

    // Sinusuri kung walang inilagay na pangalan.
    if (name ===""){

        // Nagpapakita ng alert kapag walang pangalan.
        alert("Please Enter Your Name!");

        // Itinitigil ang submission.
        return;
    }

    // Kinukuha ang pangalan ng paaralan.
    var school = document.getElementById("school").value;

    // Sinusuri kung walang inilagay na school.
    if (school ===""){

        // Nagpapakita ng alert kapag walang school.
        alert("Please Enter Your School!");

        // Itinitigil ang submission.
        return;
    }

    // Kinukuha ang email address ng borrower.
    var emailAdd = document.getElementById("emailAdd").value;

    // Sinusuri kung walang inilagay na email address.
    if (emailAdd ===""){

        // Nagpapakita ng alert kapag walang email.
        alert("Please Enter Your Email Address!");

        // Itinitigil ang submission.
        return;
    }

    // Kinukuha ang contact number ng borrower.
    var contactNum = document.getElementById("contactNum").value;

    // Sinusuri kung walang inilagay na contact number.
    if (contactNum ===""){

        // Nagpapakita ng alert kapag walang contact number.
        alert("Please Enter Your Contact Number!");

        // Itinitigil ang submission.
        return;
    }

    // Kinukuha ang pamagat ng librong gustong hiramin.
    var bookTitle = document.getElementById("bookTitle").value;

    // Sinusuri kung walang inilagay na book title.
    if (bookTitle ===""){

        // Nagpapakita ng alert kapag walang book title.
        alert("Please Enter Book Title!");

        // Itinitigil ang submission.
        return;
    }

    // Kinukuha ang Item ID input at kino-convert ito sa number.
    var itemNum = Number(document.getElementById("itemNum").value);

    // Sinusuri kung hindi number ang inilagay na Item ID.
    if (isNaN(itemNum)) {

        // Nagpapakita ng alert kapag hindi valid na number ang input.
        alert("Please Enter a Valid Book ID!");

        // Itinitigil ang submission.
        return;
    }

    // Kinukuha ang napiling borrow date mula sa borrowDate variable.
    var borrowDateValue = borrowDate.value;

    // Sinusuri kung walang napiling borrow date.
    if (borrowDateValue === "") {

        // Nagpapakita ng alert kapag walang borrow date.
        alert("Please Enter Borrow Date!");

        // Itinitigil ang submission.
        return;
    }

    // Kinukuha ang napiling due date mula sa dueDate variable.
    var dueDateValue = dueDate.value;

    // Sinusuri kung walang napiling due date.
    if (dueDateValue === "") {

        // Nagpapakita ng alert kapag walang due date.
        alert("Please Enter Due Date!");

        // Itinitigil ang submission.
        return;
    }

    // Muling sinusuri kung walang due date, gaya ng nasa orihinal mong code.
    if (dueDateValue === "") {

        // Nagpapakita ng alert kapag walang due date.
        alert("Please Enter Due Date!");

        // Itinitigil ang submission.
        return;
    }

    // Gumagawa ng Date object mula sa borrow date.
    var borrow = new Date(borrowDateValue);

    // Gumagawa ng Date object mula sa due date.
    var due = new Date(dueDateValue);

    // Kinukuwenta ang pagitan ng dalawang petsa sa bilang ng araw.
    var difference = (due - borrow) / (1000 * 60 * 60 * 24);

    // Sinusuri kung higit sa tatlong araw ang pagitan ng due date at borrow date.
    if (difference > 3) {

        // Nagpapakita ng alert kung lumampas sa tatlong araw.
        alert("Due Date cannot exceed 3 days from the Borrow Date!");

        // Itinitigil ang submission.
        return;
    }


    // Gumagawa ng unique transaction ID gamit ang kasalukuyang timestamp.
    var transactionID = "TXN-" + Date.now();


    // Gumagawa ng object na naglalaman ng borrowing information.
    const borrowData = {

        // Sine-save ang pangalan ng borrower sa object.
        name: name,

        // Sine-save ang pangalan ng school.
        school: school,

        // Sine-save ang email address.
        emailAdd: emailAdd,

        // Sine-save ang contact number.
        contactNum: contactNum,

        // Sine-save ang Item ID number.
        itemNum: itemNum,

        // Sine-save ang transaction ID.
        transactionID: transactionID,

        // Sine-save ang borrow date.
        borrowDate: borrowDateValue,

        // Sine-save ang due date.
        dueDate: dueDateValue
    };

    // Kino-convert ang borrowData object sa JSON text.
    const jsonData = JSON.stringify(borrowData);


    // Tinatanggal ang dating QR code bago gumawa ng bago.
    document.getElementById("qrcode").innerHTML = "";


    // Gumagawa ng bagong QR code para sa transaction ID.
    new QRCode(
        // Itinatakda kung saang element ilalagay ang QR code.
        document.getElementById("qrcode"),
        {
            // Ang transaction ID ang magiging laman ng QR code.
            text: transactionID,

            // Itinatakda ang lapad ng QR code.
            width: 180,

            // Itinatakda ang taas ng QR code.
            height: 180,
        }
    );

    // Nagpapakita ng mensaheng matagumpay ang borrowing.
    alert("Borrowing Successfull!");


    // Ipinapakita ang borrowing information sa output element.
    document.getElementById("output").innerHTML =
        "<b>Name: </b>" + name + "<br>" +
        "<b>School Name: </b>" + school + "<br>" +
        "<b>Email Address: </b>" + emailAdd + "<br>" +
        "<b>Contact Number: </b>" + contactNum + "<br>" +
        "<center><b>---------------Book Information</b>---------------</center>" + "</br>" +
        "<b>Item ID: </b>" + itemNum + "<br>" +
        "<b>Transaction Number: </b>" + transactionID + "<br>" +
        "<b>Borrow Date: </b>" + borrowDateValue + " " + "to " + dueDateValue;
}