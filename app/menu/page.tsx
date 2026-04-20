"use client";

import { useRestaurant } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Info, Plus, Minus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Product } from "@/lib/types";

export default function MenuPage() {
  const { products, ingredients, toggleProductActive, calculateItemPrice } = useRestaurant();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [ingredientQuantities, setIngredientQuantities] = useState<Record<string, number>>({});

  // Open configurator
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    // Initialize default quantities
    const initialQty: Record<string, number> = {};
    product.allowedIngredientIds.forEach(id => {
      initialQty[id] = product.defaultIngredientIds.includes(id) ? 1 : 0;
    });
    setIngredientQuantities(initialQty);
  };

  const currentPrice = selectedProduct ? calculateItemPrice(selectedProduct, ingredientQuantities) : 0;

  const updateQuantity = (ingredientId: string, amount: number) => {
    setIngredientQuantities(prev => ({
      ...prev,
      [ingredientId]: Math.max(0, (prev[ingredientId] || 0) + amount)
    }));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-card/30 p-6 rounded-2xl border border-border/50">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground/90">Menu Configurator</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-xl">
            Simulate products and recipes. Users can add or remove ingredients freely. 
            Prices are calculated dynamically based on ingredient individual values.
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map(product => (
          <Card 
            key={product.id} 
            className="overflow-hidden bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group cursor-pointer flex flex-col"
            onClick={() => handleProductClick(product)}
          >
            <div className="h-48 w-full overflow-hidden relative bg-muted">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge className="bg-background/90 text-foreground hover:bg-background shadow-sm border-none backdrop-blur-md">
                  {product.category.toUpperCase()}
                </Badge>
              </div>
              <div className="absolute bottom-3 right-4 font-bold text-lg text-primary shadow-sm drop-shadow-md">
                ${product.basePrice.toFixed(2)}
              </div>
            </div>
            <CardContent className="p-5 flex-1 flex flex-col">
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                {product.description}
              </p>
              <div className="text-xs text-muted-foreground bg-muted/40 p-2 rounded-md">
                <span className="font-medium text-emerald-500">{product.allowedIngredientIds.length}</span> customizable ingredients
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Configurator Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border/60 shadow-2xl">
          {selectedProduct && (
            <>
              <div className="h-40 w-full relative">
                <img src={selectedProduct.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <Badge className="absolute top-4 left-4 bg-primary/90 hover:bg-primary shadow-sm backdrop-blur-md">Recipe Configurator</Badge>
              </div>
              <div className="px-6 pb-2 pt-2 relative border-b border-border/50">
                <DialogHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <DialogTitle className="text-2xl font-bold">{selectedProduct.name}</DialogTitle>
                      <DialogDescription className="mt-1">
                        {selectedProduct.description}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
              </div>

              <div className="px-6 py-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Ingredients & Modifications</h4>
                  <span className="text-xs flex items-center text-muted-foreground"><Info className="h-3 w-3 mr-1"/> Prices adjust automatically</span>
                </div>
                
                <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedProduct.allowedIngredientIds.map(ingId => {
                    const ing = ingredients[ingId];
                    if (!ing) return null;
                    const isDefault = selectedProduct.defaultIngredientIds.includes(ingId);
                    const qty = ingredientQuantities[ingId] || 0;
                    
                    return (
                      <div key={ingId} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-card/30 transition-colors hover:bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${qty > 0 ? 'bg-primary' : 'bg-transparent border border-border'}`} />
                          <div>
                            <p className={`text-sm font-medium ${qty === 0 && isDefault ? 'line-through text-muted-foreground' : ''}`}>
                              {ing.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {isDefault ? 'Included' : `+$${ing.price.toFixed(2)}`}
                              {isDefault && <span className="ml-1 text-emerald-500/70 opacity-70">(Removal saves half)</span>}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-muted/50 p-1 rounded-full border border-border/50">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-full text-foreground/70 hover:text-red-500 hover:bg-red-500/10"
                            onClick={() => updateQuantity(ingId, -1)}
                            disabled={qty === 0}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-4 text-center text-sm font-semibold">{qty}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-full text-foreground/70 hover:text-primary hover:bg-primary/10"
                            onClick={() => updateQuantity(ingId, 1)}
                            disabled={qty >= 5} // Arbitrary max
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-muted/40 p-6 flex flex-col gap-4 border-t border-border/50">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-muted-foreground uppercase tracking-wider">POS Status</span>
                  {selectedProduct.isActive !== false ? (
                    <Badge className="bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30 border-none">Visible in POS</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-muted-foreground border-none">Hidden from POS</Badge>
                  )}
                </div>
                
                <div className="flex gap-3 mt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedProduct(null)}>Close</Button>
                  <Button 
                    variant={selectedProduct.isActive !== false ? "destructive" : "default"} 
                    className="flex-1 shadow-lg" 
                    onClick={() => {
                      toggleProductActive(selectedProduct.id);
                      setSelectedProduct(null);
                    }}
                  >
                    {selectedProduct.isActive !== false ? (
                      <>Hide from POS <EyeOff className="ml-2 h-4 w-4" /></>
                    ) : (
                      <>Show in POS <Eye className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
