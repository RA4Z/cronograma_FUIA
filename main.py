import sys
import os
import json
import webview

# 1. Caminho para os arquivos do SITE (HTML, CSS, JS) - Ficam DENTRO do EXE
def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

# 2. Caminho para o BANCO DE DADOS (JSON) - Fica FORA do EXE
if getattr(sys, 'frozen', False):
    base_folder = os.path.dirname(sys.executable)
else:
    base_folder = os.path.dirname(os.path.abspath(__file__))

FILE_PATH = os.path.join(base_folder, "data.json")

class Api:
    def load_data(self):
        print(f"Buscando arquivo em: {FILE_PATH}")
        if os.path.exists(FILE_PATH):
            try:
                # Forçamos encoding='utf-8' na leitura
                with open(FILE_PATH, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if content.strip():
                        data = json.loads(content)
                        print("Arquivo carregado com sucesso.")
                        return data
            except Exception as e:
                print(f"Erro ao ler arquivo: {str(e)}")
        print("Arquivo nao encontrado ou vazio.")
        return None

    def save_data(self, data):
        try:
            # Forçamos encoding='utf-8' na escrita
            with open(FILE_PATH, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            print("Dados salvos no JSON com sucesso.")
            return True
        except Exception as e:
            print(f"Erro ao salvar: {str(e)}")
            return False

# Inicia a Janela
api = Api()
window = webview.create_window(
    'CRONOGRAMAS PCP', 
    resource_path('index.html'), 
    js_api=api,
    width=1280, 
    height=800
)

# Debug=True ajuda a ver erros no console (F12) se algo falhar
webview.start()