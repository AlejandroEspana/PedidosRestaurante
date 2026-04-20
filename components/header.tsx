"use client";

import { Bell, Menu, Search, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
      <div className="flex lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px]">
            <h2 className="font-bold text-lg mb-4 mt-2">GourmetOS</h2>
            <nav className="flex flex-col gap-2">
              <Button variant="ghost" className="justify-start">Dashboard</Button>
              <Button variant="ghost" className="justify-start">Orders & POS</Button>
              <Button variant="ghost" className="justify-start">Menu Configurator</Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1 flex justify-between items-center sm:gap-4 md:gap-8">
        <div className="flex-1 w-full flex items-center max-w-md gap-3 bg-muted/40 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all border border-transparent focus-within:border-primary/20">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input 
            type="search"
            placeholder="Search orders, menu items..."
            className="w-full bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
          />
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/60 hidden sm:inline-flex">
            <Bell className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-muted/60"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <div className="h-8 w-px bg-border hidden sm:block mx-2"></div>

          <Avatar className="h-8 w-8 ring-2 ring-primary/20 cursor-pointer transition-all hover:scale-105">
            <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="@admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
