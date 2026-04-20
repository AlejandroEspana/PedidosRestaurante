"use client";

import { useRestaurant } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Banknote, ChefHat, Clock, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Dashboard() {
  const { orders, products } = useRestaurant();

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0) || 5432.89; // Mock data
  const activeOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length || 12;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground/90">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1 text-sm">Welcome back. Here is what's happening at GourmetOS today.</p>
        </div>
        <Link href="/orders">
          <Button className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <ShoppingBag className="mr-2 h-4 w-4" /> Go to POS
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Banknote className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-emerald-500 flex items-center mr-1"><ArrowUpRight className="h-3 w-3" /> +12.5%</span> from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrdersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              3 ready for pickup
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-emerald-500 flex items-center mr-1"><ArrowUpRight className="h-3 w-3" /> +201</span> since last hour
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 via-background to-background backdrop-blur-sm border-primary/20 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">Avg Order Value</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalRevenue / (orders.length || 150)).toFixed(2)}</div>
            <p className="text-xs text-primary/70 mt-1">
              Highest this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 h-full">
        <Card className="lg:col-span-4 bg-card/40 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              A quick look at the latest operations in your kitchen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock Recent Orders List */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border/50 transition-colors">
                  <div className="h-10 w-10 flex-shrink-0 bg-secondary rounded-full flex items-center justify-center text-xs font-bold text-secondary-foreground">
                    #{1000 + i}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Table {i * 2}</p>
                    <p className="text-xs text-muted-foreground truncate">{i} items • 2 mins ago</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={i % 2 === 0 ? "secondary" : "default"} className="px-2 py-0.5 shadow-none">
                      {i % 2 === 0 ? 'Pending' : 'Preparing'}
                    </Badge>
                    <div className="text-sm font-medium">${(Math.random() * 50 + 10).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-card/40 backdrop-blur-sm border-border/50 flex flex-col">
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
            <CardDescription>Items that customers love today.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-6">
              {products.map((product, idx) => (
                <div key={product.id} className="flex items-center justify-between group">
                  <div className="flex flex-col gap-1 w-full relative">
                    <div className="flex justify-between items-end mb-1 relative z-10">
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">{product.name}</span>
                      <span className="text-xs text-muted-foreground font-medium">{45 - idx * 10} sales</span>
                    </div>
                    {/* Progress bar mock */}
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000 ease-out" 
                        style={{ width: `${100 - idx * 20}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-8 rounded-xl bg-orange-500/10 border border-orange-500/20 p-4">
                <div className="flex items-start gap-3">
                  <ChefHat className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold tracking-tight text-orange-600 dark:text-orange-400">Chef's Suggestion</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      "Truffle Fries" are trending, add more Truffle to inventory to sustain demand!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
