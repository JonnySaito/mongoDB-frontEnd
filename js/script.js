let serverURL;
let serverPort;
let url;
let editing = false;

// Get the JSON File
$.ajax({
  url: 'config.json',
  type: 'GET',
  dataType: 'json',
  success:function(keys){
    serverURL = keys['SERVER_URL'];
    serverPort = keys['SERVER_PORT'];
    url = `${keys['SERVER_URL']}:${keys['SERVER_PORT']}`;
    getProductsData();
  },
  error: function(){
    console.log('cannot find config.json file, cannot run application');
  }
});
// On page load
$(document).ready(function(){
    // This allows the modal to pop up on load (we will remove this line when we are done with the login / register functionality)
    // $('#authForm').modal('show');

    // Check to see if there is a value called user_Name in the sessionStorage, this will only be there when we login in successfully
    if(sessionStorage['userName']){
        // you have logged in
        console.log('you are logged in ');
        $('#loginBtn').hide();
        $('#logoutBtn').removeClass('d-none');
        $('#addProductSection').removeClass('d-none');

    } else {
        // you aren't logged in
        console.log('please sign in');
    }

    // If you check sessionStorage when there isnt anything in there it should be an empty array
    // If you check it when there is some values, it will be an object
    console.log(sessionStorage);

    // From here we are going to be using a lot of if statements to hide and show specifc elements.
    // If there is a value for user_Name, then we will see the Logout button, but if there isn't then we will see the Login/Register button.
    // To clear out sessionStorage we need to call. sessionStorage.clear() which will clear all the items in our session storage.
    // This will happen on a click function for our logout button
});

// Get all the products
getProductsData = () => {
    console.log('something something');
    $.ajax({
        // url: `${serverURL}:${serverPort}/allProducts`,
        // Run an ajax request to the route to get all the products
        url: `${url}/allProducts`,
        type: 'GET',
        dataType: 'json',
        success:function(data){
            console.log('hello success');
            // Because we run this function multiple times now, we need to empty the product list each time we call it
            $('#productList').empty();
            // Loop over all the items/products that get back from the database
            for (var i = 0; i < data.length; i++) {
                // Create a variable called "product" that will hold our template string for our product.
                let product = `
                    <li
                        class="list-group-item d-flex justify-content-between align-items-center productItem"
                        data-id="${data[i]._id}"
                    >
                        <span class="productName">${data[i].name}</span>`;
                        // We only want to see the edit and remove buttons when a user is logged in.
                        // So we have closed the string above and written an if statement to only add on the buttons
                        // if someone is logged on.
                        if(sessionStorage['userName']){
                            if (sessionStorage['userID'] === data[i].user_id) {
                                product += `<div>
                                                <button class="btn btn-info editBtn">Edit</button>
                                                <button class="btn btn-danger removeBtn">Remove</button>
                                            </div>`;
                            }
                        }
                        // Either way, we have to close the li; so we add the closing li at the end.
                    product += `</li>`;
                    // Once we've created our product variable with all the data/html, we append it to the productList ul
                $('#productList').append(product);
            }
        },
        error: function(err){
            console.log(err);
            console.log('something went wrong with getting all the products');
        }
    })
}

//Add or Edit a product
$('#addProductButton').click(function(){
    event.preventDefault();
    if (!sessionStorage['userID']) {
        alert('401, permission denied');
        return;
    };
    let productName = $('#productName').val();
    let productPrice = $('#productPrice').val();
    if(productName.length === 0){
        console.log('please enter a product name');
    } else if(productPrice.length === 0){
        console.log('please enter a product price');
    } else {
        if(editing === true){
            const id = $('#productID').val();
            $.ajax({
                url: `${url}/editProduct/${id}`,
                type: 'PATCH',
                data: {
                    name: productName,
                    price: productPrice,
                    userId: sessionStorage['userID']
                },
                success:function(result){
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
                            return false;
                        }
                    });
                },
                error: function(err){
                    console.log(err);
                    console.log('something went wrong with editing the product');
                }
            })
        } else {
            $.ajax({
                url: `${url}/product`,
                type: 'POST',
                data: {
                    // data we're sending from front end
                    name: productName,
                    price: productPrice,
                    userId: sessionStorage['userID']
                },
                success:function(result){
                    $('#productName').val(null);
                    $('#productPrice').val(null);
                    $('#productList').append(`
                        <li class="list-group-item d-flex justify-content-between align-items-center productItem" data-id="${result._id}">

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
})

// Edit button to fill the form with exisiting product
$('#productList').on('click', '.editBtn', function() {
    event.preventDefault();
    if (!sessionStorage['userID']) {
        alert('401, permission denied');
        return;
    };
    // Get the ID of the product we want to edit.
    // We have saved the ID into data-id of the parent li of the button
    const id = $(this).parent().parent().data('id');
    console.log(id);
    // Send an Ajax request to our route for getting a single product
    $.ajax({
        url: `${url}/product/${id}`,
        type: 'post',
        data: {
            userId: sessionStorage['userID']
        },
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
            console.log('something went wrong with getting the single product');
        }
    })
});

// Remove a product
$('#productList').on('click', '.removeBtn', function(){
    event.preventDefault();
    if (!sessionStorage['userID']) {
        alert('401, permission denied');
        return;
    };
    const id = $(this).parent().parent().data('id');
    const li = $(this).parent().parent();
    $.ajax({
      url: `${url}/product/${id}`,
      type: 'DELETE',
      success:function(result){
        li.remove();
      },
      error:function(err) {
        console.log(err);
        console.log('something went wrong deleting the product');
      }
    })
});

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

// Register Form
$('#registerForm').submit(function(){
    event.preventDefault();
    if (sessionStorage['userID']) {
        alert('401, permission denied');
        return;
    };
    // Get all the values from the input fields
    const username = $('#rUsername').val();
    const email = $('#rEmail').val();
    const password = $('#rPassword').val();
    const confirmPassword = $('#rConfirmPassword').val();

    // We are including basic validation
    // Eventually we would need to include a more thorough validation (required, min, max values, emails, uniques, etc)
    // For time's sake, we are just checking to see if there is a value in each input field.
    if(username.length === 0){
        console.log('please enter a username');
    } else if(email.length === 0){
        console.log('please enter an email');
    } else if(password.length === 0){
        console.log('please enter a password');
    } else if(confirmPassword.length === 0){
        console.log('please confirm your password');
    } else if(password !== confirmPassword){
        // We also need to check if the two passwords match
        console.log('your passwords do not match');
    } else {
        // Once all the validation has passed we run our ajax request to our register route
        $.ajax({
            url: `${url}/users`,
            type: 'POST',
            data: {
                username: username,
                email: email,
                password: password
            },
            success:function(result){
                console.log(result);
            },
            error:function(err){
                console.log(err);
                console.log('Something went wrong with registering a new user');
            }
        })
    }
});

// Login Form
$('#loginForm').submit(function(){
    event.preventDefault();
    if (sessionStorage['userID']) {
        alert('401, permission denied');
        return;
    };
    // Get the two input fields
    const username = $('#lUsername').val();
    const password = $('#lPassword').val();

    // Add in the simple validation to make sure people input a value
    if(username.length === 0){
        console.log('please enter a username');
    } else if(password.length === 0){
        console.log('please enter a password');
    } else {
        // Send an ajax request to our login route.
        // Even though we are getting back a user, because we are dealing with secure data (password), we want to use a POST request
        $.ajax({
            url: `${url}/getUser`,
            type: 'POST',
            data: {
                username: username,
                password: password
            },
            success:function(result){
                // the result value is whatever gets sent back from the server.
                if(result === 'invalid user'){
                    // If someone tries to login with a username that doesn't exist
                    console.log('cannot find user with that username');
                } else if(result === 'invalid password'){
                    // If someone logs in with a valid username but the password is wrong
                    console.log('Your password is wrong');
                } else {
                    // If someone logs in with a valid username and a valid password
                    console.log('lets log you in');
                    console.log(result);

                    // sessionStorage (and LocalStorage) allows you to save data into your web browser and will stay there until it gets removed
                    // sessionStorage will keep data until the session is finished (closing the tab or browser)
                    // localStorage will keep the data forever until someone manually clears the localStorage cache.
                    // This is how we will be creating our login system.
                    // If we save a value into sessionStorage or localStorage, if we keep refreshing our page, the value we saved will still be there.
                    // In our document.ready() function below we are checking to see if there is a value in our sessionStorage called user_Name
                    sessionStorage.setItem('userID', result['_id']);
                    sessionStorage.setItem('userName', result['username']);
                    sessionStorage.setItem('userEmail', result['email']);
                    getProductsData();
                    $('#authForm').modal('hide');
                    $('#loginBtn').hide();
                    $('#logoutBtn').removeClass('d-none');
                    $('#addProductSection').removeClass('d-none');
                }
            },
            error:function(err){
                console.log(err);
                console.log('Something went wrong with logging in.');
            }
        })
    }
});

$('#logoutBtn').click(function(){
    if (!sessionStorage['userID']) {
        alert('401, permission denied');
        return;
    };
    sessionStorage.clear();
    getProductsData();
    $('#loginBtn').show();
    $('#logoutBtn').addClass('d-none');
    $('#addProductSection').addClass('d-none');
    $('#lUsername').val(null);
    $('#lPassword').val(null);
});
