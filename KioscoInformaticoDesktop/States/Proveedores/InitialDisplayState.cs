using Desktop.Interfaces;
using KioscoInformaticoDesktop.Views;
using Service.Interfaces;
using Service.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desktop.States.Proveedores
{
    public class InitialDisplayState : IFormState
    {
        ProveedoresView _form;
        public InitialDisplayState(ProveedoresView form) 
        {
            _form = form ?? throw new ArgumentNullException(nameof(form), "El formulario no puede ser nulo");
        }
      
        public async void OnBuscar()
        {
          await UpdateUI();
        }
        public async Task UpdateUI()
        {
            await CargarCombo();
            var proveedores = await _form.proveedorService.GetAllAsync(null);
            _form.ListProveedores.DataSource = proveedores;
            _form.dataGridProveedoresView.DataSource = _form.ListProveedores;
            _form.tabControl1.SelectTab(_form.tabPageLista);
        }
        private async Task CargarCombo()
        {
            _form.comboLocalidades.DataSource = await _form.localidadService.GetAllAsync(string.Empty);
            _form.comboLocalidades.DisplayMember = "Nombre";
            _form.comboLocalidades.ValueMember = "Id";
            _form.comboLocalidades.SelectedIndex = -1;
        }
        public void OnSalir()
        {
            _form.Close();
        }

        public void OnCancelar() { }
        public void OnGuardar() { }
        public void OnAgregar() { }
        public void OnModificar() { }
        public void OnEliminar() { }
    }
}