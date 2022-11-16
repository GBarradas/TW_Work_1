const url = 'http://alunos.di.uevora.pt/tweb/t1/roomsearch'
const urlProcura = 'http://alunos.di.uevora.pt/tweb/t1/registoprocura'
const urlOferta = 'http://alunos.di.uevora.pt/tweb/t1/registaoferta'
const urlgerAnun = 'http://alunos.di.uevora.pt/tweb/t1/gereanuncios'
const urlctrAnun = 'http://alunos.di.uevora.pt/tweb/t1/controloanuncio'
const urlAnun = 'http://alunos.di.uevora.pt/tweb/t1/anuncio'
const urlMsg = 'http://alunos.di.uevora.pt/tweb/t1/mensagens'

function get3() {
    let xhttp = new XMLHttpRequest();
    let ofer = $('#desOferta')

    let proc = $('#desProcura')
    xhttp.open('POST', url,true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send('tipo=oferta')
    xhttp.onload = function(){

        let oferta = JSON.parse(xhttp.responseText).resultados
        //console.log(oferta)
        let res = alasql("select * from  ? where estado='ativo' order by date desc limit 3",[oferta])
        //console.log(res)
        for(f of res){
            ofer.append(anuncioHTML(f))
        }
    }
    let xhttp2 = new XMLHttpRequest();
    xhttp2.open('POST', url,true);
    xhttp2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp2.send('tipo=procura')
    xhttp2.onload = function(){
        let procura = JSON.parse(xhttp2.responseText).resultados
        //console.log(procura)
        let res = alasql("select * from  ? where estado='ativo' order by date desc limit 3",[procura])
        //console.log(res)
        for(f of res){
                proc.append(anuncioHTML(f))

        }
    }
}


function submitAnun(form){
    let xhttp = new XMLHttpRequest()
    xhttp.onload = function (){
        let res = JSON.parse(xhttp.responseText)
        if(res.resultado == 'ok'){
            alert('Submetido com sucesso')
        }
    }
    xhttp.open(form.method, form.action, true)
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    let args = ''
    for(i of form){
        if( i.type == 'submit'|| i.type == 'reset') {       // este if é para ignorar estes inputs
            continue;
        }
        args += i.name + '='+ i.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')+'&';
    }
    xhttp.send((args.slice(0,-1)))
    return false;
}
function anuncioHTML(a, imgsrc='/img/default.png'){
    let labels = ['Tipo de Anuncio', 'Tipo de Alojamento','Genero','Zona','Preço', 'Anunciante']
    let infos =[a.tipo,a.tipo_alojamento, a.genero, a.zona, a.preco+'€', a.anunciante]
    let maindiv = document.createElement('div')
    maindiv.id= a.aid;
    maindiv.classList= 'anuncio box'
    let img = document.createElement('img')
    img.src = imgsrc
    maindiv.append(img)
    let infodiv = document.createElement('div')
    infodiv.classList= 'ainfos'
    let titleh3 = document.createElement('h3')
    titleh3.textContent = "Titulo"
    infodiv.append(titleh3)
    for(i in labels){
        if(labels[i] === "Tipo de Anuncio" ){
            if( infos[i] != null ){
                let idiv = document.createElement('div')
                let labelspan = document.createElement('span')
                labelspan.textContent = labels[i]+' : ' ;
                labelspan.classList = 'descricao'
                let infospan = document.createElement('span')
                infospan.textContent = infos[i]
                idiv.append(labelspan,infospan)
                infodiv.append(idiv)
            }
        }
        else{
            let idiv = document.createElement('div')
            let labelspan = document.createElement('span')
            labelspan.textContent = labels[i]+' : ' ;
            labelspan.classList = 'descricao'
            let infospan = document.createElement('span')
            infospan.textContent = infos[i]
            idiv.append(labelspan,infospan)
            infodiv.append(idiv)
        }
    }
    maindiv.append(infodiv)
    maindiv.onclick = function (){
        window.location.href = '/anuncio.html?aid='+a.aid;
    }
    return maindiv
}



function getAnnoun(){
    let xhttp = new XMLHttpRequest()
    let oferta
    let procura
    let xhttp2 = new XMLHttpRequest()
    xhttp.onload = function (){
        procura = JSON.parse(xhttp.responseText).resultados
        for(p of procura){p.tipo = 'Procura'}
        if(xhttp2.readyState == XMLHttpRequest.DONE){
            let res = alasql("select * from  ? where estado='ativo' order by date desc",[oferta.concat(procura)])
            paginar(res)
        }
    }
    xhttp2.onload = function (){
        oferta = JSON.parse(xhttp2.responseText).resultados
        for(o of oferta){o.tipo = 'Oferta'}
        if(xhttp.readyState == XMLHttpRequest.DONE){
            let res = alasql("select * from  ? where estado='ativo' order by date desc ",[oferta.concat(procura)])
            paginar(res)
        }
    }

    xhttp.open('POST', url, true)
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhttp.send('tipo=procura')

    xhttp2.open('POST',url,true)
    xhttp2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhttp2.send('tipo=oferta')
}

function filtrarAnuncios(form){
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange= function (){
    if (xhttp.readyState == XMLHttpRequest.DONE) {      //ata após o fim de xhttp.send(arg) para efetar a paginação
                let result = JSON.parse(xhttp.responseText).resultados
            //console.log(result)
                if(form['tipo_alojamento'].value != ''){
                    result = alasql("select * from ? where tipo_alojamento = '"+form['tipo_alojamento'].value+"'",[result])
                }
                if(form['genero'].value != ''){
                    result = alasql("select * from ? where genero = '"+form['genero'].value+"'",[result])
                }
                paginar(result)
        }
    }
    xhttp.open('POST',url,true)
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    var arg = '';
    arg += 'tipo='+form['tipo'].value+'&';
    arg += 'zona='+form['zona'].value+'&';
    arg += 'anunciante='+form['anunciante'].value;
    if(form['tipo'].value=='' && form['zona'].value=='' && form['anunciante'].value== ''){
        getAnnoun()
        return false
    }
    console.log(arg)
    xhttp.send(arg)
    return false
}
function paginar(anun){
    //console.log(anun)
    let resultados = $('#results')
    let pagin = $('#paginacao')
    resultados.empty()
    if(anun.length == 0){       //verifica e altera a paginação se o numero de resultados for 0
        document.getElementById('npages').innerHTML= 0
        document.getElementById('actpage').innerHTML = 0
        return false
    }
    else{
        mpages = Math.ceil(anun.length/4)       //faz o calculo do numero de paginas necessarias
    }

    document.getElementById('npages').innerHTML= mpages
    for(let i = 0; i <mpages;i++){
        let div = document.createElement('div')
        //div.classList.add('grid2a');
        div.classList.add('page')
        for(let j = 0;j < 4;j++){
            if(((i*4)+j )<anun.length){         // calculo para determinar a posição de um anuncio no array anun
                let a = anun[((i*4)+j )];
                div.append(anuncioHTML(a))
            }
        }
        resultados.append(div)
    }
    showPage(1);
    editOnclick(document.getElementById('optfp'),1)
    editOnclick(document.getElementById('optlp'),mpages)

}
function showPage(n){
    let optpp = document.getElementById('optpp')
    let optnp = document.getElementById('optnp')
    let actpage = document.getElementById('actpage')
    let npages = document.getElementById('npages').textContent
    let act = document.querySelector('.page.active')
    if(act != null)
        act.classList='page'
    document.querySelectorAll('.page')[n-1].classList.add('active')
    if(n == 1){
        editOnclick(optpp, 1)
        editOnclick(optnp,n+1)
    }
    else if(n == npages){
        editOnclick(optpp, n-1)
        editOnclick(optnp,npages)
    }
    else{
        editOnclick(optpp, n-1)
        editOnclick(optnp,n+1)
    }
    actpage.innerHTML = n;


}
function editOnclick(div, newopt){
    div.setAttribute('onclick',`showPage(${newopt})`)
}

function loadHF(user="false"){
    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function (){
        if(this.readyState == 4 && this.status == 200){
            document.querySelector('header').innerHTML = this.responseText
            if(user == true){
                document.getElementById('user').innerText = "Ola, José"
            }
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
    if(aid == null){
        alert('Anuncio não Encontrado')
    }
    let xhttp = new XMLHttpRequest()
    xhttp.onload = function (){
        let anc = JSON.parse(xhttp.responseText).anuncio
        if(anc == null || anc.estado == 'inativo'){
            alert('Anuncio não Encontrado')
        }
        document.getElementById('main').innerHTML=
            "<div id=\" "+anc.aid+"\" class=\"anuncio_unico box\">"+
            "<h1>Title</h1>"+

            "    <div class=\"ainfos_unico\">"+
            "<img src=\"/img/default.png\" >"+
            "        <div><span class=\"descricao\">Tipo de Alojamento : </span><span>"+anc.tipo_alojamento+"</span></div>"+
            "        <div><span class=\"descricao\">Genero : </span><span>"+anc.genero+"</span></div>"+
            "        <div><span class=\"descricao\">Zona : </span><span>"+anc.zona+"</span></div>"+
            "        <div><span class=\"descricao\">Preço : </span><span>"+anc.preco+" €</span></div>"+
            "        <div><span class=\"descricao\">Anunciante : </span><span>"+anc.anunciante+"</span></div>"+
            "        <div><span class=\"descricao\">Contacto : </span><span>"+anc.contacto+"</span></div>"+
            "        <div><span class=\"descricao\">Detalhes : </span><span>"+anc.detalhes+"</span></div>"+
            "    </div>"+
            "   <form class='form-cont' action=\" http://alunos.di.uevora.pt/tweb/t1/contactar\" method=\"POST\" " +
            " onsubmit='return submitAnun(this)'>"+
            "        <hr>"+
            "            <h2>Contactar:</h2>" +
            "            <div class='grid2' >" +
            "               <label> Anuncio: <input type=\"number\" name=\"aid\" value=\""+anc.aid+"\" readonly ></label> "+
            "               <label>O seu Nome: <input type=\"text\" name=\"remetente\" required >   </label> " +
            "            </div> "+
            "           <label for=\"menssagem\">Mensagem:</label>"+
            "            <textarea id=\"menssagem\" name=\"msg\" rows=\"6\" cols=\"80\" placeholder=\"A sua Mensagem\" required ></textarea>" +
            "            <div class='optForms' ><input  type= 'submit'></div> " +
            " </form>"+
            "</div>"

    }
    xhttp.open('post','http://alunos.di.uevora.pt/tweb/t1/anuncio',true)
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhttp.send(`aid=${aid}`)
}



function loadToAdmin (){
    let xhttp = new XMLHttpRequest()
    let ativo
    let inativo
    xhttp.onload= function () {
        let res = JSON.parse(xhttp.responseText)
        ativo = res.ativo;
        inativo = res.inativo;
        paginAdmin(ativo.concat(inativo));      //junta os ativo e os inativos
    }

    xhttp.open('POST', urlgerAnun, true)
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhttp.send()
}

function paginAdmin(anun){
    let resultados = $('#changeAnnoun')
    let pagin = $('#paginacao')
    resultados.empty()
    if(anun == null){
        document.getElementById('npages').innerHTML= 0
        document.getElementById('actpage').innerHTML = 0
        return false
    }
    else{
        mpages = Math.ceil(anun.length/4)
    }

    document.getElementById('npages').innerHTML= mpages
    for(let i = 0; i <mpages;i++){
        let div = document.createElement('div')
        //div.classList.add('grid2a');
        div.classList.add('pageAdmin')
        for(let j = 0;j < 4;j++){
            if(((i*4)+j )<anun.length){
                let a = anun[((i*4)+j )];
                div.append(createAdminAnun(a))
            }
        }
        resultados.append(div)
    }
    showPageUser(1);
    editOnclickAdmin(document.getElementById('optfp'),1)
    editOnclickAdmin(document.getElementById('optlp'),mpages)
}
function createAdminAnun(aid){
    let div = document.createElement('div')
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        let a = JSON.parse(xhttp.responseText).anuncio
        //console.log(a.aid +' '+a.estado)
        div.classList.add("anuncioAdmin","box")
        div.id = a.aid
        div.innerHTML =
            "    <img src=\"/img/default.png\">\n" +
            "        <div class=\"ainfosAdmin\">" +
            "            <h2>Title</h2>\n" +
            "            <div><span class=\"descricao\">Tipo de Alojamento : </span><span>" + a.tipo_alojamento + "</span></div>\n" +
            "            <div><span class=\"descricao\">Genero : </span><span>" + a.genero + "</span></div>\n" +
            "            <div><span class=\"descricao\">Zona : </span><span>" + a.zona + "</span></div>\n" +
            "            <div><span class=\"descricao\">Preço : </span><span>" + a.preco + " €</span></div>\n" +
            "            <div><span class=\"descricao\">Anunciante : </span><span>" + a.anunciante + "</span></div>\n" +
            "            <div><span class=\"descricao\">Estado : </span><span>" + a.estado + "</span></div>\n" +
            "            <div><span class=\"descricao\">Contacto : </span><span>" + a.contacto + "</span></div>\n" +
            "            <div><span class=\"descricao\">Data : </span><span>" + a.data + "</span></div>\n" +
            "        </div>\n" +
            "            <div class=\"aform\">\n" +
            "                <form class=\"anun-admin-form\" method=\"post\"\n" +
            "                      action=\"http://alunos.di.uevora.pt/tweb/t1/controloanuncio                                                                                                                                                                                                                                                                                                                                                          \"" +
            "                       onsubmit='return submitAnun(this)'>\n" +
            "                    <div class=\"grid2\">\n" +
            "                        <label class=\"id-admin-form\">Id:\n" +
            "                            <input type=\"number\" name=\"aid\" value=\"" + a.aid + "\" readOnly></label>\n" +
            "                        <label class=\"estado-admin-form\">\n" +
            "                            Estado:\n" +
            "                            <select id=\""+a.aid+"estado\"  name=\"estado\" required>\n" +
            "                                <option value='ativo' >activo</option>\n" +
            "                                <option value='inativo'>inactivo</option>\n" +
            "                            </select>\n" +
            "                        </label>\n" +
            "                    </div>\n" +
            "                    <label>Descrição:<br>\n" +
            "                        <textarea name=\"descricao\">" + a.detalhes + "</textarea>\n" +
            "                    </label>\n" +
            "                    <div class=\"optForms\">\n" +
            "                        <input type=\"submit\">\n" +
            //"                            <input type=\"reset\">\n" +
            "                    </div>\n" +
            "                </form>\n" +
            "            </div>\n"
        document.getElementById(a.aid+'estado').value = a.estado
        div.innerHTML =
            "    <img src=\"/img/default.png\">\n" +
            "        <div class=\"ainfosAdmin\">" +
            "            <h2>Title</h2>\n" +
            "            <div><span class=\"descricao\">Tipo de Alojamento : </span><span>" + a.tipo_alojamento + "</span></div>\n" +
            "            <div><span class=\"descricao\">Genero : </span><span>" + a.genero + "</span></div>\n" +
            "            <div><span class=\"descricao\">Zona : </span><span>" + a.zona + "</span></div>\n" +
            "            <div><span class=\"descricao\">Preço : </span><span>" + a.preco + " €</span></div>\n" +
            "            <div><span class=\"descricao\">Anunciante : </span><span>" + a.anunciante + "</span></div>\n" +
            "            <div><span class=\"descricao\">Estado : </span><span>" + a.estado + "</span></div>\n" +
            "            <div><span class=\"descricao\">Contacto : </span><span>" + a.contacto + "</span></div>\n" +
            "            <div><span class=\"descricao\">Data : </span><span>" + a.data + "</span></div>\n" +
            "        </div>\n" +
            "            <div class=\"aform\">\n" +
            "                <form class=\"anun-admin-form\" method=\"post\"\n" +
            "                      action=\"http://alunos.di.uevora.pt/tweb/t1/controloanuncio                                                                                                                                                                                                                                                                                                                                                          \"" +
            "                       onsubmit='return submitAnun(this)'>\n" +
            "                    <div class=\"grid2\">\n" +
            "                        <label class=\"id-admin-form\">Id:\n" +
            "                            <input type=\"number\" name=\"aid\" value=\"" + a.aid + "\" readOnly></label>\n" +
            "                        <label class=\"estado-admin-form\">\n" +
            "                            Estado:\n" +
            "                            <select id=\""+a.aid+"estado\"  name=\"estado\" required>\n" +
            "                                <option value='ativo' >activo</option>\n" +
            "                                <option value='inativo'>inactivo</option>\n" +
            "                            </select>\n" +
            "                        </label>\n" +
            "                    </div>\n" +
            "                    <label>Descrição:<br>\n" +
            "                        <textarea name=\"descricao\">" + a.detalhes + "</textarea>\n" +
            "                    </label>\n" +
            "                    <div class=\"optForms\">\n" +
            "                        <input type=\"submit\">\n" +
            //"                            <input type=\"reset\">\n" +
            "                    </div>\n" +
            "                </form>\n" +
            "            </div>\n"
        document.getElementById(a.aid+'estado').value = a.estado
    }
    xhttp.open('post',urlAnun,true)
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhttp.send(`aid=${aid}`)
    return div
}
function showPageUser(n){
    let optpp = document.getElementById('optpp')
    let optnp = document.getElementById('optnp')
    let actpage = document.getElementById('actpage')
    let npages = document.getElementById('npages').textContent
    let act = document.querySelector('.pageAdmin.active')
    if(act != null)
        act.classList='pageAdmin'
    document.querySelectorAll('.pageAdmin')[n-1].classList.add('active')
    if(n ==1){
        editOnclickAdmin(optpp, 1)
        editOnclickAdmin(optnp,n+1)
    }
    else if(n == npages){
        editOnclickAdmin(optpp, n-1)
        editOnclickAdmin(optnp,npages)
    }
    else{
        editOnclickAdmin(optpp, n-1)
        editOnclickAdmin(optnp,n+1)
    }
    actpage.innerHTML = n;


}
function editOnclickAdmin(div, newopt){
    div.setAttribute('onclick',`showPageUser(${newopt})`)
}

function loadAnunUser(){
    let url = window.location.search;
    let param = new URLSearchParams(url);
    let aid = param.get('aid');
    if(aid == null){
        window.alert('Anuncio não Encontrado')
        window.location.href='/'
    }
    let xhttp = new XMLHttpRequest()
    xhttp.onload = function (){
        let anc = JSON.parse(xhttp.responseText).anuncio
        console.log(anc)
        if(anc == null ){
            window.alert('Anuncio não Encontrado')
            window.location.href='/'
        }
        document.getElementById('main').innerHTML=
            "<div id=\""+anc.aid+"\" class=\"anuncio_unico box\">"+
            "<h1>Title</h1>"+

            "    <div class=\"ainfos_unico\">"+
            "<img src=\"/img/default.png\" >"+
            "        <div><span class=\"descricao\">Tipo de Alojamento : </span><span>"+anc.tipo_alojamento+"</span></div>"+
            "        <div><span class=\"descricao\">Genero : </span><span>"+anc.genero+"</span></div>"+
            "        <div><span class=\"descricao\">Zona : </span><span>"+anc.zona+"</span></div>"+
            "        <div><span class=\"descricao\">Preço : </span><span>"+anc.preco+" €</span></div>"+
            "        <div><span class=\"descricao\">Anunciante : </span><span>"+anc.anunciante+"</span></div>"+
            "        <div><span class=\"descricao\">Contacto : </span><span>"+anc.contacto+"</span></div>"+
            "        <div><span class=\"descricao\">Detalhes : </span><span>"+anc.detalhes+"</span></div>"+
            "    </div>" +
            "   <div id=\"msg\">"+
            "        <hr>"+
            "            <h2>Menssagens:</h2>" +
            "   </div>" +
            "</div>"
        let xhttp2 = new XMLHttpRequest();
        xhttp2.onload = function (){
            let allMsg = JSON.parse(xhttp2.responseText).msgs
            for(m of allMsg){
                let msg = document.createElement("div")
                msg.classList.add('box')
                let remetente = document.createElement('span')
                remetente.classList.add('remetente')
                remetente.textContent = m.remetente+': '
                msg.append(remetente)
                let msgBody = document.createElement('span')
                msgBody.innerHTML = m.msg
                msg.append(msgBody)
                $('#msg').append(msg)
            }
        }
        xhttp2.open('post', urlMsg, true)
        xhttp2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
        xhttp2.send(`aid=${aid}`)

    }
    xhttp.open('post','http://alunos.di.uevora.pt/tweb/t1/anuncio',true)
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhttp.send(`aid=${aid}`)

}

function loadAllUserAnun(user){
    let xhttp= new XMLHttpRequest()
    let xhttp2 = new XMLHttpRequest()
    let procura, oferta;
    xhttp.onload = function (){
        procura = JSON.parse(xhttp.responseText).resultados
        for(p of procura){p.tipo = 'Procura'}
        if(xhttp2.readyState == XMLHttpRequest.DONE){
            let res = alasql("select * from  ? where estado='ativo' order by date desc",[oferta.concat(procura)])
            paginarUser(res)
        }
    }
    xhttp2.onload = function (){
        oferta = JSON.parse(xhttp2.responseText).resultados
        for(o of oferta){o.tipo = 'Oferta'}
        if(xhttp.readyState == XMLHttpRequest.DONE){
            let res = alasql("select * from  ? where estado='ativo' order by date desc ",[oferta.concat(procura)])
            paginarUser(res)
        }
    }
    xhttp.open('POST', url, true)
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhttp.send('tipo=procura&anunciante='+user)

    xhttp2.open('POST',url,true)
    xhttp2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhttp2.send('tipo=oferta&anunciante='+user)

}
function paginarUser(anun){
    let resultados = $('#Announ')
    resultados.empty()
    if(anun == null){
        document.getElementById('npages').innerHTML= 0
        document.getElementById('actpage').innerHTML = 0
        return false
    }
    else{
        mpages = Math.ceil(anun.length/4)
    }

    document.getElementById('npages').innerHTML= mpages
    for(let i = 0; i <mpages;i++){
        let div = document.createElement('div')
        //div.classList.add('grid2a');
        div.classList.add('pageAdmin')
        for(let j = 0;j < 4;j++){
            if(((i*4)+j )<anun.length){
                let a = anun[((i*4)+j )];
                div.append(userAnun(a))
            }
        }
        resultados.append(div)
    }
    showPageUser(1);
    editOnclickAdmin(document.getElementById('optfp'),1)
    editOnclickAdmin(document.getElementById('optlp'),mpages)
}
function userAnun (a){
    let div = document.createElement('div')
    div.classList.add("anuncioAdmin","box")
    div.id = a.aid
    div.classList.add("anuncioAdmin","box")
    div.id = a.aid
    div.innerHTML =
        "    <img src=\"/img/default.png\">\n" +
        "        <div class=\"ainfosAdmin\">" +
        "            <h2>Title</h2>\n" +
        "            <div><span class=\"descricao\">Tipo de Alojamento : </span><span>" + a.tipo_alojamento + "</span></div>\n" +
        "            <div><span class=\"descricao\">Genero : </span><span>" + a.genero + "</span></div>\n" +
        "            <div><span class=\"descricao\">Zona : </span><span>" + a.zona + "</span></div>\n" +
        "            <div><span class=\"descricao\">Preço : </span><span>" + a.preco + " €</span></div>\n" +
        "            <div><span class=\"descricao\">Anunciante : </span><span>" + a.anunciante + "</span></div>\n" +
        "            <div><span class=\"descricao\">Estado : </span><span>" + a.estado + "</span></div>\n" +
        "            <div><span class=\"descricao\">Contacto : </span><span>" + a.contacto + "</span></div>\n" +
        "            <div><span class=\"descricao\">Data : </span><span>" + a.data + "</span></div>\n" +
        "        </div>\n"
    div.onclick = function (){
        window.location.href = '/utilizador/anuncio.html?aid='+a.aid;
    }
    return div
}
function showHide(a){
    a.classList.toggle("change");
    document.getElementById('options').classList.toggle('active')
}