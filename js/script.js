// Make an Ajax request for all data (we have json) and give it as a list

$(document).ready(function(){

    let data;

    $.ajax({
        url: 'http://192.168.33.10:3000/allProducts',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                $('#productBox').append(`<a class="list-group-item list-group-item-action">${data[i].name}<div class="buttonStyle"><button type="button" class="btn btn-info buttonSpace">Edit</button><button type="button" class="btn btn-danger">Remove</button></div></a>`);
            }
        },
        error: function(){
            console.log('got an error');
        }
    })
});

$('#addProductButton').click(function(){
    // check if user has input anything into the two input fields
    // console.log('button has been clicked');
    // prevent the default of submitting data and refreshing the page
    event.preventDefault();
    let productName = $('#productName').val();
    let productPrice = $('#productPrice').val();
    console.log(productName);
    if(productName.length === 0){
        console.log('please enter a product name');
    } else if(productPrice.length === 0){
        console.log('please enter a price');
    } else {
        console.log(`${productName} costs $${productPrice}`);
        $.ajax({
            url: 'http://192.168.33.10:3000/product',
            type: 'POST',
            data: {
                name: productName,
                price: productPrice
            },
            success: function(result){
                console.log(result);
            },
            error: function(error){
                console.log(error);
                console.log('something went wrong with sending the data');
            }
        })
    }
    // Now we want to send/POST data
});

$('#contactButton').click(function(){
    
});
