import React, { useEffect, useMemo, useState } from "react"
import { defineWidgetConfig } from "@medusajs/admin-shared"

const getProductIdFromUrl = () => {
  const m = window.location.pathname.match(/products\/([^/]+)/)
  return m?.[1] ?? null
}

const ProductIngredientesWidget = () => {
  const productId = useMemo(getProductIdFromUrl, [])
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!productId) return
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/admin/products/${productId}`, {
          method: "GET",
          credentials: "include",
        })
        const data = await res.json()
        setValue(data?.product?.metadata?.ingredientes ?? "")
      } catch (e: any) {
        setError("No se pudo cargar ingredientes")
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [productId])

  const onSave = async () => {
    if (!productId) return
    setSaving(true)
    setError(null)
    try {
      await fetch(`/admin/products/${productId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metadata: { ingredientes: value },
        }),
      })
    } catch (e: any) {
      setError("No se pudo guardar")
    } finally {
      setSaving(false)
    }
  }

  if (!productId) return null

  return (
    <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
      <h3 style={{ marginBottom: 8 }}>Ingredientes</h3>
      {loading ? (
        <div>Cargando…</div>
      ) : (
        <>
          <textarea
            rows={5}
            style={{ width: "100%", padding: 8 }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Introduce los ingredientes…"
          />
          {error && (
            <div style={{ color: "crimson", marginTop: 6 }}>{error}</div>
          )}
          <div style={{ marginTop: 8 }}>
            <button onClick={onSave} disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export const config = defineWidgetConfig({
  // Alternativas: "product.details.side" para la columna lateral
  zone: "product.details.after",
})

export default ProductIngredientesWidget