import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const submit = vi.hoisted(() => vi.fn())
vi.mock('../../lib/enquiry', async (orig) => ({ ...(await orig<typeof import('../../lib/enquiry')>()), submitEnquiry: submit }))

import EnquiryForm from '../../components/sections/EnquiryForm'
import { serviceOptions } from '../../lib/validation'

const field = (re: RegExp) => screen.getByLabelText(re)
const fillValid = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(field(/full name/i), 'Asha Rao')
  await user.type(field(/mobile number/i), '98765 43210')
  await user.type(field(/location/i), 'Pune')
  await user.selectOptions(field(/required service/i), 'Borewell Drilling')
}
const submitBtn = () => screen.getByRole('button', { name: /submit enquiry|sending/i })

beforeEach(() => submit.mockReset())

describe('EnquiryForm', () => {
  it('renders every requested field with labels', () => {
    render(<EnquiryForm />)
    for (const l of [/full name/i, /mobile number/i, /email address/i, /location/i, /required service/i, /expected borewell depth/i, /^message/i]) expect(field(l)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit Enquiry' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /WhatsApp Enquiry/ })).toBeInTheDocument()
  })
  it('marks required vs optional fields', () => {
    render(<EnquiryForm />)
    expect(screen.getByText(/email address/i).textContent).toContain('(optional)')
    expect(screen.getByText(/full name/i).textContent).not.toContain('(optional)')
  })
  it('offers every service in the dropdown plus a blank prompt', () => {
    render(<EnquiryForm />)
    const opts = Array.from((field(/required service/i) as HTMLSelectElement).options).map((o) => o.textContent)
    expect(opts).toEqual(['Select a service', ...serviceOptions])
  })
  it('contains a honeypot that is hidden from people and assistive tech', () => {
    const { container } = render(<EnquiryForm />)
    const trap = container.querySelector('input[name="website"]') as HTMLInputElement
    expect(trap).not.toBeNull()
    expect(trap.tabIndex).toBe(-1)
    expect(trap.closest('[aria-hidden="true"]')).not.toBeNull()
  })

  describe('validation', () => {
    it('shows inline errors on empty submit and never calls the backend', async () => {
      render(<EnquiryForm />)
      await userEvent.click(submitBtn())
      expect(await screen.findByText('Please enter your full name')).toBeInTheDocument()
      expect(screen.getByText('Mobile number is required')).toBeInTheDocument()
      expect(screen.getByText('Please tell us your location')).toBeInTheDocument()
      expect(screen.getByText('Please choose a service')).toBeInTheDocument()
      expect(submit).not.toHaveBeenCalled()
    })
    it('links each error to its field for screen readers', async () => {
      render(<EnquiryForm />)
      await userEvent.click(submitBtn())
      await screen.findByText('Please enter your full name')
      const name = field(/full name/i)
      expect(name).toHaveAttribute('aria-invalid', 'true')
      expect(document.getElementById(name.getAttribute('aria-describedby')!)).toHaveTextContent('Please enter your full name')
      expect(screen.getAllByRole('alert').length).toBeGreaterThanOrEqual(4)
    })
    it('validates a field after the user leaves it (blur) and clears it when fixed', async () => {
      const user = userEvent.setup()
      render(<EnquiryForm />)
      await user.type(field(/mobile number/i), '123')
      await user.tab()
      expect(await screen.findByText(/valid 10-digit mobile/i)).toBeInTheDocument()
      await user.clear(field(/mobile number/i))
      await user.type(field(/mobile number/i), '9876543210')
      await waitFor(() => expect(screen.queryByText(/valid 10-digit mobile/i)).toBeNull())
    })
    it('rejects a bad email and depth but allows both blank', async () => {
      const user = userEvent.setup()
      render(<EnquiryForm />)
      await fillValid(user)
      await user.type(field(/email address/i), 'not-an-email')
      await user.type(field(/expected borewell depth/i), '99999')
      await user.click(submitBtn())
      expect(await screen.findByText(/valid email address/i)).toBeInTheDocument()
      expect(screen.getByText(/depth in feet/i)).toBeInTheDocument()
      expect(submit).not.toHaveBeenCalled()
    })
  })

  describe('submission', () => {
    it('sends the validated values to the backend', async () => {
      submit.mockResolvedValue('saved')
      const user = userEvent.setup()
      render(<EnquiryForm />)
      await fillValid(user)
      await user.type(field(/expected borewell depth/i), '300')
      await user.type(field(/^message/i), 'Need a borewell')
      await user.click(submitBtn())
      await waitFor(() => expect(submit).toHaveBeenCalledTimes(1))
      expect(submit.mock.calls[0][0]).toMatchObject({ name: 'Asha Rao', phone: '98765 43210', location: 'Pune', service: 'Borewell Drilling', depth: '300', message: 'Need a borewell', website: '' })
    })
    it("shows a success message and clears the form when saved", async () => {
      submit.mockResolvedValue('saved')
      const user = userEvent.setup()
      render(<EnquiryForm />)
      await fillValid(user)
      await user.click(submitBtn())
      expect(await screen.findByText(/your enquiry has been received/i)).toBeInTheDocument()
      expect((field(/full name/i) as HTMLInputElement).value).toBe('')
      expect((field(/required service/i) as HTMLSelectElement).value).toBe('')
    })
    it('with no backend configured, hands the lead to WhatsApp and email with the typed details', async () => {
      submit.mockResolvedValue('fallback')
      const user = userEvent.setup()
      render(<EnquiryForm />)
      await fillValid(user)
      await user.click(submitBtn())
      expect(await screen.findByText(/details ready/i)).toBeInTheDocument()
      const wa = screen.getByRole('link', { name: /send on whatsapp/i })
      expect(decodeURIComponent(wa.getAttribute('href')!)).toContain('Name: Asha Rao')
      const mail = screen.getByRole('link', { name: /send by email/i })
      expect(decodeURIComponent(mail.getAttribute('href')!)).toContain('Location: Pune')
      expect((field(/full name/i) as HTMLInputElement).value).toBe('Asha Rao') // kept so nothing is lost
    })
    it('shows the error message when sending fails and keeps the form data', async () => {
      submit.mockRejectedValueOnce(new Error('We could not send your enquiry. Please try again or call us.'))
      const user = userEvent.setup()
      render(<EnquiryForm />)
      await fillValid(user)
      await user.click(submitBtn())
      expect(await screen.findByText('We could not send your enquiry. Please try again or call us.')).toBeInTheDocument()
      expect(screen.getAllByRole('alert').some((a) => /could not send/i.test(a.textContent ?? ''))).toBe(true)
      expect((field(/full name/i) as HTMLInputElement).value).toBe('Asha Rao')
    })
    it('uses a generic message for non-Error failures', async () => {
      submit.mockRejectedValueOnce('boom')
      const user = userEvent.setup()
      render(<EnquiryForm />)
      await fillValid(user)
      await user.click(submitBtn())
      expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
    })
    it('disables the button and shows "Sending…" while the request is in flight', async () => {
      let resolve!: (v: string) => void
      submit.mockReturnValue(new Promise<string>((r) => { resolve = r }))
      const user = userEvent.setup()
      render(<EnquiryForm />)
      await fillValid(user)
      await user.click(submitBtn())
      const btn = await screen.findByRole('button', { name: /sending/i })
      expect(btn).toBeDisabled()
      resolve('saved')
      await screen.findByText(/received/i)
      expect(screen.getByRole('button', { name: 'Submit Enquiry' })).toBeEnabled()
    })
    it('clears an old error when the next submit starts', async () => {
      submit.mockRejectedValueOnce(new Error('first failure')).mockResolvedValueOnce('saved')
      const user = userEvent.setup()
      render(<EnquiryForm />)
      await fillValid(user)
      await user.click(submitBtn())
      await screen.findByText('first failure')
      await user.click(submitBtn())
      await screen.findByText(/received/i)
      expect(screen.queryByText('first failure')).toBeNull()
    })
  })

  describe('WhatsApp enquiry button', () => {
    it('updates live as the user types and is always usable (even with an incomplete form)', async () => {
      const user = userEvent.setup()
      render(<EnquiryForm />)
      const wa = () => decodeURIComponent(screen.getByRole('link', { name: /WhatsApp Enquiry/ }).getAttribute('href')!)
      expect(wa()).not.toContain('Name:')
      await user.type(field(/full name/i), 'Ravi')
      expect(wa()).toContain('Name: Ravi')
      await user.type(field(/location/i), 'Nashik')
      expect(wa()).toContain('Location: Nashik')
    })
    it('opens in a new tab safely', () => {
      render(<EnquiryForm />)
      const a = screen.getByRole('link', { name: /WhatsApp Enquiry/ })
      expect(a).toHaveAttribute('target', '_blank')
      expect(a).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('pre-selects the given service', () => {
    render(<EnquiryForm defaultService="Borewell Flushing" />)
    expect((field(/required service/i) as HTMLSelectElement).value).toBe('Borewell Flushing')
  })
})
