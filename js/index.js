let products = [];
let categorys = [];
let pageActual = "";
let formValid = false;

window.onload = () => {
    loadContent('home');

    if (!JSON.parse(localStorage.getItem("Trolley"))){
        trolley = []
        localStorage.setItem("Trolley",JSON.stringify(trolley));
    }

}

function loadContent(page){
    let direction = './views/'+page+'.html';
    let contentDiv = $('#content');

    contentDiv.fadeOut();
    
    setTimeout(()=> {
        fetch(direction)
        .then(res => res.text())
        .then(content => {
            contentDiv.html(content);
            if(page == "products"){
                loadProducts();
                loadCategorys();
            }else if (page == "trolley"){
                loadTrolley();
            }
        });

        formValid = false;

        setTimeout(()=>{
            contentDiv.fadeIn();
        },200)
    },300)

    pageActual = page;
}

function loadProducts(){
    fetch('https://fakestoreapi.com/products')
            .then(res=>res.json())
            .then(response=>{
                products = response
                let contentDiv = $('#productsBox');

                for (let i = 0; i < products.length; i++) {
                    node = `
                        <div class="productBox">
                            <div class="product">
                                <img src="${products[i].image}" alt="${products[i].title}">
                                <h5><strong>${products[i].title}</strong></h3>
                                <p class="price">$${products[i].price}</p>
                                <p class="infoProduct"><i>${products[i].description}</i></p>
                                <button class="addButton" onclick="addItemTrolley(${i})">Añadir</button>
                            </div>
                        </div>
                    `
                    contentDiv.append(node);
                }


            })
}

function loadCategorys(){
    fetch('https://fakestoreapi.com/products/categories')
            .then(res=>res.json())
            .then(response=>{
                categorys = response;
                let categorysDiv =  $("#categorySelect");

                for (let i=0; i< categorys.length; i++){
                    node = `
                        <option value="${categorys[i]}" onclick="filterProducts()">${categorys[i]}</option>
                    `
                    categorysDiv.append(node);
                }
            })
}

function filterProducts(){
    let category = $("#categorySelect").val().toLowerCase();
    let name = $("#searchName").val().toLowerCase();
    auxProducts = products.filter(product => (product.title.toLowerCase().includes(name) && product.category.toLowerCase().includes(category)));
    let contentDiv = $('#productsBox');
    contentDiv.find(".productBox").remove();
    for (let i = 0; i < auxProducts.length; i++) {
        node = `
            <div class="productBox">
                <div class="product">
                    <img src="${auxProducts[i].image}" alt="${auxProducts[i].title}">
                    <h5><strong>${auxProducts[i].title}</strong></h3>
                    <p class="price">$${auxProducts[i].price}</p>
                    <p class="infoProduct"><i>${auxProducts[i].description}</i></p>
                    <button class="addButton" onclick="addItemTrolley(${i})">Añadir</button>
                </div>
            </div>
        `
        contentDiv.append(node);
    }
}

function validateCampo(id) {
    let campo = $("#"+id);
    let message = $("#messageError");
    campo.removeClass("invalidCampo");
    formValid = true;
    message.html("");

    if(campo.val()==""){
        campo.addClass("invalidCampo");
        message.html("(No puede estar vacio)");
        formValid = false;
    }

    if (id == "DNIPerson" || id == "tel" || id == "CUIT"){
        if(campo.val().length<8 && id == "DNIPerson"){
            campo.addClass("invalidCampo");
            message.html("(DNI no valido)");
            formValid = false;
        }else if(campo.val().length<10 && id == "tel"){
            campo.addClass("invalidCampo");
            message.html("(Telefono no valido)")
            formValid = false;
        }else if(campo.val().length<11 && id == "CUIT"){
            campo.addClass("invalidCampo");
            message.html("(CUIT no valido)")
            formValid = false;
        }
    }else if(id == "namePerson"){
        valores = campo.val().trim().split(' ');
        valor = campo.val();
        bandera = true;
        for(let i=0;i<valor.length;i++){

            if(!((valor[i] >= 'a' && valor[i] <= 'z') || (valor[i] >= 'A' && valor[i] <= 'Z') || (valor[i] >= 'ñ' && valor[i] <= 'Ñ') || (valor[i]==" "))){
                campo.addClass("invalidCampo");
                message.html("(caracter "+valor[i]+" invalido)")
                bandera = false;
                formValid = false;
                break;
            }
        }
        if(valores.length < 2 && bandera){
            campo.addClass("invalidCampo");
            message.html("(Falta nombre o apellido)")
            formValid = false;
        }
    }else if(id == "email") {
        var validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

        if( !validEmail.test(campo.val()) ){
            message.html('(Correo invalido)');
            formValid = false;
        }
    }
}

function saveData(event,form) {
    event.preventDefault();
    if(formValid){
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
          
        Toast.fire({
        icon: 'success',
        title: 'Solicitud Enviada⭐⭐'
        })

        form.reset();
        
    }else {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire({
            icon: 'error',
            title: 'Error en un campo😥😥'
          })
    }
}

function loadTrolley() {
    let trolley = JSON.parse(localStorage.getItem("Trolley"));
    let contentDiv = $("#trolley");
    contentDiv.find(".productTrolleyBox").remove();


    for(let i=0; i<trolley.length; i++){
        node = `
            <div class="productTrolleyBox container-fluid">
                <div class="productTrolley row">
                    <div class="auxInfo row col-md-11 col-12 mb-md-0 mb-2">
                        <img class="col-3" src="${trolley[i].image}" alt="${trolley[i].title}">
                        <h5 class="col-8"><strong>${trolley[i].title}</strong></h3>
                        <p class="col-1">$${trolley[i].price}</p>
                    </div>
                    <button class="addButton col-md-1 col-12" onclick="deleteItem(${i})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `
        contentDiv.append(node);
    }
}

function addItemTrolley(id) {
    let trolley = JSON.parse(localStorage.getItem("Trolley"));
    trolley.push(products[id]);
    localStorage.setItem("Trolley",JSON.stringify(trolley));
}

function deleteItem(id) {
    let trolley = JSON.parse(localStorage.getItem("Trolley"));
    trolley.splice(id,1);
    localStorage.setItem("Trolley",JSON.stringify(trolley));
    loadTrolley();
}

function buyTrolley(){
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Al parecer esto es una compra falsa...',
      })
    trolley = []
    localStorage.setItem("Trolley",JSON.stringify(trolley));
    loadTrolley();
}
