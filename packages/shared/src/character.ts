export type Trait = 'Agility' | 'Strength' | 'Finesse' | 'Instinct' | 'Presence' | 'Knowledge'
export type Range = 'Melee' | 'Close' | 'Far' | 'Very Close' | 'Very Far'
export type DamageType = 'phy' | 'mag'
export type PrimarySecondary = 'Primary' | 'Secondary'

export interface ClassFeat {
  name: string
  text: string
}

export interface HopeFeat {
  name: string
  text: string
}

export interface BackgroundQuestion {
  question: string
}

export interface ConnectionQuestion {
  question: string
}

export interface Weapon {
  name: string
  primaryOrSecondary: PrimarySecondary
  tier: number
  physicalOrMagical: 'Physical' | 'Magical'
  trait: Trait
  range: Range
  damage: string
  burden: string
  featName?: string
  featText?: string
}

export interface Armor {
  name: string
  tier: number
  baseThresholds: string
  baseScore: number
  featName?: string
  featText?: string
}

export interface AbilityCard {
  name: string
  level: number
  domain: string
  type: 'Spell' | 'Ability' | 'Grimoire'
  recall: number
  text: string
}

export interface InventoryWeapon extends Weapon {
  primary?: boolean
  secondary?: boolean
}

export interface Gold {
  handfuls: number
  bags: number
  chest: number
}

export interface Loadout {
  primary?: Weapon
  secondary?: Weapon
  activeArmor?: Armor
  abilityCards: AbilityCard[]
}

export interface Stats {
  agility: number
  strength: number
  finesse: number
  instinct: number
  presence: number
  knowledge: number
  proficiency: number
}

export interface DamageThresholds {
  minor: number
  major: number
  severe: number
}

export interface Character {
  id: string
  name: string
  pronouns?: string
  className: string
  subclass?: string
  ancestry?: string
  level: number
  evasion: number
  armorScore: number
  thresholds: DamageThresholds
  hpMax: number
  hpCurrent: number
  stress: number
  hope: number
  experience: number
  stats: Stats
  hopeFeat?: HopeFeat
  classFeats: ClassFeat[]
  backgrounds: BackgroundQuestion[]
  connections: ConnectionQuestion[]
  inventory: string[]
  inventoryWeapons: InventoryWeapon[]
  loadout: Loadout
  gold: Gold
  locale: 'es' | 'en'
}
