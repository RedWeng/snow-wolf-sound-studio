export default function DesignSystemTest() {
  return (
    <main className="min-h-screen bg-brand-snow p-8">
      <div className="container-custom space-y-12">
        {/* Header */}
        <section>
          <h1 className="text-h1 text-brand-navy mb-2">Design System Test</h1>
          <p className="text-body-lg text-brand-slate">
            Verifying all design tokens are configured correctly
          </p>
        </section>

        {/* Colors */}
        <section className="space-y-4">
          <h2 className="text-h2 text-brand-navy">Color Palette</h2>
          
          <div>
            <h3 className="text-h4 text-brand-midnight mb-3">Brand Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-brand-navy rounded-lg"></div>
                <p className="text-body-sm">Navy</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-brand-midnight rounded-lg"></div>
                <p className="text-body-sm">Midnight</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-brand-slate rounded-lg"></div>
                <p className="text-body-sm">Slate</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-brand-frost rounded-lg border border-brand-slate"></div>
                <p className="text-body-sm">Frost</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-brand-snow rounded-lg border border-brand-slate"></div>
                <p className="text-body-sm">Snow</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-h4 text-brand-midnight mb-3">Accent Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-accent-moon rounded-lg"></div>
                <p className="text-body-sm">Moon Gold</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-accent-ice rounded-lg"></div>
                <p className="text-body-sm">Ice Blue</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-accent-aurora rounded-lg"></div>
                <p className="text-body-sm">Aurora Purple</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-h4 text-brand-midnight mb-3">Semantic Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-semantic-success rounded-lg"></div>
                <p className="text-body-sm">Success</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-semantic-warning rounded-lg"></div>
                <p className="text-body-sm">Warning</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-semantic-error rounded-lg"></div>
                <p className="text-body-sm">Error</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-semantic-info rounded-lg"></div>
                <p className="text-body-sm">Info</p>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-4">
          <h2 className="text-h2 text-brand-navy">Typography</h2>
          <div className="space-y-3">
            <p className="text-display">Display Text</p>
            <p className="text-h1">Heading 1</p>
            <p className="text-h2">Heading 2</p>
            <p className="text-h3">Heading 3</p>
            <p className="text-h4">Heading 4</p>
            <p className="text-body-lg">Body Large - Lorem ipsum dolor sit amet</p>
            <p className="text-body">Body - Lorem ipsum dolor sit amet</p>
            <p className="text-body-sm">Body Small - Lorem ipsum dolor sit amet</p>
            <p className="text-caption">Caption - Lorem ipsum dolor sit amet</p>
          </div>
        </section>

        {/* Spacing */}
        <section className="space-y-4">
          <h2 className="text-h2 text-brand-navy">Spacing Scale</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="w-xs h-8 bg-accent-aurora rounded"></div>
              <span className="text-body-sm">xs (8px)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-sm h-8 bg-accent-aurora rounded"></div>
              <span className="text-body-sm">sm (12px)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-md h-8 bg-accent-aurora rounded"></div>
              <span className="text-body-sm">md (16px)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-lg h-8 bg-accent-aurora rounded"></div>
              <span className="text-body-sm">lg (24px)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-xl h-8 bg-accent-aurora rounded"></div>
              <span className="text-body-sm">xl (32px)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2xl h-8 bg-accent-aurora rounded"></div>
              <span className="text-body-sm">2xl (48px)</span>
            </div>
          </div>
        </section>

        {/* Gradients */}
        <section className="space-y-4">
          <h2 className="text-h2 text-brand-navy">Gradient Backgrounds</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-gradient-navy-frost rounded-lg flex items-center justify-center">
              <p className="text-brand-snow font-medium">Navy to Frost</p>
            </div>
            <div className="h-32 bg-gradient-midnight-snow rounded-lg flex items-center justify-center">
              <p className="text-brand-snow font-medium">Midnight to Snow</p>
            </div>
            <div className="h-32 bg-gradient-aurora rounded-lg flex items-center justify-center">
              <p className="text-brand-navy font-medium">Aurora Gradient</p>
            </div>
          </div>
        </section>

        {/* Animations */}
        <section className="space-y-4">
          <h2 className="text-h2 text-brand-navy">Animations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-brand-frost rounded-lg animate-fade-in">
              <p className="text-body font-medium">Fade In</p>
            </div>
            <div className="p-6 bg-brand-frost rounded-lg animate-slide-up">
              <p className="text-body font-medium">Slide Up</p>
            </div>
            <div className="p-6 bg-brand-frost rounded-lg animate-scale-in">
              <p className="text-body font-medium">Scale In</p>
            </div>
          </div>
        </section>

        {/* Interactive Elements */}
        <section className="space-y-4">
          <h2 className="text-h2 text-brand-navy">Interactive Elements</h2>
          <div className="space-y-4">
            <div className="p-6 bg-white rounded-lg shadow-md card-hover">
              <p className="text-body font-medium">Hover over this card</p>
              <p className="text-body-sm text-brand-slate mt-2">
                Card with hover effect (lift and shadow)
              </p>
            </div>
            <div className="p-6 glass rounded-lg">
              <p className="text-body font-medium text-brand-navy">Glass Morphism</p>
              <p className="text-body-sm text-brand-slate mt-2">
                Frosted glass effect with backdrop blur
              </p>
            </div>
          </div>
        </section>

        {/* Button Examples */}
        <section className="space-y-4">
          <h2 className="text-h2 text-brand-navy">Button Styles</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-base bg-brand-navy text-brand-snow hover:bg-brand-midnight">
              Primary Button
            </button>
            <button className="btn-base bg-accent-moon text-brand-navy hover:bg-accent-aurora">
              Accent Button
            </button>
            <button className="btn-base bg-transparent border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-brand-snow">
              Outline Button
            </button>
            <button className="btn-base bg-brand-navy text-brand-snow" disabled>
              Disabled Button
            </button>
          </div>
        </section>

        {/* Responsive Breakpoints */}
        <section className="space-y-4">
          <h2 className="text-h2 text-brand-navy">Responsive Breakpoints</h2>
          <div className="p-6 bg-brand-frost rounded-lg">
            <p className="text-body font-medium mb-2">Current breakpoint:</p>
            <p className="text-body-sm">
              <span className="sm:hidden">Default (&lt; 640px)</span>
              <span className="hidden sm:inline md:hidden">SM (640px+)</span>
              <span className="hidden md:inline lg:hidden">MD (768px+)</span>
              <span className="hidden lg:inline xl:hidden">LG (1024px+)</span>
              <span className="hidden xl:inline 2xl:hidden">XL (1280px+)</span>
              <span className="hidden 2xl:inline">2XL (1536px+)</span>
            </p>
          </div>
        </section>

        {/* Text Gradient */}
        <section className="space-y-4">
          <h2 className="text-h2 text-brand-navy">Text Effects</h2>
          <p className="text-h1 text-gradient-moon">
            Gradient Text Effect
          </p>
        </section>
      </div>
    </main>
  );
}
