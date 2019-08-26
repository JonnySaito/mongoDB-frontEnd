// Make an Ajax request for all data (we have json) and give it as a list
let serverURL;
let serverPort;
let editing = false;

$.ajax({
  url: 'config.json',
  type: 'GET',
  dataType: 'json',
  success:function(keys){
    serverURL = keys['SERVER_URL'];
    serverPort = keys['SERVER_PORT'];
    getProductData();
  },
  error: function(){
    console.log('cannot find config.json file, cannot run application');
  }
});

getProductData = () => {
    console.log(`${serverURL}:${serverPort}/allProducts`);
    $.ajax({
        url: `${serverURL}:${serverPort}/allProducts`,
        type: 'GET',
        dataType: 'json',
        success:function(data){
            for (var i = 0; i < data.length; i++) {
                $('#productBox').append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center" data-id="${data[i]._id}">
                        ${data[i].name}
                        <div>
                            <button class="btn btn-info editBtn">Edit</button>
                            <button class="btn btn-danger">Remove</button>
                        </div>
                    </li>
                `);
            }
        },
        error: function(err){
            console.log(err);
            console.log('something went wrong');
        }
    })
}

$('#productBox').on('click', '.editBtn', function() {
    // console.log(`${serverURL}:${serverPort}/product/${id}`);
    event.preventDefault();
    const id = $(this).parent().parent().data('id');
    $.ajax({
        url: `${serverURL}:${serverPort}/product/${id}`,
        type: 'get',
        dataType: 'json',
        success:function(product){
            console.log(product);
            $('#productName').val(product['name']);
            $('#productPrice').val(product['price']);
            $('#productID').val(product['_id']);
            $('#addProductButton').text('Edit Product').addClass('btn-warning');
            $('#heading').text('Edit Product');
            editing = true;
        },
        error:function(err){
            console.log(err);
            console.log('Something went wrong with getting the single product');
        }
    })

});

$('#addProductButton').click(function(){
    event.preventDefault();
    let productName = $('#productName').val();
    let productPrice = $('#productPrice').val();
    if(productName.length === 0){
        console.log('Please enter a product name');
    } else if(productPrice.length === 0){
        console.log('Please enter a product price');
    } else {
        if(editing === true){

            const id = $('#productID').val();
            $.ajax({
                url: `${serverURL}:${serverPort}/editProduct/${id}`,
                type: 'PATCH',
                data: {
                    name: productName,
                    price: productPrice
                },
                success: function(result){
                    $('#productName').val(null);
                    $('#productPrice').val(null);
                    $('#productID').val(null);
                    $('#addProductButton').text('Add New Product').removeClass('btn-warning');
                    $('#heading').text('Add New Product');
                    editing = false
                },
                error: function(error){
                    console.log(error);
                    console.log('Something went wrong with editing the product')
                }
            });
                // console.log(`Edited ${productName} to be $${productPrice}`);

        } else {
            console.log(`${productName} costs $${productPrice}`);
            $.ajax({
                url: `${serverURL}:${serverPort}/product`,
                type: 'POST',
                data: {
                    name: productName,
                    price: productPrice
                },
                success:function(result){
                    $('#productName').val(null);
                    $('#productPrice').val(null);
                    $('#productList').append(`
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            ${result.name}
                            <div>
                                <button class="btn btn-info editBtn">Edit</button>
                                <button class="btn btn-danger">Remove</button>
                            </div>
                        </li>
                    `);
                },
                error: function(error){
                    console.log(error);
                    console.log('something went wrong with sending the data');
                }
            })
        }
    }
});



$('#contactButton').click(function(){
    event.preventDefault();
    let userName = $('#userName').val();
    let userEmail = $('#userEmail').val();
    let userMessage = $('#userMessage').val();
    // console.log(userName, userEmail, userMessage);
    if(userName.length === 0){
      console.log('please enter your name');
    } else if(userEmail.length === 0){
      console.log('please enter your email address');
    } else if(userMessage.length === 0){
      console.log('please write a message to us, kind sir or madam');
    } else{
      $.ajax({
        url: `${SERVER_URL}:${SERVER_PORT}/contact`,
        type: 'POST',
        data: {
          name: userName,
          email: userEmail,
          message: userMessage
        },
        success: function(result){
          console.log(result);
        },
        error: function(error){
          console.log(error);
          console.log('something screwed up with sending user data');
        }
      })
    }
});





// DELETE ALL THE STUFF BELOW:



// $(document).ready(function(){
//     let portData;
//     $.ajax({
//         url: 'config.json',
//         type: 'GET',
//         dataType: 'json',
//         success: function(keys){
//           portData = keys;
//           console.log(portData);
//           // $.ajax({
//           //     url: `${portData.SERVER_URL}:${portData.SERVER_PORT}/allProducts`,
//           //     type: 'GET',
//           //     dataType: 'json',
//           //     success: function(data){
//           //         // console.log(data);
//           //         for (var i = 0; i < data.length; i++) {
//           //             $('#productBox').append(`<a class="list-group-item list-group-item-action">${data[i].name}<div class="buttonStyle"><button type="button" class="btn btn-info buttonSpace">Edit</button><button type="button" class="btn btn-danger">Remove</button></div></a>`);
//           //         }
//           //     },
//           //     error: function(){
//           //         console.log('got an error');
//           //     }
//           // })
//         },
//         error: function(){
//           console.log('Cannot find config.json file, cannot run application');
//         }
//     });
//
//     let data;
//
//
//
//
//     $('#addProductButton').click(function(){
//         // check if user has typed anything in the two input fields
//         // console.log('button has been clicked');
//         // prevent the default of submitting data and refreshing the page
//         event.preventDefault();
//         let productName = $('#productName').val();
//         let productPrice = $('#productPrice').val();
//         console.log(productName);
//         if(productName.length === 0){
//             console.log('please enter a product name');
//         } else if(productPrice.length === 0){
//             console.log('please enter a price');
//         } else {
//             console.log(`${productName} costs $${productPrice}`);
//             $.ajax({
//                 url: `${SERVER_URL}:${SERVER_PORT}/product`,
//                 type: 'POST',
//                 data: {
//                     name: productName,
//                     price: productPrice
//                 },
//                 success: function(result){
//                     console.log(result);
//                 },
//                 error: function(error){
//                     console.log(error);
//                     console.log('something went wrong with sending the data');
//                 }
//             })
//         }
//         // Now we want to send/POST data
//     });
//
//
// });
