import { writeFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { kn } from '../../i18n/kn'
import { dataKeys, sourceKeys } from '../i18nKeys'

const missing = (keys: Set<string>) => [...keys].filter((k) => !(k in kn)).sort()

describe('Kannada dictionary completeness', () => {
  it('has a translation for every string used in the UI code', () => {
    const m = missing(sourceKeys())
    if (process.env.DUMP_KEYS) writeFileSync(process.env.DUMP_KEYS + '.ui.json', JSON.stringify(m, null, 1))
    expect(m).toEqual([])
  })
  it('has a translation for every string in the data files and site config', () => {
    const m = missing(dataKeys())
    if (process.env.DUMP_KEYS) writeFileSync(process.env.DUMP_KEYS + '.data.json', JSON.stringify(m, null, 1))
    expect(m).toEqual([])
  })
})
