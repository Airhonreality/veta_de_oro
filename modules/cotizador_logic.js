/**
 * Cotizador Logic Module (Sovereign ERP)
 * Handles real-time calculations for furniture quotation lines.
 */
export function setup(api) {
  console.log('[CotizadorLogic] Injected and Ready.');

  // React to changes in Quantity
  api.onUpdate('quantity', (val) => {
    calculateTotal(api);
  });

  // React to changes in Material selection
  api.onUpdate('material_id', (val) => {
    calculateTotal(api);
    api.notify.info(`Material changed to: ${val}`);
  });

  function calculateTotal(api) {
    const qty = parseFloat(api.getValue('quantity')) || 0;
    const materialId = api.getValue('material_id');
    
    // Query global data (Harmony Point)
    const materials = api.getGlobalData('materials') || [];
    const material = materials.find(m => m.id === materialId || m.data?.name === materialId);
    
    if (material && qty > 0) {
      const price = parseFloat(material.data?.price) || 0;
      const total = qty * price;
      
      // Update the form field automatically
      api.setValue('total', total);
      
      if (total > 5000000) {
        api.notify.success('High value line detected!');
      }
    }
  }
}
