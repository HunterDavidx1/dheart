<template>
  <div class="min-h-screen parchment-bg">
    <TopNav />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-ink fantasy">Creador de Personajes</h2>
        <div class="space-x-2">
          <button class="medieval-button" @click="cancel">Cancelar</button>
          <button class="px-3 py-2 rounded-medieval bg-leather-dark text-parchment" @click="save">Guardar</button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-sm text-leather-dark font-bold">Clase</label>
              <div v-if="domain1 || domain2" class="flex gap-2 items-center">
                <span v-if="domain1" class="text-[10px] px-1.5 py-0.5 rounded-medieval border border-leather-dark text-ink bg-parchment">{{ domain1 }}</span>
                <span v-if="domain2" class="text-[10px] px-1.5 py-0.5 rounded-medieval border border-leather-dark text-ink bg-parchment">{{ domain2 }}</span>
              </div>
            </div>
            <select v-model="form.className" class="w-full medieval-input">
              <option value="">Selecciona una clase</option>
              <option v-for="cls in classOptions" :key="cls.name" :value="cls.name">{{ cls.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-leather-dark font-bold mb-1">Nombre</label>
            <div class="flex items-center gap-2">
              <input v-model="form.name" class="w-full medieval-input" placeholder="Nombre" />
              <button class="px-3 py-2 rounded-medieval bg-leather text-parchment" @click="randomName" title="Nombre aleatorio" aria-label="Nombre aleatorio">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                  <path d="M16 16h5v5"></path>
                </svg>
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm text-leather-dark font-bold mb-1">Pronombres</label>
            <select v-model="form.pronouns" class="w-full medieval-input">
              <option value="">Pronombres</option>
              <option v-for="p in pronounOptions" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-leather-dark font-bold mb-1">Herencia</label>
            <select v-model="form.ancestry" class="w-full medieval-input">
              <option value="">Selecciona herencia</option>
              <option v-for="a in ancestryOptions" :key="a.name" :value="a.name">{{ a.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-leather-dark font-bold mb-1">Subclase</label>
            <select v-model="form.subclass" class="w-full medieval-input">
              <option value="">Selecciona subclase</option>
              <option v-for="s in subclassOptions" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-leather-dark font-bold mb-1">Nivel</label>
            <div class="flex items-center space-x-2">
              <button class="px-3 py-2 rounded-medieval bg-leather text-parchment" @click="decLevel">-</button>
              <input v-model.number="form.level" type="number" min="1" class="w-20 text-center medieval-input" />
              <button class="px-3 py-2 rounded-medieval bg-leather text-parchment" @click="incLevel">+</button>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="scroll-border p-3 w-full min-h-[150px] mx-auto">
            <span class="text-xs font-semibold text-parchment bg-leather px-2 py-1 rounded-medieval mb-2 block mx-auto text-center">EVASIÓN</span>
            <div class="flex items-center justify-center gap-2">
              <button class="rounded-medieval bg-leather text-parchment w-6 h-6 flex items-center justify-center" @click="form.evasion--">-</button>
              <div class="min-w-[2.5rem] text-center text-xl font-extrabold text-ink bg-parchment rounded-medieval border-2 border-leather-dark px-2 py-0.5 shadow-medieval">{{ form.evasion }}</div>
              <button class="rounded-medieval bg-leather text-parchment w-6 h-6 flex items-center justify-center" @click="form.evasion++">+</button>
            </div>
            <span class="block text-[11px] text-leather-dark mt-2">Start at 10</span>
          </div>
          <div class="scroll-border p-3 w-full min-h-[150px] mx-auto">
            <span class="text-xs font-semibold text-parchment bg-leather px-2 py-1 rounded-medieval mb-2 block mx-auto text-center">ARMADURA</span>
            <div class="flex items-center justify-center gap-2">
              <button class="rounded-medieval bg-leather text-parchment w-6 h-6 flex items-center justify-center" @click="form.armorScore--">-</button>
              <div class="min-w-[2.5rem] text-center text-xl font-extrabold text-ink bg-parchment rounded-medieval border-2 border-leather-dark px-2 py-0.5 shadow-medieval">{{ form.armorScore }}</div>
              <button class="rounded-medieval bg-leather text-parchment w-6 h-6 flex items-center justify-center" @click="form.armorScore++">+</button>
            </div>
            <div class="mt-3 grid grid-cols-4 gap-1 justify-items-center">
              <svg v-for="i in 12" :key="i" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
                   viewBox="0 0 24 24" fill="none"
                   :class="i <= form.armorScore ? 'text-leather-dark fill-current' : 'text-leather-dark'"
                   stroke="currentColor" stroke-width="1.5">
                <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <h3 class="text-xl font-bold text-ink mb-3 fantasy">Atributos</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mb-8 items-stretch">
        <StatBox label="AGILITY" hint="Sprint • Leap • Maneuver" :options="['Sprint','Leap','Maneuver']" v-model="form.stats.agility" />
        <StatBox label="STRENGTH" hint="Lift • Smash • Grapple" :options="['Lift','Smash','Grapple']" v-model="form.stats.strength" />
        <StatBox label="FINESSE" hint="Control • Hide • Tinker" :options="['Control','Hide','Tinker']" v-model="form.stats.finesse" />
        <StatBox label="INSTINCT" hint="Perceive • Sense • Navigate" :options="['Perceive','Sense','Navigate']" v-model="form.stats.instinct" />
        <StatBox label="PRESENCE" hint="Charm • Perform • Deceive" :options="['Charm','Perform','Deceive']" v-model="form.stats.presence" />
        <StatBox label="KNOWLEDGE" hint="Recall • Analyze • Comprehend" :options="['Recall','Analyze','Comprehend']" v-model="form.stats.knowledge" />
        <StatBox label="PROFICIENCY" hint="Training • Expertise" :options="['Training','Expertise']" v-model="form.stats.proficiency" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionBox title="Daño y Salud" style="max-height: fit-content">
          <div class="space-y-4">
            <div class="text-[10px] text-leather-dark">Añade tu nivel actual a tus umbrales de daño.</div>
            <div class="flex items-center">
              <div class="rounded-medieval bg-leather-dark text-parchment px-3 py-2 text-center min-w-[140px]">
                <div class="text-[11px] font-semibold">MENOR</div>
                <div class="text-[10px] opacity-90">Mark 1 HP</div>
                <div class="text-sm font-bold mt-1">{{ form.thresholds.minor }}</div>
              </div>
              <span class="px-3 py-1 rounded-medieval border-2 border-leather-dark bg-parchment text-sm font-bold text-ink" style="height: 50px; width: 70px; margin: 0px 4px; display: flex; justify-content: center; align-items: center;">
                {{ armorThresholdWithLevel(0) }}
              </span>
              <div class="rounded-medieval bg-leather-dark text-parchment px-3 py-2 text-center min-w-[140px]">
                <div class="text-[11px] font-semibold">MAYOR</div>
                <div class="text-[10px] opacity-90">Mark 2 HP</div>
                <div class="text-sm font-bold mt-1">{{ form.thresholds.major }}</div>
              </div>
              <span class="px-3 py-1 rounded-medieval border-2 border-leather-dark bg-parchment text-sm font-bold text-ink" style="height: 50px; width: 70px; margin: 0px 4px; display: flex; justify-content: center; align-items: center;">
                {{ armorThresholdWithLevel(1) }}
              </span>
              <div class="rounded-medieval bg-leather-dark text-parchment px-3 py-2 text-center min-w-[140px]">
                <div class="text-[11px] font-semibold">SEVERO</div>
                <div class="text-[10px] opacity-90">Mark 3 HP</div>
                <div class="text-sm font-bold mt-1">{{ form.thresholds.severe }}</div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-sm font-bold text-ink">HP</div>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="i in 10"
                  :key="`hp-${i}`"
                  class="w-8 h-8 rounded-medieval border-2 border-leather-dark"
                  :class="i <= form.hpCurrent ? 'bg-leather-dark' : 'bg-parchment'"
                ></div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-sm font-bold text-ink">STRESS</div>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="i in form.stress"
                  :key="`str-${i}`"
                  class="w-8 h-8 rounded-medieval border-2 border-leather-dark"
                  :class="i <= form.stressMarked ? 'bg-leather-dark' : 'bg-parchment'"
                ></div>
              </div>
            </div>
          </div>
        </SectionBox>
        <SectionBox title="Esperanza y Experiencia">
          <div class="space-y-6">
            <div class="space-y-6">
              <div class="scroll-border p-6">
                <span class="text-xs font-semibold text-parchment bg-leather px-2 py-1 rounded-medieval mb-4 block w-max">ESPERANZA</span>
                <div class="relative">
                  <div class="h-10 bg-parchment rounded-medieval"></div>
                  <div class="absolute inset-0 flex items-center justify-between px-4">
                    <svg
                      v-for="i in maxHope"
                      :key="`hope-${i}`"
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-8 h-8 cursor-pointer"
                      viewBox="0 0 24 24"
                      fill="none"
                      :class="i <= form.hope ? 'text-leather-dark fill-current' : 'text-leather-dark'"
                      stroke="currentColor"
                      stroke-width="1.5"
                      @click="setHope(i)"
                    >
                      <path d="M12 2l8 10-8 10-8-10z"></path>
                    </svg>
                  </div>
                </div>
                <div class="text-[11px] text-leather-dark italic mt-4">
                  <span class="font-semibold">{{ hopeFeatName }}</span>: {{ hopeFeatText }}
                </div>
              </div>
              <div class="scroll-border p-6">
                <span class="text-xs font-semibold text-parchment bg-leather px-2 py-1 rounded-medieval mb-4 block w-max">EXPERIENCIA</span>
                <div class="space-y-4">
                  <div v-for="(exp, idx) in form.experiences" :key="idx" class="flex flex-nowrap items-center gap-2">
                    <input v-model="exp.note" class="flex-1 medieval-input" placeholder="Ej.: Gato con Botas" />
                    <select v-model="exp.target" class="w-40 medieval-input">
                      <option value="">Objetivo</option>
                      <option v-for="s in statsList" :key="`opt-${s.key}`" :value="s.key">{{ s.label }}</option>
                      <option value="especial">Especial</option>
                    </select>
                    <span class="px-2 py-1 rounded-medieval border-2 border-leather-dark bg-parchment text-[11px] font-semibold text-ink">+2</span>
                  </div>
                  <div class="flex justify-start">
                    <button class="medieval-button" @click="addExperience">Añadir experiencia</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionBox>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <SectionBox title="Armas Activas">
          <div class="space-y-6">
            <div class="scroll-border p-4">
              <span class="text-xs font-semibold text-parchment bg-leather px-2 py-1 rounded-medieval mb-2 block w-max">PRIMARIA</span>
              <select v-model="selectedPrimaryName" class="w-full medieval-input mb-1" :disabled="!isClassSelected()">
                <option value="">Selecciona arma primaria</option>
                <option v-for="w in primaryOptions()" :key="w.name" :value="w.name">{{ w.name }} (T{{ w.tier }})</option>
              </select>
              <div v-if="!isClassSelected()" class="text-[11px] text-leather-dark mb-2">Selecciona clase primero</div>
              <div v-if="form.loadout.primary" class="grid grid-cols-3 gap-3">
                <div>
                  <label class="block text-[11px] text-leather-dark mb-1">Nombre</label>
                  <div class="min-h-[2.25rem] rounded-medieval border-2 border-leather-dark bg-parchment px-2 py-1 text-ink text-sm flex items-center">{{ form.loadout.primary.name }}</div>
                </div>
                <div>
                  <label class="block text-[11px] text-leather-dark mb-1">Rasgo y Alcance</label>
                  <div class="min-h-[2.25rem] rounded-medieval border-2 border-leather-dark bg-parchment px-2 py-1 text-ink text-sm flex items-center">{{ form.loadout.primary.trait }} • {{ form.loadout.primary.range }}</div>
                </div>
                <div>
                  <label class="block text-[11px] text-leather-dark mb-1">Daño y Tipo</label>
                  <div class="min-h-[2.25rem] rounded-medieval border-2 border-leather-dark bg-parchment px-2 py-1 text-ink text-sm flex items-center">{{ form.loadout.primary.damage }} • {{ form.loadout.primary.physicalOrMagical === 'Physical' ? 'Físico' : 'Mágico' }}</div>
                </div>
                <div class="col-span-3">
                  <label class="block text-[11px] text-leather-dark mb-1">Característica</label>
                  <div class="min-h-[2.25rem] rounded-medieval border-2 border-leather-dark bg-parchment px-2 py-1 text-ink text-sm">
                    <div v-if="form.loadout.primary.featName" class="font-semibold">{{ form.loadout.primary.featName }}</div>
                    <div v-if="form.loadout.primary.featText">{{ form.loadout.primary.featText }}</div>
                    <div v-else class="text-leather-dark">—</div>
                  </div>
                </div>
                <div class="col-span-3">
                  <div class="text-[11px] text-leather-dark">Carga: {{ form.loadout.primary.burden }}</div>
                </div>
              </div>
            </div>
            <div class="scroll-border p-4">
              <span class="text-xs font-semibold text-parchment bg-leather px-2 py-1 rounded-medieval mb-2 block w-max">SECUNDARIA</span>
              <select v-model="selectedSecondaryName" class="w-full medieval-input mb-1" :disabled="isTwoHandedPrimary() || !isClassSelected()">
                <option value="">Selecciona arma secundaria</option>
                <option v-for="w in secondaryOptions()" :key="w.name" :value="w.name">{{ w.name }} (T{{ w.tier }})</option>
              </select>
              <div v-if="isTwoHandedPrimary()" class="text-[11px] text-leather-dark mb-2">Deshabilitada: arma primaria de dos manos</div>
              <div v-else-if="!isClassSelected()" class="text-[11px] text-leather-dark mb-2">Selecciona clase primero</div>
              <div v-if="form.loadout.secondary" class="grid grid-cols-3 gap-3">
                <div>
                  <label class="block text-[11px] text-leather-dark mb-1">Nombre</label>
                  <div class="min-h-[2.25rem] rounded-medieval border-2 border-leather-dark bg-parchment px-2 py-1 text-ink text-sm flex items-center">{{ form.loadout.secondary.name }}</div>
                </div>
                <div>
                  <label class="block text-[11px] text-leather-dark mb-1">Rasgo y Alcance</label>
                  <div class="min-h-[2.25rem] rounded-medieval border-2 border-leather-dark bg-parchment px-2 py-1 text-ink text-sm flex items-center">{{ form.loadout.secondary.trait }} • {{ form.loadout.secondary.range }}</div>
                </div>
                <div>
                  <label class="block text-[11px] text-leather-dark mb-1">Daño y Tipo</label>
                  <div class="min-h-[2.25rem] rounded-medieval border-2 border-leather-dark bg-parchment px-2 py-1 text-ink text-sm flex items-center">{{ form.loadout.secondary.damage }} • {{ form.loadout.secondary.physicalOrMagical === 'Physical' ? 'Físico' : 'Mágico' }}</div>
                </div>
                <div class="col-span-3">
                  <label class="block text-[11px] text-leather-dark mb-1">Característica</label>
                  <div class="min-h-[2.25rem] rounded-medieval border-2 border-leather-dark bg-parchment px-2 py-1 text-ink text-sm">
                    <div v-if="form.loadout.secondary.featName" class="font-semibold">{{ form.loadout.secondary.featName }}</div>
                    <div v-if="form.loadout.secondary.featText">{{ form.loadout.secondary.featText }}</div>
                    <div v-else class="text-leather-dark">—</div>
                  </div>
                </div>
                <div class="col-span-3">
                  <div class="text-[11px] text-leather-dark">Carga: {{ form.loadout.secondary.burden }}</div>
                </div>
              </div>
            </div>
          </div>
        </SectionBox>
        <SectionBox title="Armadura Activa">
          <div>
            <select v-model="selectedArmorName" class="w-full medieval-input mb-1" :disabled="!isClassSelected()">
              <option value="">Selecciona armadura</option>
              <option v-for="a in armorOptions()" :key="a.name" :value="a.name">{{ a.name }} (T{{ a.tier }})</option>
            </select>
            <div v-if="!isClassSelected()" class="text-[11px] text-leather-dark mb-2">Selecciona clase primero</div>
            <div v-if="form.loadout.activeArmor" class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-[11px] text-leather-dark mb-1">Nombre</label>
                <div class="min-h-[2.25rem] rounded-medieval border-2 border-leather-dark bg-parchment px-2 py-1 text-ink text-sm flex items-center">{{ form.loadout.activeArmor.name }}</div>
              </div>
              <div>
                <label class="block text-[11px] text-leather-dark mb-1">Umbrales Base</label>
                <div class="min-h-[2.25rem] rounded-medieval border-2 border-leather-dark bg-parchment px-2 py-1 text-ink text-sm flex items-center">{{ form.loadout.activeArmor.baseThresholds }}</div>
              </div>
              <div>
                <label class="block text-[11px] text-leather-dark mb-1">Puntuación Base</label>
                <div class="min-h-[2.25rem] rounded-medieval border-2 border-leather-dark bg-parchment px-2 py-1 text-ink text-sm flex items-center">{{ form.loadout.activeArmor.baseScore }}</div>
              </div>
              <div class="col-span-3">
                <label class="block text-[11px] text-leather-dark mb-1">Característica</label>
                <div class="min-h-[2.25rem] rounded-medieval border-2 border-leather-dark bg-parchment px-2 py-1 text-ink text-sm">
                  <div v-if="form.loadout.activeArmor.featName" class="font-semibold">{{ form.loadout.activeArmor.featName }}</div>
                  <div v-if="form.loadout.activeArmor.featText">{{ form.loadout.activeArmor.featText }}</div>
                  <div v-else class="text-leather-dark">—</div>
                </div>
              </div>
            </div>
          </div>
        </SectionBox>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <SectionBox title="Inventario">
          <div class="space-y-3">
            <div>
              <div class="text-[11px] font-semibold text-ink mb-1">Ítems fijos</div>
              <div class="flex flex-col gap-1">
                <div v-for="(it, idx) in form.inventory" :key="`inv-${it.id}-${idx}`" class="flex items-center justify-between rounded-medieval border-2 border-leather-dark bg-parchment px-3 py-2">
                  <div class="text-sm text-ink">{{ it.name }} <span v-if="it.notes" class="text-[11px] text-leather-dark">({{ it.notes }})</span></div>
                  <div class="text-[11px] font-semibold text-ink">x{{ it.quantity }}</div>
                </div>
              </div>
            </div>
            <div v-if="form.inventoryChoices.length">
              <div class="text-[11px] font-semibold text-ink mb-1">Elecciones</div>
              <div class="flex flex-col gap-2">
                <div v-for="(ch, cIdx) in form.inventoryChoices" :key="`choice-${cIdx}`" class="flex items-center gap-2">
                  <select class="w-full medieval-input" v-model="ch.selected" @change="onChooseInventory(ch, ch.selected || '')">
                    <option value="">Selecciona opción ({{ ch.choose }})</option>
                    <option v-for="opt in ch.options" :key="opt.id" :value="opt.id">{{ titleFromId(opt.id) }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </SectionBox>
        <SectionBox title="Oro">
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm text-leather-dark mb-1">Puñados</label>
              <input v-model.number="form.gold.handfuls" type="number" min="0" class="w-full medieval-input" />
            </div>
            <div>
              <label class="block text-sm text-leather-dark mb-1">Bolsas</label>
              <input v-model.number="form.gold.bags" type="number" min="0" class="w-full medieval-input" />
            </div>
            <div>
              <label class="block text-sm text-leather-dark mb-1">Cofre</label>
              <input v-model.number="form.gold.chest" type="number" min="0" class="w-full medieval-input" />
            </div>
          </div>
        </SectionBox>
        <SectionBox title="Rasgo de Clase">
          <div v-if="form.classFeats && form.classFeats.length" class="space-y-3">
            <div v-for="(feat, idx) in form.classFeats" :key="`clsfeat-${idx}`" class="scroll-border p-4">
              <div class="text-sm font-semibold text-ink">{{ feat.name }}</div>
              <div class="text-[11px] text-leather-dark whitespace-pre-line">{{ feat.text }}</div>
            </div>
          </div>
          <div v-else class="text-leather-dark text-sm">Selecciona una clase para ver sus rasgos</div>
        </SectionBox>
      </div>
    </div>
  </div>
  </template>

  <script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import TopNav from '@/components/TopNav.vue'
  import StatBox from '@/components/StatBox.vue'
  import SectionBox from '@/components/SectionBox.vue'
  import { useLibraryStore } from '@/stores/library'
  import { validateCharacter } from '@/lib/validateCharacter'
  import { classes as sharedClasses, ancestries as sharedAncestries, weapons as sharedWeapons, armors as sharedArmors, inventories as sharedInventories, itemsList as sharedItems, consumablesList as sharedConsumables } from '@shared/data'
  import { characterNames, lastNames } from '@shared/names'

  const router = useRouter()
  const library = useLibraryStore()

  const classOptions = sharedClasses
  const pronounOptions = ['él', 'ella', 'elle', 'ellos', 'ellas', 'he/him', 'she/her', 'they/them']
  const subclassOptions = ref<string[]>([])
  const domain1 = ref<string>('')
  const domain2 = ref<string>('')
  const ancestryOptions = sharedAncestries
  const weaponCatalog = sharedWeapons
  const armorCatalog = sharedArmors
  const inventoriesCatalog = sharedInventories as any[]
  const itemsCatalog = sharedItems as any[]
  const consumablesCatalog = sharedConsumables as any[]

  const form = reactive({
    name: '',
    pronouns: '',
    className: '',
    subclass: '',
    ancestry: '',
    level: 1,
    evasion: 10,
    armorScore: 0,
    thresholds: { minor: 1, major: 2, severe: 3 },
    hpMax: 10,
    hpCurrent: 0,
    stress: 6,
    hope: 0,
    experience: 0,
    experienceNote: '',
    experiences: [{ note: '', target: '' }, { note: '', target: '' }],
    stats: { agility: 0, strength: 0, finesse: 0, instinct: 0, presence: 0, knowledge: 0, proficiency: 0 },
    classFeats: [],
    backgrounds: [],
    connections: [],
    inventory: [] as Array<{ id: string; name: string; quantity: number; notes?: string; type?: string }>,
    inventoryChoices: [] as Array<{ id: string; choose: number; selected?: string; options: Array<{ id: string; quantity: number; notes?: string }> }>,
    inventoryWeapons: [],
    loadout: { abilityCards: [], primary: undefined as any, secondary: undefined as any },
    gold: { handfuls: 0, bags: 0, chest: 0 },
    locale: 'es',
    special: '',
  })

  const selectedPrimaryName = ref<string>('')
  const selectedSecondaryName = ref<string>('')
  const selectedArmorName = ref<string>('')
  const appliedMods = reactive({
    primary: { evasion: 0, armorScore: 0, stats: {} as Record<string, number>, thresholds: {} as Record<string, number> },
    secondary: { evasion: 0, armorScore: 0, stats: {} as Record<string, number>, thresholds: {} as Record<string, number> },
    armor: { evasion: 0, armorScore: 0, stats: {} as Record<string, number>, thresholds: {} as Record<string, number> },
    experience: { evasion: 0, armorScore: 0, stats: {} as Record<string, number>, thresholds: {} as Record<string, number> },
  })

  function titleFromId(id: string): string {
    return id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  }
  const itemsByName = (() => {
    const map: Record<string, { name: string; description?: string }> = {}
    for (const it of itemsCatalog) {
      map[String(it.name).toLowerCase()] = { name: String(it.name), description: String(it.description || '') }
    }
    for (const it of consumablesCatalog) {
      map[String(it.name).toLowerCase()] = { name: String(it.name), description: String(it.description || '') }
    }
    return map
  })()
  function normalizeItem(entry: { id: string; quantity?: number | string; length?: string; type?: string; notes?: string }) {
    const id = String(entry.id)
    const qtyRaw = entry.quantity
    const quantity = typeof qtyRaw === 'number' ? qtyRaw : 1
    const candidateName = titleFromId(id)
    const ref = itemsByName[candidateName.toLowerCase()]
    const name = ref?.name || candidateName
    const notes = entry.notes || (entry.length ? String(entry.length) : undefined)
    return { id, name, quantity, notes, type: entry.type }
  }
  function mergeInventoryItem(item: { id: string; name: string; quantity: number; notes?: string; type?: string }) {
    const existing = form.inventory.find(i => i.id === item.id && i.notes === item.notes)
    if (existing) existing.quantity += item.quantity
    else form.inventory.push({ ...item })
  }
  function removeInventoryByIdNotes(id: string, notes?: string, quantity: number = 1) {
    const idx = form.inventory.findIndex(i => i.id === id && i.notes === notes)
    if (idx >= 0) {
      const it = form.inventory[idx]
      it.quantity -= quantity
      if (it.quantity <= 0) form.inventory.splice(idx, 1)
    }
  }
  function applyFixedStartingEquipmentForClass(className: string) {
    const inv = inventoriesCatalog.find((x: any) => String(x.class) === className)
    if (!inv) return
    const fixed: Array<any> = inv.startingEquipment?.fixed || []
    for (const f of fixed) {
      if (String(f.id) === 'gold') {
        const which = String(f.quantity || '')
        if (which === 'handful') form.gold.handfuls += 1
        else if (which === 'bag') form.gold.bags += 1
        else if (which === 'chest') form.gold.chest += 1
        continue
      }
      const norm = normalizeItem(f)
      mergeInventoryItem(norm)
    }
    const choices: Array<any> = inv.startingEquipment?.choices || []
    form.inventoryChoices = choices.map((c: any) => ({
      id: String(c.id),
      choose: Number(c.choose || 1),
      selected: '',
      options: (c.options || []).map((o: any) => ({ id: String(o.id), quantity: Number(o.quantity || 1), notes: o.length ? String(o.length) : undefined })),
    }))
  }

  function tierMaxForLevel(level: number): number {
    if (level >= 8) return 4
    if (level >= 5) return 3
    if (level >= 2) return 2
    return 1
  }

  const primaryOptions = () => {
    const maxTier = tierMaxForLevel(form.level)
    return weaponCatalog.filter(w => w.primaryOrSecondary === 'Primary' && w.tier <= maxTier)
  }
  const secondaryOptions = () => {
    const maxTier = tierMaxForLevel(form.level)
    return weaponCatalog.filter(w => w.primaryOrSecondary === 'Secondary' && w.tier <= maxTier)
  }

  const isTwoHandedPrimary = () => form.loadout.primary?.burden === 'Two-Handed'
  function isClassSelected() { return !!form.className }
  function parseNumber(s: string): number {
    const v = parseInt(s.replace('–','-').replace('+','').trim(), 10)
    return Number.isNaN(v) ? 0 : v
  }
  function computeItemModifiers(item: any): { evasion: number; armorScore: number; stats: Record<string, number>; thresholds: Record<string, number> } {
    const mods = { evasion: 0, armorScore: 0, stats: {}, thresholds: {} } as { evasion: number; armorScore: number; stats: Record<string, number>; thresholds: Record<string, number> }
    const text = String(item?.featText || '')
    const cleaned = text.replace(/–/g, '-')
    const reBasic = /([+-]?\d+)\s*to\s*(Evasion|Armor Score|Agility|Strength|Finesse|Instinct|Presence|Knowledge)/gi
    const reThresh = /([+-]?\d+)\s*to\s*(Minor|Major|Severe)\s*damage\s*threshold/gi
    for (const m of cleaned.matchAll(reBasic)) {
      const n = parseNumber(m[1])
      const key = m[2]
      if (key.toLowerCase() === 'evasion') mods.evasion += n
      else if (key.toLowerCase() === 'armor score') mods.armorScore += n
      else mods.stats[key] = (mods.stats[key] || 0) + n
    }
    for (const m of cleaned.matchAll(reThresh)) {
      const n = parseNumber(m[1])
      const which = m[2]
      const map: Record<string, string> = { Minor: 'minor', Major: 'major', Severe: 'severe' }
      const k = map[which]
      mods.thresholds[k] = (mods.thresholds[k] || 0) + n
    }
    return mods
  }
  function adjustWithMods(mods: { evasion: number; armorScore: number; stats: Record<string, number>; thresholds: Record<string, number> }, sign: number) {
    if (mods.evasion) form.evasion += mods.evasion * sign
    if (mods.armorScore) form.armorScore += mods.armorScore * sign
    for (const k in mods.stats) {
      const v = mods.stats[k]
      if (!v) continue
      const map: Record<string, keyof typeof form.stats> = {
        Agility: 'agility',
        Strength: 'strength',
        Finesse: 'finesse',
        Instinct: 'instinct',
        Presence: 'presence',
        Knowledge: 'knowledge',
        Proficiency: 'proficiency',
      }
      const key = map[k]
      if (key) form.stats[key] += v * sign
    }
    for (const k in mods.thresholds) {
      const v = mods.thresholds[k]
      if (!v) continue
      const map: Record<string, keyof typeof form.thresholds> = {
        minor: 'minor',
        major: 'major',
        severe: 'severe',
      }
      const key = map[k]
      if (key) form.thresholds[key] += v * sign
    }
  }
  function applySlotMods(slot: 'primary' | 'secondary' | 'armor' | 'experience', mods: { evasion: number; armorScore: number; stats: Record<string, number>; thresholds: Record<string, number> }) {
    adjustWithMods(appliedMods[slot], -1)
    appliedMods[slot] = mods
    adjustWithMods(appliedMods[slot], 1)
  }

  watch(selectedPrimaryName, (name) => {
    const w = weaponCatalog.find(w => w.name === name && w.primaryOrSecondary === 'Primary')
    form.loadout.primary = w as any
    applySlotMods('primary', computeItemModifiers(w))
    if (isTwoHandedPrimary()) {
      selectedSecondaryName.value = ''
      form.loadout.secondary = undefined as any
      applySlotMods('secondary', { evasion: 0, armorScore: 0, stats: {}, thresholds: {} })
    }
  })
  watch(selectedSecondaryName, (name) => {
    if (isTwoHandedPrimary()) {
      selectedSecondaryName.value = ''
      form.loadout.secondary = undefined as any
      applySlotMods('secondary', { evasion: 0, armorScore: 0, stats: {}, thresholds: {} })
      return
    }
    const w = weaponCatalog.find(w => w.name === name && w.primaryOrSecondary === 'Secondary')
    form.loadout.secondary = w as any
    applySlotMods('secondary', computeItemModifiers(w))
  })
  const armorOptions = () => {
    const maxTier = tierMaxForLevel(form.level)
    return armorCatalog.filter(a => a.tier <= maxTier)
  }
  function armorThresholdsParts(): [string | undefined, string | undefined] {
    const s = form.loadout.activeArmor?.baseThresholds || ''
    const parts = s.split('/').map(x => x.trim())
    return [parts[0] || undefined, parts[1] || undefined]
  }
  function armorThresholdWithLevel(i: 0 | 1): string {
    const part = armorThresholdsParts()[i]
    if (!part) return '—'
    const n = parseInt(part.replace('–','-').replace('+','').trim(), 10)
    if (Number.isNaN(n)) return part
    return String(n + form.level)
  }
  watch(selectedArmorName, (name) => {
    const a = armorCatalog.find(a => a.name === name)
    form.loadout.activeArmor = a as any
    form.armorScore = a ? a.baseScore : 0
    applySlotMods('armor', computeItemModifiers(a))
  })
  watch(() => form.level, () => {
    const maxTier = tierMaxForLevel(form.level)
    if (form.loadout.primary && form.loadout.primary.tier > maxTier) {
      selectedPrimaryName.value = ''
      form.loadout.primary = undefined as any
      applySlotMods('primary', { evasion: 0, armorScore: 0, stats: {}, thresholds: {} })
    }
    if (form.loadout.secondary && form.loadout.secondary.tier > maxTier) {
      selectedSecondaryName.value = ''
      form.loadout.secondary = undefined as any
      applySlotMods('secondary', { evasion: 0, armorScore: 0, stats: {}, thresholds: {} })
    }
    if (form.loadout.activeArmor && form.loadout.activeArmor.tier > maxTier) {
      selectedArmorName.value = ''
      form.loadout.activeArmor = undefined as any
      form.armorScore = 0
      applySlotMods('armor', { evasion: 0, armorScore: 0, stats: {}, thresholds: {} })
    }
  })

  function incLevel() {
    form.level++
  }
  function decLevel() {
    if (form.level > 1) form.level--
  }

  function cancel() {
    router.push('/library')
  }

  function randomName() {
    const first = characterNames[Math.floor(Math.random() * characterNames.length)] || 'Nombre'
    const last = lastNames[Math.floor(Math.random() * lastNames.length)] || 'Apellido'
    form.name = `${first} ${last}`
  }

  function save() {
    const data = {
      id: Math.random().toString(36).slice(2),
      name: form.name || 'Personaje',
      pronouns: form.pronouns || undefined,
      className: form.className || 'Guerrero',
      subclass: form.subclass || undefined,
      ancestry: form.ancestry || undefined,
      level: form.level || 1,
      evasion: form.evasion,
      armorScore: form.armorScore,
      thresholds: { ...form.thresholds },
      hpMax: form.hpMax,
      hpCurrent: form.hpCurrent,
      stress: form.stress,
      hope: form.hope,
      experience: form.experience,
      stats: { ...form.stats },
      classFeats: [],
      backgrounds: [],
      connections: [],
      inventory: [],
      inventoryWeapons: [],
      loadout: { abilityCards: [], primary: form.loadout.primary, secondary: form.loadout.secondary, activeArmor: form.loadout.activeArmor },
      gold: { ...form.gold },
      locale: 'es' as const,
    }
    const res = validateCharacter(data as any)
    if (!res.valid) {
      alert(res.errors?.join('\n') || 'Datos inválidos')
      return
    }
    library.createCharacter(data as any)
    router.push('/library')
  }

  watch(() => form.className, (name) => {
    const cls = classOptions.find(c => c.name === name)
    if (!cls) {
      subclassOptions.value = []
      domain1.value = ''
      domain2.value = ''
      hopeFeatName.value = ''
      hopeFeatText.value = ''
      form.classFeats = []
      selectedPrimaryName.value = ''
      selectedSecondaryName.value = ''
      selectedArmorName.value = ''
      form.loadout.primary = undefined as any
      form.loadout.secondary = undefined as any
      form.loadout.activeArmor = undefined as any
      form.armorScore = 0
      form.inventory = []
      form.inventoryChoices = []
      form.gold.handfuls = 0
      form.gold.bags = 0
      form.gold.chest = 0
      applySlotMods('primary', { evasion: 0, armorScore: 0, stats: {}, thresholds: {} })
      applySlotMods('secondary', { evasion: 0, armorScore: 0, stats: {}, thresholds: {} })
      applySlotMods('armor', { evasion: 0, armorScore: 0, stats: {}, thresholds: {} })
      return
    }
    const subs = [cls.subclass_1, cls.subclass_2].filter(Boolean) as string[]
    subclassOptions.value = subs
    domain1.value = (cls as any).domain_1 || ''
    domain2.value = (cls as any).domain_2 || ''
    hopeFeatName.value = (cls as any).hope_feat_name || ''
    hopeFeatText.value = (cls as any).hope_feat_text || ''
    form.classFeats = (cls as any).class_feats || []
    const ev = parseInt(cls.evasion || '')
    if (!Number.isNaN(ev)) form.evasion = ev
    const hp = parseInt(cls.hp || '')
    if (!Number.isNaN(hp)) {
      form.hpMax = hp
      form.hpCurrent = hp
    }
    form.armorScore = 0
    form.inventory = []
    form.inventoryChoices = []
    form.gold.handfuls = 0
    form.gold.bags = 0
    form.gold.chest = 0
    applyFixedStartingEquipmentForClass(cls.name)
    const sug = (cls as any).suggested_traits as string | undefined
    if (sug) {
      const parts = sug.split(',').map(s => s.trim())
      const toNum = (v: string) => parseInt(v.replace('+',''))
      if (parts.length >= 6) {
        form.stats.agility = toNum(parts[0])
        form.stats.strength = toNum(parts[1])
        form.stats.finesse = toNum(parts[2])
        form.stats.instinct = toNum(parts[3])
        form.stats.presence = toNum(parts[4])
        form.stats.knowledge = toNum(parts[5])
      }
    }
  })
  
  const maxHope = 6
  function setHope(i: number) {
    form.hope = i
  }
  const hopeFeatName = ref<string>('')
  const hopeFeatText = ref<string>('')
  const statsList = [
    { key: 'agility', label: 'Agilidad' },
    { key: 'strength', label: 'Fuerza' },
    { key: 'finesse', label: 'Destreza' },
    { key: 'instinct', label: 'Instinto' },
    { key: 'presence', label: 'Presencia' },
    { key: 'knowledge', label: 'Conocimiento' },
    { key: 'proficiency', label: 'Pericia' },
  ] as const
  const expKeyMap: Record<string, string> = {
    agility: 'Agility',
    strength: 'Strength',
    finesse: 'Finesse',
    instinct: 'Instinct',
    presence: 'Presence',
    knowledge: 'Knowledge',
    proficiency: 'Proficiency',
  }
  watch(() => form.experiences.map(e => e.target), (targets) => {
    const mods = { evasion: 0, armorScore: 0, stats: {} as Record<string, number>, thresholds: {} as Record<string, number> }
    for (const t of targets) {
      const cap = t && expKeyMap[t]
      if (cap) mods.stats[cap] = (mods.stats[cap] || 0) + 2
    }
    applySlotMods('experience', mods)
  }, { deep: true })
  function addExperience() {
    form.experiences.push({ note: '', target: '' })
  }
  function onChooseInventory(ch: { id: string; choose: number; selected?: string; options: Array<{ id: string; quantity: number; notes?: string }> }, optId: string) {
    if (!optId) return
    const opt = ch.options.find(o => o.id === optId)
    if (!opt) return
    if (ch.choose === 1) {
      for (const o of ch.options) {
        if (o.id === optId) continue
        if (o.id === 'gold') {
          const which = String(o.notes || '')
          if (which === 'handful') form.gold.handfuls = Math.max(0, form.gold.handfuls - (o.quantity || 1))
          else if (which === 'bag') form.gold.bags = Math.max(0, form.gold.bags - (o.quantity || 1))
          else if (which === 'chest') form.gold.chest = Math.max(0, form.gold.chest - (o.quantity || 1))
        } else {
          removeInventoryByIdNotes(o.id, o.notes, o.quantity || 1)
        }
      }
    }
    if (opt.id === 'gold') {
      const which = String(opt.notes || '')
      if (which === 'handful') form.gold.handfuls += opt.quantity || 1
      else if (which === 'bag') form.gold.bags += opt.quantity || 1
      else if (which === 'chest') form.gold.chest += opt.quantity || 1
      const prev = ch.selected && ch.options.find(o => o.id === ch.selected)
      if (prev && prev.id === 'gold') {
        const pWhich = String(prev.notes || '')
        if (pWhich === 'handful') form.gold.handfuls = Math.max(0, form.gold.handfuls - (prev.quantity || 1))
        else if (pWhich === 'bag') form.gold.bags = Math.max(0, form.gold.bags - (prev.quantity || 1))
        else if (pWhich === 'chest') form.gold.chest = Math.max(0, form.gold.chest - (prev.quantity || 1))
      }
      ch.selected = optId
      return
    }
    const prev = ch.selected && ch.options.find(o => o.id === ch.selected)
    if (prev && prev.id && prev.id !== 'gold') {
      removeInventoryByIdNotes(prev.id, prev.notes, prev.quantity || 1)
    }
    ch.selected = optId
    const norm = normalizeItem({ id: opt.id, quantity: opt.quantity, notes: opt.notes })
    mergeInventoryItem(norm)
  }
  
  
  </script>
