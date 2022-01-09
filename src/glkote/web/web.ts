/*

Web GlkOte implementation
=========================

Copyright (c) 2022 Dannii Willis
MIT licenced
https://github.com/curiousdannii/asyncglk

*/

import * as GlkOte from '../common/glkote.js'
import * as protocol from '../../common/protocol.js'

import Metrics from './metrics.js'
import {DOM} from './shared.js'

export default class WebGlkOte extends GlkOte.GlkOteBase implements GlkOte.GlkOte {
    private dom: DOM = new DOM({
        context_element: undefined,
        errorcontent_id: 'errorcontent',
        errorpane_id: 'errorpane',
        gameport_id: 'gameport',
        loadingpane_id: 'loadingpane',
        prefix: '',
        windowport_id: 'windowport',
    })
    private metrics_calculator: Metrics
    private showing_error = false
    private showing_loading = true

    constructor() {
        super()

        this.metrics_calculator = new Metrics(this.dom, this.current_metrics)
    }

    async init(options: GlkOte.GlkOteOptions) {
        try {
            if (!options) {
                throw new Error('no options provided')
            }

            if (typeof jQuery === 'undefined') {
                throw new Error('jQuery is not loaded')
            }

            // Set DOM IDs
            if (options.dom_prefix) {
                this.dom.prefix = options.dom_prefix
            }
            if (options.errorcontent) {
                this.dom.errorcontent_id = options.errorcontent
            }
            if (options.errorpane) {
                this.dom.errorpane_id = options.errorpane
            }
            if (options.gameport) {
                this.dom.gameport_id = options.gameport
            }
            if (options.loadingpane) {
                this.dom.loadingpane_id = options.loadingpane
            }
            if (options.windowport) {
                this.dom.windowport_id = options.windowport
            }

            // The windport is required to already exist
            const windowport = this.dom.windowport()
            if (!windowport.length) {
                throw new Error(`Cannot find windowport element #${this.dom.windowport_id}`)
            }
            windowport.empty()

            await this.metrics_calculator.measure()

            // Note that this must be called last as it will result in VM.start() being called
            return super.init(options)
        }
        catch (err) {
            this.error(err as string)
        }
    }

    protected cancel_inputs(windows: protocol.InputUpdate[]) {
        throw new Error('cancel_inputs not yet implemented')
    }

    protected capabilities(): string[] {
        return []
    }

    protected disable(disable: boolean) {
        throw new Error('disable not yet implemented')
    }

    error(msg: any) {
        msg ?? '???'

        // Don't use jQuery, because this is called if jQuery isn't present
        const errorcontent = document.getElementById(this.dom.errorcontent_id)
        if (!errorcontent) {
            throw new Error(msg as string)
        }
        errorcontent.innerHTML = msg

        const errorpane = document.getElementById(this.dom.errorpane_id)!
        if (errorpane.className === 'WarningPane') {
            errorpane.className = ''
        }
        errorpane.style.display = ''
        this.showing_error = true
        this.hide_loading()
    }

    protected exit() {
        throw new Error('exit not yet implemented')
    }

    getdomcontext(): HTMLElement | undefined {
        return this.dom.context_element
    }

    getdomid(name: string): string {
        switch (name) {
            case 'errorcontent': return this.dom.errorcontent_id
            case 'errorpane': return this.dom.errorpane_id
            case 'gameport': return this.dom.gameport_id
            case 'loadingpane': return this.dom.loadingpane_id
            case 'windowport': return this.dom.windowport_id
            default: return name
        }
    }

    protected handle_specialinput(data: protocol.SpecialInput) {
        throw new Error('handle_specialinput not yet implemented')
    }

    private hide_loading() {
        if (!this.showing_loading) {
            return
        }
        this.showing_loading = false

        // Don't use jQuery because this could be called from error()
        const loadingpane = document.getElementById(this.dom.loadingpane_id)
        if (loadingpane) {
            loadingpane.style.display = 'none'
        }
    }

    save_allstate(): any {
        throw new Error('save_allstate not yet implemented')
    }

    setdomcontext(val: HTMLElement) {
        this.dom.context_element = val
    }

    protected update_content(content: protocol.ContentUpdate[]) {
        throw new Error('update_content not yet implemented')
    }

    protected update_inputs(windows: protocol.InputUpdate[]) {
        throw new Error('update_inputs not yet implemented')
    }

    protected update_windows(windows: protocol.WindowUpdate[]) {
        throw new Error('update_windows not yet implemented')
    }

    warning(msg: any) {
        // Don't show warnings if an error is already being shown
        if (this.showing_error) {
            return
        }

        const errorpane = $(`#${this.dom.errorpane_id}`)

        // Hide a warning
        if (!msg) {
            errorpane.hide()
            return
        }

        const errorcontent = document.getElementById(this.dom.errorcontent_id)
        if (!errorcontent) {
            console.warn(msg)
            return
        }
        errorcontent.innerHTML = msg

        errorpane.addClass('WarningPane')
        errorpane.show()
        this.hide_loading()
    }
}