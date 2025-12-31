import Ajv from 'ajv'
import { schemas } from '@shared/index'
import type { Character } from '@shared/character'

const ajv = new Ajv({ allErrors: true })
const validate = ajv.compile(schemas.character as any)

export function validateCharacter(data: Character): { valid: boolean; errors?: string[] } {
  const ok = validate(data)
  if (ok) return { valid: true }
  const errors = (validate.errors || []).map(e => `${e.instancePath} ${e.message}`)
  return { valid: false, errors }
}
