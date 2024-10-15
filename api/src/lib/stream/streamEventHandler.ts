import { StreamState } from '@prisma/client'

import { validate } from '@redwoodjs/api'

import { StreamName } from './streamName'

export enum StreamEvent {
  PushAuth = 'PUSH_REWRITE',
  Ready = 'STREAM_READY',
  Close = 'STREAM_UNLOAD',
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
      connectionId: number
      connector: string
      requestUrl: string
      sessionId: string
      jwt?: string
    }
  | {
      event: StreamEvent.Leave
      sessionId: string
      streamName: StreamName
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
  parseBody: (body: string[]) => D
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

export const createEventHandler =
  <D extends StreamEventData = StreamEventData>(options: HandlerOptions<D>) =>
  (plainBody: string) => {
    const {
      parseBody,
      validateData = defaultDataValidator,
      handle = defaultHandler,
      tap,
    } = options

    const bodyData = plainBody.split('\n')

    const data = parseBody(bodyData)
    validateData(data)

    tap?.(data)

    return {
      data,
      handle: () => handle(data),
    }
  }
