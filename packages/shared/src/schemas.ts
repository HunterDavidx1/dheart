import characterSchema from '../schema/character.schema.json' assert { type: 'json' }

export const schemas = {
  character: characterSchema as Record<string, unknown>
}
