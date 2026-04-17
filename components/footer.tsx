import Image from 'next/image'
import Link from 'next/link'
import { Instagram, MessageCircle, Twitter, Youtube } from 'lucide-react'
import { IMAGES } from '@/lib/assets'

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src={IMAGES.logo} alt="INOVANERD" width={50} height={50} />
              <span className="font-display text-2xl tracking-[3px] text-foreground">
                INOVA<span className="text-orange">NERD</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              O seu destino para produtos de anime de qualidade. Arte, paixao e cultura
              otaku em cada produto.
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

          <div>
            <h4 className="font-bold text-foreground mb-4">Navegacao</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-orange transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo"
                  className="text-muted-foreground hover:text-orange transition-colors"
                >
                  Catalogo
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo?categoria=camisetas"
                  className="text-muted-foreground hover:text-orange transition-colors"
                >
                  Camisetas
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo?categoria=bonecos"
                  className="text-muted-foreground hover:text-orange transition-colors"
                >
                  Bonecos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Informacoes</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/sobre" className="text-muted-foreground hover:text-orange transition-colors">
                  Sobre nos
                </Link>
              </li>
              <li>
                <Link href="/politica-de-troca" className="text-muted-foreground hover:text-orange transition-colors">
                  Politica de troca
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-orange transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/minha-conta" className="text-muted-foreground hover:text-orange transition-colors">
                  Rastrear pedido
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Contato</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>contato@inovanerd.com.br</li>
              <li>(62) 99999-8888</li>
              <li>Goiania, GO - Brasil</li>
              <li>Seg-Sex: 9h-18h</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>2026 INOVANERD. Todos os direitos reservados.</p>
          <p>Desenvolvido com dedicacao para a comunidade otaku</p>
        </div>
      </div>
    </footer>
  )
}
