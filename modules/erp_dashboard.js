/**
 * Orbital Dashboard (Agnostic UI)
 * A professional entry point for the Sovereign ERP.
 */
export function setup(api, container) {
  if (!container) return;

  const entities = [
    { id: 'cotizador', name: 'Cotizador', icon: '📝', path: '/erp/cotizador', desc: 'Genera variantes y presupuestos.' },
    { id: 'catalog', name: 'Catálogo', icon: '📦', path: '/schema', desc: 'Gestiona materiales y átomos.' },
    { id: 'analytics', name: 'Métricas', icon: '📊', path: '/erp/stats', desc: 'Rendimiento de operaciones.' }
  ];

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 p-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      ${entities.map(entity => `
        <div id="card-${entity.id}" class="group relative bg-background/40 backdrop-blur-3xl border border-white/5 p-8 rounded-[2rem] hover:bg-primary/5 transition-all cursor-pointer shadow-2xl overflow-hidden">
          <div class="absolute -right-4 -top-4 text-8xl opacity-[0.03] group-hover:opacity-[0.08] transition-all">${entity.icon}</div>
          <div class="relative z-10 space-y-4">
            <div class="text-4xl">${entity.icon}</div>
            <h3 class="text-2xl font-black tracking-tighter">${entity.name}</h3>
            <p class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-relaxed">
              ${entity.desc}
            </p>
            <div class="pt-4">
               <div class="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary group-hover:gap-4 transition-all">
                  Explorar Entidad <span>→</span>
               </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Attach navigation logic
  entities.forEach(entity => {
    container.querySelector(`#card-${entity.id}`).onclick = () => {
      api.notify.info(`Navigating to ${entity.name}...`);
      api.router.push(entity.path);
    };
  });
}
