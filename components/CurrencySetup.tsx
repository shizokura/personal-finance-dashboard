'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useRef } from 'react'
import CurrencyModal from '@/components/settings/CurrencyModal'
import storage from '@/lib/storage'

export default function CurrencySetup() {
  const [showModal, setShowModal] = useState(false)
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    const settings = storage.getSettings()
    const currency = settings.currency
    if (!currency) {
      setShowModal(true)
    }
  }, [])

  return (
    <CurrencyModal isOpen={showModal} onComplete={() => setShowModal(false)} />
  )
}
