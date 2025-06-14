import React, { useState, useRef, useEffect } from 'react';
import './UserProfile.css';

function UserProfile() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    dni: ''
  });

  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: ''
  });

  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/infoUsuari', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();

          setUserData({
            name: data.nom || '',
            email: data.mail || '',
            dni: data.dni || ''
          });

          if (data.targeta) {
            setCardData({
              number: data.targeta.id_num_targ || '',
              expiry: data.targeta.data_cad ? new Date(data.targeta.data_cad).toISOString().slice(0,10) : '', // formato 'YYYY-MM-DD'
              cvc: data.targeta.cvc || ''
            });
          }
        } else {
          console.error('❌ Error al obtener los datos del usuario');
        }
      } catch (error) {
        console.error('❌ Error de red:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (field, value, isCard = false) => {
    if (isCard) {
      setCardData(prev => ({ ...prev, [field]: value }));
    } else {
      setUserData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveAll = async () => {
    const payload = {
      nom: userData.name,
      mail: userData.email,
      dni: userData.dni,
      targeta: {
        number: cardData.number,
        expiry: cardData.expiry,
        cvc: cardData.cvc
      }
    };

    try {
      const response = await fetch('http://localhost:5000/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ Todos los cambios guardados correctamente");
        setEditing(false);
      } else {
        alert("❌ Error: " + result.error);
      }
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      alert("❌ Error de red al guardar cambios.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!password) {
      setDeleteError('Por favor ingresa tu contraseña');
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    try {
      const response = await fetch('http://localhost:5000/usuari', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Cuenta eliminada correctamente");
        window.location.href = '/login';
      } else {
        setDeleteError(result.error || "Error al eliminar la cuenta");
      }
    } catch (error) {
      setDeleteError("Error de conexión con el servidor");
      console.error("Error al eliminar cuenta:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const DeleteConfirmationModal = () => (
    <div className="modal-overlay">
      <div className="confirmation-modal">
        <h3>¿Seguro que quieres eliminar tu cuenta?</h3>
        <p>Esta acción no se puede deshacer y perderás todos tus datos.</p>

        <div className="password-input-group">
          <label htmlFor="delete-password">Confirma tu contraseña:</label>
          <input
            id="delete-password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setDeleteError('');
            }}
            placeholder="Ingresa tu contraseña"
          />
          {deleteError && <p className="error-message">{deleteError}</p>}
        </div>

        <div className="modal-buttons">
          <button
            className="cancel-btn"
            onClick={() => {
              setShowDeleteModal(false);
              setPassword('');
              setDeleteError('');
            }}
          >
            Cancelar
          </button>
          <button
            className="confirm-delete-btn"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? 'Eliminando...' : 'Confirmar eliminación'}
          </button>
        </div>
      </div>
    </div>
  );

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

          <div className="profile-section">
            <h3>Datos Personales</h3>
            <ProfileField
              label="Nombre"
              value={userData.name}
              field="name"
              editing={editing}
              onChange={handleChange}
              isCard={false}
            />
            <ProfileField
              label="Email"
              value={userData.email}
              field="email"
              editing={editing}
              onChange={handleChange}
              isCard={false}
            />
            <ProfileField
              label="DNI"
              value={userData.dni}
              field="dni"
              editing={editing}
              onChange={handleChange}
              isCard={false}
              disabled={true}
            />
          </div>

          <div className="card-section">
            <h3>Datos de Tarjeta</h3>
            <ProfileField
              label="Número de tarjeta"
              value={cardData.number}
              field="number"
              editing={editing}
              onChange={(field, value) => handleChange(field, value, true)}
              isCard={true}
              masked={!editing}
            />
            <div className="card-row">
              <ProfileField
                label="Caducidad"
                value={cardData.expiry}
                field="expiry"
                editing={editing}
                onChange={(field, value) => handleChange(field, value, true)}
                isCard={true}
                masked={!editing}
                small={true}
              />
              <ProfileField
                label="CVC"
                value={cardData.cvc}
                field="cvc"
                editing={editing}
                onChange={(field, value) => handleChange(field, value, true)}
                isCard={true}
                masked={!editing}
                small={true}
              />
            </div>
          </div>

          <div className="form-actions">
            {editing ? (
              <>
                <button className="save-all-btn" onClick={handleSaveAll}>
                  Guardar todos los cambios
                </button>
                <button className="cancel-btn" onClick={toggleEdit}>
                  Cancelar
                </button>
              </>
            ) : (
              <button className="edit-all-btn" onClick={toggleEdit}>
                Modificar datos
              </button>
            )}
          </div>

          <button
            className="delete-btn"
            onClick={() => setShowDeleteModal(true)}
          >
            Eliminar cuenta
          </button>
        </div>
      </main>

      {showDeleteModal && <DeleteConfirmationModal />}
    </div>
  );
}

const ProfileField = React.memo(({ label, value, field, editing, onChange, isCard, masked, small, disabled }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  return (
    <div className={`profile-field ${small ? 'small-field' : ''}`}>
      <label>{label}</label>
      <div className="field-content">
        {editing ? (
          <input
            ref={inputRef}
            type={field === 'cvc' || field === 'number' ? 'password' : 'text'}
            value={value}
            onChange={(e) => onChange(field, e.target.value, isCard)}
            className={isCard ? 'card-input' : ''}
            disabled={disabled}
          />
        ) : (
          <span className={masked ? 'masked' : ''}>{value}</span>
        )}
      </div>
    </div>
  );
});

export default UserProfile;
