import { describe, expect, it, vi } from 'vitest'
import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain Events', () => {
  it('should be able to dispath and listen to events', () => {
    const callbackSpy = vi.fn()

    // Subscriber cadastrado -> ouvindo o evento de resposta criada
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Criando resposta, sem salvar no banco
    const aggregate = CustomAggregate.create()

    expect(aggregate.domainEvents).toHaveLength(1)

    // Salva a resposta no banco de dados e dispara o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // Subscriber ouve o evento e dispara a função callback
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
