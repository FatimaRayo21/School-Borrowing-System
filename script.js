//<!--nag input si user ng item sa search-->
        const searchInput = document.getElementById("search-item");

        //<!--pumili si user kung avail or borrowed-->
        const statusFilter = document.getElementById("item-status");

        //<!--Hanapin lahat ng item cards at ilagay sila sa variable na itemCards-->
        const itemCards = document.querySelectorAll(".item-card");

        

        function filterItems(){
           //<!---search-->
            const searchValue = searchInput.value.toLowerCase().trim();
            
            //<!--dropdown-->
            const selectedStatus = statusFilter.value;

            //<!--tinitignan ang matching items/wla nakita-->
            let found = false;

            //<!--pupuntahan or chinecheck lahat ng item-->
            itemCards.forEach(function(card){
                //<!--name ng item-->
                const itemName = card.dataset.name.toLowerCase();

                //<!--status ng item-->
                const itemStatus = card.dataset.status;

                //<!--tinitignan kung nagmatch ba yung hinahanap na item ni user-->
                const matchSearch = itemName.includes(searchValue);

                //<!--sa droptown kapag sinelect ni user ang status lalabas lahat ng items-->
                const matchStatus = 
                    selectedStatus === "all" ||
                    itemStatus === selectedStatus;

                if(matchSearch && matchStatus && searchValue !== ""){
                    //<!--ginagamit para kontrolin kung makikita o hindi makikita ang item card.-->
                    card.style.display = "flex";
                    //<!--tinitignan ang matching items/may nakita-->
                    found = true;
                }else {
                    //<!--pag flse itatago nya-->
                    card.style.display ="none";
                }
            });

            //<!--May nakita ba matching item?-->
                if(found) {
                    //<!--hide no items found-->
                    noResults.style.display = "none";
                }else{
                    //<!--block means ipakita ang element/ no items found.-->
                    noResults.style.display = "block";
                }
        }
        
        //logout
        function logoutBtn(){
            window.location.href="index.html";
        }
   
        //add Item
        var savedItemData = localStorage.getItem("itemData");
        if (savedItemData == null) {
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
        localStorage.setItem("itemData", JSON.stringify(books));
    }else{
        var books = JSON.parse(savedItemData);
    }
        
        //para mag add ng item
        function addItem(){
            var itemID = document.getElementById("ItemID").value;
            var itemName = document.getElementById("ItemName").value;
            var status = document.getElementById("item-status").value;

            books.push({
                name: itemName,
                itemID: itemID,
                status: status
            });

            localStorage.setItem("itemData", JSON.stringify(books));

            alert("Item Added Successfully!");
            clearForm();

        }
        //para sa display
        function displayItems(){
            var table = "";

            for(var i = 0; i < books.length; i++){
                table += "<tr>";

                table += "<td>" + books[i].itemID + "</td>";
                table += "<td>" + books[i].name + "</td>";
                table += "<td>" + books[i].status + "</td>";

                table += "<td>";

                table += "<input type='button' value='Edit' onclick='editBtn(" + i + ")'>";
                table += "<input type='button' value='Delete' onclick='deleteBtn(" + i + ")'>";

                table += "</td>";
                table += "</tr>";
            }
            document.getElementById("itemTable").innerHTML = table;
        }

        //var para sa editing
        var editIndex = -1;

        //updaye item
        function editBtn(index){
            alert("You selected to edit this item!");

            editIndex = index;
            
        //nilalagay ung selected na data sa same input form
        document.getElementById("ItemID").value = books[index].itemID;
        document.getElementById("ItemName").value = books[index].name;
        document.getElementById("item-status").value = books[index].status;

        //iniiba ung button para maging update
        document.getElementById("addItem").value = "Update Item";
        document.getElementById("addItem").onclick = updateItem;
        document.getElementById("message").innerHTML = "Editing Item: " + books[index].name;
        
    }
        
        //para sa update item
        function updateItem(){
            var ItemID = document.getElementById("ItemID").value;
            var ItemName = document.getElementById("ItemName").value;
            var status = document.getElementById("item-status").value;

            books[editIndex] = {
                name: ItemName,
                itemID: ItemID,
                status: status
            };

            localStorage.setItem("ItemData", JSON.stringify(books));

            alert("Item Updated Successfully!");

            document.getElementById("message").innerHTML = "Item Updated Successfully!";

            clearForm();

            editIndex = -1;
            
            //ibalik ung button sa add item
            
            document.getElementById("addItem").value = "Add Item";
            document.getElementById("addItem").onclick = addItem;

            displayItems();
        }

        //mag delete ng item
        function deleteBtn(index){

            var answer = confirm("Are you sure you want to delete this item?" + books[index].name
            );

            if(answer == true){

                books.splice(index, 1);

                localStorage.setItem("itemData", JSON.stringify(books));

                alert("Item Deleted Successfully!");

                document.getElementById("message").innerHTML = "Item Deleted Successfully!";
                
                displayItems();

            }else{

                alert("Item Deletion Cancelled!");
            }
        }
        //clear form
        function clearForm(){

            document.getElementById("ItemID").value = "";
            document.getElementById("ItemName").value = "";
            document.getElementById("item-status").value = "";
        }
        
        //magdisplay ng data pag nag load ung page
        displayItems();

        // CONVERT TO JSON
        const booksJSON = JSON.stringify(books, null, 4);
        //real-time ang search
        if(searchInput){
            searchInput.addEventListener("input", filterItems);
        }
        //kapag nagpalit ang user ng option sa dropdown.
        if(statusFilter){
            statusFilter.addEventListener("change", filterItems);
        }
        //hanapim ang button na may borrow-form
        const borrowForm = document.getElementById("borrow-form");
        
        function borrowBtn() {

            var confirmed = confirm("Do you want to book this Item?");

            if(!confirmed){
                alert("Book Cancelled!");
            } else {
                alert("Please Fill out this form!");
                //para mapunta sa panibagong html or form
                window.location.href = "borrow-form.html";
            }
        }
        //for start borrow button
        function startBorrowbtn() {
            alert("Please Fill out this form!");
            //para mapunta sa panibagong html or form
            window.location.href = "borrow-form.html";
        }
        //for return borrow button
        function returnBorrowbtn() {
            alert("Please Fill out this form!");
            //para mapunta sa panibagong html or form
            window.location.href = "return-form.html";
        }
        //for submit
        function submitBtn() {

            var name = document.getElementById("name").value;
            if (name ===""){
                alert("Please Enter Your Name!");
                return;
            }
            var school = document.getElementById("school").value;
            if (school ===""){
                alert("Please Enter Your School!");
                return;
            }
            var emailAdd = document.getElementById("emailAdd").value;
            if (emailAdd ===""){
                alert("Please Enter Your Email Address!");
                return;
            }
            var contactNum = document.getElementById("contactNum").value;
            if (contactNum ===""){
                alert("Please Enter Your Contact Number!");
                return;
            }
            var bookTitle = document.getElementById("bookTitle").value;
            if (bookTitle ===""){
                alert("Please Enter Book Title!");
                return;
            }
            var itemNum = Number(document.getElementById("itemNum").value);
            if (isNaN(itemNum)) {
                alert("Please Enter a Valid Book ID!");
                return;
            }
            var borrowDateValue = borrowDate.value;
            if (borrowDateValue === "") {
                alert("Please Enter Borrow Date!");
                return;
            }
            var dueDateValue = dueDate.value;
            if (dueDateValue === "") {
                alert("Please Enter Due Date!");
                return;
            }
            if (dueDateValue === "") {
                alert("Please Enter Due Date!");
                return;
            }
            //3 days lang pwede hiramin yung item
            var borrow = new Date(borrowDateValue);
            var due = new Date(dueDateValue);
            
            var difference = (due - borrow) / (1000 * 60 * 60 * 24);
            if (difference > 3) {
                alert("Due Date cannot exceed 3 days from the Borrow Date!");
                return;
            }
            
            
        
            //automatic transaction ID

            var transactionID = "TXN-" + Date.now();

            //borrow data
            const borrowData = {
                name: name,
                school: school,
                emailAdd: emailAdd,
                contactNum: contactNum,
                itemNum: itemNum,
                transactionID: transactionID,
                borrowDate: borrowDateValue,
                dueDate: dueDateValue};

                //convert data to json
       
       const jsonData = JSON.stringify(borrowData);
       
       //clear previous qr
       document.getElementById("qrcode").innerHTML = "";

       //generate qr code
       new QRCode(
        document.getElementById("qrcode"),
        {
            text: transactionID,
            width: 180,
            height: 180,
        }
       );
       alert("Borrowing Successfull!");
       
      //dsplay
       document.getElementById("output").innerHTML =
       "<b>Name: </b>"  + name + "<br>" +
       "<b>School Name: </b>"  + school + "<br>" +
       "<b>Email Address: </b>" + emailAdd + "<br>" +
       "<b>Contact Number: </b>" + contactNum + "<br>" +
       "<center><b>---------------Book Information</b>---------------</center>" + "</br>" +
       "<b>Item ID: </b>" + itemNum + "<br>" +
       "<b>Transaction Number: </b>" + transactionID + "<br>" +
       "<b>Borrow Date: </b>" + borrowDateValue + " " + "to " + dueDateValue ;
    }
