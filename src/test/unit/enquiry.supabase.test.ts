import { beforeEach, describe, expect, it, vi } from 'vitest'

const insert = vi.fn()
vi.mock('../../lib/supabase', () => ({ supabase: { from: vi.fn(() => ({ insert })) } }))

import { submitEnquiry } from '../../lib/enquiry'
import { supabase } from '../../lib/supabase'

const values = { name: 'Asha Rao', phone: '+91 98765 43210', email: '', location: 'Pune', service: 'Borewell Cleaning', depth: '250', message: '', website: '' }

describe('submitEnquiry with Supabase configured', () => {
  beforeEach(() => {
    localStorage.clear()
    insert.mockReset()
  })

  it("inserts a normalised row into 'enquiries' and returns 'saved'", async () => {
    insert.mockResolvedValue({ error: null })
    await expect(submitEnquiry(values)).resolves.toBe('saved')
    expect(supabase!.from).toHaveBeenCalledWith('enquiries')
    expect(insert).toHaveBeenCalledWith({
      name: 'Asha Rao',
      phone: '9876543210',
      email: null,
      location: 'Pune',
      service: 'Borewell Cleaning',
      expected_depth_ft: 250,
      message: null,
    })
  })

  it('sends depth as null when blank and keeps optional text when given', async () => {
    insert.mockResolvedValue({ error: null })
    await submitEnquiry({ ...values, depth: '', email: 'a@b.co', message: 'hi' })
    expect(insert.mock.calls[0][0]).toMatchObject({ expected_depth_ft: null, email: 'a@b.co', message: 'hi' })
  })

  it('starts the throttle after a successful save and blocks an immediate repeat', async () => {
    insert.mockResolvedValue({ error: null })
    await submitEnquiry(values)
    expect(localStorage.getItem('enquiry:last')).not.toBeNull()
    await expect(submitEnquiry(values)).rejects.toThrow(/wait a few seconds/i)
    expect(insert).toHaveBeenCalledTimes(1)
  })

  it('throws a friendly error (no raw DB message) when the insert fails, and does not throttle', async () => {
    insert.mockResolvedValue({ error: { message: 'duplicate key value violates constraint' } })
    await expect(submitEnquiry(values)).rejects.toThrow('We could not send your enquiry. Please try again or call us.')
    expect(localStorage.getItem('enquiry:last')).toBeNull()
  })
})
