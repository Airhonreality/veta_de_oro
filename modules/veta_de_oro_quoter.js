/**
 * Veta de Oro - Quoter Module v2.1
 * Features: Luxury Modals (No more prompts), CRM Editor, Persistent Silo.
 */
export function setup(api, container) {
  if (!container) return;

  const render = () => {
    const spaces = api.getGlobalData('quote_spaces') || [];
    const variants = api.getGlobalData('quote_variants') || [];
    const clients = api.getGlobalData('clients') || [];
    const activeClient = clients[0] || { id: 'new', data: { name: 'Sin Cliente Asignado' } };

    container.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-12 p-4 md:p-12 animate-in fade-in duration-700 pb-32">
        
        <!-- LUXE HEADER & CRM LAYER -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
           <div class="space-y-4">
              <div class="flex items-center gap-4">
                 <div class="p-3 glass-card rounded-2xl text-primary gold-shadow">${api.renderIcon('Layers')}</div>
                 <h1 class="text-4xl md:text-7xl font-black tracking-tighter gold-gradient-text uppercase leading-none">Veta de Oro</h1>
              </div>
              <p class="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 ml-1">Sovereign Quotation Engine</p>
           </div>
           
           <!-- Client Quick Info -->
           <div class="glass-card glass-gold-border p-6 rounded-[2rem] min-w-[280px] space-y-4 group/client">
              <div class="flex items-center justify-between border-b border-white/5 pb-3">
                 <div class="flex items-center gap-2 text-primary">
                    ${api.renderIcon('User')}
                    <span class="text-[10px] font-black uppercase tracking-widest">Titular del Proyecto</span>
                 </div>
                 <button onclick="window.vetaEditClient()" class="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                    Editar ${api.renderIcon('ChevronRight')}
                 </button>
              </div>
              <div>
                 <p class="text-lg font-black tracking-tight text-foreground/90">${activeClient.data.name}</p>
                 <p class="text-[10px] font-medium text-muted-foreground/60 italic">
                    ${activeClient.data.tax_id || 'ID Pendiente'} | ${activeClient.data.phone || 'Sin Teléfono'}
                 </p>
              </div>
           </div>
        </div>

        <!-- SPACES LIST -->
        <div class="space-y-10">
          ${spaces.length === 0 ? `
            <div class="py-20 text-center glass-card rounded-[3rem] border-dashed border-white/10">
               <p class="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">No hay espacios configurados</p>
            </div>
          ` : spaces.map(space => {
            const spaceVariants = variants.filter(v => v.data.space_id === space.id);
            const activeVariant = spaceVariants[0];

            return `
              <div class="glass-card rounded-[2.5rem] p-6 md:p-10 space-y-10 relative overflow-hidden group border-white/5 hover:border-primary/20 transition-all">
                 <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                       <span class="text-3xl font-black text-primary/20">/</span>
                       <h2 class="text-2xl md:text-3xl font-black tracking-tight text-foreground/90 uppercase">${space.data.name}</h2>
                    </div>
                    <button class="p-2 text-muted-foreground/30 hover:text-destructive transition-colors" onclick="window.vetaDeleteSpace('${space.id}')">
                       ${api.renderIcon('Trash2')}
                    </button>
                 </div>

                 <!-- TABS -->
                 <div class="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
                    ${spaceVariants.map((v, idx) => `
                      <button class="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border
                         ${idx === 0 ? 'bg-primary border-primary text-primary-foreground gold-shadow' : 'bg-white/5 border-white/5 text-muted-foreground hover:border-white/20'}">
                         ${v.data.name}
                      </button>
                    `).join('')}
                    <button class="p-3 rounded-2xl bg-white/5 text-primary hover:bg-primary/10 transition-all">
                       ${api.renderIcon('Plus')}
                    </button>
                 </div>

                 <!-- PARAMETERS -->
                 <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    ${[
                      { key: 'dev_days', label: 'Desarrollo' },
                      { key: 'workshop_days', label: 'Taller' },
                      { key: 'install_days', label: 'Instalación' }
                    ].map(f => `
                      <div class="bg-black/40 p-6 rounded-3xl border border-white/5 space-y-3">
                         <p class="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">${f.label}</p>
                         <div class="flex items-end gap-3">
                            <span class="text-4xl font-black gold-gradient-text tracking-tighter">${activeVariant?.data[f.key] || 0}</span>
                            <span class="text-[10px] font-bold text-muted-foreground/30 mb-2">DÍAS</span>
                         </div>
                      </div>
                    `).join('')}
                 </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- ACTIONS -->
        <div class="fixed bottom-12 left-0 w-full px-4 md:px-0 z-50">
           <div class="max-w-lg mx-auto glass-card rounded-full p-3 flex gap-3 shadow-2xl border-white/10 backdrop-blur-3xl">
              <button onclick="window.vetaOpenSpaceModal()" class="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-white/5 hover:bg-white/10 text-muted-foreground rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                 ${api.renderIcon('Plus')}
                 Añadir Espacio
              </button>
              <button class="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-primary text-primary-foreground rounded-full text-[10px] font-black uppercase tracking-[0.2em] gold-shadow hover:scale-105 transition-all">
                 ${api.renderIcon('Save')}
                 Cerrar Contrato
              </button>
           </div>
        </div>

        <!-- HIDDEN MODAL CONTAINER -->
        <div id="veta-modal" class="fixed inset-0 z-[100] hidden items-center justify-center p-4">
           <div class="absolute inset-0 bg-black/60 backdrop-blur-md" onclick="window.vetaCloseModal()"></div>
           <div class="glass-card glass-gold-border rounded-[3rem] p-10 max-w-lg w-full relative z-10 animate-in zoom-in-95 duration-300">
              <div id="veta-modal-content"></div>
           </div>
        </div>

      </div>
    `;
  };

  // HANDLERS
  window.vetaCloseModal = () => {
    document.getElementById('veta-modal').classList.add('hidden');
    document.getElementById('veta-modal').classList.remove('flex');
  };

  window.vetaOpenModal = (html) => {
    document.getElementById('veta-modal-content').innerHTML = html;
    document.getElementById('veta-modal').classList.remove('hidden');
    document.getElementById('veta-modal').classList.add('flex');
  };

  window.vetaOpenSpaceModal = () => {
    window.vetaOpenModal(`
      <div class="space-y-8">
         <h3 class="text-3xl font-black gold-gradient-text uppercase">Nuevo Espacio</h3>
         <div class="space-y-4">
            <div class="space-y-1">
               <label class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Nombre del Espacio</label>
               <input id="new-space-name" type="text" placeholder="Ej: Cocina Integral" class="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary transition-all" />
            </div>
         </div>
         <div class="flex gap-4">
            <button onclick="window.vetaCloseModal()" class="flex-1 p-4 rounded-2xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cancelar</button>
            <button onclick="window.vetaSaveSpace()" class="flex-1 p-4 rounded-2xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest gold-shadow">Forjar Espacio</button>
         </div>
      </div>
    `);
    setTimeout(() => document.getElementById('new-space-name').focus(), 100);
  };

  window.vetaSaveSpace = async () => {
    const name = document.getElementById('new-space-name').value;
    if (!name) return;
    window.vetaCloseModal();
    api.notify.loading('Escribiendo en Silo...');
    await api.saveItem('quote_spaces', {
      id: `space_${Date.now()}`,
      context: 'quote_spaces',
      data: { quote_id: 'active_quote', name, order: 0 }
    });
    api.notify.success('Materia guardada correctamente.');
  };

  window.vetaEditClient = () => {
    const clients = api.getGlobalData('clients') || [];
    const c = clients[0] || { data: { name: '', tax_id: '', phone: '' } };

    window.vetaOpenModal(`
      <div class="space-y-8">
         <div class="flex items-center gap-3">
            <div class="p-2 bg-primary/10 text-primary rounded-xl">${api.renderIcon('User')}</div>
            <h3 class="text-3xl font-black gold-gradient-text uppercase">Perfil de Cliente</h3>
         </div>
         <div class="grid grid-cols-1 gap-4 overflow-y-auto max-h-[60vh] pr-2 no-scrollbar">
            <div class="space-y-1">
               <label class="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Nombre / Razón Social</label>
               <input id="client-name" type="text" value="${c.data.name}" class="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary transition-all" />
            </div>
            <div class="space-y-1">
               <label class="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">NIT / Identificación Fiscal</label>
               <input id="client-tax" type="text" value="${c.data.tax_id || ''}" class="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary transition-all" />
            </div>
            <div class="space-y-1">
               <label class="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Teléfono</label>
               <input id="client-phone" type="text" value="${c.data.phone || ''}" class="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary transition-all" />
            </div>
            <div class="pt-4 border-t border-white/5">
               <p class="text-[9px] font-black uppercase tracking-[0.3em] text-primary/40 mb-4">Información Legal / Contrato</p>
               <div class="space-y-1">
                  <label class="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Información Bancaria</label>
                  <textarea id="client-bank" class="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white h-24 focus:outline-none focus:border-primary transition-all">${c.data.bank_info || ''}</textarea>
               </div>
            </div>
         </div>
         <div class="flex gap-4">
            <button onclick="window.vetaCloseModal()" class="flex-1 p-4 rounded-2xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Descartar</button>
            <button onclick="window.vetaSaveClient('${c.id}')" class="flex-1 p-4 rounded-2xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest gold-shadow">Actualizar Materia</button>
         </div>
      </div>
    `);
  };

  window.vetaSaveClient = async (id) => {
    const data = {
      name: document.getElementById('client-name').value,
      tax_id: document.getElementById('client-tax').value,
      phone: document.getElementById('client-phone').value,
      bank_info: document.getElementById('client-bank').value,
    };
    window.vetaCloseModal();
    api.notify.loading('Persistiendo Identidad...');
    await api.saveItem('clients', {
      id: id === 'new' ? `client_${Date.now()}` : id,
      context: 'clients',
      data
    });
    api.notify.success('Identidad asegurada.');
  };

  window.vetaDeleteSpace = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este espacio?')) return;
    await api.deleteItem('quote_spaces', id);
    api.notify.success('Espacio eliminado.');
  };

  render();
  api.onUpdate('*', render);
}
