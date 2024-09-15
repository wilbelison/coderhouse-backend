import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

// Caminho para o arquivo JSON com produtos
const produtosPath = path.resolve("src", "data", "produtos.json");

// Função para ler produtos
function getProdutos() {
  const data = fs.readFileSync(produtosPath, "utf-8");
  return JSON.parse(data).produtos;
}

// Função para salvar os produtos atualizados
function saveProdutos(produtos) {
  const data = JSON.stringify({ produtos }, null, 2);
  fs.writeFileSync(produtosPath, data, "utf-8");
}

// Rota GET existente
router.get("/", (req, res) => {
  res.status(200).json({ hello: "world" });
});

// Rota POST para adicionar um novo produto
router.post("/produtos", (req, res) => {
  const { nome, preco, descricao, estoque } = req.body;

  if (!nome || !preco || !descricao || estoque == null) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  // Obtém a lista de produtos
  let produtos = getProdutos();

  // Cria um novo produto com um ID único
  const novoProduto = {
    id: produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1,
    nome,
    preco,
    descricao,
    estoque,
  };

  // Adiciona o novo produto à lista de produtos
  produtos.push(novoProduto);

  // Salva os produtos atualizados no arquivo JSON
  saveProdutos(produtos);

  // Retorna o novo produto adicionado
  res.status(201).json(novoProduto);
});

// Rota PUT para atualizar um produto pelo ID
router.put("/produtos/:id", (req, res) => {
  const { id } = req.params;
  const { nome, preco, descricao, estoque } = req.body;

  // Rota DELETE para deletar um produto pelo ID
  app.delete("/api/produtos/:pid", (req, res) => {
    const pid = parseInt(req.params.pid, 10); // Converte o parâmetro para um número inteiro

    if (isNaN(pid) || pid <= 0 || pid > produtos.length) {
      // Verifica se o pid é um número válido e está dentro do intervalo
      return res.status(404).json({ erro: "Posição inválida" });
    }

    const produtoRemovido = produtos.splice(pid - 1, 1); // Remove o item e captura o item removido

    // Verifica se o produto foi realmente removido
    if (produtoRemovido.length === 0) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.json({ removido: produtoRemovido[0] });
  });

  // Obtém a lista de produtos
  let produtos = getProdutos();

  // Encontra o produto pelo ID
  const produtoIndex = produtos.findIndex((p) => p.id === parseInt(id));

  if (produtoIndex === -1) {
    return res.status(404).json({ message: "Produto não encontrado." });
  }

  // Atualiza os campos do produto
  produtos[produtoIndex] = {
    ...produtos[produtoIndex],
    nome: nome || produtos[produtoIndex].nome,
    preco: preco || produtos[produtoIndex].preco,
    descricao: descricao || produtos[produtoIndex].descricao,
    estoque: estoque || produtos[produtoIndex].estoque,
  };

  // Salva os produtos atualizados no arquivo JSON
  saveProdutos(produtos);

  // Retorna o produto atualizado
  res.json(produtos[produtoIndex]);
});

export default router;
