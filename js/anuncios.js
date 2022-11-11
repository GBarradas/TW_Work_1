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
        //-----------------------------------------
        let res = alasql("select * from  ? where estado='ativo' order by date limit 3",[oferta])
        for(f of res){
            ofer.append(anuncioHTML(f.aid,f.detalhes,f.tipo_alojamento,f.genero, f.zona, f.preco, f.anunciante))
        }
    }
    let xhttp2 = new XMLHttpRequest();
    xhttp2.open('POST', url,true);
    xhttp2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp2.send('tipo=procura')
    xhttp2.onload = function(){
        let procura = JSON.parse(xhttp2.responseText).resultados
        //ordenar de forma a obeter os 3 anuncios
        let res = alasql("select * from  ? where estado='ativo' order by date limit 3",[procura])
        for(f of res){
                proc.append(anuncioHTML(f.aid,f.detalhes,f.tipo_alojamento,f.genero, f.zona, f.preco, f.anunciante))

        }
    }
}
function anuncioCTipo(aid,tipo,titlo,tipo_alojamento,genero,zona, preco, arrendatario, imgsrc='/img/default.png'){
    return anuncioHTML(aid,tipo.toUpperCase()+': '+titlo,tipo_alojamento,genero,zona, preco, arrendatario, imgsrc)
}
function anuncioHTML(aid,titlo,tipo_alojamento,genero,zona, preco, arrendatario, imgsrc='/img/default.png'){
    let labels = ['Tipo de Alojamento','Genero','Zona','Preço', 'Anunciante']
    let infos =[tipo_alojamento, genero, zona, preco+'€', arrendatario]
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
    maindiv.onclick = function (){
        window.location.href = '/anuncio.html?aid='+aid;
    }
    return maindiv
}



function getAnnoun(){
    let xhttp = new XMLHttpRequest()

    xhttp.open('POST', url, true)
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhttp.send('tipo=oferta')
    let procura
    let oferta
    xhttp.onload = function (){
        oferta = JSON.parse(xhttp.responseText).resultados

        paginar(oferta)

    }
    let xhttp2 = new XMLHttpRequest()

    xhttp2.open('POST',url,true)
    xhttp2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

    xhttp2.send('tipo=procura')
    xhttp2.onload = function (){
        procura = JSON.parse(xhttp2.responseText).resultados
    }
}

function filtrarAnuncios(form){
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange= function (){
    if (xhttp.readyState == XMLHttpRequest.DONE) {
                let result = JSON.parse(xhttp.responseText).resultados
                paginar(result)
        }
    }
    xhttp.open('POST',url,true)
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    var arg = '';
    arg += form['tipo'].name+'='+form['tipo'].value+'&';
    arg += form['zona'].name+'='+form['zona'].value+'&';
    arg += form['anunciante'].name+'='+form['anunciante'].value;
    xhttp.send(arg)
    return false


}
function paginar(anun){
    let resultados = $('#results')
    let pagin = $('#paginacao')
    resultados.empty()
    pagin.empty()
    mpages = Math.ceil(anun.length/4)
    pagin.append(getDivOption('«','pagOpt',1,'optfp'))
    pagin.append(getDivOption('<','pagOpt',1,'optpp'))
    pagin.append(getDivOption("Pagina <span id='actpage' >1</span> de <span id='npages' >"+mpages+"</span>",'pagInfo'))
    pagin.append(getDivOption('>','pagOpt',2,'optnp'))
    pagin.append(getDivOption('»','pagOpt',mpages,'optlp'))
    for(let i = 0; i <mpages;i++){
        let div = document.createElement('div')
        div.classList.add('grid2a');
        div.classList.add('page')
        for(let j = 0;j < 4;j++){
            if(((i*4)+j )<anun.length){
                let a = anun[((i*4)+j )];
                div.append(anuncioHTML(a.aid,a.detalhes,a.tipo_alojamento,a.genero,a.zona, a.preco, a.anunciante))
            }
        }
        resultados.append(div)
    }

}
function showPage(n){
    let pagin = $('#paginacao')
    let optpp = $('#optpp')
    let optnp = $('#optnp')
    let actpage = $('#actpage')
    let npages = $('#npages')

}
function editOnclick(div, newopt){
    div.onclick = function (){
        showPage(newopt)
    }
}
function getDivOption(text, cla,oncfun,id){
    let div = document.createElement('div');
    div.innerHTML = text;
    div.classList = cla;
    div.id= id;
    div.onclick= function (){
        showPage(oncfun)
    };
    return div
}
function loadHF(){
    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function (){
        if(this.readyState == 4 && this.status == 200){
            document.querySelector('header').innerHTML = this.responseText
        }
    }
    xhttp.open("GET","/header.html", true)
    xhttp.send()

    let xhttp2 = new XMLHttpRequest()
    xhttp2.onreadystatechange = function (){
        if(this.readyState == 4 && this.status == 200){
            document.querySelector('footer').innerHTML = this.responseText
        }
    }
    xhttp2.open("GET","/footer.html", true)
    xhttp2.send()
}
function loadAnnoun(){
    let url = window.location.search;
    let param = new URLSearchParams(url);
    let aid = param.get('aid');
    let xhttp = new XMLHttpRequest()
    let imgsrc = '/img/default.png'
    xhttp.onload = function (){
        let anc = JSON.parse(xhttp.responseText).anuncio
        console.log(anc)
    }
    xhttp.open('post','http://alunos.di.uevora.pt/tweb/t1/anuncio',true)
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhttp.send(`aid=${aid}`)
}
