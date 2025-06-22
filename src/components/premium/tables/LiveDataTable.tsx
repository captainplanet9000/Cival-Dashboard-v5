'use client'

import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, RefreshCw, Filter, Download } from 'lucide-react'
import { cn } from "@/lib/utils"

interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  high24h: number
  low24h: number
  marketCap: number
  lastUpdate: string
}

interface LiveDataTableProps {
  title?: string
  className?: string
  autoRefresh?: boolean
  refreshInterval?: number
  showControls?: boolean
}

const mockData: MarketData[] = [
  {
    symbol: 'BTC/USD',
    price: 43250.50,
    change: 1250.30,
    changePercent: 2.98,
    volume: 28450000,
    high24h: 43890.00,
    low24h: 41200.00,
    marketCap: 847500000000,
    lastUpdate: new Date().toISOString()
  },
  {
    symbol: 'ETH/USD',
    price: 2650.75,
    change: -85.25,
    changePercent: -3.11,
    volume: 15890000,
    high24h: 2750.00,
    low24h: 2620.00,
    marketCap: 318700000000,
    lastUpdate: new Date().toISOString()
  },
  {
    symbol: 'AAPL',
    price: 182.45,
    change: 3.25,
    changePercent: 1.81,
    volume: 45200000,
    high24h: 184.20,
    low24h: 180.10,
    marketCap: 2850000000000,
    lastUpdate: new Date().toISOString()
  },
  {
    symbol: 'TSLA',
    price: 245.30,
    change: -12.75,
    changePercent: -4.94,
    volume: 89500000,
    high24h: 258.90,
    low24h: 243.15,
    marketCap: 778000000000,
    lastUpdate: new Date().toISOString()
  }
]

export function LiveDataTable({ 
  title = "Live Market Data",
  className,
  autoRefresh = true,
  refreshInterval = 5000,
  showControls = true
}: LiveDataTableProps) {
  const [data, setData] = useState<MarketData[]>(mockData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`
    }
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`
    }
    return volume.toString()
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000) {
      return `${(marketCap / 1000000000).toFixed(1)}B`
    }
    if (marketCap >= 1000000) {
      return `${(marketCap / 1000000).toFixed(1)}M`
    }
    return marketCap.toString()
  }

  const refreshData = async () => {
    setIsRefreshing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update data with slight variations
    const updatedData = data.map(item => ({
      ...item,
      price: item.price + (Math.random() - 0.5) * 10,
      change: (Math.random() - 0.5) * 50,
      changePercent: (Math.random() - 0.5) * 5,
      volume: item.volume + Math.floor((Math.random() - 0.5) * 1000000),
      lastUpdate: new Date().toISOString()
    }))
    
    setData(updatedData)
    setLastRefresh(new Date())
    setIsRefreshing(false)
  }

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(refreshData, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        {showControls && (
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              Last: {lastRefresh.toLocaleTimeString()}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isRefreshing}
              className="h-8"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Symbol</TableHead>
                <TableHead className="font-semibold text-right">Price</TableHead>
                <TableHead className="font-semibold text-right">24h Change</TableHead>
                <TableHead className="font-semibold text-right">Volume</TableHead>
                <TableHead className="font-semibold text-right">24h High</TableHead>
                <TableHead className="font-semibold text-right">24h Low</TableHead>
                <TableHead className="font-semibold text-right">Market Cap</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.symbol} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{item.symbol}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatPrice(item.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {item.changePercent > 0 ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={cn(
                        "font-mono",
                        item.changePercent > 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatVolume(item.volume)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatPrice(item.high24h)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatPrice(item.low24h)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatMarketCap(item.marketCap)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default LiveDataTable