
import { useState } from 'react'
import { Link, useParams } from 'react-router'

export default function PaginaProduto({ produtos, onAdicionar, listaEspera = [], onRegistrarEspera }) {
  const { id } = useParams()
  const produto = produtos.find((item) => String(item.id) === String(id))
  const [formulario, setFormulario] = useState({ nome: '', email: '' })
  const [mensagem, setMensagem] = useState('')

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const relacionados = produtos
    .filter(
      (item) =>
        item.category === produto.category &&
        String(item.id) !== String(produto.id) &&
        item.estoque > 0 &&
        item.price != null
    )
    .slice(0, 4)
  const filaProduto = listaEspera.filter(
    (item) => String(item.produtoId) === String(produto.id)
  )
  const esgotado = produto.estoque === 0

  function atualizarCampo(event) {
    const { name, value } = event.target
    setFormulario((atual) => ({ ...atual, [name]: value }))
  }

  function registrarInteresse(event) {
    event.preventDefault()

    if (!onRegistrarEspera) {
      return
    }

    const cadastrado = onRegistrarEspera({
      produtoId: produto.id,
      nome: formulario.nome,
      email: formulario.email,
    })

    if (!cadastrado) {
      setMensagem('Preencha nome e e-mail válidos ou confira se você já está na lista.')
      return
    }

    setMensagem(`Você entrou na lista de espera para ${produto.title}. Vamos avisar quando ele voltar.`)
    setFormulario({ nome: '', email: '' })
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">
            {produto.price != null ? `R$ ${produto.price.toFixed(2).replace('.', ',')}` : 'Sem preço'}
          </p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className={`detalhe-estoque ${esgotado ? 'detalhe-estoque-esgotado' : ''}`}>
            {esgotado ? 'Produto esgotado' : `${produto.estoque} unidades disponíveis`}
          </p>

          <button
            className="botao botao-grande"
            onClick={() => onAdicionar(produto)}
            disabled={esgotado || produto.price == null}
          >
            {esgotado ? 'Produto indisponível' : 'Adicionar ao carrinho'}
          </button>

          {esgotado && (
            <form className="form-avise" onSubmit={registrarInteresse} noValidate>
              <h2>Avise-me quando voltar</h2>
              <label className="campo">
                <span>Nome</span>
                <input
                  type="text"
                  name="nome"
                  value={formulario.nome}
                  onChange={atualizarCampo}
                  placeholder="Seu nome"
                />
              </label>

              <label className="campo">
                <span>E-mail</span>
                <input
                  type="email"
                  name="email"
                  value={formulario.email}
                  onChange={atualizarCampo}
                  placeholder="seu@email.com"
                />
              </label>

              <button type="submit" className="botao botao-secundario">
                Quero ser avisado
              </button>

              {mensagem && <p className="mensagem-avise">{mensagem}</p>}
              {filaProduto.length > 0 && (
                <p className="contador-avise">
                  {filaProduto.length} pessoa{filaProduto.length === 1 ? '' : 's'} já {filaProduto.length === 1 ? 'está' : 'estão'} esperando este produto.
                </p>
              )}
            </form>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <article key={item.id} className="card">
            <Link to={`/produto/${item.id}`} className="card-link">
              <div className="card-imagem-moldura">
                <img src={item.image} alt={item.title} className="card-imagem" />
              </div>
              <h3 className="card-titulo">{item.title}</h3>
            </Link>
            <p className="preco">
              {item.price != null ? `R$ ${Number(item.price).toFixed(2).replace('.', ',')}` : 'Sem preço'}
            </p>
            <button className="botao" onClick={() => onAdicionar(item)}>
              Adicionar ao carrinho
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
