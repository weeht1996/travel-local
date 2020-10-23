const falseDB = [ 
    {
        "id": "1",
        "name": "Itinerary 1",
        "rating": "4",
        "pic_url": "https://worldtoptop.com/wp-content/uploads/2011/05/marina_bay_sands-.jpg",
        "description": "The roof looks like a boat! Now, that's cool."
    },
    {
        "id": "2",
        "name": "Itinerary 2",
        "rating": "3",
        "pic_url": "https://worldtoptop.com/wp-content/uploads/2011/05/merlion_park_4.jpg",
        "description": "A lion pokemon uses water gun"
    },
    {
        "id": "3",
        "name": "Itinerary 3",
        "rating": "5",
        "pic_url": "https://worldtoptop.com/wp-content/uploads/2011/05/buddha_tooth_relic_temple_singapore_3.jpg",
        "description": "A blast from the past! See the old stand against the new in this trip.A blast from the past! See the old stand against the new in this trip.A blast from the past! See the old stand against the new in this trip."
    },
    {
        "id": "4",
        "name": "Itinerary 4",
        "rating": "4",
        "pic_url": "https://worldtoptop.com/wp-content/uploads/2011/05/fountain_of_wealth_suntec.jpg",
        "description": "I ripped all these image off worldtoptop LMAO. Please don't sue me :X"
    },
    {
        "id": "5",
        "name": "Itinerary 5",
        "rating": "3",
        "pic_url": "https://worldtoptop.com/wp-content/uploads/2011/05/henderson_waves_bridge_2.jpg",
        "description": "This trip is up and down.This trip is up and down.This trip is up and down.This trip is up and down.This trip is up and down.This trip is up and down.This trip is up and down.This trip is up and down.This trip is up and down.This trip is up and down."
    },
    {
        "id": "6",
        "name": "Itinerary 6",
        "rating": "2",
        "pic_url": "https://worldtoptop.com/wp-content/uploads/2011/05/the_esplanade_theaters_on_the_bay.jpg",
        "description": "This trip will be real pointy... IDK I tried to be funny and clearly failed."
    }
];

const apiKey = "2DeahNNW3hdNmHNNpsUFv0BH7mQeZm63";

var count = 0;
var url= "../travel-local-1/php/objects/itinAllRetrieve.php";
var request = new XMLHttpRequest();
request.open("GET", url, true);
request.send();
request.onreadystatechange = function() {
    if( this.readyState == 4 && this.status == 200 ) {

        var itinsObj = JSON.parse(this.responseText);
        display_default_cards(itinsObj);
        for (itinCount in itinsObj){

            let url= "../travel-local-1/php/objects/itinActsRetrieve.php";
            var request = new XMLHttpRequest();
            request.open("POST", url, true);
            request.send(itinsObj[itinCount].itineraryID);
            request.onreadystatechange = function() {
                if( this.readyState == 4 && this.status == 200 ) {

                    var actsObj = JSON.parse(this.responseText)[0]; //Returns only first activity currently
                    // console.log(actsObj.poiUUID); //first activity's uuid
                    var base_url = "https://tih-api.stb.gov.sg/content/v1/attractions";
                    var final_url = base_url + "?uuid=" + actsObj.poiUUID + "&apikey=" + apiKey;
                
                    var tax = new XMLHttpRequest();
                    tax.open("GET", final_url, true);
                    tax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    tax.send();
                    tax.onreadystatechange = function () {
                        if (tax.readyState == 4 && tax.status == 200) {
                            var data = JSON.parse(tax.responseText);
                            // console.log(data.data[0].images[0].uuid); //first activity's image uuid
                            var img_uuid = data.data[0].images[0].uuid;
                            var pre_url = "https://tih-api.stb.gov.sg/media/v1/image/uuid/";
                            var complete_url = pre_url + img_uuid + "?apikey=" + apiKey;
                            
                            var tbx = new XMLHttpRequest();
                            tbx.open("GET", complete_url, true);
                            tbx.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                            tbx.send();
                        
                            tbx.onreadystatechange = function () {
                                if (tbx.readyState == 4 && tbx.status == 200) {

                                    var img_url_data = JSON.parse(tbx.responseText);
                                    // console.log(img_url.data.url);
                                    var img_url = img_url_data.data.url + "?apikey=" + apiKey;
                                    var current_itin = 'itinerary' + count;
                                    // console.log(itinCount);
                                    document.getElementById(current_itin).src = img_url;
                                    count++;

                                    
                                }
                            }
                        }
                    }
                }
            }   
        }

    }
}


function display_default_cards(intineraries){ //Runs on load
    console.log(intineraries);
    let itins_view = document.getElementById("popular_itins");
    for (let i = 0; i < intineraries.length; i++){
        let new_card = document.createElement('div');
        new_card.className = "col-lg-4 col-md-6 d-flex"; 
        new_card.innerHTML = `
            <div class="card mx-auto mb-5" style="width: 22rem;">
                <img alt="Card image cap" id="${'itinerary'+i}" class="card-img-top img-fluid" src="${falseDB[i].pic_url}">
                <div class="card-img-overlay">
                    <h4 class="card-title"><a href="#">${intineraries[i].name}</a> ${display_rating(0)}</h4>
                    <footer class="blockquote-footer">${intineraries[i].startDate} - ${intineraries[i].endDate}</p>
                </div>
            </div>
            `;
        itins_view.appendChild(new_card);
    }
    // console.log(itins_view.getElementsByClassName("col-lg-3 col-md-4 d-flex"));
}


function display_rating(i){ //Currently disabled due to not needing it
//     stars = '';
//     for (let n = 0; n < i; n++){
//         stars += "<span class='fa fa-star fa-xs checked'></span>";
//     }
    
    // return stars;
    return '';
}