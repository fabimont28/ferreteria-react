import { supabase } from '../db/supabase'

export const obtenerVentasPorCliente = async (fechaInicio, fechaFin) => {
  const { data, error } = await supabase
    .from('bills')
    .select(
      `
      id,
      created_at,
      total_sell,
      total_discount, 
      total_payed,
      customers (name, last_name)
    `,
    )
    .gte('created_at', fechaInicio)
    .lte('created_at', fechaFin)

  if (error) {
    console.error('Error obteniendo las ventas:', error)
    return null
  }

  return data
}