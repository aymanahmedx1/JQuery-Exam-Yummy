// & Document Start init
const animationDuration = 500;
const showItemCount = 20;
$(document).ready(function () {
    serachByName("");
    $(".loader-area").fadeOut(animationDuration);
    $(".loader-area").remove();
});

$("aside").css("left", -$(".menu").innerWidth());
$("li a").click(function (e) {
    e.preventDefault();
    if ($(e.target).attr('href') != "#search") {
        $(".home .search-area").addClass("d-none");
    }
});
// START EVENT LISTNER 
$("li a[href='#search']").click(function (e) {
    e.preventDefault();
    showSearch();
    closeAside();
});
$("li a[href='#category']").click(function (e) {
    e.preventDefault();
    getCategories();
    closeAside();
});
$("li a[href='#area']").click(function (e) {
    e.preventDefault();
    getAreas();
    closeAside();
});
$("li a[href='#ingredients']").click(function (e) {
    e.preventDefault();
    getIngrediants();
    closeAside();
});
$("li a[href='#contact']").click(function (e) {
    e.preventDefault();
    showContact();
    closeAside();
});
// END EVENT LISTNER 

// ^ ########  START GET DATA FROM API ########################
async function getMealDetails(mealID) {
    startLoader();
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    let data = await result.json();
    showMealDetails(data.meals[0]);
}
async function serachByName(name) {
    startLoader();
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    let data = await result.json();
    showMeals(data.meals, false);
}
async function serachByFirstLetter(name) {
    startLoader();
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${name}`);
    let data = await result.json();
    showMeals(data.meals, false);
}
async function getCategories() {
    startLoader();
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    let data = await result.json();
    showCategories(data.categories);
}
async function filterByCategory(categoryName) {
    startLoader();
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
    let data = await result.json();
    showMeals(data.meals);
}
async function getAreas() {
    startLoader();
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    let data = await result.json();
    showAreas(data.meals);
}
async function filterByArea(area) {
    startLoader();
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    let data = await result.json();
    showMeals(data.meals);
}
async function getIngrediants() {
    startLoader();
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    let data = await result.json();
    showIngrediants(data.meals.slice(0, 20));
}
async function filterIngrediant(ingrediant) {
    startLoader();
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediant}`);
    let data = await result.json();
    showMeals(data.meals);
}
// ^ ######## END  GET DATA FROM API ########################
// ! #################### START COMMON FUNCTIONS ####################
function startLoader() {
    $(".section-loader").fadeIn(300);
    $("body").css("overflow", "hidden");
}
function finishLoader() {
    $(".section-loader").fadeOut(300);
    $("body").css("overflow", "auto");
}
function showMeals(meals, appenRow = true) {
    let cartona = ``;
    if (meals) {
        for (let i = 0; i < meals.length; i++) {
            const current = meals[i];
            if (i < 20) {
                cartona += ` <div class="col-md-3">
            <div class="meal-item rounded-3 position-relative" data-id="${current.idMeal}">
                <img src="${current.strMealThumb}" alt="${current.strMeal}" class="w-100 rounded-3">
                <div class="overlayer rounded-3 d-flex align-items-center">
                    <h4>${current.strMeal}</h4>
                </div>
            </div>
        </div>`;
            }
        }
        addRow();
        $(".mainRow").html(cartona);
        $(".meal-item").click(function (e) {
            e.preventDefault();
            getMealDetails($(this).attr("data-id"));
        });
    } else {
        $(".mainRow").html("");
    }
    finishLoader();
}
function addRow() {
    $(".home .meal-area").html(`<div class="row gy-4 mainRow"></div>`);
}
function showMealDetails(meal) {
    $(".home .search-area").addClass("d-none");
    let ingrediant = ``;
    for (let i = 0; i <= 20; i++) {
        const ingValue = meal[`strIngredient` + i];
        const mesValue = meal[`strMeasure` + i];
        if (ingValue && mesValue) {
            ingrediant +=
                `<div class="alert alert-info p-2 me-2" role="alert">
            <span>${mesValue} ${ingValue} </span>
            </div>`
        }
    }
    let tagCartona =`` ;
    if(meal.strTags!= null){    let tagList = meal.strTags.split(",");
    for (let i = 0; i < tagList.length; i++) {
        tagCartona+=`<div class="alert alert-danger p-2 me-2" role="alert">
        ${tagList[i]}
      </div>`;
    }

    }

    let data = `      
         <div class="col-md-4">
    <div class="content">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal} ${meal.strTags}" class="w-100 rounded-3">
        <h1 class="text-white fs-1">${meal.strMeal}</h1>
    </div>
    </div>
    <div class="col-md-8">
   <div class="content text-white">
    <h3 class="fs-2">Instructions</h3>
    <p class="mb-3">${meal.strInstructions}</p>
    <h4 class="fs-3">Area : ${meal.strArea} </h4>
    <h4  class="fs-3">Category : ${meal.strCategory} </span>
    <h4  class="fs-3">Recipes :</h4>
    <div class="d-flex flex-wrap">
      ${ingrediant}
    </div>
    <h4>Tags:</h4>
    <div class="d-flex flex-wrap">
      ${tagCartona}
    </div>
    <a class="btn btn-success py-2 px-4 mt-3"  href="${meal.strSource}" target="_blank">Source</a>
    <a class="btn btn-danger py-2 px-4 mt-3"  href="${meal.strYoutube}"  target="_blank">Youtube</a>
   </div>
    </div>`;
    addRow();
    $(".mainRow").html(data);
    finishLoader();
}
// ! #################### END COMMON FUNCTIONS ####################

// ~ ############################# START SEARCH ####################

function showSearch() {
    let data = ` <div class="d-flex px-5">
    <div class="row gy-3 w-100">
        <div class="col-md-6 ">
        <input type="text" placeholder="Search By Name" name="name"
        class="form-control me-3 bg-black search-input">
    </div>    
        <div class="col-md-6">
        <input type="text" placeholder="Search By First Letter" name="firstLetter"  maxlength="1"
        class="form-control bg-black search-input">
        </div>    
    </div>
    </div>` ;
    $(".home .search-area").removeClass("d-none");
    $(".home .search-area").html(data);
    $(".home .meal-area").html("");
    $("input[name='name']").on("input", function () {
        let value = $("input[name='name']").val();
        serachByName(value);
    });
    $("input[name='firstLetter']").on("input", function () {
        let value = $("input[name='firstLetter']").val();
        serachByFirstLetter(value);
    });
    finishLoader();
}
// ~ #############################  END SEARCH ####################

// ! ############################# START CATEGORY ####################
function showCategories(categories) {
    let cartona = ``;
    for (let i = 0; i < categories.length; i++) {
        const current = categories[i];
        if (i < showItemCount) {
            let fullDecription = current.strCategoryDescription.split(" ");
            let cutText = fullDecription.slice(0, 25).join(" ");
            cartona += ` <div class="col-md-3">
            <div class="meal-item rounded-3 position-relative" data-id="${current.strCategory}">
                <img src="${current.strCategoryThumb}" alt="${current.strArea} ${current.strMeal}" class="w-100 rounded-3">
                <div class="overlayer rounded-3 d-flex flex-column align-items-center py-3">
                    <h4>${current.strCategory}</h4>
                    <p class="p-2 text-center">${cutText}</p>
                </div>
            </div>
        </div>`;
        }
    }
    addRow();
    $(".mainRow").html(cartona);
    $(".meal-item").click(function (e) {
        filterByCategory($(this).attr("data-id"));
    });
    finishLoader();

}
// ! #############################  END CATEGORY ####################

// * ############################# START AREA ####################
function showAreas(areas) {
    let cartona = ``;
    for (let i = 0; i < areas.length; i++) {
        const current = areas[i];
        if (i < showItemCount) {
            cartona += ` <div class="col-md-3">
            <div data-id="${current.strArea}" class="area-item d-flex flex-column justify-content-center align-items-center cursor-pointer"> 
            <i class="fa-solid fa-house-laptop fa-4x text-white pb-2"></i>
            <h4 class="text-white">${current.strArea}</h4>
            </div>
        </div>`;
        }
    }
    addRow();
    $(".mainRow").html(cartona);
    $(".area-item").click(function (e) {
        filterByArea($(this).attr("data-id"));
    });
    finishLoader();
}
// * #############################  END AREA ####################

// ~ ############################# START INGREDIANT ####################
function showIngrediants(ingerdiants) {
    let cartona = ``;
    for (let i = 0; i < ingerdiants.length; i++) {
        const current = ingerdiants[i];
        if (i < showItemCount) {
            let fullDecription = current.strDescription.split(" ");
            let cutText = fullDecription.slice(0, 25).join(" ");
            cartona += ` <div class="col-md-3">
            <div data-id="${current.strIngredient}" class="pt-4  area-item d-flex flex-column justify-content-center align-items-center cursor-pointer"> 
            <i class="fa-solid fa-drumstick-bite text-white fa-2xl pb-3"></i>
            <h4 class="text-white">${current.strIngredient}</h4>
            <p class="text-white text-center"> ${cutText}</p>
            </div>
        </div>`;
        }
    }
    addRow();
    $(".mainRow").html(cartona);
    $(".area-item").click(function (e) {
        filterIngrediant($(this).attr("data-id"));
    });
    finishLoader();
}
// ~ #############################  END INGREDIANT ####################

// ^ ############################# START CONTACT ####################
const nameRegex = /^[a-z A-Z]{3,}$/
const emailRegex = /^[a-z 0-9]{1,}@[a-z]{2,}\.[a-z]{1,3}$/;
const phoneRegex = /^[\+]{0,1}[0-9]{9,11}$/;
const ageRegex = /^(?:1[0-4][0-9]|150|[1-9]|[1-9][0-9])$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
function showContact() {
    startLoader();
    const data = `
     <div class="contact-us d-flex justify-content-center align-items-center" >
     <div class="alert alert-success  timedMessage position-fixed top-0 end-0 m-3 " role="alert">
      <i class="fa-solid fa-check text-success"></i>  Message Sent Succeffuly
      </div>
    <div class="row max-w-75 mx-auto">
        <div class="col-md-6">
            <input type="text" placeholder="Enter Your Name" name="name" class="form-control mb-2">
        </div>
        <div class="col-md-6">
            <input type="email" placeholder="Enter Your Email" name="email" class="form-control mb-2">
        </div>
        <div class="col-md-6">
            <input type="text" placeholder="Enter Your Phone" name="phone" class="form-control mb-2">
        </div>
        <div class="col-md-6">
            <input type="number" placeholder="Enter Your Age" name="age" class="form-control mb-2">
        </div>
        <div class="col-md-6">
            <input type="password" placeholder="Enter Your Password" name="password" class="form-control mb-2">
        </div>
        <div class="col-md-6">
            <input type="password" placeholder="RePassword" name="rePassword" class="form-control mb-2">
        </div>
       <div class="pt-5 d-flex justify-content-center align-items-center">
        <button class="btn btn-outline-danger" disabled> Submit</button>
       </div>
    </div>
  </div>`;

    $(".home .meal-area").html(data);
    $(".timedMessage").fadeOut(0);
    $("button").click(function (e) {
        e.preventDefault();
        $("input").removeClass("is-valid");
        $("input").val("");
        $(".timedMessage").fadeIn(300);
        setTimeout(() => {
            $(".timedMessage").fadeOut(animationDuration);
        }, 2000);
    });
    $("input[name='name']").on("keyup", function () {
        validate($(this), nameRegex, "Special characters and numbers not allowed And must be More Than 3 Char");
    });
    $("input[name='email']").on("keyup", function () {
        validate($(this), emailRegex, "Email not valid *exemple@yyy.zzz");
    });
    $("input[name='age']").on("keyup", function () {
        validate($(this), ageRegex, "Enter valid age between 1 and 150 year");
    });
    $("input[name='phone']").on("keyup", function () {
        validate($(this), phoneRegex, "Enter valid Phone Number");
    });
    $("input[name='password']").on("keyup", function () {
        validate($(this), passwordRegex, "Enter valid password *Minimum eight characters, at least one letter and one number:*");
    });
    $("input[name='rePassword']").on("keyup", function () {
        let errorItem = $(".inputmessage");
        if ($(this).val() === $("input[name='password']").val()) {
            $(".inputmessage").fadeOut(300);
            $(".inputmessage").remove();
            inputValidUI($(this), true);
        } else {
            inputValidUI($(this), false);
            let errorMessage = `<div class="alert alert-danger inputmessage" role="alert">
            Enter valid password must Equal Password        
                </div>` ;
            if (errorItem.length <= 0) {
                $(this).parent().append(errorMessage);
            }
        }
    });
    $("input").on("keyup", function () {
        if ($(".is-valid").length === 6) {
            $('button').prop("disabled", false);
        }
        else {
            $('button').prop("disabled", true);
        }

    });
    finishLoader();
}

function validate(input, regex, error) {
    let errorItem = $(".inputmessage");
    if (regex.test(input.val())) {
        $(".inputmessage").fadeOut(300);
        $(".inputmessage").remove();
        inputValidUI(input, true);
    } else {
        let errorMessage = `<div class="alert alert-danger inputmessage" role="alert">
        ${error}
        </div>` ;
        if (errorItem.length <= 0) {
            input.parent().append(errorMessage);
        }
        inputValidUI(input, false);

    }
}
function inputValidUI(input, isValid) {
    if (isValid) {
        input.addClass("is-valid");
        input.removeClass("is-invalid");
    } else {
        input.removeClass("is-valid");
        input.addClass("is-invalid");
    }
}
// ^ #############################  END CONTACT ####################




// ^ ############################ ASIDE ######################
$(".open").click(function (e) {
    openAside();

});
$(".close").click(function (e) {
    closeAside();
});
function openAside() {
    $("aside").animate({ "left": 0 }, animationDuration);
    $(".open").fadeOut(100, function () {
        $(".close").fadeIn(100);
    });
    for (let li = 0; li < $("ul li").length; li++) {
        $("ul li").eq(li).animate({ "top": "0" }, (li + 5) * animationDuration / 5);
    }
}
function closeAside() {
    for (let li = 0; li < $("ul li").length; li++) {
        $("ul li").eq(li).animate({ "top": "150px" }, (li + 5) * animationDuration / 10);
    }
    $("aside").animate({ "left": -$(".menu").innerWidth() }, animationDuration);
    $(".close").fadeOut(100, function () {
        $(".open").fadeIn(100);
    });
}
function animation() {
    setInterval(() => {

    }, 3000);
}
// ^ ############################ ASIDE ######################