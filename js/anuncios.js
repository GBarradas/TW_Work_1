function get3() {
    let url = 'http://alunos.di.uevora.pt/tweb/t1/roomsearch'
    let xhttp = new XMLHttpRequest();
    let ofer = $('#desOferta')
    let proc = $('#desProcura')

    xhttp.open('POST', url,true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send('tipo=oferta')
    xhttp.onload = function(){
        let oferta = JSON.parse(xhttp.responseText).resultados
        //ordenar de forma a obeter os 3 anuncios
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
            }

            else if(f.estado == 'ativo') {
                proc.append(anuncioHTML(f.aid,f.detalhes,f.tipo_alojamento,f.genero, f.zona, f.preco, f.anunciante))
                i++;
            }
        }
    }



}
function anuncioHTML(aid, titlo,tipo_alojamento,genero,zona, preco, arrendatario, imgsrc='/img/default.png'){
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


/*
<div id="aid" class="anuncio" >
            <img src="img/default.png" alt="img anuncio2">
            <div class="ainfos">
                <h3>Titulo do Quarto 2</h3>
                <div class="atipo" > <span class="descricao" >Tipo:</span>  <span id="tipoaid2" >Quarto Individual</span> </div>
                <div class="ades" >  <span class="descricao" >Destinatario: </span> <span id="destaid2" >Indiferente</span> </div>
                <div class="aloca" > <span class="descricao" >Localização: </span> <span id="alocaaid2" >Rua Bernardo de Matos, 52</span> </div>
                <div class="apre" >  <span class="descricao" >Preço: </span> <span id="preaid2" >250€</span> </div>
                <div class="aarr" >  <span class="descricao" >Nome Senhorio: </span> <span id="arraid2" >Ian sdwmruv</span> </div>
            </div>
        </div>
*/