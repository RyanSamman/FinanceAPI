/* eslint-disable no-console */
export type messageHandler = (...data: unknown[]) => void

export interface ILoggerConstructor {
	onInfo?: messageHandler
	onError?: messageHandler
	onLog?: messageHandler
}

export default class Logger {
	private onError: messageHandler
	private onInfo: messageHandler
	private onLog: messageHandler

	constructor({ onError, onInfo, onLog }: ILoggerConstructor = {}) {
		this.onError = onError || console.error
		this.onInfo = onInfo || console.log
		this.onLog = onLog || console.log
	}

	public log(...data: unknown[]): void {
		this.onLog(...data)
	}

	public info(...data: unknown[]): void {
		this.onInfo(...data)
	}

	public error(...data: unknown[]): void {
		this.onError(...data)
	}
}
