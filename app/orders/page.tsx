"use client";

import { useRestaurant } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingCart, Send, ChevronRight, Calculator, Plus, Minus, Info } from "lucide-react";
import { useState } from "react";

export default function OrdersPage() {
  const { currentOrder, orders, products, addProductToOrder, removeOrderItem, updateOrderItemIngredientQty, submitOrder, ingredients } = useRestaurant();
  const [activeTab, setActiveTab] = useState<'pos' | 'queue'>('pos');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    // Only expand if clicking the main container
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    setExpandedItemId(prev => prev === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-6 h-full flex-1 animate-in fade-in duration-700">
      
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground/90 flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" /> Point of Sale
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage active tables and process real-time orders.</p>
        </div>
        <div className="flex bg-muted/50 p-1 rounded-lg">
          <Button 
            variant={activeTab === 'pos' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setActiveTab('pos')}
            className="rounded-md"
          >
            New Order 
            {currentOrder && currentOrder.items.length > 0 && <Badge className="ml-2 bg-primary-foreground text-primary hover:bg-primary-foreground text-[10px] w-5 h-5 p-0 flex items-center justify-center">{currentOrder.items.length}</Badge>}
          </Button>
          <Button 
            variant={activeTab === 'queue' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setActiveTab('queue')}
            className="rounded-md"
          >
            Kitchen Queue
            {orders.filter(o => o.status !== 'completed').length > 0 && <Badge variant="secondary" className="ml-2 text-[10px] w-5 h-5 p-0 flex items-center justify-center">{orders.filter(o => o.status !== 'completed').length}</Badge>}
          </Button>
        </div>
      </div>

      {activeTab === 'pos' ? (
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 flex-1 lg:min-h-0 lg:h-full">
          {/* Quick Add Menu */}
          <div className="lg:col-span-2 flex flex-col gap-4 lg:overflow-hidden h-[450px] lg:h-full">
            <h2 className="font-semibold text-lg flex items-center gap-2"><ChevronRight className="h-4 w-4"/> Quick Add Products</h2>
            <ScrollArea className="flex-1 rounded-xl pr-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4">
                {products.map(product => (
                  <Card 
                    key={product.id} 
                    className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/30 border-border/40 group overflow-hidden"
                    onClick={() => addProductToOrder(product, 1)}
                  >
                    <div className="h-24 w-full bg-muted relative">
                      <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-colors" />
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        <Badge className="bg-background/90 text-foreground text-[10px] border-none scale-90 origin-top-left backdrop-blur-sm shadow-none">
                          {product.category.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <div className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">{product.name}</div>
                      <div className="text-xs text-primary font-bold mt-1">${product.basePrice.toFixed(2)}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Current Ticket */}
          <div className="h-[600px] lg:h-full">
            <Card className="h-full flex flex-col shadow-xl shadow-primary/5 border-primary/20 bg-card/60 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500" />
              <CardHeader className="pb-4 bg-muted/10 border-b border-border/50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ShoppingCart className="h-5 w-5 text-primary" /> Current Ticket
                </CardTitle>
                <CardDescription>
                  Table 04 Walk-in
                </CardDescription>
              </CardHeader>
              
              <div className="flex-1 overflow-hidden relative bg-muted/5">
                {(!currentOrder || currentOrder.items.length === 0) ? (
                  <div className="absolute inset-0 flex items-center justify-center flex-col text-muted-foreground p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4 border border-dashed border-border">
                      <ShoppingCart className="h-6 w-6 opacity-40" />
                    </div>
                    <p className="text-sm">Ticket is empty.</p>
                    <p className="text-xs mt-1 opacity-70">Add items from the menu or quick add to start.</p>
                  </div>
                ) : (
                  <ScrollArea className="h-full">
                    <div className="space-y-1 p-3">
                      {currentOrder.items.map((item) => {
                        const isExpanded = expandedItemId === item.id;
                        
                        // Check if item has non-default modifications
                        const isModified = Object.entries(item.ingredientQuantities).some(
                          ([id, q]) => item.product.defaultIngredientIds.includes(id) ? q !== 1 : q > 0
                        );

                        return (
                          <div 
                            key={item.id} 
                            className={`group relative overflow-hidden rounded-xl border transition-all cursor-pointer ${isExpanded ? 'bg-card border-primary/30 shadow-md' : 'bg-card/40 border-border/40 hover:border-primary/20'}`}
                            onClick={(e) => toggleExpand(item.id, e)}
                          >
                            <div className="flex justify-between items-start gap-3 p-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm truncate">{item.product.name}</span>
                                  <span className="text-xs font-semibold text-muted-foreground bg-muted px-1.5 rounded-md">x{item.quantity}</span>
                                </div>
                                <div className="flex gap-2 items-center mt-0.5">
                                  <span className="text-xs text-primary font-bold">${(item.calculatedPrice * item.quantity).toFixed(2)}</span>
                                  {isModified && <Badge variant="secondary" className="px-1 text-[9px] h-4">Custom</Badge>}
                                  {!isExpanded && <span className="text-[10px] text-muted-foreground ml-1">(Click to edit ingredients)</span>}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeOrderItem(item.id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Ingredients Sliders Section */}
                            {isExpanded && (
                              <div className="px-3 pb-3 border-t border-border/40 bg-muted/20 animate-in slide-in-from-top-2">
                                <div className="flex items-center text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2 mt-2">
                                  Ingredient Sliders
                                </div>
                                <div className="space-y-1">
                                  {item.product.allowedIngredientIds.map(ingId => {
                                    const ing = ingredients[ingId];
                                    if (!ing) return null;
                                    const isDefault = item.product.defaultIngredientIds.includes(ingId);
                                    const qty = item.ingredientQuantities[ingId] || 0;
                                    
                                    return (
                                      <div key={ingId} className="flex justify-between items-center bg-background/60 p-2 rounded-lg border border-border/30">
                                        <div className="flex items-center gap-2">
                                          <div className={`w-1.5 h-1.5 rounded-full ${qty > 0 ? 'bg-primary' : 'bg-border'}`} />
                                          <div className="flex flex-col leading-none">
                                            <span className={`text-xs font-medium ${qty === 0 && isDefault ? 'line-through opacity-50' : ''}`}>{ing.name}</span>
                                            <span className="text-[9px] text-muted-foreground mt-0.5">${ing.price.toFixed(2)}</span>
                                          </div>
                                        </div>
                                        <div className="flex items-center bg-muted rounded-full overflow-hidden border border-border/50">
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6 rounded-none hover:bg-destructive/10 hover:text-destructive"
                                            disabled={qty === 0}
                                            onClick={(e) => {
                                              updateOrderItemIngredientQty(item.id, ingId, qty - 1);
                                            }}
                                          >
                                            <Minus className="h-3 w-3" />
                                          </Button>
                                          <span className="w-5 text-center text-[11px] font-bold">{qty}</span>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6 rounded-none hover:bg-primary/10 hover:text-primary"
                                            disabled={qty >= 5}
                                            onClick={(e) => {
                                              updateOrderItemIngredientQty(item.id, ingId, qty + 1);
                                            }}
                                          >
                                            <Plus className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </div>

              <div className="p-6 bg-muted/20 border-t border-border/50">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${(currentOrder?.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax (8%)</span>
                    <span>${(currentOrder?.tax || 0).toFixed(2)}</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between items-end">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-3xl font-bold text-primary tracking-tight md:text-2xl lg:text-3xl">${(currentOrder?.total || 0).toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6 h-12 text-base font-semibold shadow-lg shadow-primary/20 items-center justify-center group"
                  disabled={!currentOrder || currentOrder.items.length === 0}
                  onClick={() => submitOrder()}
                >
                  Send to Kitchen <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Kitchen Queue view */}
          {['pending', 'preparing', 'ready', 'completed'].map((status) => {
            const statusOrders = orders.filter(o => o.status === status);
            return (
              <div key={status} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold capitalize flex items-center gap-2">
                    {status === 'pending' && <span className="w-2 h-2 rounded-full bg-red-400" />}
                    {status === 'preparing' && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                    {status === 'ready' && <span className="w-2 h-2 rounded-full bg-blue-400" />}
                    {status === 'completed' && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                    {status}
                  </h3>
                  <Badge variant="outline" className="opacity-50">{statusOrders.length}</Badge>
                </div>
                <div className="space-y-3">
                  {statusOrders.map(order => (
                    <Card key={order.id} className="border-border/60 shadow-sm bg-card/40 backdrop-blur-sm">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-sm">#{order.id.split('-').pop()}</CardTitle>
                          <span className="text-xs font-semibold text-muted-foreground">${order.total.toFixed(2)}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-xs text-muted-foreground mb-3">{order.items.length} items • Table --</p>
                        <div className="flex flex-col gap-1">
                          {order.items.slice(0, 2).map((item, i) => {
                            const isModified = Object.entries(item.ingredientQuantities).some(
                              ([id, q]) => item.product.defaultIngredientIds.includes(id) ? q !== 1 : q > 0
                            );
                            return (
                              <div key={i} className="text-[11px] flex items-center justify-between bg-muted/40 p-1.5 rounded">
                                <span className="truncate pr-2">{item.quantity}x {item.product.name}</span>
                                {isModified && <span className="text-primary font-bold shrink-0">*MOD*</span>}
                              </div>
                            );
                          })}
                          {order.items.length > 2 && <div className="text-[10px] text-center mt-1 text-muted-foreground border-t pt-1 border-border/50">+{order.items.length - 2} more items</div>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {statusOrders.length === 0 && (
                    <div className="h-24 rounded-xl border border-dashed border-border/50 flex items-center justify-center text-xs text-muted-foreground opacity-60">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}
