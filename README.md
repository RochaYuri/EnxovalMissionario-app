# ENXOVAL MISSIONÁRIO

Olá! Esta é uma documentação sobre as funcionalidades do sistema. Irei separar a documentação dessas funcionalidades em duas partes diferentes:
 1.  Parte prática para orientação das ações dos usuários
 2.  Parte técnica para eventuais atualizações, correções ou personalizações.
___
### Objetivo
O objetivo do sistema consiste em facilitar e unificar a organização e visualização do enxoval do missionário que será beneficiado de forma acessível em todos os sentidos, seja financeiramente ou em disponibilidade.
___
### Tutorial
Vídeos tutoriais mostrando de maneira completa como pode ser feito a hospedagem deste sistema de maneira 100% gratuita. Para acessar aos vídeos, basta clicar neste link e acessar a seguinte playlist do YouTube: https://www.youtube.com/watch?v=QjEP9QGB5Po&list=PLT1zRyZk1d1FOUy5vK4r3HA0BY4ve3bCT 
**OBS:** O tutorial foi gravado em Fev/2025, então pode ser que ocorra alterações na tela dos sites utilizados para a hospedagem, assim como alteração nos planos que eles oferecem.
___
### Funcionalidades
O sistema possui duas áreas:
 1. Inicial
 2. Admin

A área "**INICIAL**" é acessível por qualquer usuário, e é a  raiz do projeto (ou seja, a página inicial).
A área "**ADMIN**" é acessível somente por usuários previamente autorizados e cadastrados no sistema.

- **ÁREA INICIAL**
    - Nesta área será apresentado o missionário(a), sua missão e os itens pendentes.
    - A foto do missionário pode ser editada no próprio código ([Vídeo ensinando](https://www.youtube.com/watch?v=e37VpI93pGg&list=PLT1zRyZk1d1FOUy5vK4r3HA0BY4ve3bCT&index=5)), assim como a bandeira.
    - Os itens que serão apresentados na tela inicial, serão somente os itens que possuem pendência. Os itens que já forem concluídos, não aparecerão mais, para que seja possível atingir de forma automatizada à todos os itens do enxoval. Todos os itens serão ordenados por categoria.
    - O usuário doador poderá selecionar mais de um item por preenchimento, basta clicar no botão "+" e selecionar o próximo item.
    - Todas as informações (exceto a foto do missionário e a bandeira) podem ser alteradas através do **ADMIN**.
- **ÁREA ADMIN**
    - Nesta área poderá ser administrado todo o sistema.
    - O sistema possui contadores identificando quantos itens estão:
        - **Concluídos** => Itens que foram totalmente preenchidos;
        - **Parciais** => Itens que foram preenchidos, mas ainda estão pendentes;
        - **Pendentes** => Itens que não foram preenchidos nenhuma vez.
    - O sistema possui outras 5 telas:
        - **Doações** => Nesta tela poderá ser visualizada os itens e as doações relacionadas à ele, separados por categorias.
        - **Informações pessoais** => Nesta tela poderá ser alterado as informações pessoais do missionário (nome, missão, período, etc).
        - **Itens** => Nesta tela poderá ser administrado todos os itens cadastrados.
        - **Categorias** => Nesta tela poderá ser administrado todas as categorias cadastradas.
        - **Usuários** => Nesta tela poderá ser administrado todos os usuários que possuem acesso ao **ADMIN**.
    - Para que um item possa ser cadastrado, é necessário que ele seja vinculado a uma categoria.
---
### Informações técnicas
- O sistema foi desenvolvido utilizando **React** para o frontend, e **Node** para a API.
- **Frontend**:
    - O sistema possui autenticação, onde:
        - Ao realizar login, um objeto com as principais informações do usuário serão armazenadas na sessão atual do navegador. Ou seja, após o navegador ser fechado, o login expirará.
        - Todas as telas possuem uma verificação para usuário logado, e se o usuário possui a role associada a aquela tela.
- **API**:
    - A API armazena todas as informações em arquivos JSON, onde cada arquivo simula uma tabela de um banco de dados relacional. O armazenamento se fez necessário dessa forma para que a hospedagem pudesse ser gratuita, evitando a necessidade de uma utilização de hospedagem com uma instância de um DB.
    - A API utiliza a configuração do **CORS**, então se necessário precisa ser adicionado a origem no middleware.
    - Em todas as requisições necessárias para realizar alterações nos arquivos JSON, o arquivo precisa ser reescrito.
    - A API possui uma documentação feita pelo **swagger** na rota [{link_da_api}/api_docs/](%7Blink_da_api%7D/api-docs/)
    - Usuário Root:
       - root
       - @r00t#

Esta é a v1.0 do sistema. 

**O sistema pode ser utilizado e personalizado livremente para os fins pessoais, mas não pode ser comercializado de forma nenhuma.**

Links úteis:
==================== APP ====================
https://github.com/RochaYuri/EnxovalMissionario-app

==================== API ====================
https://github.com/RochaYuri/EnxovalMissionario-api
