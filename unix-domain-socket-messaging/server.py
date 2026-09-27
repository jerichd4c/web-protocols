import socket
import os

# Define socket file 
SOCKET_FILE = "./uds_endpoint.socket"

# 1. Create UDS file (delete if previous instance is still up)
if os.path.exists(SOCKET_FILE):
    os.remove(SOCKET_FILE)

# 2. Socket creation
# AF_UNIX = specify use of UDS local files
# SOCK_STREAM = specify TCP data stream
server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)

# 3. Bind socket to file
server.bind(SOCKET_FILE)

# 4. Listen conn
server.listen(1)
print(f"[*] Servidor UDS iniciado.")
print(f"[*] Escuchando en el archivo: {SOCKET_FILE}...")

try:
    while True:
        # 5. Accept receiving client connection
        connection, direction = server.accept()
        print("[+] Un cliente se ha conectado al Pipe.")

        try: 
            while True: # Loop for client messages

                # 6. Receive data (up to 1024 bytes)

                # If theres no data, client disconnected
                data = connection.recv(1024)
                if not data:
                    break

                # Decode bytes to text
                message = data.decode('utf-8').strip()

                if message.upper() == 'SALIR':
                    print("[-] El cliente cerró la conexión mediante comando SALIR.")
                    break # Exit loop

                print(f"[Cliente dice]: {message}")

                # 7. Send confirmation back to client
                response = f"Mensaje '{message}' recibido."
                connection.sendall(response.encode('utf-8'))
        finally:
            # 8. Close connection with client
            connection.close()

except KeyboardInterrupt:
        print("\n[-] Apagando el servidor...")
finally:
    # Clean UDS file
    if os.path.exists(SOCKET_FILE):
        os.remove(SOCKET_FILE)