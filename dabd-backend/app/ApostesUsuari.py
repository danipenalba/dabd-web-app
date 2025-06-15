from app.Aposta import ApostaSimple, ApostaCombinada
from app.ControladorUsuari import ControladorUsuari


class ApostesUsuari:
    def __init__(self):
        pass
    def verificar_y_actualizar_saldo(self, dni: str, amount: float) -> bool:
        controlador = ControladorUsuari()
        return controlador.actualizar_saldo(dni, -amount)

    def crear_apuestas_multiples(self, usuari_dni: str, partit_id: int, bets: dict, odds: float, amount: float) -> bool:
        # Verificar saldo primero
        if not self.verificar_y_actualizar_saldo(usuari_dni, amount):
            print("❌ Saldo insuficiente.")
            return False

        all_premises = []
        simples = []

        for team in ['home', 'away']:
            for param, value in bets.get(team, {}).items():
                texto = f"{team.upper()} - {param}: {value if isinstance(value, int) else 'Sí'}"
                aposta = ApostaSimple(texto, odds, usuari_dni, partit_id, 'pendiente', 0.0)
                simples.append(aposta)
                all_premises.append(texto)

        if not all_premises:
            print("❌ No hay premisas.")
            # Revertir la reducción de saldo si no hay premisas
            self.verificar_y_actualizar_saldo(usuari_dni, -amount)
            return False

        try:
            if len(simples) == 1:
                aposta = simples[0]
                aposta.amount = amount
                if aposta.insertar_base() and aposta.insertar_especifica():
                    return True
                else:
                    # Revertir si falla la inserción
                    self.verificar_y_actualizar_saldo(usuari_dni, -amount)
                    return False

            premisa_combinada = " + ".join(all_premises)
            combinada = ApostaCombinada(premisa_combinada, odds, usuari_dni, partit_id, 'pendiente', amount, simples)

            if combinada.insertar_base() and combinada.insertar_especifica():
                return True
            else:
                # Revertir si falla la inserción
                self.verificar_y_actualizar_saldo(usuari_dni, -amount)
                return False
        except Exception as e:
            print(f"Error inesperado: {e}")
            # Revertir en caso de error
            self.verificar_y_actualizar_saldo(usuari_dni, -amount)
            return False

