export abstract class ValueObject<TProps> {
  protected props: TProps

  protected constructor(props: TProps) {
    this.props = props
  }

  public equals(vo: ValueObject<unknown>) {
    if (vo === null || vo === undefined) {
      return false
    }

    if (vo.props === undefined) {
      return false
    }

    return JSON.stringify(vo.props) === JSON.stringify(this.props)
  }
}

/**
 * É necessario converter em string pois o operador "===", por se tratar de objetos,
 * irá verificar se ambos estão no mesmo endereço de memória (comparação referencial).
 * Convertendo em string ele ira comparar se os valores são realmentes iguais.
 *
 * '{"name": "john"}' === '{"name": "john"}' -> output: true
 * {name: "john"} === {name: "john"} -> output: false
 */
