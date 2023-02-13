Uma associação de estudantes precisa de uma nova interface web para gerir os anúncios de quartos para
arrendar, e também as respetivas solicitações/procura. O seu trabalho é desenvolver a interface web (ainda sem
desenvolver os recursos no servidor, apenas o client-side), usando técnicas estudadas na disciplina, por forma a
conseguir:
-  páginas com os conteúdos necessários;
-  apresentação com layout fluido e formato adequado ao dispositivo;
-  comportamento responsivo.
A estrutura da interface deve incluir:
-  topo: um cabeçalho, com o título do site, e opções de navegação;
-  o conteúdo principal;
-  e em baixo uma zona para patrocinadores, contactos, e os créditos da aplicação web (nomes dos alunos
que desenvolveram a solução).  

Um utilizador pode inserir oferta de alojamento, descrevendo se é quarto ou casa (T0, T1… TN), se é destinado a
arrendatário masculinho, feminino ou indiferente, o preço, e outros detalhes. Um utilizador pode também inserir
um anúncio do tipo procura, onde descreve o tipo de alojamento que pretende encontrar, com campos idênticos.
Cada anúncio deve ter também o nome do anunciante, contacto, a zona (localização aproximada), a data de registo
e um estado (inativo, ativo) atribuído automaticamente (inativo), mas que será gerido pelo administrador.
Um visitante do site deve encontrar na zona de conteúdo principal os destaques com os três últimos anúncios de
cada tipo (oferta, procura – obtidos pela operação roomsearch).
Deve procurar otimizar a área de conteúdo principal, ocupando toda a área disponível naquele bloco.
Devem existir opções para listar as ofertas e os anúncios do tipo procura (com estado ativo). Nesse resultado, se
existirem mais de 4 anúncios, deve haver paginação, ou uma forma de iterar a listagem para os anúncios seguintes
(e depois poder voltar aos anteriores).
Para registar um anúncio, prepare um formulário que permita recolher os dados necessários, submetendo-os para
um dos endereços, em função do tipo de anúncio:
-  http://alunos.di.uevora.pt/tweb/t1/registaprocura
-  http://alunos.di.uevora.pt/tweb/t1/registaoferta  

Deve ainda ser possível:
-  Procurar, por tipo (oferta, procura) e opcionalmente por zona ou nome do anunciante, mediante
comunicação dos campos (um obrigatório, dois opcionais) para
http://alunos.di.uevora.pt/tweb/t1/roomsearch
-  Nos resultados da operação anterior e que terá apenas anúncios ativos, deve ser possível filtrar por campos
complementares
-  Ao escolher um anúncio da listagem, deve mostrar todos os detalhes desse anúncio, apresentado os
campos obtidos desde http://alunos.di.uevora.pt/tweb/t1/anuncio (passando o identificador no campo
“aid”)
-  Ao visualizar um anúncio ativo, um utilizador pode enviar uma mensagem ao anunciante. Prepare um
formulário junto aos detalhes do anúncio que possa recolher a mensagem, que deverá enviar para o
servidor, para o endereço http://alunos.di.uevora.pt/tweb/t1/contactar (campos: aid, remetente, msg)
-  Na vista de “utilizador registado” (simulada) sobre um anúncio do próprio, deve ser possível apresentar
mensagens, se existirem, por consulta no endereço http://alunos.di.uevora.pt/tweb/t1/mensagens.  

A aplicação web deve ter uma zona de acesso reservado à gestão da plataforma (e assuma que a autenticação e
autorização estão tratadas) para:
-  ativar um anúncio (após validação humana do conteúdo, não ofensivo, do respetivo texto); ou inativar o
anúncio por alteração do respetivo estado
    - consulta dos dados desde http://alunos.di.uevora.pt/tweb/t1/gereanuncios
    - envio da validação/alteração para http://alunos.di.uevora.pt/tweb/t1/controloanuncio (campos: aid,
estado, descricao).  

Desenhe o conteúdo Web para esta secção da aplicação.  

Neste trabalho, não precisa preocupar-se com uma autenticação segura, nem com separação de perfis. Isso será
estudado adiante. Pode criar ou obter e reutilizar imagens de apoio.  

O CSS de todos os documentos HTML deve ser definido num único ficheiro externo.
Verifique o tipo de erro e o detalhe na resposta recebida, que terá pistas em caso de desencontro face ao esperado.  

Não são aceites ficheiros de código-fonte obtidos online (excepto imagens).  

Os aspetos omissos são decididos pelos alunos e mencionados no relatório. O trabalho será apresentado no final
 
### Nota: 16  
[Pagina](index.html)  
[codigo](https://github.com/GBarradas/TW_Work_1)
  