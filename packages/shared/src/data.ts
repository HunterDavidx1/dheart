import classesJson from '../data/classes.json' assert { type: 'json' }
import ancestriesJson from '../data/ancestries.json' assert { type: 'json' }
import weaponsJson from '../data/weapons.json' assert { type: 'json' }
import armorJson from '../data/armor.json' assert { type: 'json' }
import inventoryJson from '../data/inventory.json' assert { type: 'json' }
import itemsJson from '../data/items.json' assert { type: 'json' }
import consumablesJson from '../data/consumables.json' assert { type: 'json' }
import adversariesJson from '../data/adversaries.json' assert { type: 'json' }
import type { Weapon, Armor, Trait, Range } from './character'

export interface GameClass {
  name: string
  description?: string
  evasion?: string
  hp?: string
  subclass_1?: string
  subclass_2?: string
  suggested_armor?: string
}

export const classes: GameClass[] = classesJson as GameClass[]

export interface Ancestry {
  name: string
  description?: string
}
export const ancestries: Ancestry[] = ancestriesJson as Ancestry[]

function normalizePhysicalOrMagical(v: string): 'Physical' | 'Magical' {
  return v.includes('Magical') ? 'Magical' : 'Physical'
}

export const weapons: Weapon[] = (weaponsJson as any[]).map(w => ({
  name: String(w.name),
  primaryOrSecondary: String(w.primary_or_secondary) === 'Secondary' ? 'Secondary' : 'Primary',
  tier: parseInt(String(w.tier), 10),
  physicalOrMagical: normalizePhysicalOrMagical(String(w.physical_or_magical)),
  trait: String(w.trait) as Trait,
  range: String(w.range) as Range,
  damage: String(w.damage),
  burden: String(w.burden),
  featName: w.feat_name ? String(w.feat_name) : undefined,
  featText: w.feat_text ? String(w.feat_text) : undefined,
}))

export const armors: Armor[] = (armorJson as any[]).map(a => ({
  name: String(a.name),
  tier: parseInt(String(a.tier), 10),
  baseThresholds: String(a.base_thresholds),
  baseScore: parseInt(String(a.base_score), 10),
  featName: a.feat_name ? String(a.feat_name) : undefined,
  featText: a.feat_text ? String(a.feat_text) : undefined,
}))

export const inventories = inventoryJson as any[]
export const itemsList = itemsJson as any[]
export const consumablesList = consumablesJson as any[]

export interface AdversaryFeat {
  name: string
  text: string
}

export interface Adversary {
  name: string
  tier?: string
  type?: string
  description?: string
  motives_and_tactics?: string
  difficulty?: string
  thresholds?: string
  hp?: string
  stress?: string
  atk?: string
  attack?: string
  range?: string
  damage?: string
  experience?: string
  feats?: AdversaryFeat[]
}

export const adversaries: Adversary[] = adversariesJson as Adversary[]
