import { knCompany } from './kn.company'
import { knGeneral } from './kn.general'

/** Combined Kannada dictionary (English text -> Kannada). Company entries win over general ones. */
export const kn: Record<string, string> = { ...knGeneral, ...knCompany }
