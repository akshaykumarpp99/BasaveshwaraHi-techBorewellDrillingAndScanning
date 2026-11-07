import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from '../App'
import { LanguageProvider } from '../i18n/LanguageContext'
import type { Language } from '../i18n/translate'

export const renderAt = (path: string, language?: Language) =>
  render(
    <LanguageProvider initial={language}>
      <HelmetProvider>
        <MemoryRouter initialEntries={[path]}><App /></MemoryRouter>
      </HelmetProvider>
    </LanguageProvider>
  )
