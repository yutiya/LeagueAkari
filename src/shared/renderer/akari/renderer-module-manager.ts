import { LeagueAkariRendererModule } from './renderer-akari-module'
import { LeagueAkariRendererIpc } from './renderer-ipc'

export class LeagueAkariRendererModuleManager {
  private _modules = new Map<string, LeagueAkariRendererModule>()

  constructor() {}

  async register(module: LeagueAkariRendererModule) {
    if (this._modules.has(module.id)) {
      throw new Error(`Module of Id '${module.id}' already registered`)
    }

    await module.onRegister(this)
    await LeagueAkariRendererIpc.call('module-manager/renderer-register', module.id)
    this._modules.set(module.id, module)
  }

  async unregister(moduleId: string) {
    if (this._modules.has(moduleId)) {
      throw new Error(`Module of ID '${moduleId}' not found`)
    }

    await this._modules.get(moduleId)!.onUnregister()
    await LeagueAkariRendererIpc.call('module-manager/renderer-register', moduleId)
    this._modules.delete(moduleId)
  }

  setup() {
    LeagueAkariRendererIpc.onEvent('module-manager/event', (_, moduleId, eventName, ...args) => {
      this._modules.get(moduleId)?.dispatchEvent(eventName, ...args)
    })
  }

  call<T = any>(moduleId: string, methodName: string, ...args: any[]) {
    return LeagueAkariRendererIpc.call<T>('module-manager/call', moduleId, methodName, ...args)
  }
}