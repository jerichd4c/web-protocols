import socket 
import sys

SOCKET_FILE = "./uds_endpoint.socket"

# 1. Create Socket Client 
client = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)

print(f"[*] Intentando conectar a {SOCKET_FILE}...")

try: 
    # 2. Connect to server file
    client.connect(SOCKET_FILE)
    print("[+] Conectado exitosamente al servidor. Escribe tu mensaje y presiona Enter")
    print("[!] Escribe 'SALIR' para desconectarte.\n")

    while True: # Loop for messages
        message_to_send = input("Tu: ")

        # Avoid empty messages
        if not message_to_send.strip():
            continue

        # Encode to bytes (send through socket)
        client.sendall(message_to_send.encode('utf-8'))

        if message_to_send.upper() == 'SALIR':
            print("[-] Cerrando chat y desconectando...")
            break

        # 4. Wait server response
        response = client.recv(1024)
        print(f"[<] Respuesta del servidor: '{response.decode('utf-8')}'")

except socket.error as e:
    print(f"[-] Error de conexión: {e}")
    print("[-] Asegúrate de que el servidor esté corriendo primero.")
    sys.exit(1)
finally:
    # 5. Close socket from client
    client.close()