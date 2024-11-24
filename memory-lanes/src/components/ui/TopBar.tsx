import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from 'lucide-react'

import signpostImage from '@/assets/signpost.png';

const menuItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '#' },
]

export function TopBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="min-w-screen text-primary py-3 sticky top-0 z-10 backdrop-blur-lg bg-white/30 border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-xl md:text-2xl font-bold flex items-center space-x-2">
        <a href="/" className="flex items-center">
            <img src={signpostImage} alt="Logo" className="h-8 w-8 mr-1" />
            <span className="text-primary text-2xl mb-1" style={{ fontFamily: 'Reem Kufi, sans-serif' }}>
                memory lanes
            </span>
        </a>
        </h1>
        <nav className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
            >
              {item.name}
            </a>
          ))}
        </nav>
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" aria-label="Menu" className="border-primary text-primary">
              <Menu className="h-5 w-5 text-primary border-primary text-primary" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-secondary text-secondary-foreground">
            <nav className="flex flex-col space-y-4 mt-8 border-primary text-primary">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-lg hover:underline text-primary border-primary text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
