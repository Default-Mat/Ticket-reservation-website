// Show the list of cities that match with given input
function city_search(str, inputId, containerId){
    const list_container = $(`#${containerId}`);
    const input_field = $(`#${inputId}`);
    if(str.length === 0){
        list_container.addClass("hide");
    }
    else{
        list_container.removeClass("hide");

        // Use ajax to receive matched cities
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "/ajax/show-city?city="+str, true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var obj = JSON.parse(xmlhttp.responseText);
                list_container.empty();
                obj.forEach(city => {
                    list_container.append(`<div class="autocomplete-item"><div class="inner-block">${city['city_name']}</div></div>`)
                });
            }
        }

        // Fill autocomplete list
        list_container.on('click', '.autocomplete-item', function() {
            input_field.val($(this).text());
            list_container.empty();
            list_container.addClass("hide");
        });

        $(document).on('click', function (e) {
            if (!$(e.target).closest(list_container).length && !$(e.target).is(input_field)) {
                list_container.empty();
                list_container.addClass("hide");
            }
        });
    }


}