/*

AsyncGlk: An ES2017 Glk library
===============================

Copyright (c) 2017 Dannii Willis
MIT licenced
https://github.com/curiousdannii/asyncglk

*/

export class AsyncGlk
{

    constructor()
    {
        this.Dialog = null
        this.GiDispa = null
        this.GiLoad = null
        this.GlkOte = null
        this.metrics = null
        this.support = {}
        this.vm = null
    }

    // Initialise the library and the VM
    async init( options )
    {
        this.set_references( options )
        if ( !this.Glk )
        {
            throw new Error( 'No reference to Glk' )
        }
        if ( !this.vm )
        {
            throw new Error( 'No VM provided' )
        }

        if ( this.GiDispa )
        {
            this.GiDispa.set_vm( this.vm )
        }

        // Initialise GlkOte, and get back the support array and metrics
        const data = await this.GlkOte.init( options )
        this.metrics = data.metrics
        if ( data.support )
        {
            for ( const item of data.support )
            {
                this.support[item] = true
            }
        }

        // Initialise the VM
        this.vm.init()
    }

    // Set references to external libraries
    set_references( refs )
    {
        if ( refs.Dialog )
        {
            this.Dialog = refs.Dialog
        }

        if ( refs.GiDispa )
        {
            this.GiDispa = refs.GiDispa
        }

        if ( refs.GiLoad )
        {
            this.GiLoad = refs.GiLoad
        }

        if ( refs.GlkOte )
        {
            this.GlkOte = refs.GlkOte
        }

        if ( refs.vm )
        {
            this.vm = refs.GlkOte
        }
    }
}