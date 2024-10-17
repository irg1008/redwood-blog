import { StreamState } from '@prisma/client'
import { User } from 'types/graphql'

import { validate } from '@redwoodjs/api'

import { StreamConnector } from './streamConnector'
import { StreamName } from './streamName'

export enum StreamEvent {
  PushAuth = 'PUSH_REWRITE',
  Ready = 'STREAM_READY',
  Close = 'STREAM_UNLOAD',
  End = 'STREAM_END',
  Shutdown = 'SYSTEM_STOP',
  Boot = 'SYSTEM_START',
  View = 'USER_NEW',
  Leave = 'USER_END',
  StateChange = 'STREAM_BUFFER',
}

type StreamEventData =
  | {
      event: StreamEvent.Close
      streamName: StreamName
    }
  | {
      event: StreamEvent.Shutdown | StreamEvent.Boot
      reason: string
    }
  | {
      event: StreamEvent.View
      streamName: StreamName
      connectionAddress: string
      sessionId: number
      connector: StreamConnector
      requestUrl: string
      userId: User['id']
      ip: string
    }
  | {
      event: StreamEvent.Leave
      sessionId: number
      streamName: StreamName
      connector: StreamConnector
      connectionAddress: string
      viewDuration: number
      uploadedBytes: number
      downloadedBytes: number
      tags: string
    }
  | {
      event: StreamEvent.PushAuth
      pushUrl: string
      hostname: string
      streamKey: string
    }
  | {
      event: StreamEvent.Ready
      streamName: StreamName
      inputType: string
    }
  | {
      event: StreamEvent.StateChange
      streamName: StreamName
      state: StreamState
      healthInfo?: object
    }
  | {
      event: StreamEvent.End
      streamName: StreamName
      downloadedBytes: number
      uploadedBytes: number
      totalViews: number
      totalInputs: number
      totalOutputs: number
      totalViewDuration: number
    }

type StreamHandleResponse = {
  [StreamEvent.PushAuth]: StreamName | Promise<StreamName>
}

type HandlerOptions<
  D extends { event: StreamEvent } = StreamEventData,
  S = D['event'],
  R = S extends keyof StreamHandleResponse
    ? StreamHandleResponse[S]
    : ReturnType<typeof defaultHandler>,
> = {
  parseBody: (body: string[]) => D | Promise<D>
  validateData?: (data: D) => void
  handle?: (data: D) => R
  tap?: (data: D) => void
}

const defaultDataValidator: HandlerOptions['validateData'] = (data) => {
  validate(data, {
    presence: {
      message: `Invalid data for ${data.event}`,
    },
  })
}

const defaultHandler = (): boolean | Promise<boolean> => true

export const createEventHandler = <D extends StreamEventData = StreamEventData>(
  options: HandlerOptions<D>
) => ({
  async handle(plainBody: string) {
    const {
      parseBody,
      validateData = defaultDataValidator,
      handle = defaultHandler,
      tap,
    } = options

    const bodyData = plainBody.split('\n')

    const data = await parseBody(bodyData)
    validateData(data)

    tap?.(data)

    return await handle(data)
  },
})
