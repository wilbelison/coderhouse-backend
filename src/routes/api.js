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

// Rota PUT para atualizar um produto pelo ID
router.put("/produtos/:id", (req, res) => {
  const { id } = req.params;
  const { nome, preco, descricao, estoque } = req.body;

  // Obtém a lista de produtos
  let produtos = getProdutos();

  // Encontra o produto pelo ID
  const produtoIndex = produtos.findIndex(p => p.id === parseInt(id));

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