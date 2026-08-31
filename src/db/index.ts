import Dexie, { type Table } from 'dexie'
import type { KnowledgeNote } from '@/types/knowledge'

class WebMeDexie extends Dexie {
  notes!: Table<KnowledgeNote, number>
  constructor() {
    super('webme-db')
    this.version(1).stores({
      notes: '++id, category, title, createdAt, updatedAt, pinned, favorite'
    })
  }
}

export const db = new WebMeDexie()
