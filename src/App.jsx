import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import RolarParaTopo from './components/RolarParaTopo'
import Loja from './pages/Loja'
import PaginaProduto from './pages/PaginaProduto'
import Carrinho from './pages/Carrinho'
import Estoque from './pages/Estoque'
import { buscarProdutos } from './services/produtos'
import { buscarClientes } from './services/clientes'

const LISTA_ESPERA_KEY = 'techstore-lista-espera'

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [carrinho, setCarrinho] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteAtualId, setClienteAtualId] = useState(null)
  const [listaEspera, setListaEspera] = useState(() => {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      const salva = window.localStorage.getItem(LISTA_ESPERA_KEY)
      return salva ? JSON.parse(salva) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    buscarProdutos()
      .then((dados) => setProdutos(dados))
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))

    buscarClientes().then((dados) => {
      setClientes(dados)
      if (dados.length > 0) setClienteAtualId(dados[0].id)
    })
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LISTA_ESPERA_KEY, JSON.stringify(listaEspera))
    }
  }, [listaEspera])

  function registrarNaListaEspera({ produtoId, nome, email }) {
    const nomeLimpo = nome.trim()
    const emailLimpo = email.trim().toLowerCase()

    if (!nomeLimpo || !emailLimpo || !emailLimpo.includes('@')) {
      return false
    }

    const jaExiste = listaEspera.some(
      (item) => item.produtoId === produtoId && item.email.toLowerCase() === emailLimpo
    )

    if (jaExiste) {
      return false
    }

    setListaEspera((atual) => [
      ...atual,
      {
        id: `${produtoId}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        produtoId,
        nome: nomeLimpo,
        email: emailLimpo,
      },
    ])

    return true
  }

  function adicionarAoCarrinho(produto) {
    setCarrinho(carrinho.concat(produto))
  }

  function removerUmaUnidade(produtoId) {
    // Remove só a primeira unidade encontrada do produto 
    let removido = false
    setCarrinho(
      carrinho.filter((produto) => {
        if (!removido && produto.id === produtoId) {
          removido = true
          return false
        }
        return true
      })
    )
  }

  const clienteAtual = clientes.find((cliente) => cliente.id === clienteAtualId)

  return (
    <div className="app">
      <RolarParaTopo />
      <Header carrinho={carrinho} clienteAtual={clienteAtual} />

      <main className="conteudo">
        {carregando && <p className="aviso">Carregando produtos...</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}

        {!carregando && !erro && (
          <Routes>
            <Route
              path="/"
              element={<Loja produtos={produtos} onAdicionar={adicionarAoCarrinho} />}
            />
            <Route
              path="/produto/:id"
              element={
                <PaginaProduto
                  produtos={produtos}
                  onAdicionar={adicionarAoCarrinho}
                  listaEspera={listaEspera}
                  onRegistrarEspera={registrarNaListaEspera}
                />
              }
            />
            <Route
              path="/carrinho"
              element={
                <Carrinho
                  carrinho={carrinho}
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                />
              }
            />
            <Route
              path="/estoque"
              element={<Estoque produtos={produtos} listaEspera={listaEspera} />}
            />
          </Routes>
        )}
      </main>

      <Footer
        clientes={clientes}
        clienteAtualId={clienteAtualId}
        onTrocarCliente={setClienteAtualId}
      />
    </div>
  )
}
