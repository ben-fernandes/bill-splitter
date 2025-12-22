import { deflate, inflate } from 'pako'
import type { Person, MenuItem, Share } from '../context/BillContext'

export interface BillData {
  people?: Person[]
  items?: MenuItem[]
  shares?: Share[]
  serviceCharge?: number
}

export const serializeData = (data: BillData): string => {
  const json = JSON.stringify(data)
  const compressed = deflate(json, { level: 9 })
  const base64 = btoa(String.fromCharCode(...compressed))
  return `pako:${base64}`
}

export const deserializeData = (encoded: string): BillData => {
  const [type, data] = encoded.split(':', 2)
  
  if (type !== 'pako') {
    throw new Error(`Unsupported compression type: ${type}`)
  }
  
  const binary = atob(data)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  const json = inflate(bytes, { to: 'string' })
  
  return JSON.parse(json)
}
