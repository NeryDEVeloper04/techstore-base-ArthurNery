import { formatarPreco } from '../utils/formatarPreco'

export default function SugestaoItem({ produto, onAdicionar }) {
  return (
    <div className="sugestao">
      <div className="sugestao-imagem-moldura">
        <img src={produto.image} alt={produto.title} className="sugestao-imagem" />
      </div>
      <div className="sugestao-info">
        <p className="sugestao-titulo">{produto.title}</p>
        <p className="preco preco-pequeno">{produto.price != null ? formatarPreco(produto.price) : 'Sem preço'}</p>
      </div>
      <button className="botao botao-pequeno" onClick={() => onAdicionar(produto)} disabled={produto.estoque === 0 || produto.price == null}>
        Comprar
      </button>
    </div>
  )
}
