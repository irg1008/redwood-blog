import { EventEmitter } from 'events'

import { WorkerEvents } from 'graphile-worker'

export const events: WorkerEvents = new EventEmitter()
