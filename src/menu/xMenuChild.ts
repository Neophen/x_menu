import { Transition } from './transition'
import { HasAttributeObserver } from './hasAttributeObserver'

import type { XMenu } from './xMenu'

export class XMenuChild extends HTMLElement {
  xMenu!: XMenu
  xMenuObserver!: HasAttributeObserver

  connectedCallback() {
    this.onToggle = this.onToggle.bind(this)
    const xMenu = this.closest('x-menu')
    if (!xMenu) {
      const tag = this.tagName.toLocaleLowerCase().replace(/_/g, '-')
      throw new Error(`<${tag}> has to be nested within <x-menu> component.`)
    }

    this.xMenu = xMenu as XMenu

    this.xMenuObserver = new HasAttributeObserver(this, this.xMenu, 'open', this.onOpenChange.bind(this))

    this.querySelectorAll<HTMLButtonElement>('button[x-menu-toggle], a[x-menu-toggle]').forEach((button) => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      button.addEventListener('click', this.onToggle)
    })
  }

  disconnectedCallback() {
    this.xMenuObserver.disconnect()
    this.querySelectorAll<HTMLButtonElement>('button[x-menu-toggle]').forEach((button) => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      button.removeEventListener('click', this.onToggle)
    })
  }

  onOpenChange(open: boolean) {
    this.toggleAttribute('open', open)
  }

  onToggle(event: MouseEvent) {
    this.dispatchEvent(this.xMenu.createEvent({ target: event.target as HTMLButtonElement }))
  }
}

export class XMenuTransitionChild extends XMenuChild {
  transition!: Transition

  connectedCallback() {
    super.connectedCallback()
    this.transition = new Transition(this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.transition.disconnectedCallback()
  }

  onOpenChange(open: boolean) {
    this.transition.open = open
  }
}
