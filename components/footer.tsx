import Image from 'next/image'
import Link from 'next/link'
import { IMAGES } from '@/lib/products'
import { Instagram, Twitter, Youtube, MessageCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src={IMAGES.logo}
                alt="INOVANERD"
                width={50}
                height={50}
              />
              <span className="font-display text-2xl tracking-[3px] text-foreground">
                INOVA<span className="text-orange">NERD</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              O seu destino para produtos de anime de qualidade. Arte, paixao e cultura otaku em cada produto.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-orange hover:bg-orange/10 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-orange hover:bg-orange/10 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-orange hover:bg-orange/10 transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-orange hover:bg-orange/10 transition-all"
                aria-label="Discord"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navegacao */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Navegacao</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-orange transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="text-muted-foreground hover:text-orange transition-colors">
                  Catalogo
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=camisetas" className="text-muted-foreground hover:text-orange transition-colors">
                  Camisetas
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=bonecos" className="text-muted-foreground hover:text-orange transition-colors">
                  Bonecos
                </Link>
              </li>
            </ul>
          </div>

          {/* Informacoes */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Informacoes</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-orange transition-colors">
                  Sobre Nos
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-orange transition-colors">
                  Politica de Troca
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-orange transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-orange transition-colors">
                  Rastrear Pedido
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Contato</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li className="flex items-center gap-2">
                <span>contato@inovanerd.com.br</span>
              </li>
              <li className="flex items-center gap-2">
                <span>(62) 99999-8888</span>
              </li>
              <li className="flex items-center gap-2">
                <span>Goiania, GO - Brasil</span>
              </li>
              <li className="flex items-center gap-2">
                <span>Seg-Sex: 9h-18h</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>2025 INOVANERD. Todos os direitos reservados.</p>
          <p>Desenvolvido com dedicacao para a comunidade otaku</p>
        </div>
      </div>
    </footer>
  )
}
