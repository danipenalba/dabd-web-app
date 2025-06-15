from app.Aposta import ApostaSimple, ApostaCombinada

class ApostesUsuari:
    def __init__(self):
        pass

    def crear_apuestas_multiples(self, usuari_dni: str, partit_id: int, bets: dict, odds: float, amount: float) -> bool:
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
            return False

        if len(simples) == 1:
            # 👉 Aquí SÍ debes usar el importe real
            aposta = simples[0]
            aposta.amount = amount  # <-- corregido aquí
            return aposta.insertar_base() and aposta.insertar_especifica()

        # Si es combinada, el importe solo va a la combinada
        premisa_combinada = " + ".join(all_premises)
        combinada = ApostaCombinada(premisa_combinada, odds, usuari_dni, partit_id, 'pendiente', amount, simples)

        if not combinada.insertar_base():
            return False

        return combinada.insertar_especifica()

