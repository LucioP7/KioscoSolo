using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desktop.Interfaces
{
    public interface IFormState
    {
        void OnBuscar(); //buscar
        void OnAgregar(); //agregar
        void OnModificar(); //editar
        void OnEliminar(); //eliminar
        void OnGuardar(); //guardar
        void OnCancelar(); //cancelar
        void OnSalir(); //salir 
        Task UpdateUI(); 
    }
}
