import { useState } from 'react'
import { Link } from 'react-router'

function ProdutoEsgotadoCard({ produto, listaEspera = [], onRegistrarEspera }) {
    const [formulario, setFormulario] = useState({ nome: '', email: '' })
    const [mensagem, setMensagem] = useState('')
    const filaProduto = listaEspera.filter((item) => item.produtoId === produto.id)

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

        setMensagem(`Você entrou na lista de espera para ${produto.title}.`)
        setFormulario({ nome: '', email: '' })
    }

    return (
        <article className="card card-esgotado">
            <Link to={`/produto/${produto.id}`} className="card-link">
                <div className="card-imagem-moldura">
                    <img src={produto.image} alt={produto.title} className="card-imagem" />
                </div>
                <h3 className="card-titulo">{produto.title}</h3>
            </Link>

            <p className="card-avaliacao">
                ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
            </p>

            <div className="card-precos">
                <span className="selo selo-esgotado">Esgotado</span>
                <span className="texto-suave">{filaProduto.length} na fila</span>
            </div>

            <form className="form-avise form-avise-compacto" onSubmit={registrarInteresse} noValidate>
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
            </form>
        </article>
    )
}

export default function Esgotados({ produtos, listaEspera = [], onRegistrarEspera }) {
    const esgotados = produtos.filter((produto) => produto.estoque === 0)

    return (
        <section>
            <p className="sobretitulo">Área interna</p>
            <h1>Produtos esgotados</h1>
            <p className="aviso">Aba dedicada para testar o avise-me e conferir quais itens estão sem estoque.</p>

            {esgotados.length === 0 ? (
                <p className="aviso">Nenhum produto está esgotado no momento.</p>
            ) : (
                <div className="grade grade-esgotados">
                    {esgotados.map((produto) => (
                        <ProdutoEsgotadoCard
                            key={produto.id}
                            produto={produto}
                            listaEspera={listaEspera}
                            onRegistrarEspera={onRegistrarEspera}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}
