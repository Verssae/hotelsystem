function makeTable(){

    for(var r=7; r>0; r--){
        var floor = r;
        if(r==1){
            document.write('<tr>');
            document.write('<th class="floor" tabindex="-1" style="width:70px;height:70px;">');
            document.write('<div>');
            document.write((floor.toString())+'F');
            document.write('</div>');
            document.write('</th>');
            document.write('</tr>')
        }
        else{
            document.write('<tr>');
            document.write('<th class="floor" style="width:70px;height:70px;">'+r.toString()+'F</th>');

            for(var c=1; c<9; c++){
                var roomnum = floor*100+c;

                var roomState = "booked";   /*  get room state Info from roomnum
                                                there are three types
                                                1. booked >> already booked // color is gray
                                                2. c_done >> bookable & cleaning done // color is green
                                                3. c_n    >> bookable & not cleaned // color is red
                                            */

                if(roomnum >500){           /*  It will be erased when this file linked to database */
                    roomState = "c_n";
                }
                if(roomnum == 307){
                    roomState = "c_done";
                }
                document.write('<td class='+roomState+' id= "roomButton" role="button" onclick="modalSet()" tabindex="0" style="width:70px; height:70px;">');
                document.write('<div id = '+roomnum.toString()+'>');
                document.write((roomnum));
                document.write('</div>');
                document.write('</td>');

            }
            document.write('</tr>');
        }
    }
}
function modalSet(){

        var modal = document.getElementById("room_modal");
        var btn = document.getElementById("roomButton");
        var span = document.getElementsByClassName("close")[0];
        modal.style.display = "block";
        span.onclick = function() {
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
