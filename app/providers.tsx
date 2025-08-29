'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider, theme } from 'antd'
import 'antd/dist/reset.css'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(() => new QueryClient())
  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </ConfigProvider>
  )
}
