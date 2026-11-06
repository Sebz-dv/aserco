import type { LucideIcon } from 'lucide-react'
import { BarChart3, BriefcaseBusiness, Handshake, Wallet } from 'lucide-react'

export const services: { number: string; title: string; description: string; icon: LucideIcon }[] = [
  { number: '01', title: 'Outsourcing financiero', description: 'Acompañamiento especializado para identificar necesidades, estructurar alternativas y acercar soluciones financieras a tu empresa.', icon: BriefcaseBusiness },
  { number: '02', title: 'Colocación de productos', description: 'Conectamos empresas con opciones de financiación y productos de entidades aliadas, de acuerdo con su perfil y necesidades.', icon: Handshake },
  { number: '03', title: 'Gestión y acompañamiento', description: 'Te acompañamos durante el proceso: desde el diagnóstico inicial hasta el seguimiento de cada oportunidad.', icon: BarChart3 },
]

export const personalProducts: { title: string; description: string; icon: LucideIcon; tag: string }[] = [
  { title: 'Crédito de libre inversión', description: 'Alternativas para proyectos y necesidades personales, sujetas a evaluación de la entidad financiera.', icon: Wallet, tag: 'Financiación' },
]
