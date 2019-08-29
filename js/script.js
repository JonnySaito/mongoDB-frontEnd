// Make an Ajax request for all data (we have json) and give it as a list
let serverURL;
let serverPort;
let url;
let editing = false;
// Get the JSON file
$.ajax({
  url: 'config.json',
  type: 'GET',
  dataType: 'json',
  success:function(keys){
    serverURL = keys['SERVER_URL'];
    serverPort = keys['SERVER_PORT'];
    url = `${keys['SERVER_URL']}:${keys['SERVER_PORT']}`;
    getProductData();
  },
  error: function(){
    console.log('cannot find config.json file, cannot run application');
  }
});

getProductData = () => {
    // console.log(`${serverURL}:${serverPort}/allProducts`);
    $.ajax({
        // url: `${serverURL}:${serverPort}/allProducts`,
        url: `${url}/allProducts`,
        type: 'GET',
        dataType: 'json',
        success:function(data){
            for (var i = 0; i < data.length; i++) {
                $('#productList').append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center" data-id="${data[i]._id}">
                        <span class="productName">${data[i].name}</span>
                        <div>
                            <button class="btn btn-info editBtn">Edit</button>
                            <button class="btn btn-danger removeBtn">Remove</button>
                        </div>
                    </li>
                `);
            }
        },
        error: function(err){
            console.log(err);
            console.log('something went wrong with getting all the products');
        }
    })
}
// ADD A PRODUCT
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
                url: `${url}/product/${id}`,
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
                    editing = false;
                    const allProducts = $('.productItem');
                    allProducts.each(function(){
                        if($(this).data('id') === id){
                            $(this).find('.productName').text(productName);
                        }
                    });
                },
                error: function(error){
                    console.log(error);
                    console.log('Something went wrong with editing the product');
                }
            });
                // console.log(`Edited ${productName} to be ${productPrice}`);
        } else {
            console.log(`${productName} costs $${productPrice}`);
            $.ajax({
                url: `${url}/product`,
                type: 'POST',
                data: {
                    name: productName,
                    price: productPrice
                },
                success:function(result){
                    $('#productName').val(null);
                    $('#productPrice').val(null);
                    $('#productList').append(`
                        <li class="list-group-item d-flex justify-content-between align-items-center productItem">
                            <span class="productName">${result.name}</span>
                            <div>
                                <button class="btn btn-info editBtn">Edit</button>
                                <button class="btn btn-danger removeBtn">Remove</button>
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
// EDIT button to fill the form with existing product
$('#productList').on('click', '.editBtn', function() {
    // console.log(`${serverURL}:${serverPort}/product/${id}`);
    event.preventDefault();
    const id = $(this).parent().parent().data('id');
    $.ajax({
        url: `${url}/product/${id}`,
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
// REMOVE a product
$('#productList').on('click', '.removeBtn', function(){
    event.preventDefault();
    const id = $(this).parent().parent().data('id');
    const li = $(this).parent().parent();
    $.ajax({
      url: `${url}/product/${id}`,
      type: 'DELETE',
      success: function(result){
        li.remove();
      },
      error:function(err) {
        console.log(err);
        console.log('something went wrong deleting the product');
      }
    })
});

// $('#contactButton').click(function(){
//     event.preventDefault();
//     let userName = $('#userName').val();
//     let userEmail = $('#userEmail').val();
//     let userMessage = $('#userMessage').val();
//     // console.log(userName, userEmail, userMessage);
//     if(userName.length === 0){
//       console.log('please enter your name');
//     } else if(userEmail.length === 0){
//       console.log('please enter your email address');
//     } else if(userMessage.length === 0){
//       console.log('please write a message to us, kind sir or madam');
//     } else{
//       $.ajax({
//         url: `${SERVER_URL}:${SERVER_PORT}/contact`,
//         type: 'POST',
//         data: {
//           name: userName,
//           email: userEmail,
//           message: userMessage
//         },
//         success: function(result){
//           console.log(result);
//         },
//         error: function(error){
//           console.log(error);
//           console.log('something screwed up with sending user data');
//         }
//       })
//     }
// });

$('#loginTabBtn').click(function(){
    event.preventDefault();
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
    $('#loginForm').show();
    $('#registerForm').hide();
});

$('#registerTabBtn').click(function(){
    event.preventDefault();
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
    $('#loginForm').hide();
    $('#registerForm').removeClass('d-none').show();

});

$('#registerForm').submit(function(){
    event.preventDefault();
    console.log('register button has been clicked');
    const username = $('#rUsername').val();
    const email = $('#rEmail').val();
    const password = $('#rPassword').val();
    const confirmPassword = $('#rConfirmPassword').val();
    console.log(username);
    console.log(email);
    console.log(password);
    console.log(confirmPassword);
    if(username.length === 0){
        console.log('please enter a username');
    } else if (email.length === 0) {
        console.log('please enter an email');
    } else if (password.length === 0) {
        console.log('please enter a password');
    } else if (confirmPassword.length === 0) {
        console.log('please confirm your password');
    } else if (password !== confirmPassword) {
        console.log('your passwords do not match');
    } else {
        $.ajax({
            url:`${url}/users`,
            type: 'POST',
            data: {
                username: username,
                email: email,
                password: password
            },
            success: function(result){
                console.log(result);
            },
            error: function(err){
                console.log(err);
                console.log('something went wrong with registering a new user');
            }
        })
    }
});

// Click login button --> check if username is valid (Front-end validation)
$('#loginForm').submit(function(){
    event.preventDefault();
    console.log('Login button has been clicked');
    const username = $('#lUsername').val();
    const password = $('#lPassword').val();
    console.log(username);
    console.log(password);
    if(username.length === 0){
        console.log('Please enter a username');
    } else if (password.length === 0) {
        console.log('Please enter a password');
    } else {
        console.log('Username is OK!');
        $.ajax({
            url:`${url}/getUser`,
            type: 'POST',
            data: {
                username: username,
                password: password
            },
            success: function(result){
                if(result === 'invalid user'){
                    console.log('cannot find user with that username');
                } else if(result === 'invalid password'){
                    console.log('your password is wrong');
                } else {
                    console.log('let us log you in');
                    console.log(result);

                    sessionStorage.setItem('userId', result['_id']);
                    sessionStorage.setItem('userName', result['username']);
                    sessionStorage.setItem('userEmail', result['email']);
                }
            },
            error: function(err){
                console.log(err);
                console.log('something went wrong with logging in');
            }
        })
    }
});

// This below makes the modal appear on pageload; just while we're working on it; we'll turn it off later
$(document).ready(function(){
    $('#authForm').modal('show');
    console.log(sessionStorage);
})
