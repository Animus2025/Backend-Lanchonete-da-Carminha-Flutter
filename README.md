# 🍟 Backend - Lanchonete da Carminha

API feita com Node.js + MySQL para gerenciar pedidos, produtos e pagamentos da lanchonete mais famosa do bairro.

## 🔧 Tecnologias usadas
- Node.js
- Express
- MySQL
- Baileys (WhatsApp API)
- Outros pacotes: bcrypt, cors, etc.

## 🚀 Instalação

1. Clone o repositório:

````bash
git clone https://github.com/luana-fialho/Backend-Lanchonete-da-Carminha-Flutter.git
cd Backend-Lanchonete-da-Carminha-Flutter
````
## 🚀 Como rodar o projeto

```bash
npm install
npm start
````
## 🛢️ Banco de Dados

Este projeto utiliza **MySQL** como banco de dados. Para facilitar a configuração, o dump com a estrutura e dados já está incluído no repositório.

### 📥 Como importar o banco de dados no MySQL Workbench

1. Abra o **MySQL Workbench**.

2. Vá até o menu: Server > Data Import

3. Selecione a opção: Import from Self-Contained File

4. Escolha o arquivo: database/lanchonete.sql

5. Em **Default Target Schema**:
- Selecione um banco existente **ou**
- Clique em **"New..."** e crie um novo banco com o nome `lanchonete` (ou outro de sua preferência).

6. Marque: Dump Structure and Data

7. Clique no botão: Start Import

---

### ✅ Configuração do ambiente

Após importar o banco, configure o seu arquivo `database.js` com os dados de conexão:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=lanchonete
