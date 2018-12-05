

function modalSet(){
    // var modal = document.getElementById("room_modal");
    var x = document.getElementsByClassName("close")[0];
    var confirm = document.getElementById("confirm");
    
    var btnId = event.target.getAttribute('id');
    var modal = document.getElementById(btnId);
    console.log(btnId);
    var rState = $('#'+btnId).attr('class');
    console.log(rState)

    var chk1 = document.getElementById("c1");   //clean
    var chk2 = document.getElementById("c2");   //amenity
    var chk3 = document.getElementById("c3");   //bedding
    var chk4 = document.getElementById("c4");   //order     default is checked=true. When there is order, checked=false.

    //check 가 안돼서 일단 텍스트로 다 바꿔놨음 check돼면 바꿔주세요
    // if(rState == "bookable"){
    //     $(".checklist input").prop('checked', true);
    //     chk1.disabled = true;
    //     chk2.disabled = true;
    //     chk3.disabled = true;
    //     chk4.disabled = true;
    // }
    // else if(rState == "c_done"){
    //     $(".checklist input").prop('checked', true);
    // }
    // else{
    //     // !make this part from database
    //     $(".checklist input").prop('checked', true);
    // }
    // if(rState != "bookable"){
    //     if(rState == "c_done"){
    //         $(".checklist input").prop('checked', true);
    //     }
    //     else if(rState == "c_n"){
    //         // !make this part from database
    //     }
    //     modal.style.display = "block";

    // }
    

    modal.style.display = "block";



    // When the user clicks confirm button, save the changes and close it
    // confirm.onclick = function(){
    //     if(rState != "bookable"){
    //         var chkd1 = chk1.getAttribute("checked");
    //         var chkd2 = chk2.getAttribute("checked");
    //         var chkd3 = chk3.getAttribute("checked");
    //         var chkd4 = chk4.getAttribute("checked");

    //         // !change database by this checked information.

    //         if(chkd1 && chkd2 && chkd3 && !chkd4){
    //             rState = "c_done";

    //         }
    //         else{
    //             rState = "c_n";
    //         }
    //     }

    //     modal.style.display = "none";
    // }
    // When the user clicks x button, close it
    x.onclick = function() {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
// makeTable();
