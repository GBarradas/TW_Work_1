const url = 'http://alunos.di.uevora.pt/tweb/t1/roomsearch'
function get3() {
    let xhttp = new XMLHttpRequest();
    let ofer = $('#desOferta')

    let proc = $('#desProcura')
    xhttp.open('POST', url,true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send('tipo=oferta')
    xhttp.onload = function(){
        let oferta = JSON.parse(xhttp.responseText).resultados
        //ordenar de forma a obeter os 3 anuncios

        oferta.sort(function (a,b){
            return a.aid- b.aid
        })
        //-----------------------------------------
        let i=0
        for(f of oferta){
            if(i>=3){
                break
            }

            else if(f.estado == 'inativo') {
                ofer.append(anuncioHTML(f.aid,f.detalhes,f.tipo_alojamento,f.genero, f.zona, f.preco, f.anunciante))
                i++;
            }
        }
    }
    let xhttp2 = new XMLHttpRequest();
    xhttp2.open('POST', url,true);
    xhttp2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp2.send('tipo=procura')
    xhttp2.onload = function(){
        let procura = JSON.parse(xhttp2.responseText).resultados
        //ordenar de forma a obeter os 3 anuncios
        let i=0
        for(f of procura){

            if(i>=3){
                break
            } else if(f.estado == 'ativo') {
                proc.append(anuncioHTML(f.aid,f.detalhes,f.tipo_alojamento,f.genero, f.zona, f.preco, f.anunciante))
                i++;
            }
        }
    }
}

function compare(x, y){
    let d1 = Date.parse(x)
    let d2 = Date.parse(y)
    console.log(d1+' '+d2)

    if(d1<d2){
        return -1
    }
    if(d1>d2){
        return 1
    }
    else{
        return 0
    }
}
function anuncioCTipo(aid,tipo,titlo,tipo_alojamento,genero,zona, preco, arrendatario, imgsrc='/img/default.png'){
    return anuncioHTML(aid,tipo.toUpperCase()+': '+titlo,tipo_alojamento,genero,zona, preco, arrendatario, imgsrc)
}
function anuncioHTML(aid,titlo,tipo_alojamento,genero,zona, preco, arrendatario, imgsrc='/img/default.png'){
    let labels = ['Tipo de Alojamento','Genero','Zona','Preço', 'Anunciante']
    let infos =[tipo_alojamento, genero, zona, preco, arrendatario]
    let maindiv = document.createElement('div')
    maindiv.id= aid;
    maindiv.classList= 'anuncio'
    let img = document.createElement('img')
    img.src = imgsrc
    maindiv.append(img)
    let infodiv = document.createElement('div')
    infodiv.classList= 'ainfos'
    let titleh3 = document.createElement('h3')
    titleh3.textContent = titlo
    infodiv.append(titleh3)
    for(i in labels){
        let idiv = document.createElement('div')
        let labelspan = document.createElement('span')
        labelspan.textContent = labels[i]+' : ' ;
        labelspan.classList = 'descricao'
        let infospan = document.createElement('span')
        infospan.textContent = infos[i]
        idiv.append(labelspan,infospan)
        infodiv.append(idiv)
    }
    maindiv.append(infodiv)
    return maindiv
}



function getAnnoun(){
    let xhttp = new XMLHttpRequest()
    let res = $('#results')

    xhttp.open('POST', url, true)
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhttp.send('tipo=oferta')

    xhttp.onload = function (){
        let oferta = JSON.parse(xhttp.responseText).resultados
        for (o of oferta){
            res.append(anuncioCTipo(o.aid,'oferta',o.detalhes, o.tipo_alojamento,o.genero, o.zona, o.preco, o.anunciante))
        }
    }

    let xhttp2 = new XMLHttpRequest()
    let res2 = $('#results')

    xhttp2.open('POST',url,true)
    xhttp2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhttp2.send('tipo=procura')

    xhttp2.onload = function (){
        let procura = JSON.parse(xhttp2.responseText).resultados
        for(p of procura){
            res.append(anuncioCTipo(p.aid,'procura', p.detalhes, p.tipo_alojamento, p.genero, p.zona, p.preco, p.anunciante))
        }
    }
}
function filtrarAnuncios(){
    alert('hello')
    let arg =''
    let form = document.forms['search-form']
    arg += form['tipo'].name+'='+form['tipo'].value+'&'
    arg += form['zona'].name+'='+form['zona'].value+'&'
    arg += form['anunciante'].name+'='+form['anunciante'].value
    alert(arg)
    /*var xhttp = new XMLHttpRequest()
    xhttp.open('post',url,true)
    xhttp2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    let arg =''
    let form = document.forms['search-form']
    arg += form['tipo'].name+'='+form['tipo'].value+'&'
    arg += form['tipo_alojamento'].name+'='+form['tipo_alojamento'].value+'&'
    arg += form['anunciante'].name+'='+form['anunciante'].value
    xhttp2.send(arg)
    alert(arg)
    xhttp.onreadystatechange = function (){
        if(this.readyState == 4 && this.status == 200) {
            alert(xhttp.responseText)


        }
    }
    return false

     */
}

