function makeTable(){
    var tbody = document.getElementById("_tableBody");
    for(var r=7; r>1; r--){
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        th.setAttribute('class', 'floor');
        th.setAttribute('width','70px');
        th.setAttribute('height','70px');
        th.innerHTML= r.toString()+"F";
        tr.appendChild(th);
        for(var c=1; c<9; c++){
            var rNum = r*100+c;
            var rState = "bookable"/*   get room state Info from roomnum
                                        there are three types
                                        1. bookable // color is gray
                                        2. c_done >> booked & cleaning done // color is green
                                        3. c_n    >> booked & not cleaned // color is red
                                    */
            if(rNum==508){
                rState = "c_n";
            }
            if(rNum==203){
                rState = "c_done";
            }

            var td = document.createElement("td");
            td.setAttribute('class', rState);
            td.setAttribute('id', rNum.toString());
            td.setAttribute('role', 'button');

            td.setAttribute('tabindex', '0');
            td.style.width="70px";
            td.style.height="70px";
            td.innerHTML= rNum.toString();


            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    $("td").click(function(event){modalSet();})

}
function modalSet(){
    var modal = document.getElementById("room_modal");
    var x = document.getElementsByClassName("close")[0];
    var confirm = document.getElementById("confirm");

    var btnId = event.target.getAttribute('id');
    var rState = $('#'+btnId).attr('class');

    if(rState != "bookable"){
        if(rState == "c_done"){

        }
        else if(rState == "c_n"){
            // !make this part from database
        }
        modal.style.display = "block";

    }

    // When the user clicks confirm button, save the changes and close it
    confirm.onclick = function(){
        if(rState != "bookable"){

            // !change database by this checked information.

            
        }

        modal.style.display = "none";
    }
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
makeTable();
