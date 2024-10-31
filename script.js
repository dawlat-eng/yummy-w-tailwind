//spinner
window.onload = function(){
    $('.loading-screen').fadeOut(2000);
    getHomeData()
}

//open side-nav
$('.open-close-btn').click(function(){
    let widths = $('.nav-tab').outerWidth();
    let offset = $('.side-nav-menu').offset().left;
      if(offset === 0){
          $('.side-nav-menu').css({left:`${widths}px` , transition: 'all 1s'});
          $(".open-close-icon").removeClass("fa-align-justify");
          $(".open-close-icon").addClass("fa-x");
          $('.list-unstyled li').animate({top:0 },700)
      }else {
          $('.side-nav-menu').css({left:0 , transition: 'all 1s'});
          $(".open-close-icon").removeClass("fa-x");
          $(".open-close-icon").addClass("fa-align-justify");
          $('.list-unstyled li').animate({top:300 },1000);
      }
    });

//close sidenav
function closeSideNav(){
    let widthss = $('.nav-tab').outerWidth();
        $('.side-nav-menu').css({left:-widthss},2000);
        $(".open-close-icon").removeClass("fa-x");
        $(".open-close-icon").addClass("fa-align-justify");
        $('.list-unstyled li').animate({top:300 },700);
  }
  
  $('.list-unstyled li').click(function(){
    closeSideNav()
  });

  //get home data from api
  async function getHomeData() {
    document.querySelector('.loading-screen').classList.remove('hidden');
    document.querySelector('.side-nav-menu').classList.add('hidden');
    document.querySelector('.nav-header').animate({ left: '80px' }, 300);
    
    const result = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
    const response = await result.json();

    document.querySelector('.loading-screen').classList.add('hidden');
    document.querySelector('.side-nav-menu').classList.remove('hidden');
    document.querySelector('.nav-header').animate({ left: '0px' }, 300);
    
    displayHomeData(response.meals);
}

//display home data
async function displayHomeData(data) {
    let box = '';
    for (let meal of data) {
        box += `
        <div class=" px-2 hiddenDiv">
            <div onclick="getMealDetails('${meal.idMeal}')" class="meal overflow-hidden rounded-lg cursor-pointer relative">
                <img class="w-full" src="${meal.strMealThumb}" alt="">
                <div class="meal-layer inset-0 absolute flex items-center justify-center bg-white bg-opacity-70 p-2 opacity-0 transition-opacity duration-300 hover:opacity-100">
                    <h3 class="text-black text-lg font-semibold">${meal.strMeal}</h3>
                </div>
            </div>
        </div>`;
    }
    document.getElementById("rowData").innerHTML += box;
}

//get details of one meal from api
async function getMealDetails(id) { 
    document.querySelector('.loading-screen').classList.remove('hidden');
    const result = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const response = await result.json();
    document.querySelector('.loading-screen').classList.add('hidden');
    displayMealDetails(response.meals[0]);
}

//display details of one meal
async function displayMealDetails(meal) {
    $('.insidemeal').addClass('hidden'); 
   
    closeSideNav();
    let ingredients = '';

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="bg-blue-100 m-2 p-1 rounded">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
        }
    }

    let tags = meal.strTags ? meal.strTags.split(",") : [];
    let tagsStr = tags.map(tag => `<li class="bg-red-100 m-2 p-1 rounded">${tag}</li>`).join('');

    $('.hiddenDiv').addClass('hidden');
    $('.insidingridien').addClass('hidden');
    $('.insidarea').addClass('hidden');
    let box = `
        <div class="w-full md:w-1/3 hiddenDiv">
            <img class="w-full rounded-lg" src="${meal.strMealThumb}" alt="meal-photo"/>
            <h2 class="text-2xl text-white mt-2">${meal.strMeal}</h2>
        </div>
        <div class="w-full md:w-2/3 hiddenDiv">
            <h2 class="text-lg text-white mt-4">Instructions</h2>
            <p class="text-white">${meal.strInstructions}</p>
            <h3 class="mt-4  text-white">Area: <span class="font-bold">${meal.strArea}</span></h3>
            <h3 class="text-white">Category: <span class="font-bold  text-white">${meal.strCategory}</span></h3>
            <h3 class="text-white font-bold">Recipes:</h3>
            <ul class="list-none flex flex-wrap  text-black">${ingredients}</ul>
            <h3 class="text-white pb-2">Tags:</h3>
            <ul class="list-none flex flex-wrap flex-row  text-black pb-4">${tagsStr}</ul>
            <a target="_blank" href="${meal.strSource}" class="bg-green-500 text-white px-4 py-2 rounded mt-2">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="bg-red-500 text-white px-4 py-2 rounded mt-2">Youtube</a>
        </div>`;
    
    document.getElementById("mealdeat").innerHTML += box;
}

//display search page
async function disSearchPage(){
    $('.hiddenDiv').addClass('hidden');
    closeSideNav();
    let box=``;
        box += `
       <div class="hiddenDiv flex flex-wrap py-4">
    <div class="w-full md:w-1/2 px-2 mb-4">
        <input
            id="inputone"
            onchange="dis()"
            onkeyup="searchByName(this.value)"
            class="form-control w-full bg-transparent border border-gray-300 text-white p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            type="text"
            placeholder="Search By Name"
        />
    </div>
    <div class="w-full md:w-1/2 px-2 mb-4">
        <input
            id="inputtwo"
            onkeyup="searchByFLetter(this.value)"
            maxlength="1"
            class="form-control w-full bg-transparent border border-gray-300 text-white p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            type="text"
            placeholder="Search By First Letter"
        />
    </div>
</div>

        `
    document.getElementById("searchContainer").innerHTML+=box;
  }

  //get search of name from api
  async function searchByName(term) {
    $('.loading-screen').removeClass('hidden');
    document.getElementById("rowData").innerHTML = "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    response = await response.json();
    displayHomeData(response.meals);
    $('.loading-screen').addClass('hidden');
  }
  
  //get search of letter from api
  async function searchByFLetter(term) {
    $('.loading-screen').removeClass('hidden');
    document.getElementById("rowData").innerHTML = "";
    term == "" ? term = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`);
    response = await response.json();
    displayHomeData(response.meals);
    $('.loading-screen').addClass('hidden');
  }

  //get cattegories data from api
  async function getCategoryMeals(){
    $('.loading-screen').removeClass('hidden');
    closeSideNav();
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    let response = await result.json();
    $('.loading-screen').addClass('hidden');
    displayCategoryMeals(response.categories);
  }
  
  //display categories data from api
  async function displayCategoryMeals(categories){
    $('.hiddenDiv').addClass('hidden');
    let box=``;
    for(i=0 ; i< categories.length ; i++){
        box += `
        <div class=" w-full relative allMeals">
            <div onclick="getCategoryOneMeal('${categories[i].strCategory}')" class="meal relative overflow-hidden rounded-2 cursor-pointer" >
                <img class="w-full" src="${categories[i].strCategoryThumb}" alt="img" srcset="">
                <div class="meal-layer absolute inset-0 text-center text-black bg-white bg-opacity-70 rounded p-2 opacity-0 transition-opacity duration-300 hover:opacity-100" >
                    <h3>${categories[i].strCategory}</h3>
                    <p>${categories[i].strCategoryDescription}</p>
                </div>
            </div>
        </div>
        `
    }
    document.getElementById("displayOneMeal").innerHTML+=box;
  }
  
// get one Category meal from Api 
async function getCategoryOneMeal(Category){
    $('.loading-screen').removeClass('hidden');
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${Category}`);
    let response = await result.json();
    $('.loading-screen').addClass('hidden');
    displayCategoryOneMeal(response.meals);
  }
  //display categories of meals
  async function displayCategoryOneMeal(data){
    $('.hiddenDiv').addClass('hidden');
    $('.allMeals').addClass('hidden');
    let box=``;
    for(i=0 ; i< data.length ; i++){
        box += `
        <div class="relative insidemeal">
                <div onclick="getMealDetails('${data[i].idMeal}')" class="meal overflow-hidden rounded-2 relative cursor-pointer">
                    <img class="w-100" src="${data[i].strMealThumb}" alt="" srcset="">
                    <div class="meal-layer inset-0 absolute flex items-center justify-center bg-white bg-opacity-70 p-2 opacity-0 transition-opacity duration-300 hover:opacity-100">
                      <h3 class="text-black text-lg font-semibold">${data[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }
    document.getElementById("displayOneMeal").innerHTML+=box;
  }
  // get Areas data from Api 
async function getArea(){
    $('.loading-screen').removeClass('hidden');
    closeSideNav();
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    let response = await result.json();
    $('.loading-screen').addClass('hidden');
    displayAreas(response.meals);
  }
  
// display Areas data 
  async function displayAreas(data){
    $('.hiddenDiv').addClass('hidden');
    $('.insidemeal').addClass('hidden');
    let box=``;
    for(i=0 ; i< data.length ; i++){
        box += `
        <div class="w-full md:w-1/4 allareas">
            <div onclick="getAreaOneMeal('${data[i].strArea}')" class="rounded-2 text-center text-white cursor-pointer" >
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${data[i].strArea}</h3>
            </div>
        </div>
        `
    }
    document.getElementById("disArea").innerHTML+=box;
  }
  
// get one Area meals from Api
  async function getAreaOneMeal(Area){
    $('.loading-screen').removeClass('hidden');
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${Area}`);
    let response = await result.json();
    $('.loading-screen').addClass('hidden');
    displayAreaOneMeal(response.meals)
  }
  
// display meals of Area 
  async function displayAreaOneMeal(data){
    $('.hiddenDiv').addClass('hidden');
    $('.allareas').addClass('hidden');
    let box=``;
    for(i=0 ; i< data.length ; i++){
        box += `
        <div class="w-full insidarea">
                <div onclick="getMealDetails('${data[i].idMeal}')" class="meal overflow-hidden relative rounded-2 cursor-pointer">
                    <img class="w-full" src="${data[i].strMealThumb}" alt="img" srcset="">
                    <div class="meal-layer inset-0 absolute flex items-center justify-center bg-white bg-opacity-70 p-2 opacity-0 transition-opacity duration-300 hover:opacity-100">
                      <h3 class="text-black text-lg font-semibold">${data[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }
    document.getElementById("disArea").innerHTML+=box;
  }
  
// get Ingradiants data from Api
  async function getIngradiants(){
    $('.loading-screen').removeClass('hidden');
    closeSideNav();
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    let response = await result.json();
    $('.loading-screen').addClass('hidden');
    displayIngradiants(response.meals.slice(0, 20));
  }
  
// display Ingradiants data 
  async function displayIngradiants(data){
    $('.hiddenDiv').addClass('hidden');
    let box=``;
    for(i=0 ; i< data.length ; i++){
        box += `
        <div class="w-full allingridient">
            <div onclick="getingrOneMeal('${data[i].strIngredient}')" class="rounded-2 text-white text-center cursor-pointer" >
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${data[i].strIngredient}</h3>
                <p>${data[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
            </div>
        </div>
        `
    }
    document.getElementById("rowData").innerHTML+=box;
  }
  
/// get one ingradiant from Api 
  async function getingrOneMeal(Ingradiant){
    $('.loading-screen').removeClass('hidden');
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${Ingradiant}`);
    let response = await result.json();
    $('.loading-screen').addClass('hidden');
    displayingrOneMeal(response.meals.slice(0, 20));
  }
  
// display meals of one ingradiant
  async function displayingrOneMeal(data){
    $('.hiddenDiv').addClass('hidden');
    $('.allingridient').addClass('hidden')
    let box=``;
    for(i=0 ; i< data.length ; i++){
        box += `
        <div class="w-full insidingridien">
                <div onclick="getMealDetails('${data[i].idMeal}')" class="meal overflow-hidden rounded-2 relative cursor-pointer">
                    <img class="w-full" src="${data[i].strMealThumb}" alt="img" srcset="">
                    <div class="meal-layer inset-0 absolute flex items-center justify-center bg-white bg-opacity-70 p-2 opacity-0 transition-opacity duration-300 hover:opacity-100">
                      <h3 class="text-black text-lg font-semibold">${data[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }
    document.getElementById("rowData").innerHTML+=box;
  }
  
  // display contact us page 
  async function contactUsPage(){
    $('.hiddenDiv').addClass('hidden');
    closeSideNav();
    let box=``;
        box += `
<div class="contact min-h-screen flex justify-center items-center">
    <div class="container w-full max-w-screen-md text-center rounded-lg shadow-lg">
        <h2 class="text-2xl text-white font-semibold mb-6">Contact Form</h2>
        <div class="flex flex-wrap -mx-2">  
            <div class="w-full md:w-1/2 px-2 mb-4">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="selectedInput form-control w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300" placeholder="Enter Your Name" />
                <div id="nameAlert" class="alert alert-danger mt-2 hidden text-red-600">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="w-full md:w-1/2 px-2 mb-4">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="selectedInput form-control w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300" placeholder="Enter Your Email" />
                <div id="emailAlert" class="alert alert-danger mt-2 hidden text-red-600">
                    Email not valid *example@yyy.zzz*
                </div>
            </div>
            <div class="w-full md:w-1/2 px-2 mb-4">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="selectedInput form-control w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300" placeholder="Enter Your Phone" />
                <div id="phoneAlert" class="alert alert-danger mt-2 hidden text-red-600">
                    Enter valid phone Number
                </div>
            </div>
            <div class="w-full md:w-1/2 px-2 mb-4">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="selectedInput w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300" placeholder="Enter Your Age" />
                <div id="ageAlert" class="alert alert-danger mt-2 hidden text-red-600">
                    Enter valid age
                </div>
            </div>
            <div class="w-full md:w-1/2 px-2 mb-4">
                <input id="passwordInput" onkeyup="inputsValidation()" type="password" class="selectedInput w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300" placeholder="Enter Your Password" />
                <div id="passwordAlert" class="alert alert-danger mt-2 hidden text-red-600">
                    Enter valid password *Minimum eight characters, at least one letter and one number*
                </div>
            </div>
            <div class="w-full md:w-1/2 px-2 mb-4">
                <input id="repasswordInput" onkeyup="inputsValidation()" type="password" class="selectedInput w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300" placeholder="Re-enter Your Password" />
                <div id="repasswordAlert" class="alert text-red-700 mt-2 hidden">
                    Enter valid repassword
                </div>
            </div>
        </div>
        <button disabled class="bg-transparent text-red-900 border border-red-600 px-4 py-2 mt-4 rounded hover:bg-red-600 hover:text-white transition duration-200" id="submitBtn">Submit</button>
    </div>
</div>
        `
    document.getElementById("oneDetails").innerHTML+=box;
    let submitBtn = document.getElementById('submitBtn');
  
    
    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInputTouched = true;
    })
  
    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputTouched = true;
    })
  
    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInputTouched = true;
    })
  
    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputTouched = true;
    })
  
    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInputTouched = true;
    })
  
    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInputTouched = true;
    })
    
  }
  
 //Regex function
  
  function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value));
  }
  
  function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value));
  }
  
  function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value));
  }
  
  function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value));
  }
  
  function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value));
  }
  
  function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value;
  }
  
// variables 
  let nameInputTouched = false;
  let emailInputTouched = false;
  let phoneInputTouched = false;
  let ageInputTouched = false;
  let passwordInputTouched = false;
  let repasswordInputTouched = false;
  
 //validation 
  function inputsValidation() {
  
  let nameInput = document.getElementById('nameInput');
  let emailInput = document.getElementById('emailInput');
  let phoneInput = document.getElementById('phoneInput');
  let ageInput = document.getElementById('ageInput');
  let passwordInput = document.getElementById('passwordInput');
  let repasswordInput = document.getElementById('repasswordInput');
  let nameAlert = document.getElementById('nameAlert');
  let emailAlert = document.getElementById('emailAlert');
  let phoneAlert = document.getElementById('phoneAlert');
  let ageAlert = document.getElementById('ageAlert');
  let passwordAlert = document.getElementById('passwordAlert');
  let repasswordAlert = document.getElementById('repasswordAlert');
  
    if (nameInputTouched) {
        if (nameValidation()) {
            nameAlert.classList.replace("d-block", "hidden");
            nameInput.classList.add('is-valid');
            nameInput.classList.remove('is-invalid');
        } else {
            nameAlert.classList.replace("hidden", "d-block");
            nameInput.classList.add('is-invalid');
            nameInput.classList.remove('is-valid');
        }
    }
  
    if (emailInputTouched) {
        if (emailValidation()) {
            emailAlert.classList.replace("d-block", "hidden");
            emailInput.classList.add('is-valid');
            emailInput.classList.remove('is-invalid');
        } else {
            emailAlert.classList.replace("hidden", "d-block");
            emailInput.classList.add('is-invalid');
            emailInput.classList.remove('is-valid');
        }
    }
  
    if (phoneInputTouched) {
        if (phoneValidation()) {
            phoneAlert.classList.replace("d-block", "hidden");
            phoneInput.classList.add('is-valid');
            phoneInput.classList.remove('is-invalid');
        } else {
            phoneAlert.classList.replace("hidden", "d-block");
            phoneInput.classList.add('is-invalid');
            phoneInput.classList.remove('is-valid');
        }
    }
  
    if (ageInputTouched) {
        if (ageValidation()) {
            ageAlert.classList.replace("d-block", "hidden");
            ageInput.classList.add('is-valid');
            ageInput.classList.remove('is-invalid');
        } else {
            ageAlert.classList.replace("hidden", "d-block");
            ageInput.classList.add('is-invalid');
            ageInput.classList.remove('is-valid');
        }
    }
  
    if (passwordInputTouched) {
        if (passwordValidation()) {
            passwordAlert.classList.replace("d-block", "hidden");
            passwordInput.classList.add('is-valid');
            passwordInput.classList.remove('is-invalid');
        } else {
            passwordAlert.classList.replace("hidden", "d-block");
            passwordInput.classList.add('is-invalid');
            passwordInput.classList.remove('is-valid');
        }
    }
  
    if (repasswordInputTouched) {
        if (repasswordValidation()) {
            repasswordAlert.classList.replace("d-block", "hidden");
            repasswordInput.classList.add('is-valid');
            repasswordInput.classList.remove('is-invalid');
        } else {
            repasswordAlert.classList.replace("hidden", "d-block");
            repasswordInput.classList.add('is-invalid');
            repasswordInput.classList.remove('is-valid');
        }
    }
  
    // change button status 
    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled");
    } else {
        submitBtn.setAttribute("disabled", true);
    }
  }
  
  
  

