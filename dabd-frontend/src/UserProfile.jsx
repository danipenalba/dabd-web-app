import React, { useState } from 'react';
import './UserProfile.css';
import fondo from './images/fondo.jpg';

function UserProfile() {
  const [userData, setUserData] = useState({
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    dni: '12345678A'
  });

  const [cardData, setCardData] = useState({
    number: '**** **** **** 1234',
    expiry: '12/25',
    cvc: '***'
  });

  const [editing, setEditing] = useState({
    name: false,
    email: false,
    dni: false,
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleChange = (field, value, isCard = false) => {
    if (isCard) {
      setCardData({ ...cardData, [field]: value });
    } else {
      setUserData({ ...userData, [field]: value });
    }
  };

  const toggleEdit = (field) => {
    setEditing({ ...editing, [field]: !editing[field] });
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">EUROBET</div>
        <div className="nav-buttons">
          <button className="login-btn">Cerrar Sesión</button>
        </div>
      </nav>

      <main className="profile-container">
        <div className="profile-card">
          <h2>MI PERFIL</h2>
          
          {/* Información del usuario */}
          <div className="profile-section">
            <h3>Datos Personales</h3>
            <ProfileField 
              label="Nombre" 
              value={userData.name} 
              field="name"
              editing={editing.name}
              onChange={handleChange}
              toggleEdit={toggleEdit}
            />
            
            <ProfileField 
              label="Email" 
              value={userData.email} 
              field="email"
              editing={editing.email}
              onChange={handleChange}
              toggleEdit={toggleEdit}
            />
            
            <ProfileField 
              label="DNI" 
              value={userData.dni} 
              field="dni"
              editing={editing.dni}
              onChange={handleChange}
              toggleEdit={toggleEdit}
            />
          </div>
          
          {/* Información de la tarjeta */}
          <div className="card-section">
            <h3>Datos de Tarjeta</h3>
            <ProfileField 
              label="Número de tarjeta" 
              value={cardData.number} 
              field="number"
              editing={editing.cardNumber}
              onChange={(field, value) => handleChange(field, value, true)}
              toggleEdit={toggleEdit}
              isCard={true}
              masked={!editing.cardNumber}
            />
            
            <div className="card-row">
              <ProfileField 
                label="Caducidad" 
                value={cardData.expiry} 
                field="expiry"
                editing={editing.cardExpiry}
                onChange={(field, value) => handleChange(field, value, true)}
                toggleEdit={toggleEdit}
                isCard={true}
                masked={!editing.cardExpiry}
                small={true}
              />
              
              <ProfileField 
                label="CVC" 
                value={cardData.cvc} 
                field="cvc"
                editing={editing.cardCvc}
                onChange={(field, value) => handleChange(field, value, true)}
                toggleEdit={toggleEdit}
                isCard={true}
                masked={!editing.cardCvc}
                small={true}
              />
            </div>
          </div>
          
          <button 
            className="delete-btn"
            onClick={() => setShowDeleteModal(true)}
          >
            Eliminar cuenta
          </button>
        </div>
      </main>

      {/* Modal de confirmación para eliminar cuenta */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h3>¿Seguro que quieres eliminar tu cuenta?</h3>
            <p>Esta acción no se puede deshacer y perderás todos tus datos.</p>
            <div className="modal-buttons">
              <button 
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={() => alert('Cuenta eliminada (acción simulada)')}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente reutilizable para campos editables
const ProfileField = ({ label, value, field, editing, onChange, toggleEdit, isCard, masked, small }) => {
  return (
    <div className={`profile-field ${small ? 'small-field' : ''}`}>
      <label>{label}</label>
      <div className="field-content">
        {editing ? (
          <input
            type={field === 'cvc' || field === 'number' ? 'password' : 'text'}
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            className={isCard ? 'card-input' : ''}
          />
        ) : (
          <span className={masked ? 'masked' : ''}>{value}</span>
        )}
        <button 
          className={`edit-btn ${editing ? 'save-btn' : ''}`}
          onClick={() => toggleEdit(field)}
        >
          {editing ? 'Guardar' : 'Modificar'}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;