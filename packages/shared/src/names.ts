import namesJson from '../data/names.json' assert { type: 'json' }

export const characterNames: string[] = (namesJson as any).characterNames || []
export const lastNames: string[] = (namesJson as any).lastNames || []

