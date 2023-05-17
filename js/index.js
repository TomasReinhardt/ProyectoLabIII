let products = [];
let categorys = [];

window.onload = function() {
    loadContent('mayorista');
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
        });

        if(page=="products"){
            loadProducts();
            loadCategorys();
        }

        setTimeout(()=>{
            contentDiv.fadeIn();
        },200)
    },300)
}

function loadProducts(){
    fetch('https://fakestoreapi.com/products')
            .then(res=>res.json())
            .then(response=>{
                products = response;
                let contentDiv = $('#productsBox');

                for (let i = 0; i < products.length; i++) {
                    node = `
                        <div class="productBox">
                            <div class="product">
                                <img src="${products[i].image}" alt="${products[i].title}">
                                <h5><strong>${products[i].title}</strong></h3>
                                <p class="price">$${products[i].price}</p>
                                <p class="infoProduct"><i>${products[i].description}</i></p>
                                <button class="addButton">Añadir</button>
                            </div>
                        </div>
                    `
                    contentDiv.append(node)
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
                        <option value="${categorys[i]}">${categorys[i]}</option>
                    `
                    categorysDiv.append(node);
                }
            })
}